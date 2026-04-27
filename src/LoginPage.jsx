// ============================================================
// DIGGT — LoginPage.jsx
// Gradient auth screen matching the DIGGT pink/purple brand
// Props: onLogin(user) — called after successful sign-in
// ============================================================

import { useState } from "react";
import { fetchUserProfile, loginUser, registerUser } from "./api";

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");   // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [name, setName] = useState("");
  const [phone, setphone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [pfp, setPfp] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }

    if (tab === "signup") {
      if (!name || !phone || !dob || !gender || !country) { setError("Please fill in all required fields."); return; }
      if (password !== confPass) { setError("Passwords do not match."); return; }
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await loginUser(email, password);
      } else {
        await registerUser({
          full_name: name,
          email,
          password,
          confirm_password: confPass,
          phone,
          date_of_birth: dob,
          gender,
          country,
          profile_pic: pfp ? pfp.name : "", // Sending filename or empty string as placeholder
        });
      }

      const profile = await fetchUserProfile(email);
      onLogin(profile.data);
    } catch (err) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(140deg,#f9ccd6 0%,#e8a0c4 15%,#cc78b8 28%,#a058c8 42%,#7840c0 55%,#5830b4 68%,#4420a0 80%,#38189a 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, button { font-family: 'Inter', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .lg-card  { animation: fadeUp .45s ease both; }
        .lg-input { transition: border-color .2s, box-shadow .2s; }
        .lg-input:focus { border-color: rgba(255,255,255,.65) !important; box-shadow: 0 0 0 3px rgba(255,255,255,.12) !important; outline: none; }
        .lg-input::placeholder { color: rgba(255,255,255,.42); }
        .lg-tab:hover  { background: rgba(255,255,255,.15) !important; }
        .lg-social:hover { background: rgba(255,255,255,.2) !important; }
        .lg-submit:hover { opacity: .9 !important; transform: translateY(-1px); }
        .lg-submit:active { transform: translateY(0) !important; }
        
        @media (max-width: 500px) {
          .lg-card { padding: 24px 20px !important; border-radius: 18px !important; }
          .lg-submit { padding: 12px !important; font-size: 13px !important; }
          .lg-input { padding: 10px 14px !important; font-size: 13px !important; }
          .lg-logo-text { font-size: 32px !important; }
        }

        @media (min-width: 1200px) {
          .lg-card { max-width: 460px !important; padding: 40px 34px !important; }
        }

      `}</style>

      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <div className="lg-logo-text" style={{ fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: -1, lineHeight: 1 }}>DIGGI</div>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, marginTop: 6 }}>Your Smart News Companion</p>
      </div>


      {/* ── Card ── */}
      <div className="lg-card" style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,.13)",
        backdropFilter: "blur(22px)",
        borderRadius: 22,
        border: "1.5px solid rgba(255,255,255,.28)",
        padding: "32px 28px",
        boxShadow: "0 28px 72px rgba(0,0,0,.25)",
      }}>
        {/* tabs */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 8 }}>
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", textAlign: "center" }}>
            {tab === "login" ? "Log in to your account to continue" : "Join us and start your journey"}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* name (signup only) */}
          {tab === "signup" && (
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Full Name</label>
              <input className="lg-input" value={name} onChange={e => setName(e.target.value)} placeholder="Michael Jackson"
                style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "12px 15px", fontSize: 14, color: "#fff" }} />
            </div>
          )}
          {/* phone */}
          {tab === "signup" && (
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Phone</label>
              <input className="lg-input" value={phone} onChange={e => setphone(e.target.value)} placeholder="1234567890"
                style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "12px 15px", fontSize: 14, color: "#fff" }} />
            </div>
          )}

          {/* DOB & Gender */}
          {tab === "signup" && (
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Date of Birth</label>
                <input className="lg-input" type="date" value={dob} onChange={e => setDob(e.target.value)}
                  style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "11px 15px", fontSize: 14, color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Gender</label>
                <select className="lg-input" value={gender} onChange={e => setGender(e.target.value)}
                  style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "12px 15px", fontSize: 14, color: "#fff", appearance: "none" }}>
                  <option value="" disabled style={{ color: "#000" }}>Select</option>
                  <option value="male" style={{ color: "#000" }}>Male</option>
                  <option value="female" style={{ color: "#000" }}>Female</option>
                  <option value="other" style={{ color: "#000" }}>Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Country */}
          {tab === "signup" && (
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Country</label>
              <select className="lg-input" value={country} onChange={e => setCountry(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "12px 15px", fontSize: 14, color: "#fff", appearance: "none" }}>
                <option value="" disabled style={{ color: "#000" }}>Select Country</option>
                <option value="India" style={{ color: "#000" }}>India</option>
                <option value="USA" style={{ color: "#000" }}>United States</option>
                <option value="UK" style={{ color: "#000" }}>United Kingdom</option>
                <option value="Canada" style={{ color: "#000" }}>Canada</option>
                <option value="Australia" style={{ color: "#000" }}>Australia</option>
                <option value="Germany" style={{ color: "#000" }}>Germany</option>
                <option value="France" style={{ color: "#000" }}>France</option>
              </select>
            </div>
          )}

          {/* Profile pic */}
          {tab === "signup" && (
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Profile pic (Optional)</label>
              <div style={{ position: "relative", overflow: "hidden" }}>
                <button className="lg-social" style={{ width: "100%", padding: "11px", fontSize: 12, background: "rgba(255,255,255,.1)", border: "1.5px dashed rgba(255,255,255,.3)", borderRadius: 11, color: "rgba(255,255,255,.7)" }}>
                  {pfp ? "Chosen ✓" : "Upload Image"}
                </button>
                <input type="file" accept="image/*" onChange={e => setPfp(e.target.files[0])}
                  style={{ position: "absolute", top: 0, left: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
              </div>
            </div>
          )}

          {/* email */}
          <div>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
            <input className="lg-input" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Email Address"
              style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "12px 15px", fontSize: 14, color: "#fff" }} />
          </div>

          {/* password */}
          <div>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password</label>
            <input className="lg-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPass(e.target.value)} placeholder="••••••••"
              style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "12px 15px", fontSize: 14, color: "#fff" }} />
          </div>

          {/* confirm password */}
          {tab === "signup" && (
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,.62)", letterSpacing: .8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Confirm Password</label>
              <input className="lg-input" type={showPw ? "text" : "password"} value={confPass} onChange={e => setConfPass(e.target.value)} placeholder="••••••••"
                style={{ width: "100%", background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 11, padding: "12px 15px", fontSize: 14, color: "#fff" }} />
            </div>
          )}

          {/* forgot */}
          {tab === "login" && (
            <div style={{ textAlign: "right", marginTop: -6 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)", cursor: "pointer" }}>Forgot password?</span>
            </div>
          )}

          {/* error */}
          {error && (
            <div style={{ background: "rgba(220,53,53,.2)", border: "1px solid rgba(220,53,53,.4)", borderRadius: 9, padding: "9px 14px", fontSize: 12, color: "#fca5a5" }}>{error}</div>
          )}

          {/* submit */}
          <button className="lg-submit" onClick={submit} disabled={loading} style={{
            width: "100%", padding: "14px", marginTop: 4,
            background: "#1a1a2e", border: "none", borderRadius: 11,
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? .7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            transition: "opacity .2s, transform .15s",
          }}>
            {loading
              ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} /> Signing in…</>
              : tab === "login" ? "Login →" : "Create Account →"
            }
          </button>

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.15)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.15)" }} />
          </div>

          {/* social */}
          <div style={{ display: "flex", gap: 10 }}>
            {["Google Login"].map(p => (
              <button key={p} className="lg-social" style={{
                flex: 1, padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                background: "rgba(255,255,255,.12)",
                border: "1.5px solid rgba(255,255,255,.22)",
                borderRadius: 11, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "background .18s",
              }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.7 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.3 0-11.57-4.2-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                {p}
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
              {tab === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }}
                style={{
                  background: "none", border: "none", color: "#fff", fontWeight: 700,
                  cursor: "pointer", padding: 0, textDecoration: "underline"
                }}
              >
                {tab === "login" ? "Sign up" : "Log in"}
              </button>
            </span>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 22, fontSize: 12, color: "rgba(255,255,255,.3)" }}>© 2026 DIGGT · All rights reserved</p>
    </div>
  );
}
