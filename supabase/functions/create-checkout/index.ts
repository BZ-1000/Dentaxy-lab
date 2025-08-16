import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Restricted CORS headers for enhanced security
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://dentaxy.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use the service role key to perform writes (upsert) in Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get request body to get plan type
    const { plan_type } = await req.json();
    if (!plan_type) throw new Error("Plan type is required");
    logStep("Plan type received", { plan_type });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Define plan configurations - Updated with correct mappings
    const planConfigs = {
      express: {
        amount: 2000, // $20 MXN in centavos
        interval: "day" as const,
        name: "Plan Exprés 24 Horas"
      },
      express_semester: {
        amount: 2000, // $20 MXN in centavos
        interval: "day" as const,
        name: "Plan Exprés 24 Horas"
      },
      professional: {
        amount: 5900, // $59 MXN in centavos
        interval: "week" as const,
        name: "Plan Profesional 7 Días"
      },
      professional_semester: {
        amount: 5900, // $59 MXN in centavos
        interval: "week" as const,
        name: "Plan Profesional 7 Días"
      },
      monthly_center: {
        amount: 9900, // $99 MXN in centavos
        interval: "month" as const,
        name: "Plan Pro Mensual"
      },
      monthly_center_semester: {
        amount: 49900, // $499 MXN in centavos
        interval: "month" as const,
        interval_count: 6,
        name: "Plan Pro Semestral"
      }
    };

    // Check for free/beta plans first
    if (plan_type === "beta" || plan_type === "gratis" || plan_type === "free") {
      return new Response(
        JSON.stringify({ 
          error: "Free plan doesn't require checkout",
          redirect_url: `${req.headers.get('origin')}/app`
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }

    const config = planConfigs[plan_type as keyof typeof planConfigs];
    if (!config) throw new Error("Invalid plan type");

    logStep("Plan configuration", { config });

    // Create checkout session for subscription
    const sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: { name: config.name },
            unit_amount: config.amount,
            recurring: {
              interval: config.interval,
              ...(config.interval_count && { interval_count: config.interval_count })
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/?success=true&plan=${plan_type}`,
      cancel_url: `${req.headers.get("origin")}/?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_type: plan_type,
        user_email: user.email
      }
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});