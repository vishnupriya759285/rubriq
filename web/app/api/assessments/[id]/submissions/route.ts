import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/auth";
import { gradeCriterion } from "@/lib/grade";
import { z } from "zod";

const schema = z.object({ studentName: z.string().trim().min(2).max(100), studentId: z.string().cuid().optional(), pages: z.array(z.object({ dataUrl: z.string().startsWith("data:image/"), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]) })).min(1).max(10) });

async function processSubmission(id: string) {
  const submission = await prisma.submission.findUnique({ where: { id }, include: { assessment: { include: { questions: { include: { criteria: true } } } }, pages: true } });
  if (!submission) return;
  try {
    await prisma.submission.update({ where: { id }, data: { status: "PROCESSING" } });
    const imageUrl = submission.pages[0]?.objectKey;
    if (!imageUrl) throw new Error("No page was received.");
    const evaluations = [] as { submissionId: string; criterionId: string; proposedMark: number; effectiveMark: number; rationale: string; confidence: number; evidence: string }[];
    for (const question of submission.assessment.questions) for (const criterion of question.criteria) {
      const proposal = await gradeCriterion({ imageUrl, prompt: question.prompt, criterion: criterion.description, maximum: criterion.maximum, referenceAnswer: question.referenceAnswer ?? undefined });
      evaluations.push({ submissionId: id, criterionId: criterion.id, proposedMark: proposal.mark, effectiveMark: proposal.mark, rationale: proposal.rationale, confidence: proposal.confidence, evidence: `${proposal.transcription}\n${proposal.evidence}` });
    }
    await prisma.evaluation.createMany({ data: evaluations });
    const needsReview = evaluations.some(item => (item.confidence ?? 1) < 0.72);
    await prisma.submission.update({ where: { id }, data: { status: needsReview ? "REVIEW_REQUIRED" : "READY" } });
    await prisma.job.updateMany({ where: { payload: { path: ["submissionId"], equals: id } }, data: { status: "completed" } });
  } catch (error) {
    await prisma.submission.update({ where: { id }, data: { status: "FAILED" } });
    await prisma.job.updateMany({ where: { payload: { path: ["submissionId"], equals: id } }, data: { status: "failed" } });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const teacher = await requireTeacher(); const { id } = await params;
    const assessment = await prisma.assessment.findFirst({ where: { id, teacherId: teacher.id } });
    if (!assessment) return Response.json({ error: "Assessment not found." }, { status: 404 });
    const value = schema.safeParse(await request.json());
    if (!value.success) return Response.json({ error: "Choose a student and between one and ten image pages." }, { status: 400 });
    const submission = await prisma.submission.create({ data: { assessmentId: id, studentName: value.data.studentName, studentId: value.data.studentId, status: "UPLOADED", pages: { create: value.data.pages.map((page, position) => ({ position, objectKey: page.dataUrl, mimeType: page.mimeType })) } }, include: { pages: true } });
    await prisma.job.create({ data: { type: "grade_submission", payload: { submissionId: submission.id } } });
    void processSubmission(submission.id);
    return Response.json(submission, { status: 201 });
  } catch { return Response.json({ error: "Unable to upload this paper." }, { status: 500 }); }
}
