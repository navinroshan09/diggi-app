// ============================================================
// DIGGT — App.jsx  (Root)
// Wires all 5 screens.
//
// Navigation flow:
//   LoginPage
//     └─► LandingPage
//           ├─► MobileNewsPage  (click "Digg It" in hero search)
//           └─► ProfilePage     (click user chip / clock icon)
//
//   DashboardPage  (only reached when clicking "Digg it" in
//                   the dashboard sub-bar — opens LandingPage
//                   for a new search)
//     ├─► LandingPage  (← New Digg)
//     └─► ProfilePage  (clock icon)
//
// Note: DashboardPage is the "full desktop" result view.
//       MobileNewsPage is the result view from the landing search.
//       Both show the same AI content but different layouts.
// ============================================================

import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import MobileNewsPage from "./MobileNewsPage";
import DashboardPage from "./DashboardPage";
import ProfilePage from "./ProfilePage";

/**
 * Custom hook to detect if the user is on a mobile device
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [landingQuery, setLandingQuery] = useState("");
  const [prev, setPrev] = useState("landing");

  const isMobile = useIsMobile();
  const normalizeUser = (u) => {
    if (!u) return null;
    return {
      ...u,
      name: u.name || u.full_name || u.fullName || "",
      full_name: u.full_name || u.fullName || u.name || "",
      fullName: u.fullName || u.full_name || u.name || "",
      profile_pic: u.profile_pic || u.profilePic || u.photo || "",
    };
  };

  // ── Hash-based Routing (Direct Links) ──
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace("#", "");
      if (["login", "landing", "dashboard", "profile"].includes(h)) {
        setScreen(h);
      }
    };
    handleHash(); // on mount
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Dynamic screen switching for results
  useEffect(() => {
    if (screen === "mobile-news" && !isMobile) setScreen("dashboard");
    if (screen === "dashboard" && isMobile) setScreen("mobile-news");
  }, [isMobile, screen]);

  const go = (s) => { setPrev(screen); setScreen(s); };

  // Helper to resolve the correct result screen based on device
  const goToResults = (q) => {
    setQuery(q);
    setLandingQuery(q);
    go(isMobile ? "mobile-news" : "dashboard");
  };

  return (
    <>
      {/* 1. Login */}
      {screen === "login" && (
        <LoginPage
          onLogin={u => {
            setUser(normalizeUser(u));
            go("landing");
          }}
        />
      )}

      {/* 2. Landing — hero search page */}
      {screen === "landing" && (
        <LandingPage
          user={user}
          initialQuery={landingQuery}
          onQueryChange={setLandingQuery}
          onDiggIt={q => goToResults(q)}
          onProfile={() => go("profile")}
        />
      )}

      {/* 3. Mobile news result — after searching from landing */}
      {screen === "mobile-news" && (
        <MobileNewsPage
          query={query}
          onBack={() => go("dashboard")}
        />
      )}

      {/* 4. Dashboard — full desktop news analysis */}
      {screen === "dashboard" && (
        <DashboardPage
          initialQuery={query}
          onNewDigg={() => { setLandingQuery(""); go("landing"); }}
          onProfile={() => go("profile")}
          onSearchPage={q => { setLandingQuery(q); setQuery(q); go("landing"); }}
        />
      )}

      {/* 5. Profile & Settings */}
      {screen === "profile" && (
        <ProfilePage
          user={user}
          onUpdateUser={u => setUser(normalizeUser(u))}
          onBack={() => go(prev === "profile" ? "landing" : prev)}
          onLogout={() => { setUser(null); setQuery(""); setLandingQuery(""); go("login"); }}
        />
      )}
    </>
  );
}
