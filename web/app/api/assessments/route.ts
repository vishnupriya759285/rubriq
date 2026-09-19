import { createAssessmentSchema } from "@/lib/contracts";
import { prisma } from "@/lib/prisma";

const demoTeacherId = "replace-with-session-user";
export async function GET() { return Response.json(await prisma.assessment.findMany({ where: { teacherId: demoTeacherId }, include: { class: true, _count: { select: { submissions: true } } }, orderBy: { createdAt: "desc" } })); }
export async function POST(request: Request) {
  const parsed = createAssessmentSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "A title of at least three characters is required." }, { status: 400 });
  return Response.json(await prisma.assessment.create({ data: { ...parsed.data, teacherId: demoTeacherId } }), { status: 201 });
}
