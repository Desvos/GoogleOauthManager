import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Token exchange endpoint
  app.post("/api/token-exchange", async (req, res) => {
    try {
      const { code, clientId, clientSecret } = req.body;
      
      if (!code || !clientId || !clientSecret) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Make a request to Google's token endpoint
      const tokenUrl = "https://oauth2.googleapis.com/token";
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: "http://localhost",
          grant_type: "authorization_code",
        }),
      });
      
      const tokenData = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json({
          message: tokenData.error_description || "Failed to exchange code for token",
          error: tokenData.error,
        });
      }
      
      return res.json(tokenData);
    } catch (error) {
      console.error("Token exchange error:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
