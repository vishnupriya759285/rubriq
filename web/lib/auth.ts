import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE = "rubriq_session";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: hash(token) }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function requireTeacher() {
  const user = await currentUser();
  if (!user || user.role !== "TEACHER") throw new Error("UNAUTHORIZED");
  return user;
}

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  await prisma.session.create({ data: { userId, tokenHash: hash(token), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) } });
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
}

export async function registerTeacher(input: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  return prisma.user.create({ data: { name: input.name, email: input.email, passwordHash, role: "TEACHER" } });
}

export async function verifyPassword(password: string, passwordHash: string) { return bcrypt.compare(password, passwordHash); }

export async function endSession() {
  const jar = await cookies(); const token = jar.get(COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hash(token) } });
  jar.delete(COOKIE);
}
