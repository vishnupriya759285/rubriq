import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { registerTeacher, startSession } from "@/lib/auth";
const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email(), password: z.string().min(12).max(200) });
export async function POST(request: Request) {
  const value = schema.safeParse(await request.json());
  if (!value.success) return Response.json({ error: "Enter your name, email, and a password with at least 12 characters." }, { status: 400 });
  try {
    if (await prisma.user.count()) return Response.json({ error: "The workspace has already been set up. Please sign in." }, { status: 403 });
    const user = await registerTeacher(value.data); await startSession(user.id); return Response.json({ id: user.id, name: user.name, role: user.role }, { status: 201 });
  } catch { return Response.json({ error: "Rubriq is preparing its database. Please try again in a moment." }, { status: 503 }); }
}
