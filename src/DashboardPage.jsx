// ============================================================
// DIGGT — DashboardPage.jsx  (Screen 4)
// Full dark dashboard: Concise Analysis, Summary grid,
// Individual Articles, Dig Deeper
// Props:
//   initialQuery  — pre-loaded search term
//   onNewDigg()   — ← New Digg → LandingPage
//   onProfile()   — clock icon → ProfilePage
//   onSearchPage(q) — "Digg it" button in subbar → LandingPage (search)
// ============================================================

import { useState, useEffect } from "react";
import StagedLoading from "./components/StagedLoading";
import { getSummaryApiUrl } from "./api";


/* ── palette ── */
const T = "#47ab0dff";
const BG = "#f8f8fcff";
const C = "#141c2b";
const CD = "#111827";
const BD = "rgba(0, 0, 0, 0.06)";
const TX = "#ffffff";
const TM = "#596879ff";
const TD = "#475569";

const DEFAULT = {
  claim_level_focus: { claims: [] },
  multi_source_comparison: { consensus_points: [], disagreement_points: [], sources: [] },
  evidence_traceability: { evidence: [] },
  credibility_signals: { verified_facts: [], uncertain_claims: [] },
  historical_context: { background: "Loading...", timeline: [] },
  perspectives: { perspectives: [] },
  exploratory_questions: { questions: [], related_topics: [] }
};

const HR = () => <div style={{ height: 1, background: BD }} />;
const HL = () => <div style={{ height: 1, background: "#e2e8f0" }} />;

export default function DashboardPage({ initialQuery = "trump recent", onNewDigg, onProfile, onSearchPage }) {
  const [data, setData] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState(initialQuery);

  /* ── Firestore Integration ── */
  const [sessionId] = useState(() => {
    // Basic session persistence or new uuid
    const saved = localStorage.getItem("diggi_session_id");
    if (saved) return saved;
    const newId = "session_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("diggi_session_id", newId);
    return newId;
  });

  // 2. Effect for analysis via Vercel API
  useEffect(() => {
    if (initialQuery && sessionId) {
      analyse(initialQuery);
    }
  }, [initialQuery, sessionId]);

  const analyse = async (q) => {
    setLoading(true); setTopic(q);
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
      console.error("Connection error:", e);
      setLoading(false);
    }
  };


  return (
    <div style={{ minHeight: "100vh", width: "100%", background: BG, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, button { font-family: 'Inter', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        .db-fu  { animation: fadeUp .38s ease both; }
        .db-fu1 { animation: fadeUp .38s .09s ease both; }
        .db-fu2 { animation: fadeUp .38s .18s ease both; }
        .db-fu3 { animation: fadeUp .38s .27s ease both; }
        .db-sk  { background: linear-gradient(90deg,#141c2b 25%,#1d2a3c 50%,#141c2b 75%); background-size:600px 100%; animation:shimmer 1.6s infinite; border-radius:8px; }
        @media (max-width: 600px) {
          .db-content { padding: 10px 8px !important; }
          .db-subbar { flex-wrap: wrap !important; height: auto !important; padding: 10px !important; }
          .db-topic { order: 3 !important; width: 100% !important; text-align: left !important; margin-top: 5px !important; }
          .db-plane-img { display: none !important; }
          .db-summary-grid { grid-template-columns: 1fr !important; }
          .db-deeper-grid { grid-template-columns: 1fr !important; }
        }
        
        @media (min-width: 1440px) {
          .db-content { max-width: 900px !important; }
        }

        .article-card:hover { border-color: rgba(0, 200, 150, 0.4) !important; transform: translateY(-2px); transition: all 0.2s; }
        .perspective-card { border-left: 3px solid ${T} !important; }
        @media (min-width: 1024px) {
  .db-content {
    max-width: 1200px !important;
  }

  .db-summary-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  .db-deeper-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  .article-card {
    padding: 18px !important;
  }
}

@media (min-width: 1440px) {
  .db-content {
    max-width: 1350px !important;
  }
}
.desktop-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
@media (min-width: 900px) { .desktop-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1100px) { .desktop-grid { grid-template-columns: 2fr 1fr; } }
.topic-pill:hover { background: #dbeafe !important; }
      `
      }</style>

      {/* ── Topbar ── */}
      <div style={{ background: CD, borderBottom: `1px solid ${BD}`, height: 46, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 900, fontSize: 15, color: "#fff", letterSpacing: .3 }}>DIGGI</span>
        <div style={{ flex: 1 }} />
        <button onClick={onProfile} style={{ width: 30, height: 30, borderRadius: "50%", background: "#1e2d40", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#778899" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        </button>
        <div style={{ background: T, borderRadius: 5, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#041a10" }}>Active session</div>
      </div>

      {/* ── Sub bar ── */}
      <div className="db-subbar" style={{ background: CD, borderBottom: `1px solid ${BD}`, padding: "7px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onNewDigg} style={{ background: "rgba(0,200,150,.12)", border: "1px solid rgba(0,200,150,.35)", borderRadius: 5, color: T, fontSize: 11, fontWeight: 600, padding: "4px 11px", cursor: "pointer" }}>← New Digg</button>
        <div style={{ flex: 1 }} />
        <span className="db-topic" style={{ fontSize: 11, color: TD, fontFamily: "monospace", textTransform: "capitalize" }}>{topic}</span>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: "#1e2d40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: TD, cursor: "pointer" }}>⊙</div>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: "#1e2d40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: TD, cursor: "pointer" }}>⋯</div>
          <button onClick={() => onSearchPage && onSearchPage(topic)} style={{ background: T, border: "none", borderRadius: 5, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#041a10", cursor: "pointer" }}>Digg it</button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="db-content" style={{ padding: "24px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {loading ? (
          <StagedLoading />
        ) : (
          <div className="desktop-grid">
            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Overall Summary */}
              {data.historical_context && (
                <div className="db-fu" style={{ background: C, border: `1px solid ${BD}`, borderRadius: 10, padding: "20px" }}>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: T, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Overall Summary</div>
                  <p style={{ fontSize: 14, color: TX, lineHeight: 1.6, marginBottom: 18 }}>
                    {data.historical_context?.background || "The global landscape continues to evolve..."}
                  </p>
                  
                  {data.multi_source_comparison?.consensus_points?.length > 0 && (
                    <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "16px" }}>
                      <div style={{ fontSize: 11, color: T, fontFamily: "monospace", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Key Points</div>
                      {data.multi_source_comparison.consensus_points.map((pt, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#cbd5e1", marginBottom: i < data.multi_source_comparison.consensus_points.length - 1 ? 12 : 0, lineHeight: 1.5 }}>
                          <span style={{ color: T, flexShrink: 0, marginTop: 2 }}>•</span><span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Claims In Focus */}
              {data.claim_level_focus?.claims?.length > 0 && (
                <div className="db-fu1" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "20px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>Claims In Focus</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Core claims and the evidence cited for each one.</p>
                  
                  {data.claim_level_focus.claims.map((claim, i) => (
                    <div key={i} style={{ marginBottom: i < data.claim_level_focus.claims.length - 1 ? 24 : 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", lineHeight: 1.4, marginBottom: 12 }}>{claim.claim}</p>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                        {claim.actors?.map((actor, idx) => (
                           <span key={idx} style={{ background: "#f8fafc", border: "1px solid #f1f5f9", color: "#475569", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 16 }}>{actor}</span>
                        ))}
                      </div>

                      <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "14px", background: "#fcfcfd" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Evidence</div>
                        <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>{claim.evidence}</p>
                      </div>
                      {i < data.claim_level_focus.claims.length - 1 && <div style={{ height: 1, background: "#f1f5f9", marginTop: 24 }} />}
                    </div>
                  ))}
                </div>
              )}

              {/* Multi-Source Comparison */}
              {(data.multi_source_comparison?.consensus_points?.length > 0 || data.multi_source_comparison?.disagreement_points?.length > 0) && (
                <div className="db-fu2" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "20px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>Multi-Source Comparison</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.5 }}>Where the reporting aligns, diverges, and how each source frames the story.</p>
                  
                  {data.multi_source_comparison?.consensus_points?.length > 0 && (
                    <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: 8, padding: "16px", marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginBottom: 12 }}>Consensus</div>
                      {data.multi_source_comparison.consensus_points.map((pt, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#334155", marginBottom: i < data.multi_source_comparison.consensus_points.length - 1 ? 12 : 0, lineHeight: 1.5 }}>
                          <span style={{ color: "#059669", flexShrink: 0, marginTop: 2 }}>•</span><span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.multi_source_comparison?.disagreement_points?.length > 0 && (
                    <div style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: 8, padding: "16px" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#d97706", marginBottom: 12 }}>Disagreement</div>
                      {data.multi_source_comparison.disagreement_points.map((pt, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#334155", marginBottom: i < data.multi_source_comparison.disagreement_points.length - 1 ? 12 : 0, lineHeight: 1.5 }}>
                          <span style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }}>•</span><span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Evidence Traceability */}
              {data.evidence_traceability?.evidence?.length > 0 && (
                <div className="db-fu3" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "20px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>Evidence Traceability</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Track the statement back to the cited source passage.</p>
                  
                  {data.evidence_traceability.evidence.map((ev, i) => (
                    <div key={i} style={{ marginBottom: i < data.evidence_traceability.evidence.length - 1 ? 28 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <span style={{ background: i % 2 === 0 ? "rgba(245, 158, 11, 0.1)" : "rgba(59, 130, 246, 0.1)", color: i % 2 === 0 ? "#d97706" : "#2563eb", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 16 }}>
                          {ev.source}
                        </span>
                        {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>Open Source</a>}
                      </div>
                      
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", lineHeight: 1.5, marginBottom: 14 }}>{ev.statement}</p>
                      
                      <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 8, padding: "16px" }}>
                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, fontStyle: "italic" }}>"{ev.supporting_passage}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stakeholder Perspectives */}
              {data.perspectives?.perspectives?.length > 0 && (
                <div className="db-fu3" style={{ background: "#1a2332", border: `1px solid ${BD}`, borderRadius: 10, padding: "20px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Stakeholder Perspectives</h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>How different voices are interpreting the same conflict.</p>
                  
                  {data.perspectives.perspectives.map((p, i) => {
                    const colors = [
                      { title: "#34d399", border: "#059669" }, // Green
                      { title: "#fb923c", border: "#ea580c" }, // Orange
                      { title: "#60a5fa", border: "#2563eb" }  // Blue
                    ];
                    const theme = colors[i % colors.length];
                    return (
                      <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "16px", marginBottom: i < data.perspectives.perspectives.length - 1 ? 16 : 0, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: theme.title, marginBottom: 8 }}>{p.stakeholder}</div>
                        <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.5, marginBottom: 14 }}>{p.viewpoint}</p>
                        <div style={{ borderLeft: `3px solid ${theme.border}`, background: "rgba(0,0,0,0.2)", padding: "12px 14px", borderRadius: "0 6px 6px 0" }}>
                          <p style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic", lineHeight: 1.5 }}><strong style={{ color: "#cbd5e1", fontStyle: "normal" }}>Why it matters:</strong> {p.reasoning}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Key Takeaway */}
              {data.claim_level_focus?.claims?.[0] && (
                <div className="db-fu" style={{ background: C, border: `1px solid ${BD}`, borderRadius: 10, padding: "20px" }}>
                   <div style={{ fontSize: 11, fontFamily: "monospace", color: T, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Key Takeaway</div>
                   <p style={{ fontSize: 14, color: TX, lineHeight: 1.6 }}>{data.claim_level_focus.claims[0].claim}</p>
                </div>
              )}

              {/* Credibility Signals */}
              {data.credibility_signals && (
                <div className="db-fu1" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "20px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>Credibility Signals</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>A quick view of confidence, reliability, and open uncertainty.</p>
                  
                  <div style={{ background: "#e8fdf5", color: "#065f46", fontSize: 13, fontWeight: 700, padding: "10px 14px", borderRadius: 20, marginBottom: 12 }}>
                    Source reliability: High (All outlets are reputable)
                  </div>
                  <div style={{ background: "#f1f5f9", color: "#475569", fontSize: 13, fontWeight: 700, padding: "10px 14px", borderRadius: 20, marginBottom: 20 }}>
                    Confidence: Medium (Mixed analysis and reporting)
                  </div>

                  {data.credibility_signals?.verified_facts?.length > 0 && (
                     <div style={{ border: "1px solid #a7f3d0", background: "#f0fdf4", borderRadius: 8, padding: "16px", marginBottom: 16 }}>
                       <div style={{ fontSize: 13, fontWeight: 800, color: "#065f46", marginBottom: 10 }}>Verified Facts</div>
                       {data.credibility_signals.verified_facts.map((fact, i) => (
                         <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#334155", marginBottom: i < data.credibility_signals.verified_facts.length - 1 ? 10 : 0, lineHeight: 1.5 }}>
                           <span style={{ color: "#059669", flexShrink: 0, marginTop: 2 }}>•</span><span>{fact}</span>
                         </div>
                       ))}
                     </div>
                  )}

                  {data.credibility_signals?.uncertain_claims?.length > 0 && (
                     <div style={{ border: "1px solid #fde68a", background: "#fffbeb", borderRadius: 8, padding: "16px" }}>
                       <div style={{ fontSize: 13, fontWeight: 800, color: "#b45309", marginBottom: 10 }}>Uncertain Claims</div>
                       {data.credibility_signals.uncertain_claims.map((claim, i) => (
                         <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#451a03", marginBottom: i < data.credibility_signals.uncertain_claims.length - 1 ? 10 : 0, lineHeight: 1.5 }}>
                           <span style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }}>•</span><span>{claim}</span>
                         </div>
                       ))}
                     </div>
                  )}
                </div>
              )}

              {/* Historical Context */}
              {data.historical_context?.timeline?.length > 0 && (
                <div className="db-fu2" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "20px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>Historical Context</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>Background and timeline markers that frame the current moment.</p>
                  
                  <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.5, marginBottom: 20 }}>
                     {data.historical_context.background || "No background available."}
                  </p>

                  <div style={{ borderLeft: "2px solid #e2e8f0", marginLeft: 8, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 20 }}>
                    {data.historical_context.timeline.map((item, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: -25, top: 4, width: 12, height: 12, borderRadius: "50%", background: "#059669", border: "2px solid #fff" }} />
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>{item.date}</div>
                        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explore Further */}
              {data.exploratory_questions && (
                <div className="db-fu3" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 10, padding: "20px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>Explore Further</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Suggested follow-up angles and related topics to dig into next.</p>
                  
                  {data.exploratory_questions?.questions?.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      {data.exploratory_questions.questions.map((q, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "#334155", marginBottom: 10, lineHeight: 1.5, cursor: "pointer" }} onClick={() => analyse(q)}>
                          <span style={{ color: "#2563eb", flexShrink: 0, marginTop: 2 }}>•</span><span>{q}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.exploratory_questions?.related_topics?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                       {data.exploratory_questions.related_topics.map((tag, i) => (
                         <span key={i} onClick={() => analyse(tag)} style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20, cursor: "pointer", transition: "all 0.2s" }} className="topic-pill">
                           {tag}
                         </span>
                       ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
