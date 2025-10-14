# 🚀 HackathonHub - Full-Stack Hackathon Platform

A comprehensive hackathon management platform built with Next.js, TypeScript, TailwindCSS, and Firebase.

## ✨ Features

### 🔐 User Authentication
- Email/password authentication via Firebase
- User registration and login
- Protected routes and role-based access control

### 👥 Team Management
- Create and join teams
- Team owner management
- Member invitation system
- Team size limits and validation
- Leave/manage team members

### 🏆 Hackathon Registration
- Browse active hackathons
- Easy registration flow
- Track registration status
- View hackathon details and rules

### 💻 Project Collaboration
- Team workspace for project details
- GitHub repository integration
- Demo URL tracking
- Project description and documentation
- Real-time updates

### 👑 Owner/Admin Dashboard
- Create and manage hackathons
- View all teams and registrations
- Track statistics and metrics
- Manage hackathon status
- Monitor participant count

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS
- **Backend/Database**: Firebase (Firestore, Authentication, Storage)
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **Icons**: Heroicons, Lucide React

## 📦 Installation

1. Clone the repository:
```bash
cd hackathon-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [https://firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Copy your Firebase config

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Schema

### Users Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'organizer' | 'admin';
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Teams Collection
```typescript
{
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[]; // User IDs
  maxMembers: number;
  hackathonId?: string;
  projectName?: string;
  projectDescription?: string;
  githubRepo?: string;
  demoUrl?: string;
  status: 'forming' | 'active' | 'submitted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

### Hackathons Collection
```typescript
{
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  organizerId: string;
  maxTeams?: number;
  maxTeamSize: number;
  status: 'upcoming' | 'registration' | 'active' | 'judging' | 'completed';
  prizes?: Prize[];
  rules?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Registrations Collection
```typescript
{
  id: string;
  userId: string;
  hackathonId: string;
  teamId?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: Date;
}
```

## 🎯 Usage

### For Participants

1. **Sign Up**: Create an account at `/signup`
2. **Browse Hackathons**: View active hackathons on the home page
3. **Register**: Register for a hackathon at `/register`
4. **Create/Join Team**: Create or join a team at `/teams`
5. **Collaborate**: Work with your team, add project details
6. **Submit**: Update project info with GitHub repo and demo URL

### For Organizers/Admins

1. **Access Dashboard**: Login and go to `/dashboard`
2. **Create Hackathon**: Set up new hackathons with dates and rules
3. **Monitor Progress**: Track teams, registrations, and participants
4. **Manage Status**: Update hackathon status as it progresses

## 🔒 Setting Up Admin User

To make a user an admin, update their role in Firestore:

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Find the user in the `users` collection
4. Edit the `role` field to `admin` or `organizer`

## 📁 Project Structure

```
hackathon-platform/
├── app/
│   ├── dashboard/          # Admin dashboard
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   ├── register/          # Hackathon registration
│   ├── teams/             # Team management
│   │   └── [id]/         # Team detail page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── Navigation.tsx     # Main navigation
│   └── TeamCard.tsx       # Team card component
├── lib/
│   ├── auth-context.tsx   # Authentication context
│   ├── firebase.ts        # Firebase configuration
│   └── hooks.ts           # Custom React hooks
├── types/
│   └── index.ts           # TypeScript types
└── public/                # Static assets
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build
```

### Firebase Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /teams/{teamId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         request.auth.uid in resource.data.members);
    }
    
    match /hackathons/{hackathonId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'organizer'];
    }
    
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with Next.js, Firebase, and TailwindCSS
Icons by Heroicons and Lucide React

---

Made with ❤️ for the hackathon community
