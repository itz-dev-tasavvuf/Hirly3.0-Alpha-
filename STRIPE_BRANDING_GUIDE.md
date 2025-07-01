# Stripe Checkout Branding Guide for Hirly

## Current Branding Customizations Applied

### 1. Custom Text & Messaging
✅ **Implemented** - Added custom text throughout the checkout flow:
- Submit button: "🚀 Start your 14-day free trial with Hirly and revolutionize your hiring process!"
- Terms acceptance: Links to Hirly's terms and privacy policy
- After submit message: Welcome message with Hirly branding
- Business address message for billing

### 2. Enhanced Subscription Details
✅ **Implemented**:
- Trial period: 14 days
- Enhanced description: "Hirly Employer Pro - AI-powered, blockchain-verified recruiting platform"
- Metadata tags for tracking and analytics

### 3. Invoice Customization
✅ **Implemented**:
- Custom invoice description
- Branded footer message
- Metadata for tracking

### 4. User Experience Enhancements
✅ **Implemented**:
- Required billing address collection
- Phone number collection for verification
- Automatic tax calculation
- Promotion codes support
- Locale auto-detection

### 5. Enhanced Success/Cancel Flow
✅ **Implemented**:
- Session ID tracking in success URL
- Branded success page with Hirly messaging
- Cancel flow returns to pricing page with notification
- Clear trial messaging and feature highlights

## Additional Branding Options (Stripe Dashboard Required)

### Available in Stripe Dashboard Settings:

#### 1. Business Branding
- **Logo**: Upload Hirly logo (recommended: 512x512px PNG)
- **Accent Color**: Set to Hirly's brand color (e.g., #6366f1 or #8b5cf6)
- **Business Name**: Ensure it shows "Hirly" consistently

#### 2. Payment Page Settings
- **Header**: Add custom header text
- **Description**: Company description for payment pages
- **Website URL**: Link back to hirly.netlify.app

#### 3. Email Receipts
- **Custom Receipt**: Branded email templates
- **Support Information**: Add Hirly support contact details
- **Logo in Emails**: Include Hirly logo in receipt emails

## Stripe Dashboard Configuration Steps

### Step 1: Add Business Logo
1. Go to Stripe Dashboard → Settings → Branding
2. Upload Hirly logo (ideal: square format, 512x512px)
3. Set accent color to match Hirly brand

### Step 2: Configure Business Information
```
Business Name: Hirly
Business Description: AI-powered, blockchain-verified recruiting platform
Website: https://hirly.netlify.app
Support Email: support@hirly.com
Support Phone: [Your support number]
```

### Step 3: Payment Page Customization
```
Header Text: Welcome to Hirly Pro
Description: Join the future of recruiting with blockchain verification and AI matching
```

### Step 4: Email Receipt Branding
- Enable custom receipts
- Add Hirly logo to email headers
- Include support contact information

## Limitations of Stripe Checkout Customization

### What CAN'T Be Customized:
❌ **Layout**: Overall page structure is fixed
❌ **Colors**: Only accent color can be changed
❌ **Fonts**: Typography is fixed
❌ **Complete Theme**: Can't create fully custom themes
❌ **Background**: Background colors/images are fixed

### What CAN Be Customized:
✅ **Logo**: Company logo display
✅ **Accent Color**: Primary brand color
✅ **Text Content**: Custom messages and descriptions
✅ **Business Information**: Name, description, contact details
✅ **Invoice Details**: Custom footer and descriptions
✅ **Email Templates**: Receipt and notification emails

## Alternative Solutions for More Branding

### 1. Stripe Elements (Custom Implementation)
- **Pros**: Full design control, embedded in your site
- **Cons**: More complex implementation, requires PCI compliance
- **Use Case**: If complete brand consistency is critical

### 2. Custom Payment Flow
- **Pre-checkout**: Custom designed page with Hirly branding
- **Checkout**: Minimal Stripe checkout
- **Post-checkout**: Fully branded confirmation and onboarding

### 3. Payment Page Wrapper
- **Frame**: Embed Stripe checkout in branded iframe
- **Header/Footer**: Add Hirly branded elements above/below
- **Messaging**: Custom pre-checkout messaging

## Current Implementation Status

✅ **Completed**:
- Enhanced checkout session with all available customizations
- Branded success/cancel pages
- Custom messaging throughout flow
- Metadata tracking for analytics
- Trial period and subscription details

🔄 **Recommended Next Steps**:
1. Add logo and accent color in Stripe Dashboard
2. Configure custom receipt emails
3. Add support contact information
4. Consider implementing Stripe Elements for more control (if needed)

## Code Files Modified

1. **`supabase/functions/stripe-checkout/index.ts`**: Enhanced with all available branding options
2. **`src/pages/PaymentSuccess.jsx`**: Updated with branded messaging
3. **`src/pages/PricingPage.jsx`**: Added cancel notification handling

## Brand Colors to Use in Stripe Dashboard

```css
Primary: #6366f1 (Indigo)
Secondary: #8b5cf6 (Purple)
Success: #10b981 (Green)
```

## Summary

The current implementation maximizes Stripe's checkout customization within its limitations. For the most branded experience, the next step would be implementing custom Stripe Elements or a hybrid approach with pre/post-checkout branding while keeping the secure, PCI-compliant Stripe checkout flow.
