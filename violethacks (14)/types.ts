export type UserRole = 'USER' | 'SUPPORTER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isAdmin?: boolean; // Derived from role === 'ADMIN' for backward compatibility
  isBanned?: boolean;
  joinedAt: string; // New: Member since
  adminNotes?: string; // New: Private notes for admins
  badges?: string[]; // New: VIP, DEV, OG, etc.
}

export interface Comment {
  id: string;
  cheatId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  isAdmin?: boolean;
  userRole?: UserRole;
}

export interface Cheat {
  id: string;
  title: string;
  description: string;
  version: string;
  game: string;
  downloadUrl: string; // External Link
  authorId: string;
  authorName: string;
  downloads: number;
  status: 'UNDETECTED' | 'DETECTED' | 'TESTING'; // Cheat safety status
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'; // Admin moderation status
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface SiteStats {
  onlineMembers: number;
  totalComments: number;
  totalMembers: number;
  latestMember: string;
}