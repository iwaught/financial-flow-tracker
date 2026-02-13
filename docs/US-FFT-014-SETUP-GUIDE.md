# US-FFT-014: Backend Foundation Setup Guide

## Overview
This guide walks through setting up the Supabase backend for user authentication and flow data persistence.

## Prerequisites
- Node.js and npm installed
- A Supabase account (free tier is fine)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name**: financial-flow-tracker (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to your users
4. Click "Create new project" and wait for provisioning (~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration
6. Verify tables were created by going to **Table Editor** - you should see:
   - `profiles` table
   - `flows` table

## Step 3: Configure Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
3. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and fill in your values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Install Dependencies

```bash
npm install
```

This will install the Supabase client library (`@supabase/supabase-js`) and other dependencies.

## Step 5: Run the Application

```bash
npm run dev
```

The app should open at `http://localhost:5173`

## Step 6: Test Authentication

1. **Sign Up**:
   - Click "Don't have an account? Sign up"
   - Enter your email and password (min 6 characters)
   - Optionally add a display name
   - Click "Sign Up"
   - Check your email for verification link (Supabase sends this automatically)

2. **Verify Email** (if email confirmation is enabled):
   - Check your email inbox
   - Click the verification link
   - Return to the app

3. **Sign In**:
   - If redirected to login, enter your email and password
   - Click "Sign In"
   - You should see the flow canvas

## Step 7: Test Flow Persistence

1. **Create a Flow**:
   - Add some income and expense nodes
   - Connect them together
   - Click "💾 Save"
   - You should see "Flow saved successfully!"

2. **Verify in Database**:
   - Go to Supabase **Table Editor** → `flows`
   - You should see a row with your user_id and flow data

3. **Test Loading**:
   - Click "📂 Load"
   - Your flow should reload (though it's already loaded on login)

4. **Test Cross-Device**:
   - Sign out (click "Logout")
   - Sign in from another browser/device
   - Your flow should automatically load

## Step 8: Test Row Level Security (RLS)

1. **Create Second User**:
   - Sign out from User A
   - Sign up as User B with different email
   - Create a different flow for User B
   - Save it

2. **Verify Isolation**:
   - Sign out from User B
   - Sign in as User A
   - Verify you only see User A's flow (not User B's)

3. **Test Direct Access (Optional)**:
   - In Supabase SQL Editor, try to query another user's data:
     ```sql
     -- This should return empty if you're logged in as User A trying to see User B's data
     SELECT * FROM flows WHERE user_id != auth.uid();
     ```
   - This query should return no results due to RLS

## Troubleshooting

### "Invalid API key" or Connection Errors
- Double-check your `.env` file has the correct Supabase URL and anon key
- Ensure `.env` is in the project root directory
- Restart the dev server after changing `.env`

### "No saved flow found" on First Login
- This is normal for new users - just create a flow and save it

### Email Confirmation Issues
- By default, Supabase requires email confirmation
- For testing, you can disable this:
  1. Go to **Authentication** → **Settings** in Supabase
  2. Find "Enable email confirmations"
  3. Toggle it off (not recommended for production)

### RLS Policy Errors
- If you see "permission denied" errors, verify:
  1. RLS policies are enabled on both tables
  2. The migration ran successfully
  3. You're signed in with a valid user

### Network Errors
- Ensure your Supabase project is running (not paused)
- Check your internet connection
- Verify the Supabase URL is correct

## Security Notes

1. **Environment Variables**: Never commit `.env` to git (it's in `.gitignore`)
2. **Anon Key**: Safe to expose in frontend - only allows access through RLS
3. **Service Role Key**: NEVER use in frontend - only for server-side admin tasks
4. **RLS Policies**: Always enforced - users can only access their own data

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. These will be available during build time

## Next Steps

- ✅ US-FFT-014: Backend Foundation (Complete)
- 🔄 US-FFT-015: Gamification Achievements (Next)
- ⏳ US-FFT-016: Stripe Billing Integration

## Support

If you encounter issues:
1. Check Supabase logs: **Dashboard** → **Logs**
2. Check browser console for errors
3. Review the RLS policies in Supabase Table Editor
