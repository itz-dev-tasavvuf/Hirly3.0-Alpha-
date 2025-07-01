# Environment Variables Setup Guide

This guide covers all environment variables needed for the Hirly platform across different services.

## Netlify Environment Variables

Set these in your Netlify dashboard under Site settings > Environment variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For Netlify Functions
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Edge Functions Environment Variables

Set these in your Supabase dashboard under Settings > Edge Functions > Environment Variables:

```bash
# Required for algorand-verify function
ALGORAND_MNEMONIC=your_algorand_testnet_mnemonic_phrase
SALT_SECRET=your_random_salt_string_for_hashing

# Required for stripe-checkout function
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Supabase Service Role (for database operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Stripe Setup

### 1. Create Stripe Products and Prices

In your Stripe dashboard, create the following products:

#### Employer Basic Plan
- Product Name: "Employer Basic"
- Price: $99/month
- Recurring: Monthly
- Copy the Price ID (starts with `price_`) and update it in `HowItWorks.jsx`

#### Employer Pro Plan
- Product Name: "Employer Pro"  
- Price: $199/month
- Recurring: Monthly
- Copy the Price ID (starts with `price_`) and update it in `HowItWorks.jsx`

### 2. Create Webhook Endpoint

In Stripe dashboard > Developers > Webhooks:

1. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-checkout/webhook`
2. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
3. Copy the webhook secret (starts with `whsec_`) and add it to Supabase environment variables

## Algorand Setup

### 1. Generate TestNet Account

Use the Algorand Developer Portal or SDK to generate a TestNet account:

```javascript
const algosdk = require('algosdk');
const account = algosdk.generateAccount();
console.log('Address:', account.addr);
console.log('Mnemonic:', algosdk.secretKeyToMnemonic(account.sk));
```

### 2. Fund TestNet Account

Visit https://dispenser.testnet.aws.algodev.network/ and fund your account with test ALGO.

### 3. Add Mnemonic to Supabase

Add the mnemonic phrase to Supabase environment variables as `ALGORAND_MNEMONIC`.

## Database Migrations

Run the Stripe integration migration:

```bash
supabase db push
```

Or manually execute the SQL in `supabase/migrations/002_stripe_integration.sql`

## Production Checklist

Before going live:

- [ ] Replace all `price_1Oxxxxx` placeholders with real Stripe Price IDs
- [ ] Switch Stripe keys from test to live mode
- [ ] Update Algorand from TestNet to MainNet
- [ ] Update webhook URLs to production domains
- [ ] Set all environment variables in production
- [ ] Test payment flow end-to-end
- [ ] Test blockchain verification
- [ ] Verify webhook delivery

## Testing

### Test Stripe Integration

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

### Test Algorand Integration

The edge function will create TestNet transactions. Monitor at:
https://testnet.algoexplorer.io/

## Troubleshooting

### Common Issues

1. **Stripe webhook not receiving events**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check endpoint is accessible

2. **Algorand transaction failures**
   - Ensure account has sufficient ALGO balance
   - Verify mnemonic is correct
   - Check TestNet connectivity

3. **Environment variable issues**
   - Ensure all variables are set in the correct service
   - Check for typos in variable names
   - Restart functions after variable changes

### Debug Tools

- Supabase Edge Function logs: Supabase dashboard > Edge Functions > Logs
- Netlify Function logs: Netlify dashboard > Functions > Function name
- Stripe webhook logs: Stripe dashboard > Developers > Webhooks > Endpoint
