import { createClassSchema } from "@/lib/contracts";
import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/auth";

export async function GET() { try { const teacher = await requireTeacher(); return Response.json(await prisma.class.findMany({ where: { teacherId: teacher.id, archivedAt: null }, include: { _count: { select: { enrollments: true } } }, orderBy: { createdAt: "desc" } })); } catch { return Response.json({ error: "Sign in as a teacher." }, { status: 401 }); } }
export async function POST(request: Request) {
  let teacher; try { teacher = await requireTeacher(); } catch { return Response.json({ error: "Sign in as a teacher." }, { status: 401 }); }
  const parsed = createClassSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Please provide a class name." }, { status: 400 });
  return Response.json(await prisma.class.create({ data: { ...parsed.data, teacherId: teacher.id } }), { status: 201 });
}
