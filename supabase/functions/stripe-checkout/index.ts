import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

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
    // Get the Stripe secret key from environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    // Debug: Log if the key exists (without exposing the actual key)
    console.log('Stripe key exists:', !!stripeSecretKey);
    console.log('Stripe key starts with sk_:', stripeSecretKey?.startsWith('sk_'));
    
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({
        error: "STRIPE_SECRET_KEY environment variable is not set in Supabase"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get request data
    const { action, priceId, companyName, companyEmail, successUrl, cancelUrl } = await req.json();

    console.log('Stripe checkout request:', { action, priceId, companyName, companyEmail });

    if (action === "create-checkout-session") {
      // Validate required fields
      if (!priceId || !companyEmail) {
        return new Response(JSON.stringify({
          error: "Missing required fields: priceId and companyEmail are required"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: companyEmail,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || 'https://hirly.netlify.app/payment-success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl || 'https://hirly.netlify.app/payment-cancel',
        subscription_data: {
          trial_period_days: 14
        }
      });

      console.log('Stripe session created successfully:', session.id);

      return new Response(JSON.stringify({ 
        success: true,
        sessionId: session.id,
        url: session.url 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      error: "Invalid action. Supported actions: create-checkout-session" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });

  } catch (error) {
    console.error("Stripe error:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error",
      details: error.type || "unknown_error"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
