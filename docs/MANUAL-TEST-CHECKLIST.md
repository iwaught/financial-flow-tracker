# Manual Test Checklist: US-FFT-014 to US-FFT-016

This checklist covers testing for all three user stories. Mark items as ✅ when completed successfully.

## Prerequisites
- [ ] Application builds successfully (`npm run build`)
- [ ] Development server starts (`npm run dev`)
- [ ] Supabase project is set up
- [ ] Database migrations have been run
- [ ] Environment variables are configured

---

## US-FFT-014: Backend Foundation & Authentication

### Test Case TC-FFT-014-1: User Sign Up

**Steps:**
1. [ ] Navigate to the app in a fresh browser/incognito window
2. [ ] Verify login screen is displayed
3. [ ] Click "Don't have an account? Sign up"
4. [ ] Enter display name: "Test User"
5. [ ] Enter email: `test@example.com`
6. [ ] Enter password: `password123` (min 6 characters)
7. [ ] Click "Sign Up"

**Expected Results:**
- [ ] Success message appears or email confirmation prompt
- [ ] User is logged in (if email confirmation disabled) OR
- [ ] Email verification link is sent (if email confirmation enabled)

### Test Case TC-FFT-014-2: User Sign In

**Steps:**
1. [ ] From logged out state, click "Already have an account? Sign in"
2. [ ] Enter email: `test@example.com`
3. [ ] Enter password: `password123`
4. [ ] Click "Sign In"

**Expected Results:**
- [ ] User is successfully logged in
- [ ] Flow canvas is displayed
- [ ] User email appears in top-right corner
- [ ] Logout button is visible

### Test Case TC-FFT-014-3: Flow Persistence - Save

**Steps:**
1. [ ] Sign in as a user
2. [ ] Create a new income node
3. [ ] Edit the income value to $5000
4. [ ] Create a new expense node
5. [ ] Edit the expense value to $2000
6. [ ] Create a connection between nodes
7. [ ] Click "💾 Save" button

**Expected Results:**
- [ ] "Flow saved successfully!" message appears
- [ ] Message disappears after 3 seconds
- [ ] No errors in browser console

### Test Case TC-FFT-014-4: Flow Persistence - Load

**Steps:**
1. [ ] From the previous test, note the current flow state
2. [ ] Click "Logout"
3. [ ] Sign in again with same credentials
4. [ ] Observe the flow canvas

**Expected Results:**
- [ ] Flow is automatically loaded on login
- [ ] All nodes are present with correct values
- [ ] All edges/connections are restored
- [ ] Node positions are preserved

### Test Case TC-FFT-014-5: Cross-User Data Isolation

**Steps:**
1. [ ] Create and save a flow for User A (e.g., `usera@test.com`)
2. [ ] Note a unique identifier (e.g., specific node label)
3. [ ] Logout
4. [ ] Sign up as User B (e.g., `userb@test.com`)
5. [ ] Observe the flow canvas

**Expected Results:**
- [ ] User B sees default/empty flow (not User A's data)
- [ ] User B can create and save their own flow
- [ ] Logout and login as User A again
- [ ] User A still sees only their original flow

### Test Case TC-FFT-014-6: Row Level Security

**Steps:**
1. [ ] In Supabase SQL Editor, run:
```sql
-- Try to access another user's data
SELECT * FROM flows WHERE user_id != auth.uid();
```

**Expected Results:**
- [ ] Query returns no rows (empty result)
- [ ] RLS policies prevent unauthorized access

### Test Case TC-FFT-014-7: Error Handling

**Steps:**
1. [ ] Try to sign in with wrong password
2. [ ] Try to sign up with existing email
3. [ ] Disconnect internet and try to save
4. [ ] Reconnect and try to save again

**Expected Results:**
- [ ] Clear error messages for invalid credentials
- [ ] Network error message for offline save
- [ ] Successful save after reconnecting

---

## US-FFT-015: Gamification Achievements

### Test Case TC-FFT-015-1: First Income Achievement

**Steps:**
1. [ ] Sign up as a new user
2. [ ] Click "Add Income" button
3. [ ] Observe the screen

**Expected Results:**
- [ ] Achievement toast appears with confetti effect
- [ ] Toast shows "First Step" achievement
- [ ] Toast includes icon 💰 and description
- [ ] Toast auto-closes after ~4 seconds

### Test Case TC-FFT-015-2: Triple Income Achievement

**Steps:**
1. [ ] From previous test, add a second income node
2. [ ] Verify no achievement (only 2 incomes)
3. [ ] Add a third income node

**Expected Results:**
- [ ] "Triple Income" achievement unlocks
- [ ] Confetti effect plays
- [ ] Toast displays with 🎯 icon

### Test Case TC-FFT-015-3: Budget Builder Achievement

**Steps:**
1. [ ] Click "Add Expense" button

**Expected Results:**
- [ ] "Budget Builder" achievement unlocks
- [ ] Toast displays with 💳 icon

### Test Case TC-FFT-015-4: Balanced Map Achievement

**Steps:**
1. [ ] From previous test (3 incomes, 1 expense)
2. [ ] Add a second expense node

**Expected Results:**
- [ ] "Balanced Map" achievement unlocks (2+ income & 2+ expense)
- [ ] Toast displays with ⚖️ icon

### Test Case TC-FFT-015-5: Connector Achievement

**Steps:**
1. [ ] Create connections between nodes
2. [ ] Count connections as you create them
3. [ ] Create the 5th connection

**Expected Results:**
- [ ] "Connector" achievement unlocks at 5 connections
- [ ] Toast displays with 🔗 icon

### Test Case TC-FFT-015-6: Data Keeper Achievement

**Steps:**
1. [ ] Click "💾 Save" button

**Expected Results:**
- [ ] "Data Keeper" achievement unlocks
- [ ] Toast displays with 💾 icon

### Test Case TC-FFT-015-7: Achievements Panel

**Steps:**
1. [ ] Click "🏆 Achievements" button in top bar
2. [ ] Review the achievements panel

**Expected Results:**
- [ ] Panel opens with all achievements listed
- [ ] Unlocked achievements show ✓ and colored background
- [ ] Locked achievements are grayed out
- [ ] Progress indicators show for incomplete achievements
- [ ] Achievement count shows (e.g., "6/6" if all unlocked)

### Test Case TC-FFT-015-8: Achievement Persistence

**Steps:**
1. [ ] Note which achievements are unlocked
2. [ ] Logout
3. [ ] Sign in again
4. [ ] Click "🏆 Achievements" button

**Expected Results:**
- [ ] All previously unlocked achievements are still unlocked
- [ ] Achievement count matches previous session
- [ ] No duplicate unlocks on reload

### Test Case TC-FFT-015-9: No Duplicate Unlocks

**Steps:**
1. [ ] From a state with "First Step" already unlocked
2. [ ] Delete all income nodes
3. [ ] Add a new income node

**Expected Results:**
- [ ] No achievement toast appears (already unlocked)
- [ ] Achievement remains in unlocked state

---

## US-FFT-016: Stripe Billing Integration

### Test Case TC-FFT-016-1: Billing Disabled by Default

**Steps:**
1. [ ] Verify `.env` has `VITE_BILLING_ENABLED=false`
2. [ ] Restart dev server
3. [ ] Sign in
4. [ ] Observe the top bar

**Expected Results:**
- [ ] No plan badge visible
- [ ] No upgrade button visible
- [ ] Can add unlimited boxes (no limit enforced)

### Test Case TC-FFT-016-2: Enable Billing

**Steps:**
1. [ ] Set `VITE_BILLING_ENABLED=true` in `.env`
2. [ ] Set `VITE_STRIPE_PUBLIC_KEY=pk_test_...` with valid key
3. [ ] Restart dev server
4. [ ] Sign in

**Expected Results:**
- [ ] Plan badge appears (🆓 Free)
- [ ] Upgrade button appears (⭐ Upgrade)

### Test Case TC-FFT-016-3: Free Plan Limit Enforcement

**Steps:**
1. [ ] Sign in as a free user
2. [ ] Add 5 income/expense boxes (count carefully)
3. [ ] Try to add a 6th box

**Expected Results:**
- [ ] 5th box creates successfully
- [ ] 6th box attempt shows Upgrade Modal
- [ ] Modal displays Free vs Pro plan comparison
- [ ] Box is not created (limit enforced)

### Test Case TC-FFT-016-4: Upgrade Modal

**Steps:**
1. [ ] From free plan, click "⭐ Upgrade" button
2. [ ] Review the modal

**Expected Results:**
- [ ] Modal shows Free plan (current)
- [ ] Modal shows Pro plan with $0.99/month price
- [ ] Free plan shows "Current Plan" badge
- [ ] Pro plan shows "Upgrade to Pro" button
- [ ] Features are listed for both plans

### Test Case TC-FFT-016-5: Checkout Flow (with Edge Functions)

**Note:** This requires Edge Functions deployed. Skip if not deployed.

**Steps:**
1. [ ] Click "Upgrade to Pro" in modal
2. [ ] Observe the behavior

**Expected Results (if deployed):**
- [ ] Redirected to Stripe Checkout page
- [ ] Can complete test payment with card `4242 4242 4242 4242`
- [ ] After payment, redirected back to app
- [ ] Plan changes to Pro

**Expected Results (if not deployed):**
- [ ] Error message: "Stripe checkout is not yet configured"
- [ ] Instructions shown to set up Stripe

### Test Case TC-FFT-016-6: Pro Plan Features

**Note:** Requires successful upgrade or manual DB update.

**Steps:**
1. [ ] Manually update subscription to Pro in Supabase:
```sql
UPDATE subscriptions SET plan_code = 'pro' WHERE user_id = 'your-user-id';
```
2. [ ] Reload the app
3. [ ] Observe the UI
4. [ ] Try adding many boxes (more than 5)

**Expected Results:**
- [ ] Plan badge shows ⭐ Pro
- [ ] No upgrade button (already Pro)
- [ ] Can add unlimited boxes (no 5-box limit)

### Test Case TC-FFT-016-7: Subscription Persistence

**Steps:**
1. [ ] As a Pro user, logout
2. [ ] Sign in again

**Expected Results:**
- [ ] Pro status persists across sessions
- [ ] Plan badge still shows ⭐ Pro
- [ ] Can still add unlimited boxes

### Test Case TC-FFT-016-8: New User Default Plan

**Steps:**
1. [ ] Sign up as a brand new user
2. [ ] Observe the plan badge

**Expected Results:**
- [ ] New user defaults to Free plan
- [ ] Plan badge shows 🆓 Free
- [ ] Subject to 5-box limit

---

## Regression Tests

### Test Case REG-001: Existing Flow Features Still Work

**Steps:**
1. [ ] Create income and expense nodes
2. [ ] Edit node values by double-clicking
3. [ ] Edit node labels by double-clicking
4. [ ] Create connections between nodes
5. [ ] Drag nodes to reposition them
6. [ ] Use zoom controls
7. [ ] Use mini-map
8. [ ] Delete nodes
9. [ ] View Financial Status breakdown

**Expected Results:**
- [ ] All features work as before
- [ ] No console errors
- [ ] No visual glitches

### Test Case REG-002: PDF Import Still Works

**Steps:**
1. [ ] Click "📄 Import PDF"
2. [ ] Select a test PDF
3. [ ] Enter password if needed
4. [ ] Click "Import PDF"

**Expected Results:**
- [ ] PDF imports successfully
- [ ] Expense node created/updated
- [ ] Success message shown

---

## Performance Tests

### Test Case PERF-001: Initial Load Time

**Steps:**
1. [ ] Clear browser cache
2. [ ] Navigate to app
3. [ ] Measure time to interactive

**Expected Results:**
- [ ] App loads within 3 seconds on good connection
- [ ] No indefinite loading states

### Test Case PERF-002: Save/Load Performance

**Steps:**
1. [ ] Create a large flow (20+ nodes, 30+ edges)
2. [ ] Save the flow
3. [ ] Reload the app
4. [ ] Observe load time

**Expected Results:**
- [ ] Large flow saves within 2 seconds
- [ ] Large flow loads within 3 seconds
- [ ] No UI freezing

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

Each should:
- [ ] Display correctly
- [ ] All features work
- [ ] No console errors

---

## Mobile Responsiveness

**Note:** Current app may not be fully optimized for mobile.

**Steps:**
1. [ ] Resize browser to mobile width
2. [ ] Test on actual mobile device if possible

**Expected Results:**
- [ ] Modals are scrollable
- [ ] Buttons are accessible
- [ ] No horizontal scrolling issues

---

## Security Tests

### Test Case SEC-001: Authentication Required

**Steps:**
1. [ ] Open app in incognito/private window
2. [ ] Try to access without logging in

**Expected Results:**
- [ ] Cannot access flow canvas without login
- [ ] Redirected to login screen

### Test Case SEC-002: Environment Variables Secure

**Steps:**
1. [ ] Build production version: `npm run build`
2. [ ] Inspect built files in `dist/`
3. [ ] Search for "SUPABASE" or "STRIPE"

**Expected Results:**
- [ ] Only public keys visible (starts with `pk_`)
- [ ] No secret keys exposed
- [ ] No Supabase service role keys

---

## Summary

### US-FFT-014: Backend Foundation
- Total Tests: 7
- Passed: ___
- Failed: ___

### US-FFT-015: Achievements
- Total Tests: 9
- Passed: ___
- Failed: ___

### US-FFT-016: Billing
- Total Tests: 8
- Passed: ___
- Failed: ___

### Regression Tests
- Total Tests: 2
- Passed: ___
- Failed: ___

### Other Tests
- Performance: 2 tests
- Browser Compatibility: 3 browsers
- Mobile: 1 test
- Security: 2 tests

---

## Notes

Record any issues or observations here:

---

## Sign-Off

- [ ] All critical tests passing
- [ ] No major regressions found
- [ ] Ready for deployment

**Tested by:** _______________  
**Date:** _______________  
**Version:** _______________
