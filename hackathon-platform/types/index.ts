// Database Types for Hackathon Platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'organizer' | 'admin';
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
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

export interface Hackathon {
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

export interface Prize {
  place: number;
  title: string;
  description: string;
  amount?: string;
}

export interface Registration {
  id: string;
  userId: string;
  hackathonId: string;
  teamId?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: Date;
}

export interface Submission {
  id: string;
  teamId: string;
  hackathonId: string;
  projectName: string;
  description: string;
  githubRepo: string;
  demoUrl?: string;
  videoUrl?: string;
  submittedAt: Date;
}
