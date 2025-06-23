# Troubleshooting Guide

## Common Auth0 Errors

### 1. "parameter organization is not allowed for this client"

**Error**: `BadRequestError: invalid_request (parameter organization is not allowed for this client)`

**Cause**: Your Auth0 application is not configured to use Organizations, but the `AUTH0_ORGANIZATION` environment variable is set.

**Solutions**:

#### Option A: Remove Organization Parameter (Recommended for simple setups)
1. In your `.env` file, comment out or remove the `AUTH0_ORGANIZATION` line:
   ```bash
   # AUTH0_ORGANIZATION=your_auth0_organization_id_here
   ```

2. Restart your application:
   ```bash
   npm run dev
   ```

#### Option B: Enable Organizations in Auth0 (For enterprise setups)
1. Go to your Auth0 Dashboard
2. Navigate to Organizations
3. Create a new organization
4. Add your application to the organization
5. Enable the organization feature for your tenant

### 2. Callback URL Mismatch

**Error**: `Callback URL mismatch` or redirect errors

**Solution**:
1. Check your Auth0 application settings
2. Ensure these URLs are in **Allowed Callback URLs**:
   ```
   http://localhost:3000/callback,
   https://charter-specs.genericprototypes.com/callback
   ```

### 3. CORS Errors

**Error**: Cross-origin request blocked

**Solution**:
1. Add to **Allowed Web Origins** in Auth0:
   ```
   http://localhost:3000,
   https://charter-specs.genericprototypes.com
   ```

### 4. "Invalid state parameter"

**Error**: State parameter validation failed

**Solutions**:
1. Clear browser cookies and cache
2. Check that `AUTH0_SECRET` is properly set
3. Ensure `AUTH0_SECRET` is at least 32 characters long

### 5. "Access Denied"

**Error**: User sees access denied page

**Solutions**:
1. Check user permissions in Auth0
2. Verify the user is assigned to the correct organization (if using organizations)
3. Check application grant types include "Authorization Code"

## Quick Fixes

### For Local Development:
```bash
# Minimal .env file for testing
AUTH0_SECRET=your_32_character_secret_key_here_1234
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
PORT=3000
BASE_URL=http://localhost:3000
```

### Clear All Auth Data:
```bash
# Clear browser storage
# In browser console:
localStorage.clear();
sessionStorage.clear();
# Then refresh the page
```

### Test Auth0 Configuration:
```bash
# Check if Auth0 endpoints are accessible
curl https://your-tenant.auth0.com/.well-known/openid_configuration

# Test callback URL
curl -I http://localhost:3000/callback
```

## Environment Variable Validation

### Required Variables:
- ✅ `AUTH0_SECRET` (32+ characters)
- ✅ `AUTH0_CLIENT_ID`
- ✅ `AUTH0_ISSUER_BASE_URL`
- ✅ `BASE_URL`

### Optional Variables:
- `AUTH0_ORGANIZATION` (only if using Auth0 Organizations)
- `AUTH0_REDIRECT_URI` (usually not needed)
- `PORT` (defaults to 3000)

## Getting Help

1. **Check Auth0 Logs**: Go to Auth0 Dashboard → Monitoring → Logs
2. **Check Application Logs**: Use `console.log` statements or check server logs
3. **Verify URLs**: Double-check all URLs match between Auth0 settings and your application
4. **Test Step by Step**: Start with minimal configuration and add features gradually 