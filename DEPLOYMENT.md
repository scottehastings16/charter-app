# Deployment Guide - Charter Specs App

This app is part of a multi-app Auth0 setup with centralized authentication at `genericprototypes.com`.

## GitHub Setup

### Initial Git Setup
```bash
# Initialize git repository
git init

# Add remote for GitHub
git remote add origin https://github.com/scottehastings16/charter-app.git

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Analytics Event Generator"

# Push to GitHub
git push -u origin main
```

## Production Deployment

### Deploy to charter-specs.genericprototypes.com
```bash
# Set environment variables for production
# AUTH0_SECRET=your_auth0_secret_here
# AUTH0_CLIENT_ID=your_charter_specs_client_id
# AUTH0_ORGANIZATION=your_auth0_organization_id_here
# AUTH0_ISSUER_BASE_URL=https://login.genericprototypes.com
# AUTH0_REDIRECT_URI=https://charter-specs.genericprototypes.com/callback
# BASE_URL=https://charter-specs.genericprototypes.com

# Deploy using your preferred method (Heroku, AWS, etc.)
```

### Environment Variables Required

#### For Local Development (.env file)
```
AUTH0_SECRET=your_auth0_secret_here
AUTH0_CLIENT_ID=your_charter_specs_client_id
AUTH0_ORGANIZATION=your_auth0_organization_id_here
AUTH0_ISSUER_BASE_URL=https://login.genericprototypes.com
AUTH0_REDIRECT_URI=http://localhost:3000/callback
PORT=3000
BASE_URL=http://localhost:3000
```

#### For Production Deployment
Set these environment variables:
- `AUTH0_SECRET` - Your Auth0 application secret
- `AUTH0_CLIENT_ID` - Your Auth0 application client ID for charter-specs
- `AUTH0_ORGANIZATION` - Your Auth0 organization ID
- `AUTH0_ISSUER_BASE_URL` - `https://login.genericprototypes.com`
- `AUTH0_REDIRECT_URI` - `https://charter-specs.genericprototypes.com/callback`
- `BASE_URL` - `https://charter-specs.genericprototypes.com`

## Auth0 Multi-App Configuration

### For Charter Specs Application in Auth0:
1. **Application Type**: Regular Web Application
2. **Allowed Callback URLs**: 
   - `http://localhost:3000/callback` (for development)
   - `https://charter-specs.genericprototypes.com/callback`
3. **Allowed Logout URLs**: 
   - `http://localhost:3000`
   - `https://charter-specs.genericprototypes.com`
   - `https://genericprototypes.com` (central dashboard)
4. **Allowed Web Origins**: 
   - `http://localhost:3000`
   - `https://charter-specs.genericprototypes.com`

### Centralized Authentication Flow:
1. User visits `charter-specs.genericprototypes.com`
2. If not authenticated, redirected to `login.genericprototypes.com`
3. After authentication, redirected back to `charter-specs.genericprototypes.com/callback`
4. User can access the Charter Specs application

## Files Created for Deployment

- **Procfile**: Tells Heroku how to start the application
- **.gitignore**: Excludes unnecessary files from version control
- **env.example**: Template for environment variables
- **DEPLOYMENT.md**: This deployment guide

## Troubleshooting

### Common Issues
1. **Auth0 Configuration**: Ensure all callback URLs are properly set
2. **Environment Variables**: Double-check all required environment variables are set
3. **Heroku Logs**: Use `heroku logs --tail` to debug issues

### Useful Commands
```bash
# View Heroku logs
heroku logs --tail

# Check Heroku config vars
heroku config

# Restart Heroku app
heroku restart

# Open app in browser
heroku open
``` 