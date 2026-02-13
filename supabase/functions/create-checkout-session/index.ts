// Supabase Edge Function: create-checkout-session
// Creates a Stripe Checkout session for upgrading to Pro
// Deploy with: supabase functions deploy create-checkout-session

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Replace with your actual Stripe Price ID for the Pro plan
const STRIPE_PRICE_ID = Deno.env.get('STRIPE_PRO_PRICE_ID') || 'price_xxxxx'

serve(async (req) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401 }
      )
    }

    // Verify the user with Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      )
    }

    // Get or create Stripe customer
    let customerId: string

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Update subscription with customer ID
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
        })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/`,
      metadata: {
        user_id: user.id,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    console.error('Checkout session error:', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    )
  }
})
