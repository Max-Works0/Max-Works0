# 🚀 HackathonHub

A full-stack hackathon management platform built with Next.js, TypeScript, TailwindCSS, and Firebase.

## ✨ Features

- 🔐 User authentication (Firebase Auth)
- 👥 Team management and collaboration
- 🏆 Hackathon registration system
- 💻 Project workspace with GitHub integration
- 👑 Admin dashboard for organizers
- 📊 Real-time updates with Firestore

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Firebase config

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📚 Documentation

- **[HACKATHON_README.md](./HACKATHON_README.md)** - Complete feature documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup and deployment guide

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Vercel-ready

## 📸 Screenshots

![Homepage](https://github.com/user-attachments/assets/ce911a03-c24d-47bf-b3f6-71832f13fb9b)
![Signup](https://github.com/user-attachments/assets/d374253d-b615-4096-b5cf-0f236bdb49b3)
![Teams](https://github.com/user-attachments/assets/c9804499-dd5f-435a-b4b9-2a767a8388cc)

## 🎯 Core Pages

- `/` - Homepage with active hackathons
- `/signup` - User registration
- `/login` - User authentication
- `/teams` - Browse and create teams
- `/teams/[id]` - Team detail and collaboration
- `/register` - Hackathon registration
- `/dashboard` - Admin/organizer dashboard (requires admin role)

## 🔒 Security

This project includes:
- Firebase Authentication
- Firestore security rules
- Role-based access control (participant, organizer, admin)
- Protected routes

## 📦 Installation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete installation instructions.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📝 License

MIT License - feel free to use this project for your hackathons!

---

Built with ❤️ for the hackathon community
