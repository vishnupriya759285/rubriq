import { currentUser } from "@/lib/auth";
export async function GET() { const user = await currentUser(); return user ? Response.json({ id: user.id, name: user.name, email: user.email, role: user.role }) : Response.json({ user: null }, { status: 401 }); }
