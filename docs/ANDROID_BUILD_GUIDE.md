# Job Finder Pro – Android Mobile App Build Guide
**Powered by IAMTECHNI**  
**Package Name:** `in.iamtechni.jobfinderpro`

---

## 1. Prerequisites

Ensure you have the following installed on your development workstation:
- **Node.js** (v18.x or v20.x LTS)
- **npm** or **bun**
- **Java Development Kit (JDK 17)**
- **Android Studio** (for local Android Emulator testing)
- **Expo CLI & EAS CLI**:
  ```bash
  npm install -g expo-cli eas-cli
  ```

---

## 2. Project Structure

The complete React Native / Expo codebase is located in `/mobile`:
```text
/mobile
├── App.tsx                     # Main application entry point
├── app.json                    # Expo configuration & Android package details
├── eas.json                    # EAS Build profiles (APK & AAB)
├── package.json                # Mobile dependencies (React Native, Paper, etc.)
├── tsconfig.json               # TypeScript config
└── src/
    ├── context/
    │   ├── AuthContext.tsx     # Google OAuth & session management
    │   └── JobContext.tsx      # Job search, saved jobs, alerts & employer intake
    ├── theme/
    │   └── ThemeContext.tsx    # Automatic Android system dark/light theme
    ├── navigation/
    │   └── RootNavigator.tsx   # 5-Tab bottom navigation & screen overlays
    └── screens/
        ├── SplashScreen.tsx
        ├── OnboardingScreen.tsx
        ├── LoginScreen.tsx
        ├── SignUpScreen.tsx
        ├── HomeScreen.tsx
        ├── SearchScreen.tsx
        ├── JobDetailScreen.tsx
        ├── SavedJobsScreen.tsx
        ├── JobAlertsScreen.tsx
        ├── ProfileScreen.tsx
        ├── EmployerRequestScreen.tsx
        ├── AboutScreen.tsx
        └── AdminPortalScreen.tsx
```

---

## 3. Local Development (Android Emulator or Physical Device)

1. Open a terminal and navigate to the mobile folder:
   ```bash
   cd mobile
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Press `a` in the terminal to launch on the Android Emulator, or scan the QR code using the **Expo Go** app on your Android phone.

---

## 4. Building the Standalone Android APK (Direct Phone Installation)

To generate a standalone `.apk` file that can be transferred and directly installed on any Android phone:

1. Log in to your Expo account:
   ```bash
   eas login
   ```
2. Configure EAS project ID (if first time):
   ```bash
   eas build:configure
   ```
3. Run the APK build command:
   ```bash
   eas build -p android --profile preview
   ```
4. EAS Build will compile the native Android code in the cloud and output a direct download link for the `.apk` file.
5. Download the APK and install it directly onto your Android device.

---

## 5. Building the Android App Bundle (AAB) for Google Play Console

To publish **Job Finder Pro** to the Google Play Store:

1. Ensure the package name in `mobile/app.json` is set to:
   ```json
   "package": "in.iamtechni.jobfinderpro"
   ```
2. Increment `versionCode` in `mobile/app.json` before each production release.
3. Run the production build command:
   ```bash
   eas build -p android --profile production
   ```
4. Download the signed `.aab` file from the EAS dashboard.
5. Upload the `.aab` bundle to Google Play Console under **Production** or **Internal Testing**.

---

## 6. Android Permissions Configured in `app.json`

The following Android permissions are configured:
- `INTERNET`: For connecting to backend API and external job portals.
- `ACCESS_NETWORK_STATE`: For detecting network availability and offline-first cache.
- `POST_NOTIFICATIONS`: For Android 13+ push notifications on job alert matches.
- `VIBRATE`: For tactile alert feedback.

---

## 7. Branding Consistency

Every screen, splash asset, and setting displays:
- **Application Name:** Job Finder Pro
- **Branding:** Powered by IAMTECHNI (exact spelling `IAMTECHNI`)
- **Package ID:** `in.iamtechni.jobfinderpro`
