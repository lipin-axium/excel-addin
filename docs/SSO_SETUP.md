# Office SSO Setup Guide

Getting `Office.auth.getAccessToken()` to return real user identity (name + email) in an Excel add-in.

---

## Prerequisites

- M365 Business (Basic or higher) tenant — personal M365 Family does **not** support centralized deployment
- Admin access to both Azure portal and M365 admin center
- Add-in hosted at a public HTTPS URL (e.g. CloudFront)

---

## Step 1: Register Azure AD App

1. Go to [portal.azure.com](https://portal.azure.com) → **Azure Active Directory** → **App registrations** → **New registration**
2. Name: `ExcelOS`
3. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
4. Redirect URI: leave blank for now
5. Click **Register** — note the **Application (client) ID**

---

## Step 2: Configure Expose an API

1. Left sidebar → **Expose an API**
2. Click **Edit** next to Application ID URI — set it to:
   ```
   api://{your-cloudfront-domain}/{client-id}
   ```
   Example: `api://d10i2j79wgfo75.cloudfront.net/a4b0516f-52c9-4b28-95f9-255dd9dd6bfb`
3. Click **Add a scope**:
   - Scope name: `access_as_user`
   - Who can consent: **Admins and users**
   - Admin consent display name: `Access ExcelOS as user`
   - Admin consent description: `Allows Office to call ExcelOS on behalf of the user`
   - Click **Add scope**

---

## Step 3: Pre-authorize Office Client Applications

Still in **Expose an API** → **Authorized client applications** → **Add a client application**

Add each of the following client IDs, selecting the `access_as_user` scope for each:

| Client ID | Application |
|---|---|
| `d3590ed6-52b3-4102-aeff-aad2292ab01c` | Microsoft Office (desktop) |
| `ea5a67f6-b6f3-4338-b240-c655ddc3cc8e` | Office on the web |
| `57fb890c-0dab-4253-a5e0-7188c88b2bb4` | Office iOS |
| `08e18876-6177-487e-b8b5-cf950c1e598c` | Office broker |

> Note: `93d53678-613d-4013-afc8-bf21b35f3bef` is sometimes listed in docs but may not exist in all tenants — skip it if it fails.

---

## Step 4: Add Redirect URI

1. Left sidebar → **Authentication**
2. Click **Add Redirect URI** (or switch to old experience → Add a platform → Web)
3. Add: `https://{your-cloudfront-domain}` (e.g. `https://d10i2j79wgfo75.cloudfront.net`)
4. Click **Save**

---

## Step 5: API Permissions + Admin Consent

1. Left sidebar → **API permissions**
2. Verify Microsoft Graph has: `email`, `openid`, `profile`, `User.Read` (delegated)
3. Click **Grant admin consent for {tenant}** → confirm

Then grant consent for the full app (including `access_as_user`) by visiting this URL in the browser while signed in as a tenant admin:

```
https://login.microsoftonline.com/{tenant-id}/adminconsent?client_id={client-id}&redirect_uri=https://{your-cloudfront-domain}
```

Example:
```
https://login.microsoftonline.com/3cf4c768-54ab-4d02-9572-e913956497df/adminconsent?client_id=a4b0516f-52c9-4b28-95f9-255dd9dd6bfb&redirect_uri=https://d10i2j79wgfo75.cloudfront.net
```

Click **Accept** on the consent prompt. On success it redirects to the CloudFront URL.

---

## Step 6: Update Manifest

The manifest's `<WebApplicationInfo>` `<Resource>` must include the CloudFront domain:

```xml
<WebApplicationInfo>
  <Id>{client-id}</Id>
  <Resource>api://{your-cloudfront-domain}/{client-id}</Resource>
  <Scopes>
    <Scope>openid</Scope>
    <Scope>email</Scope>
    <Scope>profile</Scope>
  </Scopes>
</WebApplicationInfo>
```

> **Important:** `<WebApplicationInfo>` must come **after** `<Resources>` in the XML — placing it before will cause admin center upload to fail.

> **Important:** `<SupportUrl>` and `<AppDomain>` values must have a **trailing slash** for the build transform to replace localhost URLs with the production CDN URL.

---

## Step 7: Deploy via M365 Admin Center

1. Go to [admin.microsoft.com](https://admin.microsoft.com) → **Settings** → **Integrated apps**
2. Click **Upload custom apps** → **Office Add-in** → upload `dist/manifest.prod.xml`
3. Assign to **Entire organization** or specific users
4. Wait for deployment to propagate (up to a few hours)

> The add-in must be loaded from **Admin Managed** (not "My Add-ins" / sideloaded) for SSO to work.

---

## Step 8: Verify

Open Excel Online at `office.com` signed in with a tenant account. Open the ExcelOS add-in from the Home ribbon. Check browser DevTools console — there should be no SSO errors, and DynamoDB should log the real user email.

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `SSO Resource "api://..." cannot be used from "https://..." origin due to domain mismatch` | Manifest `<Resource>` doesn't include the hosting domain | Update `<Resource>` to `api://{domain}/{client-id}` and re-upload manifest |
| `400 Bad Request` with `x-ms-clitelem: 1,65001,...` | Admin consent not granted | Run the `adminconsent` URL above |
| `AADSTS500113: No reply address is registered` | No redirect URI on the app | Add redirect URI in Authentication |
| SSO returns "anonymous" | Add-in loaded from sideload instead of Admin Managed | Use the admin center deployed version |
| Add-in still shows after removal from admin center | Microsoft propagation delay | Wait 15–30 min and refresh |
