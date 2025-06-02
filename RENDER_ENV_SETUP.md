# Render Environment Variables Setup

## Database Credentials

Add these environment variables to your Render backend service:

### PostgreSQL Database
```
DATABASE_URL=postgresql://proofpix_postgres_user:YOUR_PASSWORD@dpg-d0v2mmq4d50c73e3veo0-a:5432/proofpix_postgres
DB_HOST=dpg-d0v2mmq4d50c73e3veo0-a
DB_PORT=5432
DB_NAME=proofpix_postgres
DB_USER=proofpix_postgres_user
DB_PASSWORD=YOUR_ACTUAL_PASSWORD
```

### Redis Cache
```
REDIS_URL=redis://red-d0v2nmvdiees73cej9p0:6379
```

## How to Add Environment Variables in Render:

1. Go to your Render dashboard
2. Select your `proofpix-backend` service
3. Go to the "Environment" tab
4. Add each variable above
5. Click "Save Changes"
6. Your service will automatically redeploy

## Important Notes:

- Replace `YOUR_PASSWORD` with the actual database password from Render
- The Redis URL is already complete and ready to use
- These are internal Render URLs that only work within your Render services
- Make sure to also keep all your existing environment variables (Stripe keys, JWT secrets, etc.)

## Verification:

After adding these variables, your backend should be able to:
- Connect to PostgreSQL for data storage
- Connect to Redis for caching and sessions
- Process API requests from your Netlify frontend 