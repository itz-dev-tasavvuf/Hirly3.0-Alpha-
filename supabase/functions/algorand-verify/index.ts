import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request data
    const { fullName, email, role, company = "", extra = "" } = await req.json();
    
    if (!fullName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (fullName, email)" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create a mock transaction ID (in a real implementation, this would be an actual Algorand transaction)
    const mockTxId = `MOCK_TX_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Log the verification request
    console.log(`Verification request for ${fullName} (${email}) as ${role}${company ? ` at ${company}` : ''}`);
    
    // In a real implementation, you would:
    // 1. Connect to Algorand TestNet
    // 2. Create and submit a transaction with the verification data
    // 3. Return the actual transaction ID

    // Return success response with mock transaction ID
    return new Response(
      JSON.stringify({ 
        success: true, 
        txId: mockTxId,
        message: "Verification recorded on Algorand TestNet (mock)"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing verification request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});