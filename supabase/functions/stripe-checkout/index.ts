import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the authorization token from the request
    const authHeader = req.headers.get('Authorization')
    let user = null
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token)
      if (!error) {
        user = authUser
      }
    }

    if (req.method === 'POST') {
      const { priceId, successUrl, cancelUrl, customerId } = await req.json()

      if (!priceId) {
        return new Response(
          JSON.stringify({ error: 'Price ID is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Create checkout session parameters
      const sessionParams: any = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl || `${req.headers.get('origin')}/payment-success`,
        cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing`,
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        subscription_data: {
          trial_period_days: 14,
        },
        metadata: {
          userId: user?.id || 'anonymous',
        },
      }

      // If user is authenticated, prefill customer info
      if (user?.email) {
        sessionParams.customer_email = user.email
      }

      // If customerId is provided, use existing customer
      if (customerId) {
        sessionParams.customer = customerId
        delete sessionParams.customer_email
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create(sessionParams)

      // If user is authenticated, save the session info
      if (user) {
        await supabase
          .from('stripe_sessions')
          .insert({
            user_id: user.id,
            session_id: session.id,
            price_id: priceId,
            status: 'pending',
            created_at: new Date().toISOString(),
          })
      }

      return new Response(
        JSON.stringify({ 
          sessionId: session.id,
          sessionUrl: session.url 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle webhook for subscription events
    if (req.method === 'POST' && req.url.includes('/webhook')) {
      const signature = req.headers.get('stripe-signature')
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

      if (!signature || !webhookSecret) {
        return new Response('Webhook signature missing', { status: 400 })
      }

      const body = await req.text()
      let event

      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return new Response('Webhook signature verification failed', { status: 400 })
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object
          console.log('Checkout session completed:', session.id)
          
          // Update session status
          await supabase
            .from('stripe_sessions')
            .update({ 
              status: 'completed',
              customer_id: session.customer,
              subscription_id: session.subscription,
              updated_at: new Date().toISOString(),
            })
            .eq('session_id', session.id)

          // Update user subscription status
          if (session.metadata?.userId) {
            await supabase
              .from('user_subscriptions')
              .upsert({
                user_id: session.metadata.userId,
                customer_id: session.customer,
                subscription_id: session.subscription,
                status: 'active',
                price_id: session.display_items?.[0]?.price?.id,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
          }
          break

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object
          console.log('Subscription updated:', subscription.id)
          
          // Update subscription status
          await supabase
            .from('user_subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', subscription.id)
          break

        case 'invoice.payment_succeeded':
          const invoice = event.data.object
          console.log('Payment succeeded:', invoice.id)
          
          // Update subscription status to active
          if (invoice.subscription) {
            await supabase
              .from('user_subscriptions')
              .update({
                status: 'active',
                updated_at: new Date().toISOString(),
              })
              .eq('subscription_id', invoice.subscription)
          }
          break

        case 'invoice.payment_failed':
          const failedInvoice = event.data.object
          console.log('Payment failed:', failedInvoice.id)
          
          // Update subscription status to past_due
          if (failedInvoice.subscription) {
            await supabase
              .from('user_subscriptions')
              .update({
                status: 'past_due',
                updated_at: new Date().toISOString(),
              })
              .eq('subscription_id', failedInvoice.subscription)
          }
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return new Response('Webhook handled', { status: 200 })
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
