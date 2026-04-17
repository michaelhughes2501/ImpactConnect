import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertLikeSchema, insertMessageSchema } from "@shared/schema";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  registerAuthRoutes(app);
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Create profile
      await storage.createOrUpdateProfile({
        userId: user.id,
        isVisible: true,
        privacySettings: {},
        stats: { profileViews: 0, matches: 0, responseRate: 0 }
      });

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Registration failed", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  });

  // Discovery routes
  app.get("/api/discover/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const users = await storage.getUsersForDiscovery(userId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to get discovery users", error });
    }
  });

  // Like routes
  app.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      const like = await storage.createLike(likeData);

      // Check for mutual like to create match
      const existingLikes = await storage.getLikesBetweenUsers(
        likeData.fromUserId, 
        likeData.toUserId
      );
      
      const mutualLike = existingLikes.find(l => 
        l.fromUserId === likeData.toUserId && l.toUserId === likeData.fromUserId
      );

      let match = null;
      if (mutualLike) {
        match = await storage.createMatch({
          user1Id: likeData.fromUserId,
          user2Id: likeData.toUserId
        });
      }

      res.json({ like, match });
    } catch (error) {
      res.status(400).json({ message: "Failed to create like", error });
    }
  });

  // Match routes
  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to get matches", error });
    }
  });

  // Single match with both users — used by the chat page
  app.get("/api/match/:matchId", async (req, res) => {
    try {
      const { matchId } = req.params;
      const match = await storage.getMatch(matchId);
      if (!match) return res.status(404).json({ message: "Match not found" });
      const user1 = await storage.getUser(match.user1Id);
      const user2 = await storage.getUser(match.user2Id);
      res.json({
        ...match,
        user1: user1 ? { ...user1, password: undefined } : null,
        user2: user2 ? { ...user2, password: undefined } : null,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get match", error });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to send message", error });
    }
  });

  app.get("/api/messages/match/:matchId", async (req, res) => {
    try {
      const { matchId } = req.params;
      const messages = await storage.getMatchMessages(matchId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages", error });
    }
  });

  app.get("/api/messages/recent/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await storage.getRecentMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent messages", error });
    }
  });

  app.patch("/api/messages/read/:matchId/:userId", async (req, res) => {
    try {
      const { matchId, userId } = req.params;
      await storage.markMessagesAsRead(matchId, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark messages as read", error });
    }
  });

  // User/Profile routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
