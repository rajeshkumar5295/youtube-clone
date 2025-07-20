# Firebase Setup Guide

## Prerequisites
- Firebase account
- Google Cloud project

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "youtube-clone")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" provider
5. Enable it and configure:
   - Project support email
   - Authorized domains (add localhost for development)
6. Click "Save"

## Step 3: Enable Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 4: Configure Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with the content from `firestore.rules` in this project
3. Click "Publish"

## Step 5: Enable Storage

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location (same as Firestore)
5. Click "Done"

## Step 6: Configure Storage Security Rules

1. In Storage, go to the "Rules" tab
2. Replace the default rules with the content from `storage.rules` in this project
3. Click "Publish"

## Step 7: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a nickname
5. Copy the config object
6. Replace the config in `src/firebase/config.js`

## Step 8: Update Security Rules (Production)

For production, update the security rules to be more restrictive:

### Firestore Rules (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{videoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules (storage.rules)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 100 * 1024 * 1024 && // 100MB limit
        request.resource.contentType.matches('video/.*');
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your domain is added to authorized domains in Authentication settings.

2. **Permission Denied**: Check that your security rules are properly configured and published.

3. **Storage Upload Fails**: Verify that Storage is enabled and rules allow uploads.

4. **Firestore Connection Errors**: Ensure Firestore is enabled and rules are published.

### Development vs Production:

- **Development**: Use "test mode" for quick setup
- **Production**: Use proper security rules and enable authentication requirements

## Environment Variables

For production, consider using environment variables for sensitive config:

```javascript
// .env.local
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Then update `src/firebase/config.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
``` 