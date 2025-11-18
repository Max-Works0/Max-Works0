# 🎯 Quick Reference Guide

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Run linter

# Dependencies
npm install          # Install all dependencies
npm install <package> # Add new package
```

## File Locations

| What | Where |
|------|-------|
| Pages | `app/*/page.tsx` |
| Components | `components/*.tsx` |
| Firebase config | `lib/firebase.ts` |
| Auth logic | `lib/auth-context.tsx` |
| Custom hooks | `lib/hooks.ts` |
| Type definitions | `types/index.ts` |
| Environment variables | `.env.local` |

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage | No |
| `/signup` | User registration | No |
| `/login` | User login | No |
| `/teams` | Browse teams | No* |
| `/teams/[id]` | Team details | Yes |
| `/register` | Hackathon registration | Yes |
| `/dashboard` | Admin dashboard | Yes (Admin/Organizer) |

*Can view without auth, but need auth to create teams

## Database Collections

```typescript
// Collections in Firestore
users/          // User profiles
teams/          // Team information
hackathons/     // Hackathon events
registrations/  // User registrations
submissions/    // Project submissions
```

## User Roles

```typescript
'participant'   // Default role, can join teams
'organizer'     // Can create hackathons
'admin'        // Full access to dashboard
```

## Common Tasks

### Add a New Admin User
1. Sign up through the app
2. Go to Firebase Console → Firestore
3. Find user in `users` collection
4. Change `role` to `admin`

### Create a Hackathon
1. Login as admin/organizer
2. Go to `/dashboard`
3. Click "Create Hackathon"
4. Fill in details and save

### Create a Team
1. Login as any user
2. Go to `/teams`
3. Click "Create Team"
4. Fill in team details

### Join a Team
1. Login as any user
2. Browse teams at `/teams`
3. Click on a team
4. Click "Join Team"

## Environment Variables

```bash
# Required for Firebase connection
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Customization

### Change Colors
Edit `tailwind.config.ts` or use Tailwind classes:
- Primary: `purple-600`
- Secondary: `blue-600`
- Success: `green-600`
- Danger: `red-600`

### Add New Pages
```bash
# Create new page
mkdir app/new-page
touch app/new-page/page.tsx
```

### Add to Navigation
Edit `components/Navigation.tsx` to add new links

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Firebase not initialized" | Check `.env.local` exists and has correct values |
| "Permission denied" | Update Firestore security rules |
| "Module not found" | Run `npm install` |
| Build fails | Clear `.next` folder, reinstall: `rm -rf .next && npm install` |
| Port 3000 in use | Use different port: `npm run dev -- -p 3001` |

## Helpful Firebase Console Links

- **Authentication**: Console → Authentication → Users
- **Database**: Console → Firestore Database → Data
- **Rules**: Console → Firestore Database → Rules
- **Settings**: Console → Project Settings → General

## Git Workflow

```bash
# Make changes
git add .
git commit -m "Your message"
git push

# Create new branch
git checkout -b feature/new-feature
```

## Deployment Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore created
- [ ] Environment variables set in Vercel
- [ ] Security rules updated
- [ ] First admin user created
- [ ] Test signup flow
- [ ] Test team creation
- [ ] Test hackathon creation

## Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

💡 **Pro Tip**: Keep this file handy for quick reference during development!
