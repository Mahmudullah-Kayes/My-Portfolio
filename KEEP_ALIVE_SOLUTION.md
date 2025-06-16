# Supabase Keep-Alive Solution

This solution prevents your Supabase project from automatically pausing due to inactivity.

## How It Works

1. **Database Table**: A `_pings` table in Supabase stores records of each ping.
2. **API Endpoint**: An endpoint at `/api/keep-alive` pings Supabase by inserting a new record.
3. **Vercel Cron Job**: Automatically calls the endpoint every 6 hours.
4. **Auto-Cleanup**: A database trigger limits the table to 100 records to prevent unlimited growth.

## Implementation Details

### Files Created/Modified:

- `src/utils/keepAlive.ts` - Utility function to ping Supabase
- `src/app/api/keep-alive/route.ts` - API endpoint
- `supabase/migrations/20240621000000_create_pings_table.sql` - SQL migration for the table
- `vercel.json` - Added cron job configuration

### Manual Steps Required:

1. **Apply the SQL Migration**:
   - Run this migration in your Supabase project's SQL editor
   - Or use the Supabase CLI to apply the migration

2. **Deploy to Vercel**:
   - Push these changes to your repository
   - Vercel will automatically deploy and set up the cron job

## Testing

You can manually test the keep-alive functionality by visiting:
`https://your-domain.com/api/keep-alive`

This should return a JSON response confirming the ping was successful.

## Troubleshooting

If you encounter issues:
1. Check Vercel logs for the cron job execution
2. Verify the `_pings` table exists in your Supabase database
3. Test the API endpoint manually to ensure it works 