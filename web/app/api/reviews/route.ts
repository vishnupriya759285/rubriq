import { reviewSchema } from "@/lib/contracts";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "The review details are invalid." }, { status: 400 });
  const { evaluationId, mark, note, decision } = parsed.data;
  const evaluation = await prisma.evaluation.update({ where: { id: evaluationId }, data: { effectiveMark: mark, teacherNote: note, teacherDecision: decision }, include: { submission: true } });
  await prisma.auditEvent.create({ data: { submissionId: evaluation.submissionId, action: "evaluation.reviewed", details: { evaluationId, mark, decision } } });
  return Response.json(evaluation);
}
