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
    // Create sample users
    const user1 = await this.createUser({
      email: "marcus@example.com",
      password: "password123",
      name: "Marcus",
      age: 32,
      bio: "Looking for genuine connections and someone who believes in second chances. Love hiking and cooking.",
      occupation: "Community Volunteer",
      education: "Trade School Graduate",
      photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
      location: "2 miles away"
    });

    const user2 = await this.createUser({
      email: "sarah@example.com", 
      password: "password123",
      name: "Sarah",
      age: 28,
      bio: "Art therapist passionate about helping others. Love coffee, books, and meaningful conversations.",
      occupation: "Art Therapist",
      education: "Bachelor's Degree",
      photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"],
      location: "5 miles away"
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
    };
    this.profiles.set(profile.userId, fullProfile);
    return fullProfile;
  }

  async createLike(like: InsertLike): Promise<Like> {
    const id = randomUUID();
    const fullLike: Like = {
      ...like,
      id,
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
