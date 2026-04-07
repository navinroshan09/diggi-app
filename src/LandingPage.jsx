// ============================================================
// DIGGT — LandingPage.jsx  (Screen 3)
// White topbar + pink→purple gradient hero + frosted search box
// Props:
//   user          — { name, country } shown in bottom-right chip
//   onDiggIt(q)   — called when user submits a search → goes to MobileNewsPage
//   onProfile()   — called when clock/avatar icon clicked → ProfilePage
// ============================================================

import { useEffect, useState } from "react";
import { fetchSummaryPreview } from "./api";

export default function LandingPage({ user, initialQuery = "", onQueryChange, onDiggIt, onProfile }) {
  const [query, setQuery] = useState(initialQuery);
  const [dragOver, setDragOver] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState("");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const updateQuery = (value) => {
    setQuery(value);
    if (onQueryChange) {
      onQueryChange(value);
    }
  };

  const clearSuggestionState = () => {
    setSuggestions([]);
    setSuggestionMessage("");
    setActiveSuggestion("");
  };

  const submit = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loadingSuggestions) return;

    setLoadingSuggestions(true);
    setActiveSuggestion("");

    try {
      const payload = await fetchSummaryPreview(trimmedQuery);

      if (payload?.status === "vague" && Array.isArray(payload?.suggestions) && payload.suggestions.length > 0) {
        setSuggestions(payload.suggestions);
        setSuggestionMessage(payload.message || "Try one of these more specific searches.");
        setLoadingSuggestions(false);
        return;
      }

      clearSuggestionState();
      setLoadingSuggestions(false);
      onDiggIt(trimmedQuery);
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      clearSuggestionState();
      setLoadingSuggestions(false);
      onDiggIt(trimmedQuery);
    }
  };

  const useSuggestion = (suggestion) => {
    updateQuery(suggestion);
    setActiveSuggestion(suggestion);
    clearSuggestionState();
    onDiggIt(suggestion);
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, button { font-family: 'Inter', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .ld-h1  { animation: fadeUp .45s ease both; }
        .ld-sub { animation: fadeUp .45s .1s ease both; }
        .ld-box { animation: fadeUp .45s .2s ease both; }
        .ld-chip{ animation: fadeUp .45s .3s ease both; }
        .ld-inp::placeholder { color: rgba(255,255,255,.55); }
        .ld-btn:hover { background: #2a2a4e !important; }
        .ld-btn:active { transform: scale(.97); }
        .ld-chip-btn:hover { background: rgba(18,14,30,.88) !important; }
        .ld-clock:hover { background: #f5f5f5 !important; }
        .ld-suggestion-card:hover { background: rgba(255,255,255,.2) !important; border-color: rgba(255,255,255,.42) !important; }
        .ld-use-btn:hover { background: rgba(26,26,46,.92) !important; }
        
        @media (max-width: 768px) {
          .ld-topbar { padding: 0 16px !important; height: 60px !important; }
          .ld-hero { padding: 30px 16px 50px !important; }
          .ld-h1 { margin-bottom: 16px !important; }
          .ld-sub { margin-bottom: 32px !important; }
          .ld-box { border-radius: 12px !important; }
          .ld-inp-row { padding: 4px 6px 4px 12px !important; }
          .ld-inp { font-size: 14px !important; }
          .ld-btn { padding: 10px 16px !important; font-size: 13px !important; border-radius: 8px !important; }
          .ld-suggestion-row { flex-direction: column !important; align-items: stretch !important; }
          .ld-use-btn { width: 100% !important; justify-content: center !important; }
          .ld-chip { bottom: 12px !important; right: 12px !important; padding: 6px 10px 6px 6px !important; }
          .ld-avatar { width: 28px !important; height: 28px !important; font-size: 14px !important; }
        }

        @media (min-width: 1440px) {
          .ld-hero { padding: 100px 48px 140px !important; }
          .ld-box { max-width: 900px !important; }
          .ld-h1 { max-width: 1100px !important; }
        }

      `}</style>

      {/* ── Topbar: pure white ── */}
      <div className="ld-topbar" style={{
        height: 72, background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        display: "flex", alignItems: "center",
        padding: "0 36px", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 900, fontSize: 28, color: "#111", letterSpacing: -.5, fontStyle: "times new roman" }}>DIGGI</span>

        {user ? (
          <button className="ld-chip-btn" onClick={onProfile} style={{
            background: "#86b8eaff",
            borderRadius: 30, padding: "6px 14px 6px 6px",
            display: "flex", alignItems: "center", gap: 10,
            border: "1.5px solid #ececec",
            cursor: "pointer", transition: "background .18s, transform .1s",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4a90d9,#357abd)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#ffffffff", flexShrink: 0 }}>Liberty</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "#777", lineHeight: 1.2 }}>{user.country}</div>
            </div>
          </button>
        ) : (
          <button className="ld-clock" onClick={onProfile} style={{
            width: 42, height: 42, borderRadius: "50%",
            border: "1.5px solid #e0e0e0",
            background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "background .18s",
          }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Hero: pink → purple gradient ── */}
      <div className="ld-hero" style={{
        flex: 1,
        background: "linear-gradient(138deg,#f9ccd6 0%,#e8a0c4 14%,#cc78b8 26%,#a058c8 40%,#7840c0 54%,#5830b4 67%,#4420a0 79%,#38189a 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 24px 90px",
        position: "relative", overflow: "hidden",
      }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const t = e.dataTransfer.getData("text"); if (t) setQuery(t); }}
      >
        {/* headline */}
        <h1 className="ld-h1" style={{
          fontSize: "clamp(34px, 5.5vw, 70px)",
          fontWeight: 800, color: "#fff",
          textAlign: "center", lineHeight: 1.1,
          marginBottom: 20, maxWidth: 900, letterSpacing: -1.5,
        }}>
          Discover What's Behind The Headline
        </h1>

        {/* subtitle */}
        <p className="ld-sub" style={{
          fontSize: "clamp(13px, 1.5vw, 17px)",
          color: "rgba(255,255,255,.88)",
          textAlign: "center", lineHeight: 1.68,
          marginBottom: 44, maxWidth: 640, fontWeight: 400,
        }}>
          Diggi Is Your Smart News Companion. Search Any Text, Link, Or Image To Get Real-Time Updates And Insights From Trusted Sources.
        </p>

        {/* ── Search box ── */}
        <div className="ld-box" style={{
          width: "100%", maxWidth: 760,
          background: "rgba(255,255,255,.14)",
          borderRadius: 14,
          border: `1.5px solid rgba(255,255,255,${dragOver ? ".55" : ".32"})`,
          backdropFilter: "blur(14px)",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,.12)",
          transition: "border-color .2s",
        }}>
          {/* input row */}
          <div className="ld-inp-row" style={{ display: "flex", alignItems: "center", padding: "6px 8px 6px 22px" }}>
            <input className="ld-inp"
              value={query}
              onChange={e => {
                updateQuery(e.target.value);
                if (suggestions.length || suggestionMessage) {
                  clearSuggestionState();
                }
              }}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Enter Text Or URL / Drag  &  Drop Media"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 15, color: "rgba(255,255,255,.92)", fontWeight: 400,
              }}
            />
            {/* mic icon */}
            <div style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginRight: 6 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="9" y1="22" x2="15" y2="22" />
              </svg>
            </div>
            {/* Digg It button */}
            <button className="ld-btn" onClick={submit} style={{
              background: "#1a1a2e", color: "#fff", border: "none",
              borderRadius: 10, padding: "13px 30px",
              fontSize: 15, fontWeight: 700,
              cursor: loadingSuggestions ? "wait" : "pointer", flexShrink: 0, letterSpacing: -.2,
              opacity: loadingSuggestions ? 0.8 : 1,
              transition: "background .15s, transform .1s",
            }}>{loadingSuggestions ? "Checking..." : "Digg It"}</button>
          </div>

          {/* attachment strip */}
          <div style={{ background: "rgba(20,15,35,.55)", padding: "9px 22px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </div>
        </div>

        {(suggestionMessage || suggestions.length > 0) && (
          <div style={{
            width: "100%",
            maxWidth: 760,
            marginTop: 18,
            background: "rgba(19,12,35,.22)",
            border: "1px solid rgba(255,255,255,.22)",
            borderRadius: 16,
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 34px rgba(0,0,0,.12)",
            padding: "18px 18px 14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: suggestions.length > 0 ? 16 : 0 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,.72)", marginBottom: 6 }}>
                  Try A Specific Search
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#fff", maxWidth: 620 }}>
                  {suggestionMessage}
                </p>
              </div>
              <button
                onClick={clearSuggestionState}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,.22)",
                  color: "rgba(255,255,255,.82)",
                  borderRadius: 999,
                  padding: "7px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                Close
              </button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion}-${index}`}
                  className="ld-suggestion-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,.24)",
                    background: "rgba(255,255,255,.13)",
                    transition: "background .2s, border-color .2s"
                  }}
                >
                  <div className="ld-suggestion-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, width: "100%" }}>
                    <div style={{ color: "#fff", fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>
                      {suggestion}
                    </div>
                    <button
                      className="ld-use-btn"
                      onClick={() => useSuggestion(suggestion)}
                      style={{
                        background: activeSuggestion === suggestion ? "#2a2a4e" : "#1a1a2e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        transition: "background .15s"
                      }}
                    >
                      Use it
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
