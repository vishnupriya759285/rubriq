import { reviewSchema } from "@/lib/contracts";
import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/auth";

export async function PATCH(request: Request) {
  try { await requireTeacher(); } catch { return Response.json({ error: "Sign in as a teacher." }, { status: 401 }); }
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "The review details are invalid." }, { status: 400 });
  const { evaluationId, mark, note, decision } = parsed.data;
  const existing = await prisma.evaluation.findFirst({ where: { id: evaluationId, submission: { assessment: { teacherId: (await requireTeacher()).id } } } });
  if (!existing) return Response.json({ error: "Evaluation not found." }, { status: 404 });
  const maximum = await prisma.criterion.findUnique({ where: { id: existing.criterionId } });
  if (!maximum || mark > maximum.maximum) return Response.json({ error: "The mark is outside this criterion's bounds." }, { status: 400 });
  const evaluation = await prisma.evaluation.update({ where: { id: evaluationId }, data: { effectiveMark: mark, teacherNote: note, teacherDecision: decision }, include: { submission: true } });
  await prisma.auditEvent.create({ data: { submissionId: evaluation.submissionId, action: "evaluation.reviewed", details: { evaluationId, mark, decision } } });
  return Response.json(evaluation);
}
