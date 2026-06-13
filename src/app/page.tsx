"use client";

import { useState, useEffect } from "react";
import BgCanvas from "@/components/BgCanvas";
import FlatIcon from "@/components/FlatIcon";
import HackingLoader from "@/components/HackingLoader";
import ScoreRing from "@/components/ScoreRing";
import Repolytics from "@/components/Repolytics";
import CertificateModal from "@/components/CertificateModal";
import { generateMockRoast, RoastResult } from "@/utils/mockRoaster";

const LANG_COLORS = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572a5",
  Java: "#b07219", "C++": "#f34b7d", C: "#555555", "C#": "#178600",
  Go: "#00add8", Rust: "#dea584", PHP: "#4f5d95", Ruby: "#701516",
  Swift: "#f05138", Kotlin: "#a97bff", Dart: "#00b4ab", Shell: "#89e051",
  HTML: "#e34c26", CSS: "#563d7c", Vue: "#41b883", Svelte: "#ff3e00",
  Elixir: "#6e4a7e", Haskell: "#5e5086", Lua: "#000080", R: "#198ce7",
  Scala: "#dc322f", MATLAB: "#e16737",
};

function timeSince(date: Date) {
  const secs = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = [
    [31536000, "year"], [2592000, "month"], [86400, "day"],
    [3600, "hour"], [60, "minute"]
  ] as const;
  for (const [s, n] of intervals) {
    const c = Math.floor(secs / s);
    if (c >= 1) return `${c} ${n}${c > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

const getBadgeIconName = (id: string) => {
  const map: Record<string, string> = {
    commit_machine: "badge_machine",
    readme_warrior: "badge_warrior",
    open_source_explorer: "badge_explorer",
    repo_hoarder: "badge_hoarder",
    social_butterfly: "badge_social",
    lone_wolf: "badge_wolf",
    star_collector: "badge_collector",
    certified_celebrity: "badge_celebrity",
    ancient_coder: "badge_ancient",
    night_owl: "badge_owl",
    language_loyalist: "badge_loyalist",
    bug_hunter: "badge_bug",
    fresh_meat: "badge_fresh",
    ghost: "badge_ghost",
    philanthropist: "badge_philanthropist",
  };
  return map[id] || "badge_machine";
};

const BADGE_MEMES: Record<string, string> = {
  commit_machine: "/memes/commit_machine.gif",
  readme_warrior: "/memes/readme_warrior.gif",
  open_source_explorer: "/memes/open_source_explorer.gif",
  repo_hoarder: "/memes/repo_hoarder.gif",
  social_butterfly: "/memes/social_butterfly.gif",
  lone_wolf: "/memes/lone_wolf.gif",
  star_collector: "/memes/star_collector.gif",
  certified_celebrity: "/memes/certified_celebrity.gif",
  ancient_coder: "/memes/ancient_coder.gif",
  night_owl: "/memes/night_owl.gif",
  language_loyalist: "/memes/language_loyalist.gif",
  bug_hunter: "/memes/bug_hunter.gif",
  fresh_meat: "/memes/fresh_meat.gif",
  ghost: "/memes/ghost.gif",
  philanthropist: "/memes/philanthropist.gif",
};

const escapeMemegenText = (str: string): string => {
  if (!str) return "_";
  return str
    .replace(/\s+/g, "_")
    .replace(/\?/g, "~q")
    .replace(/&/g, "~a")
    .replace(/%/g, "~p")
    .replace(/#/g, "~h")
    .replace(/\//g, "~s")
    .replace(/\\/g, "~b")
    .replace(/</g, "~l")
    .replace(/>/g, "~g")
    .replace(/"/g, "''");
};

const getBadgeMemeUrl = (id: string, username: string, stats: any): string => {
  const userEsc = escapeMemegenText(`@${username}`);
  const topLang = stats?.topLang || "code";
  const langEsc = escapeMemegenText(topLang.toUpperCase());

  switch (id) {
    case "commit_machine":
      return `https://api.memegen.link/images/buzz/${userEsc}/commits_everywhere.webp`;
    case "readme_warrior":
      return `https://api.memegen.link/images/firsttry/${userEsc}/wrote_the_readme_first_try.webp`;
    case "open_source_explorer":
      return `https://api.memegen.link/images/pigeon/${userEsc}/is_this_my_contribution~q.webp`;
    case "repo_hoarder":
      return `https://api.memegen.link/images/pool/new_repos/unfinished_projects/${userEsc}.webp`;
    case "social_butterfly":
      return `https://api.memegen.link/images/friends/followers/${userEsc}/we_are_not_friends.webp`;
    case "lone_wolf":
      return `https://api.memegen.link/images/fa/${userEsc}/no_collaborators.webp`;
    case "star_collector":
      return `https://api.memegen.link/images/money/give_me/your_stars.webp`;
    case "certified_celebrity":
      return `https://api.memegen.link/images/success/${userEsc}/has_followers.webp`;
    case "ancient_coder":
      return `https://api.memegen.link/images/older/${userEsc}_on_github/it_is_an_older_code_sir.webp`;
    case "night_owl":
      return `https://api.memegen.link/images/fry/not_sure_if_coding/or_just_stuck_on_a_bug.webp`;
    case "language_loyalist":
      return `https://api.memegen.link/images/oag/i_will_never_let_you_go/${langEsc}.webp`;
    case "bug_hunter":
      return `https://api.memegen.link/images/spiderman/my_new_bug/my_old_bug.webp`;
    case "fresh_meat":
      return `https://api.memegen.link/images/harold/${userEsc}_believes/in_clean_code.webp`;
    case "ghost":
      return `https://api.memegen.link/images/gandalf/${userEsc}/no_activity_in_a_year.webp`;
    case "philanthropist":
      return `https://api.memegen.link/images/millers/${userEsc}_making_open_source/you_guys_are_getting_paid~q.webp`;
    default:
      return `/memes/${id}.gif`;
  }
};



const getLangIcon = (lang: string) => {
  if (!lang) return "code";
  const l = lang.toLowerCase().trim();
  if (l === "c++") return "cpp";
  if (l === "c#") return "csharp";
  if (l === "javascript") return "js";
  return l;
};

interface Badge {
  id: string;
  emoji: string;
  name: string;
  desc: string;
}

const getEarnedBadges = (profile: any, stats: any): Badge[] => {
  if (!profile || !stats) return [];
  
  const d = {
    public_repos: profile.public_repos || 0,
    following: profile.following || 0,
    followers: profile.followers || 0,
    _totalStars: stats.totalStars || 0,
    _undescribedRepoRatio: stats.undescribedRepoRatio || 0,
    _forkRatio: stats.forkRatio || 0,
    _accountAgeYears: stats.accountAgeYears || 0,
    _daysSinceLastPush: stats.daysSinceLastPush || 0,
    _topLang: stats.topLang || ""
  };

  const badgeDefs = [
    {
      id: "commit_machine", emoji: "⚡", name: "Commit Machine",
      desc: "Pushes code like their rent depends on it.",
      condition: () => d._totalStars > 500 || d.public_repos > 50
    },
    {
      id: "readme_warrior", emoji: "📜", name: "README Warrior",
      desc: "Actually documents things. Statistically improbable.",
      condition: () => d._undescribedRepoRatio < 0.3 && d.public_repos > 3
    },
    {
      id: "open_source_explorer", emoji: "🌍", name: "Open Source Explorer",
      desc: "Forks repos with the optimism of someone who will definitely contribute.",
      condition: () => d._forkRatio > 0.4 && d.public_repos > 5
    },
    {
      id: "repo_hoarder", emoji: "📦", name: "Repo Hoarder",
      desc: "Has more repos than completed projects. Impressive.",
      condition: () => d.public_repos > 40
    },
    {
      id: "social_butterfly", emoji: "🦋", name: "Social Butterfly",
      desc: "Follows people who do not follow back. Iconic.",
      condition: () => d.following > 100
    },
    {
      id: "lone_wolf", emoji: "🐺", name: "Lone Wolf",
      desc: "Zero collaborators. Zero followers. Maximum focus (or nobody cares).",
      condition: () => d.followers < 5 && d.public_repos > 5
    },
    {
      id: "star_collector", emoji: "⭐", name: "Star Collector",
      desc: "Somehow convinced the internet their code was worth a click.",
      condition: () => d._totalStars > 100
    },
    {
      id: "certified_celebrity", emoji: "👑", name: "Certified Celebrity",
      desc: "1000+ followers. Must be doing something right. Disgusting.",
      condition: () => d.followers >= 1000
    },
    {
      id: "ancient_coder", emoji: "🦕", name: "Ancient Coder",
      desc: "GitHub veteran. Has survived jQuery, CoffeeScript, and Grunt.",
      condition: () => d._accountAgeYears >= 8
    },
    {
      id: "night_owl", emoji: "🦉", name: "Night Owl",
      desc: "Peak productivity between midnight and 4am. A menace.",
      condition: () => {
        const hash = profile.login.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        return d.public_repos > 10 && hash % 2 === 0;
      }
    },
    {
      id: "language_loyalist", emoji: "🔑", name: "Language Loyalist",
      desc: "Has found their language soulmate and will not betray it.",
      condition: () => !!d._topLang && d.public_repos > 5
    },
    {
      id: "bug_hunter", emoji: "🐛", name: "Bug Hunter",
      desc: "Creates bugs with remarkable efficiency, then fixes some of them.",
      condition: () => d.public_repos > 8
    },
    {
      id: "fresh_meat", emoji: "🐣", name: "Fresh Meat",
      desc: "New to GitHub. Still believes in clean code. Give it time.",
      condition: () => d._accountAgeYears < 1.5
    },
    {
      id: "ghost", emoji: "👻", name: "The Ghost",
      desc: "Account exists. Repos exist. Activity: classified.",
      condition: () => d._daysSinceLastPush > 365
    },
    {
      id: "philanthropist", emoji: "💸", name: "Open Source Philanthropist",
      desc: "Gives code away for free. Baffling business model.",
      condition: () => d._totalStars > 50 && d.public_repos > 10
    },
  ];

  return badgeDefs
    .filter(b => b.condition())
    .map(b => ({ id: b.id, emoji: b.emoji, name: b.name, desc: b.desc }));
};

interface HomeProps {
  initialUsername?: string;
  initialRepo?: string;
}

export default function Home({ initialUsername = "", initialRepo = "" }: HomeProps) {
  const [username, setUsername] = useState(initialUsername);
  const [activeTheme, setActiveTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Investigation Results States
  const [profile, setProfile] = useState<any | null>(null);
  const [repoDetails, setRepoDetails] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [roast, setRoast] = useState<RoastResult | null>(null);
  const [auditType, setAuditType] = useState<"profile" | "repository">("profile");
  
  // Interactive UI States
  const [isWarrantOpen, setIsWarrantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("cc-theme") || "dark";
    setTheme(savedTheme);
  }, []);

  // Trigger automatic search on mount if initial parameters are provided (dynamic URL shortcuts)
  useEffect(() => {
    if (initialUsername) {
      runInvestigation(initialUsername, initialRepo);
    }
  }, [initialUsername, initialRepo]);

  const setTheme = (theme: string) => {
    setActiveTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cc-theme", theme);
  };

  const toggleTheme = () => {
    setTheme(activeTheme === "dark" ? "light" : "dark");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Perform forensic lookup
  const runInvestigation = async (targetUser: string, targetRepo = "") => {
    const trimmedUser = targetUser.trim().replace(/^@/, "");
    const trimmedRepo = targetRepo.trim();
    if (!trimmedUser) {
      showToast("Enter a username, genius.");
      return;
    }

    setLoading(true);
    setError(null);
    setProfile(null);
    setRepoDetails(null);
    setStats(null);
    setRoast(null);
    setIsAiLoading(false);

    try {
      // 1. Fetch GitHub metrics and initial mock roast (runs in under 1 second)
      let url = `/api/investigate?username=${encodeURIComponent(trimmedUser)}`;
      if (trimmedRepo) {
        url += `&repo=${encodeURIComponent(trimmedRepo)}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("NOT_FOUND");
        if (res.status === 429) throw new Error("RATE_LIMIT");
        throw new Error(`API_ERROR_${res.status}`);
      }

      const data = await res.json();
      setAuditType(data.type);

      if (data.type === "repository") {
        setProfile(data.user);
        setRepoDetails(data.repo);
        setRoast(data.roast);
      } else {
        setProfile(data.user);
        setStats(data.stats);
        setRoast(data.roast);
      }

      setUsername(trimmedUser);
      setLoading(false); // Hide the loading screen immediately for speed of light interaction

      // Smooth scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById("results-area");
        resultsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);

      // 2. Asynchronously request the real Forensic AI roast in the background
      setIsAiLoading(true);
      fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(async (roastRes) => {
        if (roastRes.ok) {
          const aiRoast = await roastRes.json();
          // Update the roast payload with custom AI-generated indictments
          setRoast(aiRoast);
        }
      })
      .catch((err) => {
        console.warn("Forensic AI roast failed, staying on mock indictment.", err);
      })
      .finally(() => {
        setIsAiLoading(false);
      });

    } catch (err: any) {
      setLoading(false);
      if (err.message === "NOT_FOUND") {
        if (targetRepo) {
          setError(`Repository "${targetUser}/${targetRepo}" or suspect profile not found. Did they delete the project, make it private, or mistype the name?`);
        } else {
          setError(`Suspect "@${trimmedUser}" does not exist. Either you mistyped it, they deleted their account, or this person is so underground they don't even code.`);
        }
      } else if (err.message === "RATE_LIMIT") {
        setError("GitHub's API rate limit was hit. Serverless proxies protect us, but you investigated too many suspects. Wait a moment before checking again.");
      } else {
        setError(`Investigation crashed: ${err.message || "Unknown error"}. Try again in a moment.`);
      }
    }
  };

  const copyReportToClipboard = () => {
    if (!profile || !roast) return;

    const titleStr = auditType === "repository" ? `${profile.login}/${repoDetails?.name}` : `@${profile.login}`;
    const header = `=== COMMIT CRIMES REPORT: ${titleStr} ===\n\n`;
    const text = roast.charges
      .map((c) => `[${c.charge}]\n${c.body}`)
      .join("\n\n");
    const footer = `\n\nScore: ${roast.score}/100 — Status: ${roast.verdict}\n— Generated by CommitCrimes.dev`;

    navigator.clipboard.writeText(header + text + footer)
      .then(() => showToast("📋 Indictment copied to clipboard!"))
      .catch(() => showToast("Failed to copy. Browser blocked clipboard access."));
  };

  const shareResults = () => {
    if (!profile || !roast) return;

    const shareText = `I just got roasted by Commit Crimes 🔥\n\nMy crime score: ${roast.score}/100\n\nCheck your own GitHub crimes at: `;
    const shareUrl = auditType === "repository" 
      ? `${window.location.origin}/${profile.login}/${repoDetails?.name}`
      : `${window.location.origin}/${profile.login}`;

    if (navigator.share) {
      navigator.share({
        title: "Commit Crimes Report",
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}${shareUrl}`)
        .then(() => showToast("🔗 Share link copied to clipboard!"))
        .catch(() => showToast("Failed to copy link."));
    }
  };

  const resetToHome = () => {
    setProfile(null);
    setRepoDetails(null);
    setStats(null);
    setRoast(null);
    setError(null);
    setUsername("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatAge = (age: number) => {
    return age >= 1 ? `${age.toFixed(1)}y` : `${Math.round(age * 12)}mo`;
  };

  return (
    <>
      {/* Interactive Floating Particle Canvas */}
      <BgCanvas />

      {/* Toast Notification Popups */}
      <div className={`toast ${toastMessage ? "show" : ""}`}>
        {toastMessage}
      </div>

      {/* Theme Selection Toggle */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        <span className="theme-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FlatIcon name={activeTheme === "dark" ? "sun" : "moon"} size={18} />
        </span>
      </button>

      {/* Main loading screen */}
      {loading && <HackingLoader username={username} repo={initialRepo} />}

      {/* ===================== HERO / SEARCH SECTION ===================== */}
      <section className="hero" id="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            FORENSIC DIVISION · ACTIVE
          </div>

          <h1 className="hero-title">
            <span className="title-line-1">COMMIT</span>
            <span className="title-line-2">CRIMES</span>
          </h1>

          <p className="hero-subtitle">
            Investigating suspicious GitHub activity since today.<br />
            <span className="hero-sub-small">
              No developer is innocent. Especially you.
            </span>
          </p>

          {/* Search container */}
          <div className="search-container">
            <div className="search-box">
              <span className="search-prefix">
                github.com /
              </span>
              <input
                type="text"
                placeholder="your-username-here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const parts = username.split("/");
                    if (parts.length >= 2) {
                      runInvestigation(parts[0], parts[1]);
                    } else {
                      runInvestigation(username);
                    }
                  }
                }}
                className="search-input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                maxLength={39}
              />
              <button
                onClick={() => {
                  const parts = username.split("/");
                  if (parts.length >= 2) {
                    runInvestigation(parts[0], parts[1]);
                  } else {
                    runInvestigation(username);
                  }
                }}
                className="analyze-btn flex items-center gap-1.5"
              >
                <span className="btn-text">INVESTIGATE</span>
                <span className="btn-icon" style={{ display: "flex", alignItems: "center" }}>
                  <FlatIcon name="search" size={14} />
                </span>
              </button>
            </div>
            
            <p className="search-disclaimer">Warning: Results may cause existential crisis and/or career reconsideration.</p>

            {/* Suspect Shortcuts */}
            <div className="example-users">
              <span className="example-label">Try these suspects:</span>
              {[
                { name: "torvalds", repo: "" },
                { name: "gaearon", repo: "" },
                { name: "sindresorhus", repo: "" },
                { name: "tj", repo: "" },
              ].map((suspect, idx) => (
                <button
                  key={idx}
                  onClick={() => runInvestigation(suspect.name, suspect.repo)}
                  className="example-chip"
                >
                  {suspect.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        {!profile && (
          <div className="scroll-hint visible">↓ scroll to see crimes ↓</div>
        )}
      </section>

      {/* ===================== ERROR OVERLAY ===================== */}
      {error && (
        <div className="error-overlay">
          <div className="error-card glass-card">
            <div className="error-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <FlatIcon name="alert" size={48} className="icon-glow-red" />
            </div>
            <h2 className="error-title">Crime Scene Not Found</h2>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={() => setError(null)}>
              Try Another Suspect
            </button>
          </div>
        </div>
      )}

      {/* ===================== RESULTS SCREEN AREA ===================== */}
      {profile && roast && (
        <section id="results-area" className="results-section">
          <div className="results-container">
            
            {/* profile / repository information row */}
            <div className="profile-row">
              
              {/* Profile Card Summary */}
              <div className="profile-card glass-card">
                <div className="profile-verdict-badge">
                  {auditType === "repository" ? "🔎 REPOSITORY IDENTIFIED" : "🔎 SUSPECT IDENTIFIED"}
                </div>
                
                <div className="profile-avatar-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    className="profile-avatar"
                  />
                  <div className="avatar-glow"></div>
                </div>

                <div className="profile-info">
                  <h2 className="profile-name">
                    {auditType === "repository" ? repoDetails?.name : (profile.name || profile.login)}
                  </h2>
                  <p className="profile-login">
                    {auditType === "repository" ? `${profile.login}/${repoDetails?.name}` : `@${profile.login}`}
                  </p>
                  <p className="profile-bio">
                    {auditType === "repository" 
                      ? (repoDetails?.description || "No project description provided. Unlabeled files are highly suspicious.")
                      : (profile.bio || "No profile bio provided. Highly suspicious. Refuses to explain coordinates.")
                    }
                  </p>

                  <div className="profile-tags">
                    {auditType === "repository" ? (
                      <span className="profile-tag">OWNER: @{profile.login}</span>
                    ) : (
                      <>
                        {profile.location && (
                          <span className="profile-tag">LOCATION: {profile.location}</span>
                        )}
                        {profile.company && (
                          <span className="profile-tag">COMPANY: {profile.company.replace(/^@/, "")}</span>
                        )}
                        {profile.blog && (
                          <span className="profile-tag">🔗 Has website</span>
                        )}
                        {profile.twitter_username && (
                          <span className="profile-tag">🐦 Twitter user</span>
                        )}
                      </>
                    )}
                  </div>

                  <a
                    href={auditType === "repository" ? `https://github.com/${profile.login}/${repoDetails?.name}` : `https://github.com/${profile.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    View Crime Scene on GitHub ↗
                  </a>
                </div>
              </div>

              {/* Quick stats panel */}
              <div className="quick-stats-grid">
                {auditType === "repository" ? (
                  // Stats for Repository Audit
                  [
                    { icon: "star", val: repoDetails?.stars, label: "Repo Stars" },
                    { icon: "fork", val: repoDetails?.forks, label: "Repo Forks" },
                    { icon: "hoarder", val: `${Math.round(repoDetails?.size / 1024)}MB`, label: "Project Size", isString: true },
                    { icon: "commit", val: repoDetails?.commits?.length || 30, label: "Scanned Commits" },
                    { icon: "readme", val: repoDetails?.readme ? `${repoDetails?.readme.length} B` : "None", label: "README Size", isString: true },
                    { icon: getLangIcon(repoDetails?.language), val: repoDetails?.language || "None", label: "Language", isString: true, isLang: true },
                  ].map((stat, idx) => (
                    <div key={idx} className="quick-stat glass-card">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(99,179,255,0.06)] p-1.5 flex-shrink-0">
                        <FlatIcon name={stat.icon} size={22} className="qs-icon" />
                      </div>
                      <span className={`qs-value ${stat.isLang ? "lang-val" : ""}`}>
                        {stat.isString ? stat.val : stat.val?.toLocaleString()}
                      </span>
                      <span className="qs-label">
                        {stat.label}
                      </span>
                    </div>
                  ))
                ) : (
                  // Stats for Profile Audit
                  [
                    { icon: "hoarder", val: profile.public_repos, label: "Public Repos" },
                    { icon: "star", val: stats.totalStars, label: "Total Stars" },
                    { icon: "profile", val: profile.followers, label: "Followers" },
                    { icon: "social", val: profile.following, label: "Following" },
                    { icon: "clock", val: formatAge(stats.accountAgeYears), label: "Years on GitHub", isString: true },
                    { icon: getLangIcon(stats.topLang), val: stats.topLang || "None", label: "Primary Language", isString: true, isLang: true },
                  ].map((stat, idx) => (
                    <div key={idx} className="quick-stat glass-card">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(99,179,255,0.06)] p-1.5 flex-shrink-0">
                        <FlatIcon name={stat.icon} size={22} className="qs-icon" />
                      </div>
                      <span className={`qs-value ${stat.isLang ? "lang-val" : ""}`}>
                        {stat.isString ? stat.val : stat.val?.toLocaleString()}
                      </span>
                      <span className="qs-label">
                        {stat.label}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Crime Scoring ring widget */}
            <div className="section-block">
              <div className="section-eyebrow">FORENSIC SCORING</div>
              <h2 className="section-title">The Crime Score™</h2>
              <p className="section-desc">Our patented algorithm determined your guilt with absolutely scientific precision.</p>
              
              <ScoreRing
                score={roast.score}
                verdict={roast.verdict}
                activityPercent={roast.activityPercent}
                docsPercent={roast.docsPercent}
                consistencyPercent={roast.consistencyPercent}
                popularityPercent={roast.popularityPercent}
              />
            </div>

            {/* Sarcastic Indictment charges panel */}
            <div className="section-block">
              <div className="section-eyebrow">OFFICIAL INDICTMENT</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Crime Report</h2>
                {isAiLoading && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-wider text-[var(--accent-cyan)] bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.25)] rounded-full animate-pulse" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" style={{ animation: "pulse 1.2s infinite" }} />
                    FORENSIC AI UPGRADING INDICTMENTS...
                  </span>
                )}
              </div>
              <p className="section-desc">These findings have been certified by a highly sarcastic algorithm with a law degree from StackOverflow University.</p>
              
              <div className="roast-actions">
                <button
                  onClick={copyReportToClipboard}
                  className="action-btn"
                >
                  📋 Copy Report
                </button>
                <button
                  onClick={shareResults}
                  className="action-btn"
                >
                  🔗 Share Evidence
                </button>
              </div>

              <div className="roast-list">
                {roast.charges.map((charge, idx) => (
                  <div
                    key={idx}
                    className={`roast-item ${charge.highlight ? "highlight" : ""}`}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <FlatIcon name={charge.icon} size={28} className="roast-icon" />
                    
                    <div className="roast-text">
                      <span className="roast-charge">
                        Charge #{idx + 1}: {charge.charge}
                      </span>
                      <span className="roast-body">
                        &quot;{charge.body}&quot;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badges (Dis)Honor - Only for Profiles */}
            {auditType === "profile" && (
              <div className="section-block">
                <div className="section-eyebrow">COMMENDATIONS & CONVICTIONS</div>
                <h2 className="section-title">Badges of (Dis)Honor</h2>
                <p className="section-desc">Awards that look impressive until you read what they're actually for.</p>

                <div className="badges-grid">
                  {getEarnedBadges(profile, stats).length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: ".85rem", fontStyle: "italic", gridColumn: "1/-1" }}>
                      No badges earned. This itself is an achievement of sorts.
                    </p>
                  ) : (
                    getEarnedBadges(profile, stats).map((b, i) => (
                      <div
                        key={b.id}
                        className="badge-card glass-card"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div 
                          style={{ 
                            width: "100%", 
                            height: "125px", 
                            borderRadius: "8px", 
                            overflow: "hidden", 
                            border: "1px solid var(--border-color)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#080b14"
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getBadgeMemeUrl(b.id, profile.login, stats)}
                            alt={b.name}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.src = BADGE_MEMES[b.id] || `/memes/${b.id}.gif`;
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain"
                            }}
                          />
                        </div>
                        <span className="badge-name">{b.name}</span>
                        <span className="badge-desc">{b.desc}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Repolytics commit hours graph */}
            <div className="section-block">
              <div className="section-eyebrow">FORENSIC CHRONOLOGY</div>
              <h2 className="section-title">Crime Hours Analysis</h2>
              <p className="section-desc">Our analysis of your commit timestamps reveals when you are most active (or most desperate).</p>
              
              <Repolytics commits={auditType === "repository" ? repoDetails?.commits : null} />
            </div>

            {/* Evidence Vault Top 6 repositories (Only displayed for Profile audits) */}
            {auditType === "profile" && stats && (
              <div className="section-block">
                <div className="section-eyebrow">EXHIBIT A THROUGH Z</div>
                <h2 className="section-title">The Evidence Vault</h2>
                <p className="section-desc">A curated selection of your finest alleged works, sorted by how much the internet cared (not very much).</p>
                
                <div className="repos-grid">
                  {stats.topRepos?.map((repo: any, idx: number) => {
                    const langColor = LANG_COLORS[repo.language as keyof typeof LANG_COLORS] || "#8ba3cc";
                    const updated = repo.pushed_at ? timeSince(new Date(repo.pushed_at)) : "never";
                    return (
                      <div
                        key={idx}
                        className="repo-card"
                        style={{ animationDelay: `${idx * 70}ms` }}
                      >
                        <div className="repo-header">
                          <span className="repo-icon" style={{ display: "flex", alignItems: "center" }}>
                            <FlatIcon name={repo.fork ? "fork" : "folder"} size={16} />
                          </span>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="repo-name"
                          >
                            {repo.name}
                          </a>
                        </div>

                        <p className="repo-desc">
                          {repo.description || "No description. A mystery repo. Very ominous."}
                        </p>

                        <div className="repo-meta">
                          {repo.language && (
                            <span className="repo-meta-item">
                              <span className="lang-dot" style={{ backgroundColor: langColor }}></span>
                              {repo.language}
                            </span>
                          )}
                          <span className="repo-meta-item" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <FlatIcon name="star" size={12} />
                            {(repo.stargazers_count || 0).toLocaleString()}
                          </span>
                          <span className="repo-meta-item" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <FlatIcon name="fork" size={12} />
                            {(repo.forks_count || 0).toLocaleString()}
                          </span>
                        </div>
                        <span className="repo-updated">Last updated {updated}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Final Actions Footer */}
            <div className="results-footer">
              <button className="new-search-btn" onClick={resetToHome}>
                🔄 Investigate Another Suspect
              </button>
              <button className="download-btn" onClick={() => setIsWarrantOpen(true)}>
                📸 Download Warrant
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Warrant Indictment PDF/PNG generator modal */}
      {profile && roast && (
        <CertificateModal
          isOpen={isWarrantOpen}
          onClose={() => setIsWarrantOpen(false)}
          username={profile.login}
          name={auditType === "repository" ? `${profile.login}/${repoDetails?.name}` : profile.name}
          score={roast.score}
          verdict={roast.verdict}
          topLang={auditType === "repository" ? repoDetails?.language : stats?.topLang}
          charges={roast.charges}
          avatarUrl={profile.avatar_url}
        />
      )}

      {/* Page Footer */}
      <footer className="site-footer">
        <p>Commit Crimes © {new Date().getFullYear()} · No developers were permanently harmed · Probably.</p>
        <p className="footer-sub">Uses the public GitHub API. Not affiliated with GitHub or sanity.</p>
      </footer>
    </>
  );
}
