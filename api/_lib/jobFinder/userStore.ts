import crypto from 'crypto';
import { UserProfileData, JobAlertItem } from './jobTypes.js';

interface UserAccount {
  id: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  fullName: string;
  mobileNumber?: string;
  avatarUrl?: string;
  profile: UserProfileData;
  savedJobIds: Set<string>;
  alerts: JobAlertItem[];
  createdAt: string;
  updatedAt: string;
}

class UserStore {
  private users: Map<string, UserAccount> = new Map();
  private sessions: Map<string, string> = new Map(); // token -> userId

  constructor() {
    // Seed a demo user for quick testing if requested
    const demoId = 'usr-demo-001';
    const demoProfile: UserProfileData = {
      id: demoId,
      email: 'seeker@iamtechni.com',
      fullName: 'Aarav Sharma',
      mobileNumber: '+91 98123 45678',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
      headline: 'Full Stack & Mobile Engineer',
      bio: 'Building accessible mobile apps and high-performance backend systems.',
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      preferredSalaryMin: 1800000,
      preferredSalaryMax: 2600000,
      salaryCurrency: 'INR',
      experienceLevel: 'THREE_TO_FIVE_YEARS',
      educationLevel: 'BACHELORS',
      preferredSkills: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
      preferredCategories: ['Mobile Development', 'Software Engineering'],
      resumeFileName: 'Aarav_Sharma_Resume.pdf',
      theme: 'SYSTEM',
      enablePushNotifications: true,
      enableEmailAlerts: true,
    };

    const demoUser: UserAccount = {
      id: demoId,
      email: 'seeker@iamtechni.com',
      passwordHash: this.hashPassword('Password123!'),
      fullName: 'Aarav Sharma',
      mobileNumber: '+91 98123 45678',
      avatarUrl: demoProfile.avatarUrl,
      profile: demoProfile,
      savedJobIds: new Set(['job-iamt-001', 'job-ext-004']),
      alerts: [
        {
          id: 'alert-001',
          userId: demoId,
          name: 'React Native & Mobile - India',
          skills: ['React Native', 'TypeScript'],
          country: 'India',
          city: 'Bengaluru',
          categoryName: 'Mobile Development',
          employmentType: 'FULL_TIME',
          workLocationType: 'HYBRID',
          minSalary: 1500000,
          maxSalary: 3000000,
          isRemoteOnly: false,
          pushNotificationEnabled: true,
          emailNotificationEnabled: true,
          isActive: true,
          matchCount: 4,
          createdAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(demoId, demoUser);
  }

  private hashPassword(pass: string): string {
    return crypto.createHash('sha256').update(`salt_iamt_${pass}`).digest('hex');
  }

  public signup(params: { email: string; password?: string; fullName: string; mobileNumber?: string; googleId?: string; avatarUrl?: string }) {
    const cleanEmail = params.email.trim().toLowerCase();
    
    // Check if user exists
    for (const u of this.users.values()) {
      if (u.email === cleanEmail) {
        return { ok: false, error: 'An account with this email address already exists. Please log in.' };
      }
    }

    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const profile: UserProfileData = {
      id: userId,
      email: cleanEmail,
      fullName: params.fullName.trim(),
      mobileNumber: params.mobileNumber?.trim(),
      avatarUrl: params.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80',
      country: 'India',
      salaryCurrency: 'INR',
      preferredSkills: [],
      preferredCategories: [],
      theme: 'SYSTEM',
      enablePushNotifications: true,
      enableEmailAlerts: true,
    };

    const newAccount: UserAccount = {
      id: userId,
      email: cleanEmail,
      passwordHash: params.password ? this.hashPassword(params.password) : undefined,
      googleId: params.googleId,
      fullName: params.fullName.trim(),
      mobileNumber: params.mobileNumber?.trim(),
      avatarUrl: profile.avatarUrl,
      profile,
      savedJobIds: new Set(),
      alerts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(userId, newAccount);
    const token = `iamt_usr_${crypto.randomBytes(32).toString('hex')}`;
    this.sessions.set(token, userId);

    return { ok: true, user: profile, token };
  }

  public loginWithEmail(email: string, pass: string) {
    const cleanEmail = email.trim().toLowerCase();
    let found: UserAccount | null = null;
    for (const u of this.users.values()) {
      if (u.email === cleanEmail) {
        found = u;
        break;
      }
    }

    if (!found) {
      return { ok: false, error: 'No account found with this email. Please sign up.' };
    }

    if (found.passwordHash && found.passwordHash !== this.hashPassword(pass)) {
      return { ok: false, error: 'Incorrect password. Please try again or use Forgot Password.' };
    }

    const token = `iamt_usr_${crypto.randomBytes(32).toString('hex')}`;
    this.sessions.set(token, found.id);
    return { ok: true, user: found.profile, token };
  }

  public loginWithGoogle(payload: { googleId: string; email: string; name: string; avatarUrl?: string }) {
    const cleanEmail = payload.email.trim().toLowerCase();
    let existing: UserAccount | null = null;
    for (const u of this.users.values()) {
      if (u.googleId === payload.googleId || u.email === cleanEmail) {
        existing = u;
        break;
      }
    }

    if (existing) {
      if (!existing.googleId) existing.googleId = payload.googleId;
      if (payload.avatarUrl && !existing.avatarUrl) {
        existing.avatarUrl = payload.avatarUrl;
        existing.profile.avatarUrl = payload.avatarUrl;
      }
      const token = `iamt_usr_${crypto.randomBytes(32).toString('hex')}`;
      this.sessions.set(token, existing.id);
      return { ok: true, user: existing.profile, token };
    }

    // New Google Sign Up
    return this.signup({
      email: cleanEmail,
      fullName: payload.name,
      googleId: payload.googleId,
      avatarUrl: payload.avatarUrl,
    });
  }

  public getUserFromToken(token?: string): UserAccount | null {
    if (!token) return null;
    const cleanToken = token.replace('Bearer ', '').trim();
    const userId = this.sessions.get(cleanToken);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  public updateProfile(userId: string, updates: Partial<UserProfileData>): UserProfileData | null {
    const user = this.users.get(userId);
    if (!user) return null;
    user.profile = {
      ...user.profile,
      ...updates,
    };
    if (updates.fullName) user.fullName = updates.fullName;
    if (updates.avatarUrl) user.avatarUrl = updates.avatarUrl;
    user.updatedAt = new Date().toISOString();
    return user.profile;
  }

  public deleteAccount(userId: string): boolean {
    // Invalidate sessions
    for (const [token, uid] of this.sessions.entries()) {
      if (uid === userId) this.sessions.delete(token);
    }
    return this.users.delete(userId);
  }

  public toggleSaveJob(userId: string, jobId: string): { isSaved: boolean; count: number } {
    const user = this.users.get(userId);
    if (!user) return { isSaved: false, count: 0 };
    if (user.savedJobIds.has(jobId)) {
      user.savedJobIds.delete(jobId);
      return { isSaved: false, count: user.savedJobIds.size };
    } else {
      user.savedJobIds.add(jobId);
      return { isSaved: true, count: user.savedJobIds.size };
    }
  }

  public getSavedJobIds(userId: string): string[] {
    const user = this.users.get(userId);
    return user ? Array.from(user.savedJobIds) : [];
  }

  public getAlerts(userId: string): JobAlertItem[] {
    const user = this.users.get(userId);
    return user ? [...user.alerts] : [];
  }

  public createAlert(userId: string, alertData: Omit<JobAlertItem, 'id' | 'userId' | 'createdAt' | 'matchCount'>): JobAlertItem | null {
    const user = this.users.get(userId);
    if (!user) return null;
    const newAlert: JobAlertItem = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      ...alertData,
      matchCount: Math.floor(Math.random() * 8) + 2,
      createdAt: new Date().toISOString(),
    };
    user.alerts.unshift(newAlert);
    return newAlert;
  }

  public toggleAlert(userId: string, alertId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    const alert = user.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isActive = !alert.isActive;
      return true;
    }
    return false;
  }

  public deleteAlert(userId: string, alertId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    const initialLen = user.alerts.length;
    user.alerts = user.alerts.filter((a) => a.id !== alertId);
    return user.alerts.length < initialLen;
  }
}

export const userStore = new UserStore();
