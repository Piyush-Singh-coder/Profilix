import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { generateToken } from "../utils/token";
import { sendVerificationEmail } from "./email.service";
import admin from "../config/firebase";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { Response } from "express";
import { RegisterInput, LoginInput, OAuthInput } from "../validators/auth.validator";


// ─── Email / Password Auth ────────────────────────────────────────────────────

export const registerUser = async (input: RegisterInput, res: Response) => {
  const { fullName, email, username, password } = input;

  // Check uniqueness
  const [existingEmail, existingUsername] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (existingEmail) throw new ConflictError("An account with this email already exists");
  if (existingUsername) throw new ConflictError("This username is already taken");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      username,
      password: hashedPassword,
      authProvider: "EMAIL" as const,
      isVerified: false,
      profile: {
        create: {
          displayName: fullName,
        },
      },
    },
    select: { id: true, fullName: true, email: true, username: true, isVerified: true },
  });

  // Generate JWT token for email verification (reuses same secret, expires 48h)
  const verificationToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: "2d",
  });

  await sendVerificationEmail(user.email, user.fullName, verificationToken);

  return user;
};

export const verifyEmail = async (token: string) => {
  let decoded: { userId: string };
  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
  } catch {
    throw new BadRequestError("Invalid or expired verification token");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) throw new NotFoundError("User");
  if (user.isVerified) throw new BadRequestError("Email is already verified");

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });
};

export const loginUser = async (input: LoginInput, res: Response) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({ 
    where: { email },
    include: { profile: { select: { theme: true } } }
  });
  if (!user || !user.password) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new UnauthorizedError("Invalid email or password");

  if (!user.isVerified) {
    throw new UnauthorizedError("Please verify your email before logging in");
  }

  generateToken(user.id, res);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
    avatarUrl: user.avatarUrl,
    selectedTheme: user.profile?.theme || "GLASS",
  };
};

// ─── Google / GitHub OAuth ────────────────────────────────────────────────────

const handleOAuthLogin = async (
  input: OAuthInput,
  provider: "EMAIL" | "GITHUB" | "GOOGLE",
  res: Response
) => {
  const { idToken } = input;

  // Verify Firebase token
  const decodedToken = await admin.auth().verifyIdToken(idToken).catch(() => {
    throw new UnauthorizedError("Invalid or expired Firebase token");
  });

  const { name, email, uid, picture } = decodedToken;
  if (!email) throw new BadRequestError("OAuth account has no email associated");

  // Upsert user — find by email (user may have registered with email first)
  let user = await prisma.user.findUnique({ 
    where: { email },
    include: { profile: { select: { theme: true } } }
  });

  if (!user) {
    // Generate a unique username from name or email prefix
    const baseUsername = (name ?? email.split("@")[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 25);

    let username = baseUsername.length >= 3 ? baseUsername : `user${baseUsername}`;

    // Handle username collision
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) username = `${username}${Math.floor(Math.random() * 9000 + 1000)}`;

    user = await prisma.user.create({
      data: {
        fullName: name ?? email.split("@")[0],
        email,
        username,
        firebaseUid: uid,
        authProvider: provider as "EMAIL" | "GITHUB" | "GOOGLE",
        isVerified: true,
        avatarUrl: picture ?? null,
        // Auto-create Profile on OAuth registration
        profile: {
          create: {
            displayName: name ?? email.split("@")[0],
          },
        },
      },
      include: { profile: { select: { theme: true } } }
    });
  } else if (!user.firebaseUid) {
    // Link Firebase UID to existing email/password account
    user = await prisma.user.update({
      where: { id: user.id },
      data: { firebaseUid: uid, isVerified: true },
      include: { profile: { select: { theme: true } } }
    });
  }

  generateToken(user.id, res);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
    avatarUrl: user.avatarUrl,
    selectedTheme: user.profile?.theme || "GLASS",
  };
};

export const googleLogin = (input: OAuthInput, res: Response) =>
  handleOAuthLogin(input, "GOOGLE", res);

export const githubLogin = (input: OAuthInput, res: Response) =>
  handleOAuthLogin(input, "GITHUB", res);

// ─── Delete Account ───────────────────────────────────────────────────────────

export const deleteAccount = async (userId: string) => {
  // Cascading delete via Prisma schema onDelete: Cascade
  await prisma.user.delete({ where: { id: userId } });
};
