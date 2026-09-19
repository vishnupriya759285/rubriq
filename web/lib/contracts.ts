import { z } from "zod";

export const createClassSchema = z.object({ name: z.string().trim().min(2).max(100), section: z.string().trim().max(60).optional(), year: z.string().trim().max(30).optional() });
export const createAssessmentSchema = z.object({ classId: z.string().cuid().optional(), title: z.string().trim().min(3).max(140), instructions: z.string().trim().max(5000).optional() });
export const reviewSchema = z.object({ evaluationId: z.string().cuid(), mark: z.number().min(0), note: z.string().trim().max(1200).optional(), decision: z.enum(["CONFIRMED", "OVERRIDDEN", "REJECTED"]) });
