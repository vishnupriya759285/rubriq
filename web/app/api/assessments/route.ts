import { createAssessmentSchema } from "@/lib/contracts";
import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/auth";

export async function GET() { try { const teacher = await requireTeacher(); return Response.json(await prisma.assessment.findMany({ where: { teacherId: teacher.id }, include: { class: true, _count: { select: { submissions: true } }, questions: { include: { criteria: true } } }, orderBy: { createdAt: "desc" } })); } catch { return Response.json({ error: "Sign in as a teacher." }, { status: 401 }); } }
export async function POST(request: Request) {
  let teacher; try { teacher = await requireTeacher(); } catch { return Response.json({ error: "Sign in as a teacher." }, { status: 401 }); }
  const parsed = createAssessmentSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "A title of at least three characters is required." }, { status: 400 });
  const { questions = [], ...assessment } = parsed.data;
  if (assessment.classId) { const owned = await prisma.class.count({ where: { id: assessment.classId, teacherId: teacher.id } }); if (!owned) return Response.json({ error: "Choose one of your classes." }, { status: 403 }); }
  return Response.json(await prisma.assessment.create({ data: { ...assessment, teacherId: teacher.id, questions: { create: questions.map((question, position) => ({ position, prompt: question.prompt, referenceAnswer: question.referenceAnswer, criteria: { create: question.criteria.map((criterion, criterionPosition) => ({ ...criterion, position: criterionPosition })) } })) } }, include: { questions: { include: { criteria: true } } } }), { status: 201 });
}
