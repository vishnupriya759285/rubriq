"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "Arial, sans-serif", background: "#f7f4ed", color: "#17342d" }}><section style={{ maxWidth: 520, background: "#fffdf9", padding: 32, borderRadius: 14, border: "1px solid #e9e4da" }}><h1>We couldn&apos;t load this assessment.</h1><p>Rubriq kept your saved work. Try loading the assessment again.</p><pre style={{ whiteSpace: "pre-wrap", color: "#8b442f", fontSize: 12 }}>{error.message || error.digest}</pre><button onClick={reset} style={{ background: "#204f43", color: "white", border: 0, borderRadius: 8, padding: "11px 16px", cursor: "pointer" }}>Try again</button></section></main>;
}
