# Google OAuth 2.0 Configuration Guide
**Job Finder Pro – Powered by IAMTECHNI**  
**Package:** `in.iamtechni.jobfinderpro`

---

## 1. Overview

Job Finder Pro integrates authentic Google OAuth authentication for seamless one-tap login and automatic user profile generation.

---

## 2. Google Cloud Console Setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create your project: `IAMTECHNI Job Finder Pro`.
3. Go to **APIs & Services** → **OAuth consent screen**:
   - User Type: **External**
   - App Name: `Job Finder Pro`
   - User support email: `support@iamtechni.com`
   - Developer contact email: `admin@iamtechni.com`
   - Scopes: `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`

---

## 3. Create Android OAuth Client ID

1. Go to **Credentials** → **Create Credentials** → **OAuth client ID**.
2. Select **Application type**: `Android`.
3. Package Name:
   ```text
   in.iamtechni.jobfinderpro
   ```
4. SHA-1 Certificate Fingerprint:
   - For EAS builds, retrieve your release SHA-1 fingerprint with:
     ```bash
     eas credentials -p android
     ```
   - For local debug keystore:
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
5. Save the generated **Android Client ID**.

---

## 4. Create Web OAuth Client ID (For Backend Verification)

1. Click **Create Credentials** → **OAuth client ID**.
2. Select **Application type**: `Web application`.
3. Add authorized redirect URIs:
   ```text
   https://auth.expo.io/@your-expo-username/job-finder-pro
   https://iamtechni.com/api/job-finder/auth/google
   ```
4. Copy the **Web Client ID** and **Client Secret**.

---

## 5. Environment Variables in `.env`

```env
GOOGLE_CLIENT_ID="your-google-web-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_ANDROID_CLIENT_ID="your-android-client-id.apps.googleusercontent.com"
```
