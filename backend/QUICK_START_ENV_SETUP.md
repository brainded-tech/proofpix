# 🚀 Quick Start Environment Setup

## **Step 1: Copy Environment File**
```bash
cp env.example .env
```

## **Step 2: Configure ONLY These Required Fields**

Open `.env` and update these **3 essential sections**:

### **Database (REQUIRED)**
```bash
# Update this line with your actual PostgreSQL password
DB_PASSWORD=your_actual_postgres_password_here
```

### **JWT Secrets (REQUIRED - Generate Random Strings)**
```bash
# Replace these with actual random strings (32+ characters each)
JWT_SECRET=generate_a_random_32_character_string_here
JWT_REFRESH_SECRET=generate_different_32_character_string_here  
SESSION_SECRET=generate_another_32_character_string_here
```

**Generate random secrets with:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Email (OPTIONAL - For Development)**
```bash
# For development, keep this as true to skip email setup
MOCK_EMAIL=true
```

## **Step 3: Everything Else Uses Good Defaults!**

✅ **These work out of the box:**
- Server configuration (port 5000)
- File upload settings (50MB limit, PDF support)
- Document intelligence features (all enabled)
- Security settings (production-ready)
- Feature flags (document AI enabled)

## **Step 4: Test Your Configuration**

```bash
# Test server starts correctly
npm start

# Should see:
# ✅ Server running on port 5000
# ✅ Database connected
# ✅ Document intelligence enabled
```

## **What You DON'T Need to Configure Yet**

### **Stripe (Payments)** - Add later when ready to charge users
```bash
STRIPE_SECRET_KEY=sk_test_...  # Add when ready for payments
```

### **Azure OCR** - Add later for premium features
```bash
AZURE_COGNITIVE_SERVICES_KEY=...  # Add for enterprise OCR
```

### **Redis** - Add later for better performance
```bash
REDIS_URL=redis://localhost:6379  # Add for caching
```

### **OAuth** - Add later for social login
```bash
GOOGLE_CLIENT_ID=...  # Add for Google login
```

## **Database Setup**

If you don't have PostgreSQL installed:

### **Option 1: Local PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb proofpix

# Ubuntu/Debian
sudo apt install postgresql
sudo -u postgres createdb proofpix
```

### **Option 2: Cloud Database (Recommended)**
- **Supabase** (free): https://supabase.com
- **Railway** (free tier): https://railway.app
- **Heroku Postgres** (free tier): https://heroku.com

## **Ready to Deploy!**

Once you have:
1. ✅ Database running
2. ✅ JWT secrets generated  
3. ✅ `.env` file configured

You can immediately:
```bash
npm run migrate  # Create database tables
npm start        # Start the server
```

**Document intelligence features will be fully functional!** 