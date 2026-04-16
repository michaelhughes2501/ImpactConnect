import { 
  type User, 
  type InsertUser, 
  type Profile, 
  type InsertProfile,
  type Match, 
  type InsertMatch,
  type Like, 
  type InsertLike,
  type Message, 
  type InsertMessage 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getUsersForDiscovery(currentUserId: string, limit?: number): Promise<User[]>;

  // Profile methods
  getProfile(userId: string): Promise<Profile | undefined>;
  createOrUpdateProfile(profile: InsertProfile): Promise<Profile>;

  // Like methods
  createLike(like: InsertLike): Promise<Like>;
  getLikesBetweenUsers(user1Id: string, user2Id: string): Promise<Like[]>;
  getUserLikes(userId: string): Promise<Like[]>;

  // Match methods
  createMatch(match: InsertMatch): Promise<Match>;
  getUserMatches(userId: string): Promise<(Match & { otherUser: User })[]>;
  getMatch(id: string): Promise<Match | undefined>;

  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMatchMessages(matchId: string): Promise<Message[]>;
  markMessagesAsRead(matchId: string, userId: string): Promise<void>;
  getRecentMessages(userId: string): Promise<(Message & { match: Match; otherUser: User })[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private profiles: Map<string, Profile> = new Map(); // keyed by userId
  private likes: Map<string, Like> = new Map();
  private matches: Map<string, Match> = new Map();
  private messages: Map<string, Message> = new Map();

  constructor() {
    // Add some sample users for testing
    this.seedData();
  }

  private async seedData() {
    // Fixed UUIDs so pages can reference the logged-in demo user reliably
    const MARCUS_ID = "00000000-0000-0000-0000-000000000001";
    const SARAH_ID  = "00000000-0000-0000-0000-000000000002";
    const TOMMY_ID  = "00000000-0000-0000-0000-000000000003";
    const MARIA_ID  = "00000000-0000-0000-0000-000000000004";
    const DEJA_ID   = "00000000-0000-0000-0000-000000000005";
    const RAY_ID    = "00000000-0000-0000-0000-000000000006";

    const seedUser = (id: string, data: InsertUser): User => {
      const user: User = {
        ...data,
        id,
        isVerified: true,
        lastActive: new Date(),
        createdAt: new Date(),
        location: data.location || null,
        bio: data.bio || null,
        occupation: data.occupation || null,
        education: data.education || null,
        photos: data.photos || [],
        preferences: data.preferences || {},
      };
      this.users.set(id, user);
      return user;
    };

    const user1 = seedUser(MARCUS_ID, {
      email: "marcus@example.com",
      password: "password123",
      name: "Marcus",
      age: 32,
      bio: "Been in the free world for 3 years now. Keeping my head down, staying out the mix, and building something real. Looking for somebody who knows the code and ain't about the drama.",
      occupation: "Construction Worker",
      education: "GED, Welding Certificate (earned inside)",
      photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
      location: "2 miles away",
    });

    const user2 = seedUser(SARAH_ID, {
      email: "sarah@example.com",
      password: "password123",
      name: "Sarah",
      age: 28,
      bio: "Did 8 years behind those walls, but I made it out. Now I help other people navigate this free world life. Need someone who understands the transition and wants to build something solid.",
      occupation: "Peer Support Specialist",
      education: "Bachelor's in Social Work (correspondence)",
      photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"],
      location: "5 miles away",
    });

    const user3 = seedUser(TOMMY_ID, {
      email: "tommy@example.com",
      password: "password123",
      name: "Tommy",
      age: 35,
      bio: "Did my bid, came home changed. Been clean off the streets for 2 years, got my hustle legal now. Need a down chick who gets where I been and where I'm going.",
      occupation: "Warehouse Supervisor",
      education: "High School, Forklift Certified (got it inside)",
      photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"],
      location: "4 miles away",
    });

    const user4 = seedUser(MARIA_ID, {
      email: "maria@example.com",
      password: "password123",
      name: "Maria",
      age: 31,
      bio: "Been home 5 years, got my program tight. Raising my babies and staying focused. Ready for a real one who ain't on no childish games - just solid vibes only.",
      occupation: "CNA at Community Clinic",
      education: "Nursing Assistant Certificate",
      photos: ["https://images.unsplash.com/photo-1494790108755-2616b69b3322?w=400"],
      location: "3 miles away",
    });

    const user5 = seedUser(DEJA_ID, {
      email: "deja@example.com",
      password: "password123",
      name: "Deja",
      age: 27,
      bio: "Touched down 18 months ago and haven't looked back. Staying out the mix, focused on my kids and my future. Looking for somebody real — no games, no bs.",
      occupation: "Hair Stylist",
      education: "Cosmetology License",
      photos: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400"],
      location: "6 miles away",
    });

    const user6 = seedUser(RAY_ID, {
      email: "ray@example.com",
      password: "password123",
      name: "Ray",
      age: 38,
      bio: "15 years behind those walls. Came home changed for real. Got my program together, working steady, staying out the mix. Just want somebody solid to build with.",
      occupation: "Electrician Apprentice",
      education: "Trade Certification (IBEW)",
      photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"],
      location: "7 miles away",
    });

    // Create profiles
    await this.createOrUpdateProfile({
      userId: user1.id,
      isVisible: true,
      privacySettings: {},
      stats: { profileViews: 127, matches: 23, responseRate: 89 }
    });

    await this.createOrUpdateProfile({
      userId: user2.id,
      isVisible: true,
      privacySettings: {},
      stats: { profileViews: 95, matches: 18, responseRate: 92 }
    });

    await this.createOrUpdateProfile({
      userId: user3.id,
      isVisible: true,
      privacySettings: {},
      stats: { profileViews: 83, matches: 15, responseRate: 76 }
    });

    await this.createOrUpdateProfile({
      userId: user4.id,
      isVisible: true,
      privacySettings: {},
      stats: { profileViews: 156, matches: 31, responseRate: 94 }
    });

    await this.createOrUpdateProfile({
      userId: user5.id,
      isVisible: true,
      privacySettings: {},
      stats: { profileViews: 64, matches: 9, responseRate: 81 }
    });

    await this.createOrUpdateProfile({
      userId: user6.id,
      isVisible: true,
      privacySettings: {},
      stats: { profileViews: 48, matches: 7, responseRate: 70 }
    });

    // Seed a mutual match between Marcus (logged-in demo user) and Sarah
    const seedMatch = await this.createMatch({ user1Id: MARCUS_ID, user2Id: SARAH_ID });

    // Seed a couple of messages in that match so Kites tab has content
    await this.createMessage({
      matchId: seedMatch.id,
      senderId: SARAH_ID,
      content: "Hey! Glad we connected. Stay solid out here 💪",
      isRead: false,
    });
    await this.createMessage({
      matchId: seedMatch.id,
      senderId: MARCUS_ID,
      content: "Facts. It's hard but we making it. How long you been home?",
      isRead: true,
    });
    await this.createMessage({
      matchId: seedMatch.id,
      senderId: SARAH_ID,
      content: "Almost a year now. Got my program together. You?",
      isRead: false,
    });

    // Seed a match between Marcus and Maria
    const seedMatch2 = await this.createMatch({ user1Id: MARCUS_ID, user2Id: MARIA_ID });
    await this.createMessage({
      matchId: seedMatch2.id,
      senderId: MARIA_ID,
      content: "Real recognize real. Keep your head up 🙏",
      isRead: false,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      isVerified: true, // Auto-verify for demo
      lastActive: new Date(),
      createdAt: new Date(),
      location: insertUser.location || null,
      bio: insertUser.bio || null,
      occupation: insertUser.occupation || null,
      education: insertUser.education || null,
      photos: insertUser.photos || [],
      preferences: insertUser.preferences || {},
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersForDiscovery(currentUserId: string, limit: number = 10): Promise<User[]> {
    const currentUser = this.users.get(currentUserId);
    if (!currentUser) return [];

    // Get users that haven't been liked by current user
    const userLikes = Array.from(this.likes.values())
      .filter(like => like.fromUserId === currentUserId)
      .map(like => like.toUserId);

    return Array.from(this.users.values())
      .filter(user => 
        user.id !== currentUserId && 
        !userLikes.includes(user.id)
      )
      .slice(0, limit);
  }

  async getProfile(userId: string): Promise<Profile | undefined> {
    return this.profiles.get(userId);
  }

  async createOrUpdateProfile(profile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const fullProfile: Profile = {
      ...profile,
      id,
      isVisible: profile.isVisible ?? true,
      privacySettings: profile.privacySettings || {},
      stats: profile.stats || {},
    };
    this.profiles.set(profile.userId, fullProfile);
    return fullProfile;
  }

  async createLike(like: InsertLike): Promise<Like> {
    const id = randomUUID();
    const fullLike: Like = {
      ...like,
      id,
      isSuper: like.isSuper ?? false,
      createdAt: new Date(),
    };
    this.likes.set(id, fullLike);
    return fullLike;
  }

  async getLikesBetweenUsers(user1Id: string, user2Id: string): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like =>
      (like.fromUserId === user1Id && like.toUserId === user2Id) ||
      (like.fromUserId === user2Id && like.toUserId === user1Id)
    );
  }

  async getUserLikes(userId: string): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => 
      like.toUserId === userId
    );
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const fullMatch: Match = {
      ...match,
      id,
      createdAt: new Date(),
    };
    this.matches.set(id, fullMatch);
    return fullMatch;
  }

  async getUserMatches(userId: string): Promise<(Match & { otherUser: User })[]> {
    const userMatches = Array.from(this.matches.values()).filter(match =>
      match.user1Id === userId || match.user2Id === userId
    );

    return userMatches.map(match => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const otherUser = this.users.get(otherUserId)!;
      return { ...match, otherUser };
    });
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const fullMessage: Message = {
      ...message,
      id,
      isRead: message.isRead ?? false,
      createdAt: new Date(),
    };
    this.messages.set(id, fullMessage);
    return fullMessage;
  }

  async getMatchMessages(matchId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.matchId === matchId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async markMessagesAsRead(matchId: string, userId: string): Promise<void> {
    Array.from(this.messages.values())
      .filter(message => 
        message.matchId === matchId && 
        message.senderId !== userId
      )
      .forEach(message => {
        message.isRead = true;
        this.messages.set(message.id, message);
      });
  }

  async getRecentMessages(userId: string): Promise<(Message & { match: Match; otherUser: User })[]> {
    const userMatches = await this.getUserMatches(userId);
    const matchIds = userMatches.map(match => match.id);
    
    const recentMessages = Array.from(this.messages.values())
      .filter(message => matchIds.includes(message.matchId))
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());

    // Get the most recent message for each match
    const latestByMatch = new Map<string, Message>();
    recentMessages.forEach(message => {
      if (!latestByMatch.has(message.matchId)) {
        latestByMatch.set(message.matchId, message);
      }
    });

    return Array.from(latestByMatch.values()).map(message => {
      const match = this.matches.get(message.matchId)!;
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const otherUser = this.users.get(otherUserId)!;
      return { ...message, match, otherUser };
    });
  }
}

export const storage = new MemStorage();
