import { UserProfile, SubscriptionTier, PaymentRecord } from '../types/content';
import { UBLUE_PLANS } from '../data/mock-content';

const STORAGE_KEY_ACTIVE_USER = 'ublue_active_user_v3';
const STORAGE_KEY_USERS_DB = 'ublue_registered_users_v3';
const STORAGE_KEY_AUTH_CONFIRMED = 'ublue_auth_confirmed_v3';

export const DEFAULT_PRESET_USERS: UserProfile[] = [
  {
    id: 'UB-100201',
    name: 'Novo Assinante Livre',
    email: 'livre@universoblue.co.mz',
    phone: '+258 84 900 1122',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    subscription: {
      tier: 'free',
      status: 'active',
      expiresAt: 'Vitalício (Canais Livres)',
      autoRenew: false,
      paymentMethod: 'mpesa'
    },
    savedChannels: ['tvm-1-hd', 'tv-miramar-hd', 'ublue-tv-hd'],
    favoriteContent: [],
    history: [],
    walletBalanceMT: 0,
    createdAt: '2026-10-01',
    paymentHistory: []
  },
  {
    id: 'UB-842910',
    name: 'Carlos Nhantumbo',
    email: 'carlos.nhantumbo@universoblue.co.mz',
    phone: '+258 84 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    subscription: {
      tier: 'basic',
      status: 'active',
      expiresAt: '2026-11-15',
      autoRenew: true,
      paymentMethod: 'mpesa',
      accountPhone: '84 123 4567',
      lastPaymentDate: '2026-10-15',
      transactionRef: 'MPESA-TX-849201'
    },
    savedChannels: ['ublue-tv-hd', 'stv-oficial', 'ublue-desporto-mzb'],
    favoriteContent: [],
    history: [],
    walletBalanceMT: 150,
    createdAt: '2026-09-15',
    paymentHistory: [
      {
        id: 'pay-init-1',
        userId: 'UB-842910',
        tier: 'basic',
        planName: 'UBlue Basic (100 MT)',
        amountMT: 100,
        method: 'mpesa',
        phone: '+258 84 123 4567',
        transactionRef: 'MPESA-TX-849201',
        date: '2026-10-15 09:30',
        status: 'completed'
      }
    ]
  },
  {
    id: 'UB-990001',
    name: 'Dra. Amélia Cossa',
    email: 'amelia.cossa@universoblue.co.mz',
    phone: '+258 84 777 8899',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    subscription: {
      tier: 'max',
      status: 'active',
      expiresAt: '2026-12-31',
      autoRenew: true,
      paymentMethod: 'emola',
      accountPhone: '84 777 8899',
      lastPaymentDate: '2026-10-01',
      transactionRef: 'EMOLA-TX-990011'
    },
    savedChannels: ['ublue-tv-hd', 'ublue-cinema-lusofono', 'rtp-africa-hd'],
    favoriteContent: [],
    history: [],
    walletBalanceMT: 1200,
    createdAt: '2026-08-01',
    paymentHistory: [
      {
        id: 'pay-init-2',
        userId: 'UB-990001',
        tier: 'max',
        planName: 'UBlue Max (500 MT)',
        amountMT: 500,
        method: 'emola',
        phone: '+258 84 777 8899',
        transactionRef: 'EMOLA-TX-990011',
        date: '2026-10-01 14:15',
        status: 'completed'
      }
    ]
  }
];

class AuthService {
  private users: UserProfile[] = [];
  private activeUser: UserProfile | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [...DEFAULT_PRESET_USERS];
        this.saveUsersToStorage();
      }

      const activeUserId = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      if (activeUserId) {
        const found = this.users.find((u) => u.id === activeUserId);
        if (found) {
          this.activeUser = found;
          return;
        }
      }

      // Default active user is the free subscriber (Novo Assinante Livre)
      this.activeUser = this.users[0];
      if (this.activeUser) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_USER, this.activeUser.id);
      }
    } catch {
      this.users = [...DEFAULT_PRESET_USERS];
      this.activeUser = this.users[0];
    }
  }

  private saveUsersToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(this.users));
    } catch (e) {
      console.warn('LocalStorage error saving users:', e);
    }
  }

  private saveActiveUserToStorage() {
    try {
      if (this.activeUser) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_USER, this.activeUser.id);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
      }
    } catch (e) {
      console.warn('LocalStorage error saving active user:', e);
    }
  }

  /**
   * Generates a unique member ID: UB- followed by 6 unique digits
   */
  generateUniqueId(): string {
    let id: string;
    let exists: boolean;
    do {
      const digits = Math.floor(100000 + Math.random() * 900000);
      id = `UB-${digits}`;
      exists = this.users.some((u) => u.id.toUpperCase() === id.toUpperCase());
    } while (exists);
    return id;
  }

  /**
   * Returns current authenticated user
   */
  getCurrentUser(): UserProfile {
    if (!this.activeUser) {
      this.initDatabase();
    }
    return this.activeUser || DEFAULT_PRESET_USERS[0];
  }

  /**
   * Check if user has completed onboarding/registration
   */
  hasCompletedOnboarding(): boolean {
    try {
      const confirmed = localStorage.getItem(STORAGE_KEY_AUTH_CONFIRMED);
      return confirmed === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Confirms active session so user bypasses registration gate
   */
  confirmSession(user?: UserProfile) {
    try {
      if (user) {
        this.activeUser = user;
        this.saveActiveUserToStorage();
      }
      localStorage.setItem(STORAGE_KEY_AUTH_CONFIRMED, 'true');
    } catch (e) {
      console.warn('LocalStorage error confirming session:', e);
    }
  }

  /**
   * Logs out user and triggers registration gate
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH_CONFIRMED);
    } catch (e) {
      console.warn('LocalStorage error logging out:', e);
    }
  }

  /**
   * Gets all registered users
   */
  getAllUsers(): UserProfile[] {
    return [...this.users];
  }

  /**
   * Registers a new user with an auto-generated unique ID
   */
  registerUser(params: {
    name: string;
    email?: string;
    phone: string;
    password?: string;
    province?: string;
    initialTier?: SubscriptionTier;
  }): { success: boolean; user: UserProfile; error?: string } {
    const cleanName = params.name.trim();
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanPhone = params.phone.trim();
    const selectedTier = params.initialTier || 'free';

    if (!cleanName) {
      return { success: false, user: this.getCurrentUser(), error: 'Por favor, insira o seu nome completo.' };
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      return { success: false, user: this.getCurrentUser(), error: 'Por favor, informe o seu número de telefone (ex: +258 84 ...).' };
    }

    // Check duplicate email
    if (cleanEmail) {
      const duplicateEmail = this.users.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      if (duplicateEmail) {
        return {
          success: false,
          user: duplicateEmail,
          error: `O email ${cleanEmail} já está associado à conta com ID ${duplicateEmail.id}. Faça login com o seu ID.`
        };
      }
    }

    const uniqueId = this.generateUniqueId();
    const today = new Date().toISOString().split('T')[0];

    const newUser: UserProfile = {
      id: uniqueId,
      name: cleanName,
      email: cleanEmail || `${uniqueId.toLowerCase()}@universoblue.co.mz`,
      phone: cleanPhone,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80`,
      subscription: {
        tier: selectedTier,
        status: 'active',
        expiresAt: selectedTier === 'free' ? 'Vitalício (Canais Livres)' : '2026-11-30',
        autoRenew: selectedTier !== 'free',
        paymentMethod: 'mpesa'
      },
      savedChannels: ['tvm-1-hd', 'tv-miramar-hd', 'ublue-tv-hd', 'stv-soico'],
      favoriteContent: [],
      history: [],
      walletBalanceMT: selectedTier === 'free' ? 0 : 50,
      createdAt: today,
      paymentHistory: []
    };

    this.users.unshift(newUser);
    this.activeUser = newUser;
    this.saveUsersToStorage();
    this.saveActiveUserToStorage();
    this.confirmSession(newUser);

    return { success: true, user: newUser };
  }

  /**
   * Login using unique ID, email, or phone
   */
  login(identifier: string, _password?: string): { success: boolean; user: UserProfile; error?: string } {
    const cleanId = identifier.trim().toUpperCase();
    const cleanRaw = identifier.trim().toLowerCase();

    // Match by ID, email, or phone
    const user = this.users.find((u) => {
      return (
        u.id.toUpperCase() === cleanId ||
        u.email.toLowerCase() === cleanRaw ||
        u.phone.replace(/\s+/g, '') === cleanRaw.replace(/\s+/g, '')
      );
    });

    if (!user) {
      return {
        success: false,
        user: this.getCurrentUser(),
        error: `Nenhuma conta encontrada com o identificador "${identifier}". Verifique o seu ID Único (ex: UB-842910) ou crie uma conta nova.`
      };
    }

    this.activeUser = user;
    this.saveActiveUserToStorage();
    this.confirmSession(user);
    return { success: true, user };
  }

  /**
   * Quick guest/visitor access
   */
  createGuestUser(): UserProfile {
    const uniqueId = this.generateUniqueId();
    const guestUser: UserProfile = {
      id: uniqueId,
      name: 'Visitante UBlue TV',
      email: `${uniqueId.toLowerCase()}@universoblue.co.mz`,
      phone: '+258 84 000 0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      subscription: {
        tier: 'free',
        status: 'active',
        expiresAt: 'Acesso Livre Demonstrativo',
        autoRenew: false,
        paymentMethod: 'mpesa'
      },
      savedChannels: ['tvm-1-hd', 'tv-miramar-hd', 'ublue-tv-hd'],
      favoriteContent: [],
      history: [],
      walletBalanceMT: 0,
      createdAt: new Date().toISOString().split('T')[0],
      paymentHistory: []
    };
    this.activeUser = guestUser;
    this.confirmSession(guestUser);
    return guestUser;
  }

  /**
   * Switch active user directly (useful for testing different subscriber roles)
   */
  switchUser(userId: string): UserProfile {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.activeUser = user;
      this.saveActiveUserToStorage();
      this.confirmSession(user);
      return user;
    }
    return this.getCurrentUser();
  }

  /**
   * Processes a subscription payment linked to the user's unique ID
   */
  processPaymentForId(
    userId: string,
    tier: SubscriptionTier,
    paymentMethod: 'mpesa' | 'emola' | 'card' | 'wallet',
    phone: string
  ): { user: UserProfile; paymentRecord: PaymentRecord } {
    const user = this.users.find((u) => u.id === userId) || this.activeUser || this.users[0];
    const plan = UBLUE_PLANS.find((p) => p.id === tier) || UBLUE_PLANS[2];

    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const expiryStr = expiry.toISOString().split('T')[0];
    const txPrefix = paymentMethod === 'mpesa' ? 'MPESA' : paymentMethod === 'emola' ? 'EMOLA' : 'PAY';
    const txRef = `${txPrefix}-TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const paymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      userId: user.id,
      tier,
      planName: `${plan.name} (${plan.priceMT} MT)`,
      amountMT: plan.priceMT,
      method: paymentMethod,
      phone: phone || user.phone,
      transactionRef: txRef,
      date: dateStr,
      status: 'completed'
    };

    user.subscription = {
      tier,
      status: 'active',
      expiresAt: expiryStr,
      autoRenew: true,
      paymentMethod,
      accountPhone: phone || user.phone,
      lastPaymentDate: dateStr,
      transactionRef: txRef
    };

    if (!user.paymentHistory) {
      user.paymentHistory = [];
    }
    user.paymentHistory.unshift(paymentRecord);

    // Save
    this.saveUsersToStorage();
    if (this.activeUser?.id === user.id) {
      this.activeUser = { ...user };
      this.saveActiveUserToStorage();
    }

    return { user: { ...user }, paymentRecord };
  }

  /**
   * Simulates switching tier directly (for debugging or sandbox testing)
   */
  simulateTier(userId: string, tier: SubscriptionTier): UserProfile {
    const user = this.users.find((u) => u.id === userId) || this.activeUser || this.users[0];
    user.subscription.tier = tier;
    user.subscription.status = 'active';
    this.saveUsersToStorage();
    if (this.activeUser?.id === user.id) {
      this.activeUser = { ...user };
      this.saveActiveUserToStorage();
    }
    return { ...user };
  }

  /**
   * Reset database back to default state
   */
  resetToDefaults(): UserProfile {
    this.users = [...DEFAULT_PRESET_USERS];
    this.activeUser = this.users[1];
    this.saveUsersToStorage();
    this.saveActiveUserToStorage();
    return this.activeUser;
  }
}

export const authService = new AuthService();
