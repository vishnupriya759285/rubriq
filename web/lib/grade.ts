import OpenAI from "openai";

export type GradeProposal = { transcription: string; mark: number; rationale: string; evidence: string; confidence: number; needsReview: boolean };
export async function gradeCriterion(input: { imageUrl: string; prompt: string; criterion: string; maximum: number; referenceAnswer?: string }): Promise<GradeProposal> {
  if (!process.env.OPENAI_API_KEY) throw new Error("AI grading has not been configured.");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({ model: "gpt-5.6-luna", reasoning: { effort: "low" }, input: [{ role: "user", content: [{ type: "input_text", text: `Read the handwritten student answer. Grade only this criterion on a 0–${input.maximum} scale. Return strict JSON with transcription, mark, rationale, evidence, confidence from 0 to 1, and needsReview. Question: ${input.prompt}. Criterion: ${input.criterion}. Reference: ${input.referenceAnswer ?? "None supplied"}.` }, { type: "input_image", image_url: input.imageUrl, detail: "high" }] }] });
  const raw = response.output_text.trim();
  const proposal = JSON.parse(raw) as GradeProposal;
  if (!Number.isFinite(proposal.mark) || proposal.mark < 0 || proposal.mark > input.maximum) throw new Error("The grading response was outside the rubric bounds.");
  return { ...proposal, mark: Math.round(proposal.mark * 100) / 100, needsReview: proposal.needsReview || proposal.confidence < 0.72 };
}
