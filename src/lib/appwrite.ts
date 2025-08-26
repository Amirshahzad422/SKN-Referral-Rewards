import { Client, Account, Databases, Storage, Teams } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
export const TREE_NODES_COLLECTION_ID = '68ac6ed6001e3c93925b';
export const USER_STATS_COLLECTION_ID = '68ac711f00230f958382';
export const PINS_COLLECTION_ID = '68ac892e003d1b1887e4';
export const REWARD_TIERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARD_TIERS_COLLECTION_ID!;
export const USER_REWARDS_COLLECTION_ID = '68ac99dc0011ac0661f7';
export const PAYMENTS_COLLECTION_ID = '68ac9b66002599ceb772';
export const WITHDRAWALS_COLLECTION_ID = '68acbba40009d948abfd';
export const EVENTS_COLLECTION_ID = '68acbea40004a2573a8e';

// Storage bucket IDs
export const ASSETS_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_PAYMENTS_BUCKET_ID!;

// Helper functions
export const generateIdempotencyKey = (action: string, userId: string) => {
  return `${action}_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// API functions for client-side use
export const appwriteAPI = {
  // Create account with PIN
  async createAccountWithPin(data: {
    pinCode: string;
    username: string;
    email: string;
    phone: string;
    fullName: string;
    underUserId: string;
    leg: 'left' | 'right';
    sponsorId?: string;
    password: string;
  }) {
    const idempotencyKey = generateIdempotencyKey('create_account', data.email);
    
    const response = await fetch('/api/createAccountWithPin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        idempotencyKey,
      }),
    });

    return response.json();
  },

  // Approve payment (admin only)
  async approvePayment(data: {
    paymentId: string;
    action: 'approve' | 'reject';
    notes?: string;
    adminUserId: string;
  }) {
    const idempotencyKey = generateIdempotencyKey('approve_payment', data.paymentId);
    
    const response = await fetch('/api/approvePayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        idempotencyKey,
      }),
    });

    return response.json();
  },

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const user = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
      return user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Get user stats
  async getUserStats(userId: string) {
    try {
      const stats = await databases.listDocuments(
        DATABASE_ID,
        USER_STATS_COLLECTION_ID,
        [`userId=${userId}`]
      );
      return stats.documents[0] || null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  },

  // Get reward tiers
  async getRewardTiers() {
    try {
      const tiers = await databases.listDocuments(
        DATABASE_ID,
        REWARD_TIERS_COLLECTION_ID,
        ['isActive=true'],
        100
      );
      return tiers.documents;
    } catch (error) {
      console.error('Error fetching reward tiers:', error);
      return [];
    }
  },

  // Get user rewards
  async getUserRewards(userId: string) {
    try {
      const rewards = await databases.listDocuments(
        DATABASE_ID,
        USER_REWARDS_COLLECTION_ID,
        [`userId=${userId}`],
        100
      );
      return rewards.documents;
    } catch (error) {
      console.error('Error fetching user rewards:', error);
      return [];
    }
  },

  // Upload file
  async uploadFile(bucketId: string, file: File, path?: string) {
    try {
      const upload = await storage.createFile(
        bucketId,
        'unique()',
        file,
        path
      );
      return upload;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get file URL
  getFileUrl(bucketId: string, fileId: string) {
    return storage.getFileView(bucketId, fileId);
  },
};

export default client; 