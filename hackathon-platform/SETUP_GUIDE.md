# 🚀 HackathonHub Setup Guide

This guide will help you set up and deploy your HackathonHub platform.

## Prerequisites

- Node.js 18+ installed
- Firebase account
- Git

## Quick Start

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "hackathon-hub")
4. Follow the wizard to create your project

### 2. Enable Firebase Services

#### Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method

#### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select your preferred region
5. Click "Enable"

#### Firebase Configuration
1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll to "Your apps" section
4. Click the web icon `</>`
5. Register your app with a nickname
6. Copy the configuration values

### 3. Local Development Setup

```bash
# Navigate to the project directory
cd hackathon-platform

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your Firebase config
# Use your favorite editor (nano, vim, code, etc.)
nano .env.local
```

Add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

### Firebase Security Rules

Replace the default Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Team documents
    match /teams/{teamId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         request.auth.uid in resource.data.members);
      allow delete: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // Hackathon documents
    match /hackathons/{hackathonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'organizer'];
    }
    
    // Registration documents
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'organizer']);
    }
    
    // Submission documents
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
        exists(/databases/$(database)/documents/teams/$(request.resource.data.teamId)) &&
        request.auth.uid in get(/databases/$(database)/documents/teams/$(request.resource.data.teamId)).data.members;
    }
  }
}
```

### Update Firestore Security Rules

1. Go to Firebase Console
2. Navigate to **Firestore Database**
3. Click **Rules** tab
4. Replace with the security rules above
5. Click **Publish**

## Creating Your First Admin User

### Option 1: Via Firebase Console

1. Sign up through the app at `/signup`
2. Go to Firebase Console → Firestore Database
3. Find your user document in the `users` collection
4. Edit the document
5. Change `role` field from `participant` to `admin`
6. Save the document
7. Refresh your app and you'll have admin access

### Option 2: Via Firebase CLI (Advanced)

```javascript
// admin-setup.js
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

async function makeAdmin(email) {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', email).get();
  
  if (snapshot.empty) {
    console.log('User not found');
    return;
  }
  
  snapshot.forEach(async (doc) => {
    await doc.ref.update({ role: 'admin' });
    console.log(`User ${email} is now an admin`);
  });
}

makeAdmin('your-email@example.com');
```

## Features Overview

### For Participants
- ✅ User registration and authentication
- ✅ Browse active hackathons
- ✅ Create and join teams
- ✅ Team collaboration workspace
- ✅ Project submission with GitHub integration

### For Organizers/Admins
- ✅ Create and manage hackathons
- ✅ View all teams and participants
- ✅ Track registrations and submissions
- ✅ Dashboard with statistics

## Troubleshooting

### Firebase Connection Issues
- Verify your Firebase config in `.env.local`
- Check Firebase Console for API restrictions
- Ensure billing is enabled for production apps

### Authentication Not Working
- Verify Email/Password is enabled in Firebase Authentication
- Check browser console for errors
- Clear browser cache and cookies

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### CORS Issues
- Add your domain to Firebase authorized domains:
  - Firebase Console → Authentication → Settings
  - Scroll to "Authorized domains"
  - Add your domain

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyC...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `my-hackathon-hub` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | `1:123:web:abc` |

## Support

For issues and questions:
- Check the [HACKATHON_README.md](./HACKATHON_README.md) for detailed documentation
- Open an issue on GitHub
- Check Firebase documentation at [firebase.google.com/docs](https://firebase.google.com/docs)

## Next Steps

1. ✅ Complete Firebase setup
2. ✅ Deploy to Vercel
3. ✅ Create your first admin user
4. ✅ Create your first hackathon
5. ✅ Invite participants
6. 🎉 Start hacking!

---

Happy Hacking! 🚀
