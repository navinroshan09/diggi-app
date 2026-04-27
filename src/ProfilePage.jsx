import { useState, useRef, useEffect } from "react";

export default function ProfilePage({ user, onBack, onLogout, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mapping API keys to state with multiple fallbacks
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [photo, setPhoto] = useState("");

  const fileInputRef = useRef(null);

  // Sync state when user prop changes (e.g., after login or data fetch)
  useEffect(() => {
    if (user) {
      setName(user.fullName || user.full_name || user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || user.phoneNumber || user.phone_number || "");
      setDob(user.dateOfBirth || user.date_of_birth || user.dob || "");
      setGender(user.gender || "");
      setCountry(user.country || user.address || "");
      setPhoto(user.profile_pic || user.photo || user.profilePic || "");
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const updatedUser = {
          ...user,
          fullName: name,
          full_name: name,
          name: name,
          email,
          phone,
          dateOfBirth: dob,
          date_of_birth: dob,
          dob: dob,
          gender,
          country,
          address: country,
          profile_pic: photo,
          profilePic: photo,
          photo: photo
        };
        // If onUpdateUser prop at exists, call it to update parent state
        if (typeof onUpdateUser === "function") {
          onUpdateUser(updatedUser);
        }
        setIsEditing(false);
        setLoading(false);
      }, 800);
    } else {
      setIsEditing(true);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    // Reset to current user values using the same multi-key logic
    if (user) {
      setName(user.fullName || user.full_name || user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || user.phoneNumber || user.phone_number || "");
      setDob(user.dateOfBirth || user.date_of_birth || user.dob || "");
      setGender(user.gender || "");
      setCountry(user.country || user.address || "");
      setPhoto(user.profile_pic || user.photo || user.profilePic || "");
    }
    setIsEditing(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      /* matches screenshot: pink/blue/grey pastel gradient */
      background: "linear-gradient(145deg,#d8e0ec 0%,#caced8 25%,#b8bdc8 48%,#c4bece 68%,#cec4d8 85%,#d4bcd4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, button { font-family: 'Inter', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .pf-card  { animation: fadeUp .42s ease both; }
        .pf-row:hover { background: #f5f6f8 !important; }
        .pf-back:hover { background: rgba(255,255,255,.9) !important; }
        .pf-logout:hover { background: #2a2a4a !important; }
        .pf-upgrade:hover { background: #fff !important; color: #1e2a3a !important; }
        .pf-footer-link:hover { text-decoration: underline; cursor: pointer; }
        
        .edit-input, .edit-select {
          background: rgba(255, 255, 255, 0.8);
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 12px;
          width: 100%;
          font-size: 14px;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .edit-input:focus, .edit-select:focus { 
          border-color: #4a90d9;
          box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.1);
        }
        .edit-label {
          font-size: 11px;
          font-weight: 700;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          display: block;
        }

        @media (max-width: 768px) {
          .pf-card { padding: 24px 20px 20px !important; border-radius: 18px !important; }
          .pf-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .pf-footer-box { flex-direction: column !important; padding: 12px 20px !important; border-radius: 18px !important; }
          .pf-footer-sep { display: none !important; }
          .pf-footer-link { padding: 8px 0 !important; width: 100%; text-align: center; }
          .pf-back { top: 12px !important; left: 12px !important; width: 38px !important; height: 38px !important; }
          .pf-title { font-size: 18px !important; margin-bottom: 20px !important; }
        }

        @media (min-width: 1440px) {
          .pf-card { max-width: 1000px !important; padding: 50px 60px !important; }
          .pf-grid { gap: 24px !important; }
        }
      `}</style>

      {/* ── Professional Back Button ── */}
      <button
        className="pf-back"
        onClick={onBack}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          zIndex: 50,
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* full arrow (line + head) */}
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* ── Main card ── */}
      <div className="pf-card" style={{
        width: "100%", maxWidth: 880,
        background: "rgba(175,180,190,.62)",
        backdropFilter: "blur(18px)",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,.42)",
        padding: "34px 38px 30px",
        boxShadow: "0 22px 64px rgba(0,0,0,.13)",
      }}>
        <h1 className="pf-title" style={{
          textAlign: "center", fontSize: 22, fontWeight: 700,
          color: "#1a1a2e", fontFamily: "'DM Mono', monospace",
          marginBottom: 30, letterSpacing: -.3,
        }}>
          Profile &amp; Settings
        </h1>

        <div className="pf-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 30 }}>
          {/* ══ Left: user info / main profile ══ */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "26px", boxShadow: "0 2px 20px rgba(0,0,0,.08)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 26 }}>
              <div
                onClick={() => isEditing && fileInputRef.current?.click()}
                style={{
                  width: 70, height: 70, borderRadius: "50%",
                  background: (photo && (photo.startsWith("data:") || photo.startsWith("http"))) ? `url(${photo}) center/cover no-repeat` : "#edf2f7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, flexShrink: 0, cursor: isEditing ? "pointer" : "default",
                  position: "relative", overflow: "hidden",
                  border: "2px solid #e2e8f0"
                }}
              >
                {!(photo && (photo.startsWith("data:") || photo.startsWith("http"))) && "👤"}
                {isEditing && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,.4)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff"
                  }}>
                    📷
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoChange} />

              <div style={{ flex: 1, paddingTop: 4 }}>
                {isEditing ? (
                  <div>
                    <label className="edit-label">Full Name</label>
                    <input className="edit-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2 }}>{name || "User Name"}</div>
                    <div style={{ fontSize: 13, color: "#718096", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {country || "Unspecified Country"}
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={handleEditToggle} disabled={loading} style={{
                  background: isEditing ? "#1a1a2e" : "#f4f6fa",
                  border: "none",
                  borderRadius: 20, padding: "8px 18px",
                  fontSize: 13, fontWeight: 700, color: isEditing ? "#fff" : "#3a3a4a",
                  cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s", opacity: loading ? 0.7 : 1
                }}>
                  {loading ? "..." : isEditing ? "Save" : "Edit"}
                </button>
                {isEditing && (
                  <button onClick={handleCancel} style={{
                    background: "#fef2f2",
                    border: "none",
                    borderRadius: 20, padding: "8px 18px",
                    fontSize: 13, fontWeight: 700, color: "#991b1b",
                    cursor: "pointer", transition: "all 0.2s"
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 16px" }}>
              <div>
                <label className="edit-label">Email Address</label>
                {isEditing ? (
                  <input className="edit-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{email || "—"}</div>
                )}
              </div>

              <div>
                <label className="edit-label">Phone Number</label>
                {isEditing ? (
                  <input className="edit-input" value={phone} onChange={e => setPhone(e.target.value)} />
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{phone || "—"}</div>
                )}
              </div>

              <div>
                <label className="edit-label">Date of Birth</label>
                {isEditing ? (
                  <input className="edit-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{dob || "—"}</div>
                )}
              </div>

              <div>
                <label className="edit-label">Gender</label>
                {isEditing ? (
                  <select className="edit-select" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", textTransform: "capitalize" }}>{gender || "—"}</div>
                )}
              </div>

              {isEditing && (
                <div style={{ gridColumn: "span 2" }}>
                  <label className="edit-label">Country</label>
                  <select className="edit-select" value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
              <button className="pf-logout" onClick={onLogout} style={{
                background: "#1a1a2e", color: "#fff", border: "none",
                borderRadius: 24, padding: "10px 22px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                transition: "background .18s",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout Account
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
              <button className="pf-row" style={{ width: "100%", display: "flex", alignItems: "center", padding: "17px 20px", background: "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #f0f0f0", transition: "background .15s" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", flex: 1, textAlign: "left" }}>Dig History</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 8 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>

              <button className="pf-row" style={{ width: "100%", display: "flex", alignItems: "center", padding: "17px 20px", background: "transparent", border: "none", cursor: "pointer", transition: "background .15s" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#e53e3e", flex: 1, textAlign: "left" }}>Delete Dig History</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" /><path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>

            <div style={{ background: "#1e2a3a", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 16px rgba(0,0,0,.14)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#00c896", marginBottom: 12, letterSpacing: .3 }}>Your Subscription</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 5, lineHeight: 1.2 }}>You're a normal User</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>you only have limited access</div>
                </div>
                <button className="pf-upgrade" style={{
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,.85)",
                  borderRadius: 24, padding: "11px 20px",
                  fontSize: 13, fontWeight: 700, color: "#fff",
                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  transition: "background .18s, color .18s",
                }}>
                  Upgrade Pro now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="pf-footer-box" style={{ background: "#1a1a2e", borderRadius: 32, padding: "12px 0", display: "flex", alignItems: "center" }}>
            {["Customer Support", "Privacy Polices", "About Us"].map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <span className="pf-footer-link" style={{ fontSize: 13, color: "rgba(255,255,255,.75)", padding: "0 22px", fontWeight: 400 }}>{label}</span>
                {i < 2 && <div className="pf-footer-sep" style={{ width: 1, height: 15, background: "rgba(255,255,255,.22)" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
