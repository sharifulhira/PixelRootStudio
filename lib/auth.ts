import { SignJWT, jwtVerify } from "jose";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";
import { adminUsers } from "./db/schema";
import { eq } from "drizzle-orm";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "pixelroot-studio-secret-key-change-in-production-32chars"
);

const COOKIE_NAME = "pixelroot_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: number;
  email: string;
  name: string | null;
  expiresAt: Date;
};

// ─────────────────────────────────────────────────────────────
// Password utilities
// ─────────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ─────────────────────────────────────────────────────────────
// JWT utilities
// ─────────────────────────────────────────────────────────────
async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string | null,
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Session management
// ─────────────────────────────────────────────────────────────
export async function createSession(userId: number, email: string, name: string | null) {
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE * 1000);
  const token = await encrypt({ userId, email, name, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
  
  // Update last login
  db.update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, userId))
    .run();
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  const session = await decrypt(token);
  if (!session) return null;
  
  // Check if expired
  if (new Date() > session.expiresAt) {
    return null;
  }
  
  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─────────────────────────────────────────────────────────────
// User verification
// ─────────────────────────────────────────────────────────────
export async function verifyCredentials(email: string, password: string) {
  const user = db.select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .get();
  
  if (!user) return null;
  
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

// ─────────────────────────────────────────────────────────────
// Middleware helper (for use in middleware.ts)
// ─────────────────────────────────────────────────────────────
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  return decrypt(token);
}

export { COOKIE_NAME };
