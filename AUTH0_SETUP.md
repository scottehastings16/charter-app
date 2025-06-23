# Auth0 Multi-App Setup Guide

This guide covers setting up Auth0 for your multi-application architecture with centralized authentication.

## Architecture Overview

### Applications:
- **Main Dashboard**: `genericprototypes.com` (login portal)
- **Charter Specs**: `charter-specs.genericprototypes.com` (Node.js)
- **Surveys**: `surveys.genericprototypes.com` (Node.js)
- **Web Map**: `web-map.genericprototypes.com` (Node.js)
- **Enterprise Admin**: `enterprise-admin.genericprototypes.com` (Python/Flask on Streamlit)

## Auth0 Configuration Steps

### 1. Create Auth0 Applications

Create separate applications in Auth0 for each subdomain:

#### Charter Specs Application:
- **Name**: Charter Specs
- **Type**: Regular Web Application
- **Domain**: Use your Auth0 domain (e.g., `your-tenant.auth0.com`)

#### Repeat for Other Apps:
- Surveys Application
- Web Map Application  
- Enterprise Admin Application
- Main Dashboard Application

### 2. Configure Each Application

#### For Charter Specs (this app):

**Application URIs:**
- **Allowed Callback URLs**:
  ```
  http://localhost:3000/callback,
  https://charter-specs.genericprototypes.com/callback
  ```

- **Allowed Logout URLs**:
  ```
  http://localhost:3000,
  https://charter-specs.genericprototypes.com,
  https://genericprototypes.com
  ```

- **Allowed Web Origins**:
  ```
  http://localhost:3000,
  https://charter-specs.genericprototypes.com
  ```

**Advanced Settings:**
- **Grant Types**: Authorization Code, Refresh Token
- **Token Endpoint Authentication Method**: Post

### 3. Organization Setup (Optional but Recommended)

Create an Auth0 Organization to manage user access across applications:

1. Go to Organizations in Auth0 Dashboard
2. Create new organization
3. Add your applications to the organization
4. Configure organization settings for centralized user management

### 4. Custom Domain (Recommended)

Set up a custom domain for Auth0:
1. Go to Branding → Custom Domains
2. Add `login.genericprototypes.com`
3. Configure DNS and SSL certificate
4. This provides consistent branding across all apps

### 5. Environment Variables for Charter Specs

#### Local Development (.env):
```bash
AUTH0_SECRET=your_32_character_secret_key
AUTH0_CLIENT_ID=your_charter_specs_client_id
AUTH0_ORGANIZATION=org_your_organization_id
AUTH0_ISSUER_BASE_URL=https://login.genericprototypes.com
AUTH0_REDIRECT_URI=http://localhost:3000/callback
PORT=3000
BASE_URL=http://localhost:3000
```

#### Production:
```bash
AUTH0_SECRET=your_32_character_secret_key
AUTH0_CLIENT_ID=your_charter_specs_client_id
AUTH0_ORGANIZATION=org_your_organization_id
AUTH0_ISSUER_BASE_URL=https://login.genericprototypes.com
AUTH0_REDIRECT_URI=https://charter-specs.genericprototypes.com/callback
BASE_URL=https://charter-specs.genericprototypes.com
```

## Centralized Dashboard Implementation

### Main Dashboard App (genericprototypes.com)

The main dashboard should:
1. Handle initial login
2. Display available applications based on user permissions
3. Provide single sign-on to subdomain applications

#### Sample Dashboard Structure:
```javascript
// After successful Auth0 login
const userApps = [
  {
    name: 'Charter Specs',
    url: 'https://charter-specs.genericprototypes.com',
    description: 'Analytics Event Generator',
    permissions: ['admin', 'user']
  },
  {
    name: 'Surveys',
    url: 'https://surveys.genericprototypes.com', 
    description: 'Survey Management',
    permissions: ['admin']
  },
  // ... other apps
];
```

## Authentication Flow

### Direct Subdomain Access:
1. User visits `charter-specs.genericprototypes.com`
2. App checks if user is authenticated
3. If not authenticated:
   - Redirect to Auth0 login (`login.genericprototypes.com`)
   - Auth0 authenticates user
   - Redirect back to `charter-specs.genericprototypes.com/callback`
   - User gains access to Charter Specs app

### Dashboard Access:
1. User visits `genericprototypes.com`
2. User logs in via Auth0
3. Dashboard shows available applications
4. User clicks on Charter Specs
5. Seamless access due to shared Auth0 session

## Security Considerations

### User Permissions:
- Use Auth0 roles and permissions to control app access
- Implement role-based access control (RBAC)
- Consider using Auth0 Organizations for tenant isolation

### Session Management:
- Configure appropriate session timeouts
- Implement proper logout across all applications
- Use refresh tokens for long-lived sessions

## Testing the Setup

### Test Scenarios:
1. **Direct access**: Visit each subdomain directly
2. **Dashboard access**: Login via main dashboard, navigate to apps
3. **Logout**: Ensure logout works across all applications
4. **Permissions**: Test different user roles and access levels

### Development Testing:
```bash
# Test local development
npm run dev

# Visit http://localhost:3000
# Should redirect to Auth0 login
# After login, should return to localhost:3000
```

## Troubleshooting

### Common Issues:
1. **Callback URL mismatch**: Ensure all URLs are properly configured
2. **CORS errors**: Check Allowed Web Origins
3. **Logout issues**: Verify logout URLs include all necessary domains
4. **Session conflicts**: Clear browser cache and cookies

### Debug Commands:
```bash
# Check Auth0 configuration
curl -H "Authorization: Bearer YOUR_MANAGEMENT_TOKEN" \
  https://your-tenant.auth0.com/api/v2/clients/YOUR_CLIENT_ID

# Test callback URL
curl -I https://charter-specs.genericprototypes.com/callback
``` 