# Environment Variables Setup Guide

## ⚠️ IMPORTANT: Your .env file was committed to GitHub

### Step 1: Remove .env from Git History

Run these commands to remove .env from your git history:

```bash
# Remove .env from git tracking
git rm --cached .env

# Remove from git history (use BFG Repo-Cleaner or git filter-branch)
# Option 1: Using git filter-branch (simpler)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

# Option 2: Using BFG Repo-Cleaner (recommended for large repos)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
# java -jar bfg.jar --delete-files .env
# git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

### Step 2: Force Push to GitHub (⚠️ WARNING: This rewrites history)

```bash
git push origin --force --all
```

**Note:** If others are working on this repo, coordinate with them first!

### Step 3: Create Your .env File

Create a `.env` file in the root directory with your actual values:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyB6iyQ6iiwTosWUeRRV9S86vSkSFVBAB2g
REACT_APP_FIREBASE_AUTH_DOMAIN=house-marketplace-app-ddae6.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=house-marketplace-app-ddae6
REACT_APP_FIREBASE_STORAGE_BUCKET=house-marketplace-app-ddae6.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=423101116511
REACT_APP_FIREBASE_APP_ID=1:423101116511:web:8d4915006c1319beb5ebea

# Chat Server URL (Optional)
REACT_APP_CHAT_SERVER_URL=http://localhost:8000
```

### Step 4: Rotate Your Firebase Keys (Recommended)

Since your Firebase config was exposed:
1. Go to Firebase Console → Project Settings
2. Regenerate your API keys
3. Update your .env file with new keys
4. Update Firebase security rules if needed

### Step 5: Verify .gitignore

Make sure `.env` is in your `.gitignore` (already done ✅)

## What to Store in .env

✅ **DO Store:**
- API keys
- Database credentials
- Secret tokens
- Firebase config
- Third-party service keys

❌ **DON'T Store:**
- Public configuration
- Non-sensitive settings
- Build configurations

## Security Best Practices

1. ✅ `.env` is now in `.gitignore`
2. ✅ Created `.env.example` as a template (without real values)
3. ✅ Firebase config now uses environment variables
4. ⚠️ Rotate exposed keys if they were sensitive
5. ⚠️ Never commit `.env` files again

