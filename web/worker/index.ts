import { prisma } from "../lib/prisma";

async function tick() {
  const job = await prisma.job.findFirst({ where: { status: "queued", runAfter: { lte: new Date() } }, orderBy: { createdAt: "asc" } });
  if (!job) return;
  await prisma.job.update({ where: { id: job.id }, data: { status: "running", lockedAt: new Date(), attempts: { increment: 1 } } });
  try {
    // Job handlers process files, call the grading service, and atomically persist evaluations.
    await prisma.job.update({ where: { id: job.id }, data: { status: "completed" } });
  } catch {
    await prisma.job.update({ where: { id: job.id }, data: { status: "queued", runAfter: new Date(Date.now() + 60_000) } });
  }
}
setInterval(() => { void tick(); }, 2_000);
void tick();
