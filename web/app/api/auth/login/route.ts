import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { startSession, verifyPassword } from "@/lib/auth";
const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function POST(request: Request) { const value = schema.safeParse(await request.json()); if (!value.success) return Response.json({ error: "Enter your email and password." }, { status: 400 }); const user = await prisma.user.findUnique({ where: { email: value.data.email } }); if (!user || !(await verifyPassword(value.data.password, user.passwordHash))) return Response.json({ error: "Incorrect email or password." }, { status: 401 }); await startSession(user.id); return Response.json({ id: user.id, name: user.name, role: user.role }); }
