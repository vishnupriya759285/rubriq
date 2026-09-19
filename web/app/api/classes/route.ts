import { createClassSchema } from "@/lib/contracts";
import { prisma } from "@/lib/prisma";

// Authentication middleware supplies this in the deployed application.
const demoTeacherId = "replace-with-session-user";
export async function GET() { return Response.json(await prisma.class.findMany({ where: { teacherId: demoTeacherId, archivedAt: null }, include: { _count: { select: { enrollments: true } } }, orderBy: { createdAt: "desc" } })); }
export async function POST(request: Request) {
  const parsed = createClassSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Please provide a class name." }, { status: 400 });
  return Response.json(await prisma.class.create({ data: { ...parsed.data, teacherId: demoTeacherId } }), { status: 201 });
}
