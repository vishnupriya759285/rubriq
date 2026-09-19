import { z } from "zod";

export const createClassSchema = z.object({ name: z.string().trim().min(2).max(100), section: z.string().trim().max(60).optional(), year: z.string().trim().max(30).optional() });
export const criterionSchema = z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().min(1).max(2000), concept: z.string().trim().min(1).max(100), maximum: z.number().positive().max(100) });
export const questionSchema = z.object({ prompt: z.string().trim().min(1).max(5000), referenceAnswer: z.string().trim().max(5000).optional(), criteria: z.array(criterionSchema).min(1) });
export const createAssessmentSchema = z.object({ classId: z.string().cuid().optional(), title: z.string().trim().min(3).max(140), instructions: z.string().trim().max(5000).optional(), questions: z.array(questionSchema).min(1).optional() });
export const reviewSchema = z.object({ evaluationId: z.string().cuid(), mark: z.number().min(0), note: z.string().trim().max(1200).optional(), decision: z.enum(["CONFIRMED", "OVERRIDDEN", "REJECTED"]) });
