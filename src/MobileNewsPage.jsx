// ============================================================
// DIGGT — MobileNewsPage.jsx  (Screen 2)
// Mobile-first news result view after a search.
// Shows: Overall Summary dark card, CNN article with credibility
// bar, Source Ranking Badge.
// Props:
//   query     — the searched term
//   onBack()  — ← New Digg or back → LandingPage
// ============================================================

import { useState, useEffect } from "react";
import StagedLoading from "./components/StagedLoading";
import { getSummaryApiUrl } from "./api";


const T = "#00c896";
const DK = "#1a2332";
const BD = "rgba(255,255,255,.08)";
const TX = "#e2e8f0";
const TM = "#94a3b8";
const TD = "#5a6a7e";

const DEFAULT = {
  claim_level_focus: { claims: [] },
  multi_source_comparison: { consensus_points: [], disagreement_points: [], sources: [] },
  evidence_traceability: { evidence: [] },
  historical_context: { background: "Loading..." },
  exploratory_questions: { questions: [] }
};

export default function MobileNewsPage({ query = "trump recent", onBack }) {
  const [data, setData] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [inp, setInp] = useState(query);

  /* ── Firestore Integration ── */
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem("diggi_session_id");
    if (saved) return saved;
    const newId = "session_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("diggi_session_id", newId);
    return newId;
  });

  useEffect(() => {
    if (query && sessionId) {
      run(query);
    }
  }, [query, sessionId]);

  const run = async (q) => {
    setLoading(true);
    try {
      // 1. Fetch from New API (POST)
      const apiUrl = getSummaryApiUrl();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });
      if (!response.ok) throw new Error("API request failed");
      const apiData = await response.json();

      // 2. Set API response data
      const d = apiData.data;
      if (d) {
        setData(d);
      } else {
        setData(DEFAULT);
      }
      setLoading(false);

      // 3. Optional: Record request (PostgreSQL integration can be added later)

    } catch (e) {
      console.error("API error:", e);
      setLoading(false);
    }
  };


  return (
    <div className="mn-container" style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(180deg,#e8eef8 0%,#f0f4fa 100%)", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, button { font-family: 'Inter', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes sk2 { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .mn-fu  { animation: fadeUp .38s ease both; }
        .mn-fu1 { animation: fadeUp .38s .1s ease both; }
        .mn-fu2 { animation: fadeUp .38s .2s ease both; }
        .mn-sk  { background: linear-gradient(90deg,#212d3d 25%,#2a3a50 50%,#212d3d 75%); background-size:400px 100%; animation:sk2 1.5s infinite; border-radius:8px; }
        input::placeholder { color: #94a3b8; }
        @media (min-width: 900px) {
          .mn-container { max-width: 600px !important; margin: 0 auto !important; border-left: 1px solid #e8edf2; border-right: 1px solid #e8edf2; height: 100vh; }
        }
      `}</style>

      {/* ── Topbar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8edf2", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#4a90d9,#357abd)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🗽</div>
        <span style={{ fontWeight: 900, fontSize: 18, color: "#111", letterSpacing: -.3 }}>DIGGI</span>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #e0e0e0", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        </button>
      </div>

      {/* ── Sub bar ── */}
      <div style={{ background: "#fff", padding: "10px 14px 12px", borderBottom: "1px solid #e8edf2", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "rgba(0,200,150,.1)", border: "1px solid rgba(0,200,150,.3)", borderRadius: 20, color: T, fontSize: 11, fontWeight: 600, padding: "5px 12px", cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> New Digg
        </button>
        <form onSubmit={e => { e.preventDefault(); run(inp); }} style={{ display: "flex", alignItems: "center", background: "#f4f6fa", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 12px", gap: 8 }}>
          <input value={inp} onChange={e => setInp(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#1a1a2e" }} />
          <button type="button" onClick={() => setInp("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14, lineHeight: 1, padding: 0 }}>✕</button>
          <button type="submit" style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a1a2e", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </form>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {loading ? (
          <StagedLoading />
        ) : (
          <>
            {/* ── OVERALL SUMMARY ── */}
            {data.historical_context && (
              <div className="mn-fu" style={{ background: DK, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Overall Summary</div>
                <p style={{ fontSize: 13.5, color: TX, lineHeight: 1.6, marginBottom: 18 }}>
                  {data.historical_context?.background || "The global landscape continues to evolve..."}
                </p>
                
                {data.multi_source_comparison?.consensus_points?.length > 0 && (
                  <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "14px" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Key Points</div>
                    {data.multi_source_comparison.consensus_points.map((pt, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, color: "#cbd5e1", marginBottom: i < data.multi_source_comparison.consensus_points.length - 1 ? 12 : 0, lineHeight: 1.5 }}>
                        <span style={{ color: T, flexShrink: 0, marginTop: 2 }}>•</span><span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── KEY TAKEAWAY ── */}
            {data.claim_level_focus?.claims?.[0] && (
              <div className="mn-fu" style={{ background: DK, borderRadius: 10, padding: "16px", marginBottom: 16 }}>
                 <div style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Key Takeaway</div>
                 <p style={{ fontSize: 13.5, color: TX, lineHeight: 1.6 }}>
                   {data.claim_level_focus.claims[0].claim}
                 </p>
              </div>
            )}

            {/* ── CLAIMS IN FOCUS ── */}
            {data.claim_level_focus?.claims?.length > 0 && (
              <div className="mn-fu1" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 4 }}>Claims In Focus</h3>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Core claims and the evidence cited for each one.</p>
                
                {data.claim_level_focus.claims.map((claim, i) => (
                  <div key={i} style={{ marginBottom: i < data.claim_level_focus.claims.length - 1 ? 24 : 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", lineHeight: 1.4, marginBottom: 12 }}>
                      {claim.claim}
                    </p>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {claim.actors?.map((actor, idx) => (
                         <span key={idx} style={{ background: "#f8fafc", border: "1px solid #f1f5f9", color: "#475569", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 16 }}>
                           {actor}
                         </span>
                      ))}
                    </div>

                    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px", background: "#fcfcfd" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Evidence</div>
                      <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                        {claim.evidence}
                      </p>
                    </div>
                    {i < data.claim_level_focus.claims.length - 1 && <div style={{ height: 1, background: "#f1f5f9", marginTop: 24 }} />}
                  </div>
                ))}
              </div>
            )}

            {/* ── MULTI-SOURCE COMPARISON ── */}
            {(data.multi_source_comparison?.consensus_points?.length > 0 || data.multi_source_comparison?.disagreement_points?.length > 0) && (
              <div className="mn-fu1" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 4 }}>Multi-Source Comparison</h3>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 18, lineHeight: 1.5 }}>Where the reporting aligns, diverges, and how each source frames the story.</p>
                
                {/* Consensus */}
                {data.multi_source_comparison?.consensus_points?.length > 0 && (
                  <div style={{ background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: 8, padding: "14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginBottom: 12 }}>Consensus</div>
                    {data.multi_source_comparison.consensus_points.map((pt, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#334155", marginBottom: i < data.multi_source_comparison.consensus_points.length - 1 ? 12 : 0, lineHeight: 1.5 }}>
                        <span style={{ color: "#059669", flexShrink: 0, marginTop: 2 }}>•</span><span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Disagreement */}
                {data.multi_source_comparison?.disagreement_points?.length > 0 && (
                  <div style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: 8, padding: "14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 12 }}>Disagreement</div>
                    {data.multi_source_comparison.disagreement_points.map((pt, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#334155", marginBottom: i < data.multi_source_comparison.disagreement_points.length - 1 ? 12 : 0, lineHeight: 1.5 }}>
                        <span style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }}>•</span><span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── EVIDENCE TRACEABILITY ── */}
            {data.evidence_traceability?.evidence?.length > 0 && (
              <div className="mn-fu2" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 4 }}>Evidence Traceability</h3>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Track the statement back to the cited source passage.</p>
                
                {data.evidence_traceability.evidence.map((ev, i) => (
                  <div key={i} style={{ marginBottom: i < data.evidence_traceability.evidence.length - 1 ? 24 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ background: i % 2 === 0 ? "rgba(245, 158, 11, 0.12)" : "rgba(59, 130, 246, 0.12)", color: i % 2 === 0 ? "#d97706" : "#2563eb", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 14 }}>
                        {ev.source}
                      </span>
                      {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>Open Source</a>}
                    </div>
                    
                    <p style={{ fontSize: 14.5, fontWeight: 700, color: "#1e293b", lineHeight: 1.4, marginBottom: 12 }}>
                      {ev.statement}
                    </p>
                    
                    <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 8, padding: "14px" }}>
                      <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, fontStyle: "italic" }}>
                        {ev.supporting_passage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── SOURCE FRAMING ── */}
            {data.multi_source_comparison?.sources?.map((src, i) => {
               const evLink = data.evidence_traceability?.evidence?.find(e => e.source === src.source)?.link;
               return (
                <div key={`src-${i}`} className="mn-fu2" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: "inline-block", background: i % 2 === 0 ? "rgba(245, 158, 11, 0.12)" : "rgba(59, 130, 246, 0.12)", color: i % 2 === 0 ? "#d97706" : "#2563eb", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 14, marginBottom: 8 }}>
                        {src.source}
                      </span>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", lineHeight: 1.4 }}>
                        {src.stance}
                      </h4>
                    </div>
                    {evLink && <a href={evLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textDecoration: "none", flexShrink: 0, marginLeft: 12, marginTop: 4 }}>View Site</a>}
                  </div>
                  
                  <div>
                    {src.key_points?.map((kp, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569", marginBottom: idx < src.key_points.length - 1 ? 10 : 0, lineHeight: 1.5 }}>
                        <span style={{ color: "#94a3b8", flexShrink: 0, marginTop: 2 }}>•</span><span>{kp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ height: 20 }} />
          </>
        )}
      </div>
    </div>
  );
}
