# JWT Authentication Setup Guide

## Problem
The Dashboard is returning 403 Forbidden errors with the message:
```
{"code":"jwt_auth_bad_config","message":"JWT is not configured properly, please contact the admin","data":{"status":403}}
```

## Root Cause
The JWT Auth plugin on the WordPress server is not properly configured to handle authentication requests.

## Solution for WordPress Admin

### 1. Install JWT Auth Plugin
Make sure the JWT Authentication for WP REST API plugin is installed and activated.

### 2. Configure JWT Auth
In WordPress admin, go to **Settings > JWT Auth** and configure:

1. **Secret Key**: Generate a strong secret key
2. **Algorithm**: Use HS256 (default)
3. **Expiration**: Set token expiration time (recommended: 1 hour)

### 3. Configure .htaccess
Add this to your WordPress `.htaccess` file:
```apache
# JWT Auth Headers
RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

### 4. Test Configuration
Test the JWT endpoint:
```bash
curl -X POST "https://your-site.com/wp-json/jwt-auth/v1/token" \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

## Temporary Workaround
Until JWT is properly configured, users will see an error message in the Dashboard explaining the issue.

## Current Status
- ✅ Public endpoints (products, categories) work without authentication
- ❌ Authenticated endpoints (orders, customers) require JWT setup
- ✅ Proper error handling implemented with user-friendly messages
