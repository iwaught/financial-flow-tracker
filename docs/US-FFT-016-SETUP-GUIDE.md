# US-FFT-016: Stripe Billing Integration Setup Guide

## Overview
This guide walks through setting up Stripe billing integration for the Financial Flow Tracker. The billing system is behind a feature flag and can be disabled by default.

## Prerequisites
- Completed US-FFT-014 (Backend Foundation)
- A Stripe account (free for testing)
- Supabase Edge Functions CLI (optional, for webhook handling)

## Step 1: Create Stripe Account and Get API Keys

1. Go to [https://stripe.com](https://stripe.com) and sign up
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)
5. Keep these secure - you'll need them shortly

## Step 2: Create Stripe Product and Price

1. In Stripe dashboard, go to **Products**
2. Click **Add product**
3. Fill in:
   - **Name**: Financial Flow Tracker Pro
   - **Description**: Unlimited income/expense boxes and priority support
   - **Pricing model**: Recurring
   - **Price**: $0.99 USD
   - **Billing period**: Monthly
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)

## Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Run the migration: `supabase/migrations/20240103000000_subscriptions.sql`
3. This creates:
   - `subscriptions` table
   - RLS policies
   - Trigger to create default free subscription for new users

## Step 4: Configure Environment Variables

Update your `.env` file:

```bash
# Billing Configuration
VITE_BILLING_ENABLED=true  # Set to 'true' to enable, 'false' to disable

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
```

**Important**: Never commit your actual keys to git. The .env file is gitignored.

## Step 5: Deploy Supabase Edge Functions (Optional but Recommended)

### Install Supabase CLI

```bash
npm install -g supabase
```

### Login to Supabase

```bash
supabase login
```

### Link to Your Project

```bash
supabase link --project-ref your-project-ref
```

### Set Function Secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
supabase secrets set STRIPE_PRO_PRICE_ID=price_your_price_id
```

### Deploy Functions

```bash
# Deploy checkout session creator
supabase functions deploy create-checkout-session

# Deploy webhook handler
supabase functions deploy stripe-webhook
```

## Step 6: Set Up Stripe Webhook

1. In Stripe dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: Your Supabase function URL
   - Format: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Update your function secrets with this webhook secret

## Step 7: Update Frontend to Call Checkout Function

Update `src/lib/subscription.js` to call the edge function:

```javascript
export const createCheckoutSession = async (userId, priceId) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session')
    }

    return { sessionUrl: data.url, error: null }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { sessionUrl: null, error }
  }
}
```

## Step 8: Test the Integration

### Test Free Plan Limits

1. Start the app: `npm run dev`
2. Sign up as a new user
3. Add boxes until you reach 5 (the free plan limit)
4. Try to add a 6th box
5. You should see the upgrade modal

### Test Upgrade Flow (when ready)

1. Click "Upgrade to Pro" button
2. You should be redirected to Stripe Checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Webhook should update your subscription to Pro
6. Verify you can now add unlimited boxes

### Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Require authentication**: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC will work.

## Step 9: Disable Billing (If Needed)

To disable billing features while keeping the code ready:

1. Set `VITE_BILLING_ENABLED=false` in `.env`
2. Restart the dev server
3. Billing UI will be hidden
4. Users won't see plan limits or upgrade prompts

## Step 10: Production Deployment

When deploying to production:

1. Switch to live Stripe keys (start with `pk_live_` and `sk_live_`)
2. Create a live Stripe product and price
3. Update environment variables in your hosting platform
4. Update webhook endpoint to production URL
5. Test thoroughly before enabling billing

## Security Best Practices

1. ✅ **Never** expose Stripe secret keys in frontend code
2. ✅ **Always** verify webhook signatures
3. ✅ **Always** validate user authentication before creating checkout sessions
4. ✅ Store secrets only in environment variables
5. ✅ Use RLS policies to protect subscription data
6. ✅ Treat webhook events as source of truth for subscription state

## Plan Limits

| Plan | Max Boxes | Price |
|------|-----------|-------|
| Free | 5 | $0 |
| Pro | Unlimited | $0.99/month |

## Troubleshooting

### "Stripe checkout not configured" Error

This is expected before deploying the edge functions. The checkout flow requires:
- Edge function deployed
- Stripe keys configured
- Webhook endpoint set up

### Subscription Not Updating After Checkout

1. Check Supabase function logs
2. Verify webhook is receiving events in Stripe dashboard
3. Check that webhook secret is correct
4. Ensure user_id is in checkout session metadata

### User Stuck on Free Plan

1. Check `subscriptions` table in Supabase
2. Verify plan_code is set correctly
3. Check webhook events in Stripe
4. Manually update if needed for testing

## Monitoring

Monitor your integration:

1. **Stripe Dashboard** → **Developers** → **Events**: See all webhook events
2. **Supabase Dashboard** → **Edge Functions** → **Logs**: See function execution
3. **Supabase Dashboard** → **Table Editor** → `subscriptions`: See all user plans

## Next Steps

After setup:

1. Test the complete checkout flow
2. Test subscription cancellation
3. Test plan limit enforcement
4. Add analytics for upgrade conversions
5. Consider adding annual plans or other tiers

## Support

For issues:
1. Check Stripe logs for webhook delivery
2. Check Supabase function logs for errors
3. Verify RLS policies are not blocking access
4. Test with Stripe test mode before going live
