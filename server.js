require('dotenv').config();
const express = require('express');
const path = require('path');
const { auth } = require('express-openid-connect');
const ExcelJS = require('exceljs');
const sizeOf = require('image-size');
const app = express();
const port = process.env.PORT || 3000;

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://login.genericprototypes.com',
  authorizationParams: {}
};

// Add organization for restricted access (required for organization-only access)
if (process.env.AUTH0_ORGANIZATION && process.env.AUTH0_ORGANIZATION.trim() !== '') {
  config.authorizationParams.organization = process.env.AUTH0_ORGANIZATION;
  // Require organization membership
  config.authRequired = true;
}

// Only add redirect_uri if it's provided and not empty
if (process.env.AUTH0_REDIRECT_URI && process.env.AUTH0_REDIRECT_URI.trim() !== '') {
  config.authorizationParams.redirect_uri = process.env.AUTH0_REDIRECT_URI;
}

// Middleware
app.use(express.json({ limit: 'Infinity' }));
app.use(express.urlencoded({ extended: true, limit: 'Infinity' }));

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Middleware to require authentication for protected routes
const requireAuth = (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.oidc.login();
  }
  next();
};

// Middleware to check organization membership
const requireOrgMembership = (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.oidc.login();
  }
  
  // If organization is configured, check membership
  if (process.env.AUTH0_ORGANIZATION) {
    const user = req.oidc.user;
    const userOrgs = user.org_id || user.organizations || [];
    
    // Check if user belongs to the required organization
    const hasAccess = Array.isArray(userOrgs) 
      ? userOrgs.includes(process.env.AUTH0_ORGANIZATION)
      : userOrgs === process.env.AUTH0_ORGANIZATION;
    
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Access denied. You must be a member of the organization to access this application.',
        message: 'Please contact your administrator for access.'
      });
    }
  }
  
  next();
};

// Serve static assets (unprotected - needed for login flow)
app.use('/vml.png', express.static(path.join(__dirname, 'public', 'vml.png')));
app.use('/styles.css', express.static(path.join(__dirname, 'public', 'styles.css')));

// Root route - redirect to login if not authenticated, otherwise serve the app
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.oidc.login();
  }
});

// Profile route to show user info (optional, for debugging)
app.get('/profile', requireOrgMembership, (req, res) => {
  res.json(req.oidc.user);
});

// Protect all other static files and routes with organization check
app.use(requireOrgMembership, express.static('public'));

// Custom logout route that redirects to login
app.get('/custom-logout', (req, res) => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL || 'http://localhost:3000'
  });
});

// Export events to Excel with images embedded
app.post('/export-excel', requireOrgMembership, async (req, res) => {
  try {
    const events = req.body.events;
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'No events provided' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Events');

    // Set fixed column widths that work well for images, code, and tagging plan
    worksheet.columns = [
      { header: 'Experience Image', key: 'image', width: 45 },
      { header: 'Data Layer Specifications', key: 'code', width: 80 },
      { header: 'Tagging Plan', key: 'taggingPlan', width: 60 }
    ];

    // Define max dimensions for images (in pixels) - optimized for mobile screenshots
    const MAX_WIDTH = 250;
    const MAX_HEIGHT = 450;

    for (const [i, event] of events.entries()) {
      const rowIndex = i + 2; // +2 for header row (Excel is 1-indexed)
      
      // Add the row with code and tagging plan - add line breaks at the beginning to push content down
      const codeWithSpacing = '\n\n' + event.codeBlock;
      const taggingPlanWithSpacing = event.taggingPlan ? '\n\n' + event.taggingPlan : '';
      const row = worksheet.addRow({ 
        code: codeWithSpacing,
        taggingPlan: taggingPlanWithSpacing
      });
      
      if (event.image) {
        // Remove the data:image/...;base64, prefix if present
        const match = event.image.match(/^data:image\/(png|jpeg);base64,(.*)$/);
        if (match) {
          const extension = match[1];
          const base64 = match[2];
          const buffer = Buffer.from(base64, 'base64');
          
          let imageWidth = MAX_WIDTH;
          let imageHeight = MAX_HEIGHT;
          
          try {
            const dimensions = sizeOf(buffer);
            const originalWidth = dimensions.width;
            const originalHeight = dimensions.height;
            
            console.log(`Original image dimensions: ${originalWidth}x${originalHeight}`);
            
            // Calculate aspect ratio
            const aspectRatio = originalWidth / originalHeight;
            
            // Scale image to fit within max dimensions while preserving aspect ratio
            if (originalWidth > MAX_WIDTH || originalHeight > MAX_HEIGHT) {
              if (aspectRatio > 1) {
                // Wide image - constrain by width
                imageWidth = MAX_WIDTH;
                imageHeight = MAX_WIDTH / aspectRatio;
                
                // If height is still too big, constrain by height
                if (imageHeight > MAX_HEIGHT) {
                  imageHeight = MAX_HEIGHT;
                  imageWidth = MAX_HEIGHT * aspectRatio;
                }
              } else {
                // Tall image - constrain by height
                imageHeight = MAX_HEIGHT;
                imageWidth = MAX_HEIGHT * aspectRatio;
                
                // If width is still too big, constrain by width
                if (imageWidth > MAX_WIDTH) {
                  imageWidth = MAX_WIDTH;
                  imageHeight = MAX_WIDTH / aspectRatio;
                }
              }
            } else {
              // Image is smaller than max dimensions, use original size
              imageWidth = originalWidth;
              imageHeight = originalHeight;
            }
            
            console.log(`Scaled image dimensions: ${imageWidth}x${imageHeight}`);
            
            // Set row height to match image height exactly
            // More accurate conversion: 1 point = 1.33 pixels, so pixels to points = pixels / 1.33
            const calculatedRowHeight = imageHeight / 1.33;
            row.height = calculatedRowHeight;
            
            console.log(`Row height set to: ${calculatedRowHeight} points`);
            
          } catch (e) {
            console.warn('Could not get image dimensions, using defaults:', e.message);
            // Set row height for default image size
            const calculatedRowHeight = imageHeight / 1.33;
            row.height = calculatedRowHeight;
          }
          
          const imageId = workbook.addImage({
            buffer: buffer,
            extension: extension
          });
          
          // Add image with calculated dimensions
          worksheet.addImage(imageId, {
            tl: { col: 0, row: rowIndex - 1 }, // Excel is 0-indexed for images
            ext: { width: imageWidth, height: imageHeight },
            editAs: 'oneCell' // Image moves and sizes with cell
          });
        }
      }
    }

    // Set column alignment for code and tagging plan
    worksheet.getColumn('code').alignment = { wrapText: true, vertical: 'top' };
    worksheet.getColumn('taggingPlan').alignment = { wrapText: true, vertical: 'top' };
    
    // Set alignment for image column
    worksheet.getColumn('image').alignment = { vertical: 'middle', horizontal: 'center' };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics_events.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Auth0 authentication enabled');
  console.log('Access the app at http://localhost:3000 - you will be redirected to Auth0 for login');
}); 