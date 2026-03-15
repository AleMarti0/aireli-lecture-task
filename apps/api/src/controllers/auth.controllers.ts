import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // 1. Basic validation
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // 2. Call the createUser function from your model
    // Note: We don't pass 'id' here as the database handles it
    const createdUser = await createUser({ email, password });

    // 3. Respond with the new user ID
    res.status(201).json({
      message: "User registered successfully",
      id: createdUser.id
    });
    
  } catch (error: any) {
    // Handle potential errors (e.g., duplicate email if you have a UNIQUE constraint)
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

  // please finish this function
