import express from "express";
import * as authController from "../controllers/authController.js";
import * as animeController from "../controllers/animeController.js";
import * as userController from "../controllers/userController.js";
import * as notificationController from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const api = express.Router();

// ========== AUTH ROUTES ==========
api.post("/auth/register", authController.register);
api.post("/auth/login", authController.login);
api.get("/auth/me", authMiddleware, authController.getMe);

// ========== ANIME ROUTES ==========
api.get("/anime/discovery", animeController.getDiscovery);
api.get("/anime/my-list", authMiddleware, animeController.getMyList);
api.get("/anime/:id", animeController.getAnimeById);
api.post("/anime", authMiddleware, animeController.createAnime);
api.put("/anime/:id", authMiddleware, animeController.updateAnime);
api.delete("/anime/:id", authMiddleware, animeController.deleteAnime);
api.post("/anime/:id/review", authMiddleware, animeController.addReview);

// ========== USER ROUTES ==========
api.get("/users", userController.getAllUsers);
api.get("/users/:userId", userController.getUserProfile);
api.post("/users/:userId/follow", authMiddleware, userController.followUser);
api.post("/users/:userId/unfollow", authMiddleware, userController.unfollowUser);
api.put("/users/profile", authMiddleware, userController.updateProfile);

// ========== NOTIFICATION ROUTES ==========
api.get("/notifications", authMiddleware, notificationController.getNotifications);
api.put("/notifications/:id/read", authMiddleware, notificationController.markAsRead);
api.put("/notifications/read-all", authMiddleware, notificationController.markAllAsRead);
api.delete("/notifications/:id", authMiddleware, notificationController.deleteNotification);

export default api;
