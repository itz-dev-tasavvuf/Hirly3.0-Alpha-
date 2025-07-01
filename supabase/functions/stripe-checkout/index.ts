import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({
        error: "STRIPE_SECRET_KEY not found"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const { action, priceId } = await req.json();

    if (action === "create-checkout-session") {
      if (!priceId) {
        return new Response(JSON.stringify({
          error: "priceId is required"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        success_url: 'https://hirly.netlify.app/payment-success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://hirly.netlify.app/pricing?canceled=true',
        // Enhanced branding and customization
        custom_text: {
          submit: {
            message: '🚀 Start your Hirly Employer Pro subscription and revolutionize your hiring process!'
          },
          terms_of_service_acceptance: {
            message: 'I agree to the [Terms of Service](https://hirly.netlify.app/terms) and [Privacy Policy](https://hirly.netlify.app/privacy)'
          },
          shipping_address: {
            message: 'Business address for billing purposes'
          },
          after_submit: {
            message: 'Welcome to Hirly! We\'re excited to help you find the perfect candidates through blockchain-verified recruiting.'
          }
        },
        consent_collection: {
          terms_of_service: 'required',
          promotions: 'auto'
        },
        // Subscription settings with enhanced description
        subscription_data: {
          description: 'Hirly Employer Pro - AI-powered, blockchain-verified recruiting platform',
          metadata: {
            platform: 'hirly',
            plan_type: 'employer_pro'
          }
        },
        // Customer information
        billing_address_collection: 'required',
        // Enhanced phone number collection
        phone_number_collection: {
          enabled: true
        },
        // Additional customization
        allow_promotion_codes: true,
        automatic_tax: {
          enabled: true
        },
        // Invoice settings for better branding
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: 'Hirly Employer Pro Subscription',
            footer: 'Thank you for choosing Hirly - The future of recruiting is here!',
            metadata: {
              platform: 'hirly',
              product: 'employer_pro'
            }
          }
        },
        // Locale for better user experience
        locale: 'auto'
      });

      return new Response(JSON.stringify({ 
        success: true,
        url: session.url 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      error: "Invalid action" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });

  } catch (error) {
    console.error("Error:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
