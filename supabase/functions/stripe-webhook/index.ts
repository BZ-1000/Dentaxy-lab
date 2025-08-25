import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate required headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing stripe-signature header");
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate environment variables
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeWebhookSecret || !stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing required environment variables");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    
    // Verify webhook signature to prevent attacks
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Verified webhook event: ${event.type}`);

    // Process only specific event types to reduce attack surface
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Validate session data
      if (!session.id || !session.amount_total) {
        console.error('Invalid session data received');
        return new Response(JSON.stringify({ error: "Invalid session data" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      
      // Only process donation sessions with proper metadata
      if (session.metadata?.type === "donation") {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Sanitize customer details
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerName = session.customer_details?.name?.substring(0, 100) || 
                           customerEmail?.split('@')[0]?.substring(0, 100) || 
                           'Donador Anónimo';

        // Validate amount (prevent negative or excessive amounts)
        const amount = Math.max(Math.min(session.amount_total, 100000000), 100); // Min $1, Max $1M

        try {
          // Register the donation with validation
          const { error } = await supabase.from('donations').insert({
            donor_name: customerName,
            amount: amount,
            session_id: session.id,
            message: `¡Gracias ${customerName} por apoyar Dentaxy! ☕`
          });

          if (error) {
            console.error('Database error inserting donation:', error);
            return new Response(JSON.stringify({ error: "Database error" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            });
          } else {
            console.log(`Donation recorded for ${customerName}: $${amount/100}`);
          }
        } catch (dbError) {
          console.error('Unexpected database error:', dbError);
          return new Response(JSON.stringify({ error: "Database connection failed" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});