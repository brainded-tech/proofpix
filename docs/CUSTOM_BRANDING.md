# ProofPix Enterprise Custom Branding

This document provides comprehensive documentation for the custom branding features in ProofPix Enterprise. The white-label branding functionality allows you to fully customize the look and feel of the application to match your organization's brand identity.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Branding Assets](#branding-assets)
4. [Color Scheme](#color-scheme)
5. [White-Label Configuration](#white-label-configuration)
6. [API Reference](#api-reference)
7. [Implementation Details](#implementation-details)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

The ProofPix Enterprise branding system allows you to:

- Upload custom logos (light and dark versions) and favicon
- Define a custom color scheme for the application
- Configure white-label settings including custom domain and application name
- Remove ProofPix branding and replace with your own

All branding settings are managed through a secure API and are automatically applied to all aspects of the application, including the user interface, PDF reports, and email notifications.

## Getting Started

To begin customizing your ProofPix Enterprise instance:

1. Navigate to the Enterprise Branding page
2. Enter your Enterprise API key
3. Follow the three-step process to configure your branding:
   - Upload branding assets
   - Configure color scheme
   - Set up white-label options

## Branding Assets

### Logo Requirements

| Asset | Recommended Size | Format | Notes |
|-------|-----------------|--------|-------|
| Light Logo | 300×100px | SVG, PNG, JPEG | For use on dark backgrounds |
| Dark Logo | 300×100px | SVG, PNG, JPEG | For use on light backgrounds |
| Favicon | 32×32px | ICO, PNG, SVG | Used in browser tabs |

### File Specifications

- **Maximum File Size**: 5MB per asset
- **Supported Formats**: SVG (preferred), PNG, JPEG, ICO (favicon only)
- **Transparency**: Recommended for logos to blend with different backgrounds
- **Resolution**: High-resolution assets recommended for retina displays

## Color Scheme

The color scheme defines the visual appearance of the application interface. You can customize the following colors:

| Color | Description | Default |
|-------|-------------|---------|
| Primary | Main brand color used for buttons, links, and highlights | `#3B82F6` |
| Secondary | Used for secondary elements and accents | `#1E40AF` |
| Accent | Used for success states and calls to action | `#F59E0B` |
| Text | Used for text content | `#F9FAFB` |
| Background | Used for application background | `#111827` |

### Color Accessibility

When selecting colors, we automatically check for:

- WCAG 2.1 AA compliance for text contrast
- Color blindness considerations
- Sufficient contrast between interactive elements and backgrounds

## White-Label Configuration

White-label settings allow you to present ProofPix as your own branded solution:

| Setting | Description | Example |
|---------|-------------|---------|
| Custom Domain | The domain where your branded application is hosted | `exif.yourcompany.com` |
| Application Name | Custom name for your application | `YourCompany EXIF Tool` |
| Support Email | Email displayed for support inquiries | `support@yourcompany.com` |
| Custom Footer | Text displayed in the application footer | `© 2024 YourCompany. All rights reserved.` |

### Hide ProofPix Branding

When enabled, this option removes all references to ProofPix from the application, including:

- Logo and name in the UI
- Footer references
- "Powered by" mentions
- References in reports and exports

## API Reference

### Authentication

All API endpoints require authentication using an Enterprise API key:

```http
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

#### Upload Branding Assets

```http
POST /api/branding/upload
Content-Type: multipart/form-data
```

| Parameter | Type | Description |
|-----------|------|-------------|
| logo_light | File | Light version of logo |
| logo_dark | File | Dark version of logo |
| favicon | File | Favicon image |
| colors | JSON | Optional color scheme configuration |

#### Update Colors

```http
PUT /api/branding/colors
Content-Type: application/json
```

```json
{
  "primary": "#3B82F6",
  "secondary": "#1E40AF",
  "accent": "#F59E0B",
  "text": "#F9FAFB",
  "background": "#111827"
}
```

#### Configure White-Label

```http
PUT /api/branding/whitelabel
Content-Type: application/json
```

```json
{
  "domain": "exif.yourcompany.com",
  "applicationName": "YourCompany EXIF Tool",
  "supportEmail": "support@yourcompany.com",
  "customFooter": "© 2024 YourCompany. All rights reserved.",
  "hideProofPixBranding": true
}
```

#### Get Configuration

```http
GET /api/branding/config
```

Returns the complete branding configuration for the authenticated user.

## Implementation Details

### Storage

Branding assets are stored securely in the following location:

```
/uploads/branding/{userId}_{uuid}.{extension}
```

### Application of Styles

The branding is applied through:

1. Dynamic CSS generation based on color scheme
2. Asset URL substitution for logos and favicons
3. Text replacement for application name and footer
4. Domain configuration via proxy/reverse proxy

### Security Considerations

- All uploaded files are scanned for malware
- File types are strictly validated
- Size limits are enforced
- Assets are served with appropriate caching headers
- All URLs and text inputs are sanitized

## Best Practices

For optimal results with your custom branding:

1. **Use SVG logos** whenever possible for best scaling across devices
2. **Test colors** in both light and dark contexts
3. **Provide both logo versions** (light and dark) for better appearance across themes
4. **Keep file sizes small** to ensure fast loading times
5. **Maintain sufficient contrast** between text and background colors
6. **Consider accessibility** when choosing colors and designs

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Logo appears pixelated | Use SVG format or higher resolution PNG |
| Colors not updating | Clear browser cache or use incognito mode |
| Upload errors | Check file size and format requirements |
| Missing assets | Verify all required assets have been uploaded |
| White-label settings not applied | DNS configuration may need updating |

### Support

For additional assistance with branding configuration:

- Email: enterprise-support@proofpixapp.com
- Documentation: https://docs.proofpixapp.com/enterprise/branding
- Support Portal: https://support.proofpixapp.com 