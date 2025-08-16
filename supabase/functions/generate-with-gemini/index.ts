import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Restricted CORS headers for enhanced security
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://dentaxy.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Enhanced authentication and input validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Initialize Supabase client for authentication and rate limiting
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify authentication
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      console.error("Authentication failed:", userError?.message);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Rate limiting check
    const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
    const { data: rateLimitOk } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: userData.user.id,
      p_action: 'generate_with_gemini',
      p_limit: 50, // 50 requests per hour
      p_window_minutes: 60
    });

    if (!rateLimitOk) {
      console.warn(`Rate limit exceeded for user: ${userData.user.id}`);
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    // Input validation
    const body = await req.json();
    const { prompt } = body;
    
    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt provided");
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Sanitize and validate prompt length
    if (prompt.length > 10000) {
      console.error("Prompt too long");
      return new Response(JSON.stringify({ error: "Prompt too long. Maximum 10,000 characters allowed." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Audit logging
    await supabaseClient.rpc('log_audit_event', {
      p_user_id: userData.user.id,
      p_action: 'generate_with_gemini',
      p_resource_type: 'ai_generation',
      p_details: { prompt_length: prompt.length },
      p_ip_address: clientIp,
      p_user_agent: req.headers.get("user-agent")?.substring(0, 255)
    });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[generate-with-gemini] Error:", error);
    // Don't expose internal error details to client
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
