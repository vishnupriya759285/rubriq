export async function GET() {
  return Response.json({ status: "ok", service: "rubriq", time: new Date().toISOString(), aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
}
