import { Cheat, User, SiteStats, Comment, UserRole } from './types';

// Admin Configuration
const ADMIN_EMAIL = 'sabaudenis72@gmail.com';
const ADMIN_PASS = 'Deni12889!';

// Admin Account
const ADMIN_USER: User = {
    id: 'admin_master_01',
    username: 'VioletAdmin',
    email: ADMIN_EMAIL,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    bio: 'Official Administrator and Lead Developer of VioletHacks.',
    role: 'ADMIN',
    isAdmin: true,
    isBanned: false,
    joinedAt: new Date('2024-01-01').toISOString(),
    badges: ['DEV', 'OG', 'VERIFIED'],
    adminNotes: 'Main system administrator.'
};

// Initial Data
const MOCK_USERS: User[] = [ADMIN_USER];
let MOCK_CHEATS: Cheat[] = [];
let MOCK_COMMENTS: Comment[] = [];

// Service Simulation
export const getCheats = async (): Promise<Cheat[]> => {
  return new Promise((resolve) => {
    resolve([...MOCK_CHEATS]);
  });
};

export const getAllUsers = async (): Promise<User[]> => {
    return new Promise((resolve) => {
        resolve([...MOCK_USERS]);
    });
};

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User | null> => {
    return new Promise((resolve) => {
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
            user.role = newRole;
            // Sync isAdmin for compatibility
            user.isAdmin = newRole === 'ADMIN';
            resolve({ ...user });
        } else {
            resolve(null);
        }
    });
};

// New function to update extended admin data (notes, badges)
export const updateUserAdminData = async (userId: string, notes: string, badges: string[]): Promise<User | null> => {
    return new Promise((resolve) => {
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
            user.adminNotes = notes;
            user.badges = badges;
            resolve({ ...user });
        } else {
            resolve(null);
        }
    });
};

export const toggleUserBan = async (userId: string): Promise<User | null> => {
    return new Promise((resolve) => {
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
            user.isBanned = !user.isBanned;
            resolve({ ...user });
        } else {
            resolve(null);
        }
    });
};

export const getComments = async (cheatId: string): Promise<Comment[]> => {
    return new Promise((resolve) => {
        const comments = MOCK_COMMENTS.filter(c => c.cheatId === cheatId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(comments);
    });
};

export const addComment = async (cheatId: string, user: User, text: string): Promise<Comment> => {
    return new Promise((resolve) => {
        const newComment: Comment = {
            id: 'comment_' + Math.random().toString(36).substr(2, 9),
            cheatId,
            userId: user.id,
            username: user.username,
            userAvatar: user.avatar,
            text,
            createdAt: new Date().toISOString(),
            isAdmin: user.isAdmin,
            userRole: user.role
        };
        MOCK_COMMENTS.push(newComment);
        setTimeout(() => resolve(newComment), 300);
    });
};

export const getSiteStats = async (): Promise<SiteStats> => {
    return new Promise((resolve) => {
        // Accurate counts based on the mock arrays
        const baseOnline = Math.floor(MOCK_USERS.length * 0.4) + 1; 

        resolve({
            onlineMembers: baseOnline, 
            totalComments: MOCK_COMMENTS.length,
            totalMembers: MOCK_USERS.length,
            latestMember: MOCK_USERS[MOCK_USERS.length - 1].username
        });
    });
};

export const createCheat = async (cheatData: any, user: User): Promise<Cheat> => {
  return new Promise((resolve, reject) => {
    // Permission Check: USER role cannot upload
    if (user.role === 'USER') {
        reject("You must be a Supporter or higher to upload cheats.");
        return;
    }

    const newCheat: Cheat = {
      id: Math.random().toString(36).substr(2, 9),
      title: cheatData.title,
      game: cheatData.game,
      version: cheatData.version,
      description: cheatData.description,
      status: cheatData.status,
      downloadUrl: cheatData.downloadUrl,
      downloads: 0,
      createdAt: new Date().toISOString(),
      authorName: user.username,
      authorId: user.id,
      // Auto-verify if admin or mod
      verificationStatus: (user.role === 'ADMIN' || user.role === 'MODERATOR') ? 'VERIFIED' : 'PENDING' 
    };
    MOCK_CHEATS.unshift(newCheat);
    setTimeout(() => resolve(newCheat), 500);
  });
};

export const updateCheat = async (updatedCheat: Cheat): Promise<Cheat> => {
  return new Promise((resolve) => {
    const index = MOCK_CHEATS.findIndex(c => c.id === updatedCheat.id);
    if (index !== -1) {
        MOCK_CHEATS[index] = updatedCheat;
    }
    setTimeout(() => resolve(updatedCheat), 500);
  });
};

export const deleteCheat = async (cheatId: string): Promise<void> => {
    return new Promise((resolve) => {
        MOCK_CHEATS = MOCK_CHEATS.filter(c => c.id !== cheatId);
        MOCK_COMMENTS = MOCK_COMMENTS.filter(c => c.cheatId !== cheatId); 
        setTimeout(() => resolve(), 500);
    });
};

export const incrementDownload = async (cheatId: string): Promise<Cheat | null> => {
    return new Promise((resolve) => {
        const cheat = MOCK_CHEATS.find(c => c.id === cheatId);
        if (cheat) {
            cheat.downloads += 1;
            resolve({ ...cheat });
        } else {
            resolve(null);
        }
    });
};

export const loginUser = async (email: string, password?: string): Promise<User> => {
    // Simulate API delay and async operation
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanEmail = email.trim();
    const cleanPass = password ? password.trim() : '';

    // Admin Check
    if (cleanEmail === ADMIN_EMAIL) {
        // Direct comparison for mock reliability
        if (cleanPass === ADMIN_PASS) {
            return ADMIN_USER;
        } else {
            throw "Invalid credentials.";
        }
    }

    // Normal User Flow
    let user = MOCK_USERS.find(u => u.email === cleanEmail);
    
    if (user) {
        if (user.isBanned) {
            throw "This account has been banned for violating our Terms of Service.";
        }
    } else {
        // Create new user - SECURITY FIX: No auto-admin for "admin." emails
        user = { 
            id: 'u_' + Math.random().toString(36).substr(2, 9), 
            username: cleanEmail.split('@')[0], 
            email: cleanEmail,
            bio: 'New member of the VioletHacks community.',
            avatar: '',
            role: 'USER', 
            isAdmin: false,
            isBanned: false,
            joinedAt: new Date().toISOString(),
            badges: [],
            adminNotes: ''
        };
        MOCK_USERS.push(user);
    }
    return user;
}

export const updateUserProfile = async (user: User): Promise<User> => {
    return new Promise((resolve) => {
        const index = MOCK_USERS.findIndex(u => u.id === user.id);
        if (index !== -1) {
            MOCK_USERS[index] = user;
        }
        setTimeout(() => resolve(user), 500);
    });
}