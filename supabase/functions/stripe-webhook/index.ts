import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received", { method: req.method, url: req.url });
    
    const signature = req.headers.get("stripe-signature");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!signature) {
      logStep("Missing Stripe signature");
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    if (!stripeWebhookSecret || !stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      logStep("Missing environment variables");
      throw new Error("Missing required environment variables");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    
    // Verify the webhook signature - this will throw if invalid
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
      logStep("Webhook signature verified", { type: event.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Only process donation sessions
      if (session.metadata?.type === "donation") {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Get customer details
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerName = session.customer_details?.name || 
                           customerEmail?.split('@')[0] || 
                           'Donador Anónimo';

        // Register the donation
        const { error } = await supabase.from('donations').insert({
          donor_name: customerName,
          amount: session.amount_total || 2000,
          session_id: session.id,
          message: `¡Gracias ${customerName} por apoyar Dentaxy! ☕`
        });

        if (error) {
          logStep("Error inserting donation", { error: error.message, customer: customerName });
        } else {
          logStep("Donation recorded successfully", { customer: customerName, amount: session.amount_total });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Webhook error", { error: error.message });
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});