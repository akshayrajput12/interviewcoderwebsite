# One-Time Pro Plan Setup - Complete Implementation

This document explains the complete implementation of the "Interview Coder Pro" one-time plan system.

## 🎯 What This System Does

### Core Functionality
- **One-time purchase**: Users pay ₹49 once and get 4 credits
- **No monthly subscription**: This is NOT a recurring plan
- **Purchase restriction**: Each user can only buy this once per email/account
- **Credit tracking**: Separate tracking for one-time credits vs subscription credits
- **Complete audit trail**: Full tracking of credit usage and purchase history

### Business Logic
1. User sees "Interview Coder Pro" plan at ₹49 for 4 credits
2. User can purchase this plan only once
3. After purchase, user gets 4 credits immediately
4. User cannot purchase this plan again (system prevents it)
5. If user wants more credits later, they must buy regular subscription plans

## 🗄️ Database Changes

### New Columns in `profiles` table:
- `has_purchased_one_time_pro` - Boolean flag to prevent duplicate purchases
- `one_time_pro_purchase_date` - When the purchase was made
- `one_time_credits_total` - Total one-time credits received (always 4)
- `one_time_credits_used` - How many one-time credits have been used

### New Functions:
- `process_one_time_pro_upgrade()` - Handles payment processing and credit allocation
- `can_purchase_one_time_pro()` - Checks if user is eligible for purchase
- `get_one_time_pro_status()` - Returns user's one-time pro status and credit info
- `use_one_time_pro_credit()` - Deducts one credit when user uses the service

### New View:
- `one_time_pro_users` - Easy view to see all users who purchased one-time pro

## 🚀 How to Apply Changes

### Step 1: Run Database Migration
Copy and paste the contents of `supabase/migrations/20250125_add_one_time_pro_plan.sql` into your Supabase SQL Editor and execute it.

### Step 2: Verify Database Changes
After running the migration, verify with these queries:

```sql
-- 1. Check the one-time pro plan exists
SELECT name, tag, price_monthly, credits_per_month, highlight_text, features
FROM subscription_plans
WHERE tag = 'One-Time Pro';

-- 2. Check profiles table has new columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name LIKE '%one_time%';

-- 3. Test the functions work
SELECT can_purchase_one_time_pro('00000000-0000-0000-0000-000000000000'::uuid);

-- 4. Check the view exists
SELECT * FROM one_time_pro_users LIMIT 1;
```

### Step 3: Test the Complete Flow

1. **Frontend Display**: Visit pricing page - should show "Interview Coder Pro" at ₹49 one-time
2. **First Purchase**: Should work for new users
3. **Duplicate Purchase Prevention**: Should be blocked with error message
4. **Credit Allocation**: User should receive exactly 4 credits
5. **Credit Usage**: Credits should be deducted when user uses the service

## 📋 Plan Details

### Interview Coder Pro (One-Time)
- **Price**: ₹49 (one-time payment, never recurring)
- **Credits**: 4 credits total (not per month)
- **Restriction**: ONE purchase per user/email (strictly enforced)
- **Features**:
  - 4 one-time credits (not monthly)
  - Pro plan features
  - Advanced AI models
  - Priority support
  - Undetectable in all platforms
  - One purchase per user only

### Regular Subscription Plans (Unchanged)
- **GhostCoder Pro (Yearly)**: ₹999/month billed annually (₹11,988/year) - 150 credits/month
- **GhostCoder Pro (Monthly)**: ₹1,499/month - 100 credits/month

## 🔄 Credit System Logic

### One-Time Pro Credits
- User pays ₹49 once → Gets 4 credits immediately
- Credits are added to `current_month_credits` for immediate use
- Tracked separately in `one_time_credits_total` and `one_time_credits_used`
- No monthly renewal - once used, they're gone
- User must buy subscription plans for more credits

### Credit Usage Priority
1. Use current month credits (includes one-time pro credits)
2. System tracks which credits came from one-time purchase
3. Complete audit trail in `credit_transactions` table

## Technical Implementation

### Database Functions
- `process_one_time_pro_upgrade()`: Handles payment processing and credit allocation
- `can_purchase_one_time_pro()`: Checks if user is eligible for purchase

### API Endpoints
- `/api/payment/create-order`: Updated to check purchase eligibility
- `/api/payment/verify`: Updated to handle one-time pro purchases

### Frontend Components
- `PricingCards.tsx`: Updated pricing display
- `PaymentButton.tsx`: Updated success messages
- Payment flow handles one-time purchases

## Troubleshooting

### Common Issues

1. **Migration fails**: Ensure you're running it in the correct order after complete_setup.sql
2. **Purchase blocked**: Check if user has already purchased (has_purchased_one_time_pro = true)
3. **Credits not added**: Check credit_transactions table for transaction records
4. **Payment fails**: Check Razorpay configuration and order creation logs

### Rollback (if needed)
To rollback to the original free plan:

```sql
UPDATE public.subscription_plans 
SET 
  name = 'GhostCoder',
  tag = 'Free',
  description = 'Try it and see',
  price_monthly = 0,
  credits_per_month = 0,
  features = '["Test visibility in screen sharing", "Basic interface access", "No credits included", "Limited functionality"]',
  highlight_text = null
WHERE tag = 'One-Time Pro';
```

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check Supabase logs for database errors
3. Verify Razorpay configuration
4. Ensure all environment variables are set correctly
