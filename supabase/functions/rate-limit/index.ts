import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RateLimitRequest {
  identifier: string;
  action: string;
  limit?: number;
  windowMinutes?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { identifier, action, limit = 60, windowMinutes = 60 }: RateLimitRequest = await req.json();

    // Validate input
    if (!identifier || !action) {
      return new Response(JSON.stringify({ error: "Missing identifier or action" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Sanitize inputs
    const sanitizedIdentifier = identifier.substring(0, 255);
    const sanitizedAction = action.substring(0, 100);
    const validLimit = Math.max(1, Math.min(limit, 10000));
    const validWindow = Math.max(1, Math.min(windowMinutes, 1440));

    // Call the rate limit function
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: sanitizedIdentifier,
      p_action: sanitizedAction,
      p_limit: validLimit,
      p_window_minutes: validWindow
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return new Response(JSON.stringify({ error: "Rate limit check failed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ allowed: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Rate limit function error:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});