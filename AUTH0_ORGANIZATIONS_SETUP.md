# Auth0 Organizations Setup Guide

This guide will help you set up Auth0 Organizations to restrict access to only members of your organization.

## 📋 Prerequisites

1. Auth0 account with Organizations feature enabled
2. Admin access to your Auth0 dashboard
3. Charter Specs application already created in Auth0

## 🏢 Step 1: Create an Organization

### In Auth0 Dashboard:

1. **Navigate to Organizations**
   - Go to Auth0 Dashboard → Organizations
   - Click "Create Organization"

2. **Organization Details**
   - **Name**: `Generic Prototypes` (or your company name)
   - **Display Name**: `Generic Prototypes`
   - **Logo**: Upload your company logo (optional)
   - Click "Create"

3. **Note the Organization ID**
   - After creation, you'll see the Organization ID (starts with `org_`)
   - Example: `org_abc123def456ghi789`
   - **Save this ID** - you'll need it for your environment variables

## 🔧 Step 2: Configure Your Application for Organizations

### Enable Organizations for Charter Specs App:

1. **Go to Applications**
   - Auth0 Dashboard → Applications → Charter Specs

2. **Enable Organizations**
   - Go to "Organizations" tab
   - Toggle "Enable Organizations" to ON
   - Click "Save Changes"

3. **Grant Organization Access**
   - In the Organizations tab of your app
   - Click "Grant Access" 
   - Select your organization
   - Choose grant type: "Authorization Code" and "Refresh Token"
   - Click "Save"

## 👥 Step 3: Add Users to Organization

### Option A: Invite New Users
1. **In your Organization**
   - Go to Organizations → Your Organization → Members
   - Click "Invite Members"
   - Enter email addresses
   - Set roles (Admin, Member, etc.)
   - Send invitations

### Option B: Add Existing Users
1. **In your Organization**
   - Go to Organizations → Your Organization → Members
   - Click "Add Members"
   - Search and select existing Auth0 users
   - Assign roles
   - Click "Add"

## 🔐 Step 4: Configure Environment Variables

### Update your `.env` file:

```bash
# Auth0 Configuration
AUTH0_SECRET=your_32_character_secret_here
AUTH0_CLIENT_ID=your_charter_specs_client_id
AUTH0_ORGANIZATION=org_abc123def456ghi789
AUTH0_ISSUER_BASE_URL=https://login.genericprototypes.com
BASE_URL=http://localhost:3000
PORT=3000
```

**Important**: Replace `org_abc123def456ghi789` with your actual Organization ID from Step 1.

## 🎯 Step 5: Test the Setup

### Test Access Control:

1. **Test with Organization Member**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Login with a user that belongs to your organization
   # Should get access to the app
   ```

2. **Test with Non-Member**
   - Login with a user NOT in your organization
   - Should see: "Access denied. You must be a member of the organization"

3. **Check User Profile**
   - Visit `http://localhost:3000/profile` after login
   - Verify the user object contains organization information

## 📊 Step 6: Monitor Access

### View Organization Activity:
1. **Auth0 Dashboard → Organizations → Your Organization**
2. **Members Tab**: See all organization members
3. **Activity Tab**: Monitor login attempts and access
4. **Settings Tab**: Manage organization settings

### View Application Logs:
1. **Auth0 Dashboard → Monitoring → Logs**
2. Filter by your application
3. Look for organization-related events

## ⚙️ Advanced Configuration

### Organization-Specific Branding:
```javascript
// In your Auth0 organization settings
{
  "branding": {
    "logo_url": "https://your-domain.com/logo.png",
    "colors": {
      "primary": "#your-brand-color"
    }
  }
}
```

### Role-Based Access Control:
```javascript
// Add to your middleware for role checking
const requireRole = (role) => (req, res, next) => {
  const user = req.oidc.user;
  const userRoles = user['https://your-domain.com/roles'] || [];
  
  if (!userRoles.includes(role)) {
    return res.status(403).json({ 
      error: 'Insufficient permissions',
      required_role: role 
    });
  }
  next();
};

// Usage
app.get('/admin', requireOrgMembership, requireRole('admin'), (req, res) => {
  // Admin-only content
});
```

## 🚨 Troubleshooting

### Common Issues:

1. **"parameter organization is not allowed"**
   - Ensure Organizations is enabled for your application
   - Check that your app is granted access to the organization

2. **Users can't access the app**
   - Verify users are added to the organization
   - Check organization ID in environment variables
   - Ensure users are logging in with the correct account

3. **Organization ID not found**
   - Go to Organizations → Your Organization
   - Copy the ID from the URL or settings page
   - Format should be: `org_xxxxxxxxxxxxx`

### Debug Commands:

```bash
# Check organization membership in user profile
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://your-domain.auth0.com/userinfo

# View organization details
# (Requires Management API token)
curl -H "Authorization: Bearer YOUR_MGMT_TOKEN" \
  https://your-domain.auth0.com/api/v2/organizations/org_YOUR_ORG_ID
```

## 🎉 Success!

Once configured correctly:
- ✅ Only organization members can access your app
- ✅ Non-members get a clear "access denied" message
- ✅ You can manage user access through Auth0 Organizations
- ✅ Users get a seamless login experience

Your Charter Specs application is now securely restricted to your organization members only! 