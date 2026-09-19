import { NextRequest } from "next/server";
import { gradeCriterion } from "@/lib/grade";
import { z } from "zod";

const gradeRequestSchema = z.object({
  imageUrl: z.string().min(1, "Image URL or data URI is required"),
  prompt: z.string().min(1, "Question prompt is required"),
  criterion: z.string().min(1, "Criterion description is required"),
  maximum: z.number().positive("Maximum score must be positive"),
  referenceAnswer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = gradeRequestSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Invalid grading request payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await gradeCriterion(parsed.data);
    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error?.message || "Grading failed." }, { status: 500 });
  }
}
