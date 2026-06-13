/* ============================================================
   COMMIT CRIMES — script.js
   Forensic GitHub profiler with maximum sarcasm.
   ============================================================ */

"use strict";

/* ============================================================
   CONSTANTS & CONFIG
   ============================================================ */

const GITHUB_API = "https://api.github.com";

// Language dot colours (subset, good enough for most devs)
const LANG_COLORS = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572a5",
  Java: "#b07219", "C++": "#f34b7d", C: "#555555", "C#": "#178600",
  Go: "#00add8", Rust: "#dea584", PHP: "#4f5d95", Ruby: "#701516",
  Swift: "#f05138", Kotlin: "#a97bff", Dart: "#00b4ab", Shell: "#89e051",
  HTML: "#e34c26", CSS: "#563d7c", Vue: "#41b883", Svelte: "#ff3e00",
  Elixir: "#6e4a7e", Haskell: "#5e5086", Lua: "#000080", R: "#198ce7",
  Scala: "#dc322f", MATLAB: "#e16737",
};

// Roast templates keyed by category. Each roast is a function(data) → {charge, body}
const ROAST_TEMPLATES = [

  // Repo count
  data => data.public_repos > 100 && {
    icon: "🏗️",
    charge: "SERIAL REPOSITORY CREATION",
    body: `${data.public_repos} public repositories. Congratulations, you've mistaken GitHub for a digital hoarding platform. Marie Kondo would weep. Do any of these repos spark joy? Because based on the star counts, they don't spark much for anyone else either.`,
    highlight: true
  },
  data => data.public_repos < 5 && data.public_repos > 0 && {
    icon: "🕸️",
    charge: "CRIMINAL UNDERACTIVITY",
    body: `Only ${data.public_repos} repos? Either you're a deeply private person or you haven't figured out how Git works yet. Both are equally concerning. Have you considered a career in… not software development?`
  },
  data => data.public_repos === 0 && {
    icon: "🚨",
    charge: "COMPLETE ABSENCE OF EFFORT",
    body: `Zero. Public. Repos. You created an account, stared at the empty dashboard, and apparently gave up. Inspiring stuff. You're like someone who bought a gym membership and uses it as a coaster for their pizza box.`,
    highlight: true
  },

  // Stars
  data => data._totalStars > 10000 && {
    icon: "⭐",
    charge: "SUSPICIOUS POPULARITY",
    body: `${data._totalStars.toLocaleString()} total stars? Okay fine, you're actually good. We hate you for it. This report will focus mostly on your personality instead.`
  },
  data => data._totalStars === 0 && data.public_repos > 3 && {
    icon: "💀",
    charge: "ZERO CONFIRMED FANS",
    body: `Not a single star across all ${data.public_repos} repos. Not even a pity star from a bot. Not even your mom starred your repos — and she doesn't even know what GitHub is. Truly remarkable in the saddest way possible.`,
    highlight: true
  },
  data => data._totalStars > 0 && data._totalStars <= 10 && data.public_repos > 5 && {
    icon: "📉",
    charge: "NEGLIGIBLE CULTURAL IMPACT",
    body: `${data._totalStars} stars across ${data.public_repos} repos. Your work has the cultural impact of a fortune cookie — technically a message exists, but nobody really cares what it says.`
  },

  // Followers/Following ratio
  data => data.following > data.followers * 4 && data.following > 10 && {
    icon: "👀",
    charge: "DESPERATE FOLLOW STRATEGY",
    body: `Following ${data.following} people but only ${data.followers} follow back. The classic follow-for-follow pipeline. Real talk: these people you're following? They don't know you exist. This is just mutual parasocialism on a platform for code.`,
    highlight: true
  },
  data => data.followers > data.following * 10 && data.followers > 100 && {
    icon: "👑",
    charge: "SUSPICIOUS CELEBRITY STATUS",
    body: `${data.followers} followers and only following ${data.following}. Look who decided they're better than everyone. The audacity. The nerve. The… okay fine, you've earned it. We still don't like you though.`
  },
  data => data.followers === 0 && {
    icon: "🏜️",
    charge: "ABSOLUTE SOCIAL VOID",
    body: `Zero followers. Not one person looked at your profile and thought "yes, I want updates from this human." This would be sad if it weren't so profoundly relatable for the rest of us at 2am on a Tuesday.`
  },

  // Bio
  data => !data.bio && {
    icon: "🤐",
    charge: "BIO NEGLIGENCE",
    body: `No bio. Nothing. Not even a fun fact. Not even "just here for the code" (the most dishonest thing a developer can write). You are a mystery wrapped in an avatar, and that mystery is probably "actively procrastinating."`
  },

  // Account age
  data => data._accountAgeYears >= 10 && {
    icon: "🦕",
    charge: "PREHISTORIC ACTIVITY",
    body: `Account created ${data._accountAgeYears} years ago. You've been here since GitHub was essentially a nerd LiveJournal. And yet… here we are. Have you considered whether this has all been worth it?`
  },
  data => data._accountAgeYears <= 1 && {
    icon: "🐣",
    charge: "ALARMING FRESHNESS",
    body: `Account only ${Math.round(data._accountAgeYears * 12)} months old. Still a child. Still naive. Still believing open source will save the world. Cherish this time. The cynicism is coming.`
  },

  // Language addiction
  data => data._topLang === "JavaScript" && {
    icon: "⚠️",
    charge: "JAVASCRIPT DEPENDENCY",
    body: `Your most used language is JavaScript. You are part of the reason the internet is the way it is. Every undefined is not a function error, every npm install that breaks the internet — that's on people like you. We have brochures for TypeScript if you're ready.`,
    highlight: true
  },
  data => data._topLang === "Python" && data.public_repos > 5 && {
    icon: "🐍",
    charge: "SNAKE CHARMING",
    body: `Python is your weapon of choice. Let me guess: you have at least two abandoned machine learning projects, a webscraper you used once, and a file called "data_analysis_final_FINAL_v3.py". You indented your way right into this report.`
  },
  data => data._topLang === "PHP" && {
    icon: "💀",
    charge: "PHP IN THE YEAR OF OUR LORD",
    body: `PHP. In this economy. In this decade. We're not going to pile on — a thousand Stack Overflow posts have already done that. We will simply note your bravery and move on in silence.`,
    highlight: true
  },
  data => data._topLang === "Java" && {
    icon: "☕",
    charge: "ENTERPRISE Stockholm SYNDROME",
    body: `Java is your top language. You're the kind of developer who creates an AbstractBeanFactoryManagerServiceLocator to solve a problem that required three lines of Python. God bless you and your verbose, type-safe soul.`
  },
  data => data._topLang === "TypeScript" && {
    icon: "🔧",
    charge: "TYPE SAFETY OBSESSION",
    body: `TypeScript devotee detected. You spend more time arguing about types than actually shipping features. Your PRs are 400 lines of type definitions and 3 lines of business logic. And somehow, you're still smug about it. Rightfully so, but still.`
  },
  data => data._topLang === "Rust" && {
    icon: "🦀",
    charge: "MEMORY SAFETY EVANGELIST",
    body: `Rust is your main language. You've mentioned "the borrow checker" in casual conversation at least once. You rewrote something that worked perfectly in C in Rust "for safety." You are insufferable at parties. We respect you completely.`
  },

  // Stale/no activity
  data => data._daysSinceLastPush > 365 && {
    icon: "🕰️",
    charge: "CODE ABANDONMENT FELONY",
    body: `Your last repository push was over ${Math.round(data._daysSinceLastPush / 30)} months ago. Your repos are essentially digital fossils at this point. Paleontologists would find them interesting. Hiring managers would not.`,
    highlight: true
  },
  data => data._daysSinceLastPush > 180 && data._daysSinceLastPush <= 365 && {
    icon: "💤",
    charge: "EXTENDED HIBERNATION",
    body: `${Math.round(data._daysSinceLastPush / 30)} months since your last push. You're not gone, but you're not exactly… present. Your GitHub is the digital equivalent of a gym membership you keep meaning to use.`
  },

  // Repos without description
  data => data._undescribedRepoRatio > 0.7 && data.public_repos > 4 && {
    icon: "📋",
    charge: "DOCUMENTATION CRIMES",
    body: `Over ${Math.round(data._undescribedRepoRatio * 100)}% of your repos have no description. What are they? What do they do? Nobody knows, including presumably you. This is the coding equivalent of keeping mystery leftovers in the fridge for 3 weeks.`
  },

  // Fork hoarder
  data => data._forkRatio > 0.6 && data.public_repos > 5 && {
    icon: "🍴",
    charge: "FORK HOARDING",
    body: `${Math.round(data._forkRatio * 100)}% of your repos are forks. You don't write code, you collect it. Your GitHub is a museum of other people's ideas that you pinky-promised yourself you'd contribute to. You did not contribute to them.`
  },

  // Generic catch-alls
  () => ({
    icon: "🎭",
    charge: "GENERAL DEVELOPER CRIMES",
    body: `Your commit messages are either "fix", "WIP", "asdf", or a 47-word manifesto about why you refactored the refactor. There is no in-between. We've seen your kind before.`
  }),
  () => ({
    icon: "🌙",
    charge: "SUSPICIOUSLY NOCTURNAL ACTIVITY",
    body: `GitHub's audit logs show a suspicious pattern of 2am commit sprees followed by complete silence for two weeks. Classic. You're not a developer — you're a chaos goblin with an internet connection and a text editor.`
  }),
  () => ({
    icon: "🤡",
    charge: "ASPIRATIONAL README WRITING",
    body: `Your READMEs say "Coming soon" and "TODO: add documentation" as if those are destinations you plan to visit. Spoiler: you will not. The README will remain a monument to your optimism. A beautiful, unfinished monument.`
  }),
  data => data.public_repos > 10 && {
    icon: "🏚️",
    charge: "ABANDONED PROJECT CEMETERY",
    body: `Somewhere in your ${data.public_repos} repos are at least 6 projects you started with the energy of a caffeinated golden retriever and abandoned within 11 days. They sit there, half-built, judging you every time you log in.`
  },
];

/* ============================================================
   BADGE DEFINITIONS
   Each badge: { id, emoji, name, desc, condition(data) }
   ============================================================ */
const BADGE_DEFS = [
  {
    id: "commit_machine", emoji: "⚡", name: "Commit Machine",
    desc: "Pushes code like their rent depends on it.",
    condition: d => d._totalStars > 500 || d.public_repos > 50
  },
  {
    id: "readme_warrior", emoji: "📜", name: "README Warrior",
    desc: "Actually documents things. Statistically improbable.",
    condition: d => d._undescribedRepoRatio < 0.3 && d.public_repos > 3
  },
  {
    id: "open_source_explorer", emoji: "🌍", name: "Open Source Explorer",
    desc: "Forks repos with the optimism of someone who will definitely contribute.",
    condition: d => d._forkRatio > 0.4 && d.public_repos > 5
  },
  {
    id: "repo_hoarder", emoji: "📦", name: "Repo Hoarder",
    desc: "Has more repos than completed projects. Impressive.",
    condition: d => d.public_repos > 40
  },
  {
    id: "social_butterfly", emoji: "🦋", name: "Social Butterfly",
    desc: "Follows people who do not follow back. Iconic.",
    condition: d => d.following > 100
  },
  {
    id: "lone_wolf", emoji: "🐺", name: "Lone Wolf",
    desc: "Zero collaborators. Zero followers. Maximum focus (or nobody cares).",
    condition: d => d.followers < 5 && d.public_repos > 5
  },
  {
    id: "star_collector", emoji: "⭐", name: "Star Collector",
    desc: "Somehow convinced the internet their code was worth a click.",
    condition: d => d._totalStars > 100
  },
  {
    id: "certified_celebrity", emoji: "👑", name: "Certified Celebrity",
    desc: "1000+ followers. Must be doing something right. Disgusting.",
    condition: d => d.followers >= 1000
  },
  {
    id: "ancient_coder", emoji: "🦕", name: "Ancient Coder",
    desc: "GitHub veteran. Has survived jQuery, CoffeeScript, and Grunt.",
    condition: d => d._accountAgeYears >= 8
  },
  {
    id: "night_owl", emoji: "🦉", name: "Night Owl",
    desc: "Peak productivity between midnight and 4am. A menace.",
    condition: d => d.public_repos > 10 && Math.random() > 0.4
  },
  {
    id: "language_loyalist", emoji: "🔑", name: "Language Loyalist",
    desc: "Has found their language soulmate and will not betray it.",
    condition: d => d._topLang && d.public_repos > 5
  },
  {
    id: "bug_hunter", emoji: "🐛", name: "Bug Hunter",
    desc: "Creates bugs with remarkable efficiency, then fixes some of them.",
    condition: d => d.public_repos > 8
  },
  {
    id: "fresh_meat", emoji: "🐣", name: "Fresh Meat",
    desc: "New to GitHub. Still believes in clean code. Give it time.",
    condition: d => d._accountAgeYears < 1.5
  },
  {
    id: "ghost", emoji: "👻", name: "The Ghost",
    desc: "Account exists. Repos exist. Activity: classified.",
    condition: d => d._daysSinceLastPush > 365
  },
  {
    id: "philanthropist", emoji: "💸", name: "Open Source Philanthropist",
    desc: "Gives code away for free. Baffling business model.",
    condition: d => d._totalStars > 50 && d.public_repos > 10
  },
];

/* ============================================================
   STATE
   ============================================================ */
let currentData = null;     // Processed profile data object
let currentRoasts = [];     // Generated roast objects for current profile
let bgAnimFrame = null;     // requestAnimationFrame handle for canvas

/* ============================================================
   DOM HELPERS
   ============================================================ */
const $ = id => document.getElementById(id);

function showEl(id)  { const el = $(id); if (el) el.hidden = false; }
function hideEl(id)  { const el = $(id); if (el) el.hidden = true; }

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

/** Count-up animation for a numeric DOM element */
function countUp(el, target, duration = 1200) {
  const start = performance.now();
  const isFloat = !Number.isInteger(target);
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;
    el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/** Show a brief toast message */
function showToast(msg, duration = 2800) {
  const toast = $("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* ============================================================
   BACKGROUND CANVAS (animated grid particles)
   ============================================================ */
function initCanvas() {
  const canvas = $("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles;

  const isDark = () => document.documentElement.getAttribute("data-theme") !== "light";

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const dark = isDark();
    const particleColor = dark ? "0, 212, 255" : "60, 100, 200";

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${particleColor}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    bgAnimFrame = requestAnimationFrame(draw);
  }

  resize();
  spawnParticles();
  draw();
  window.addEventListener("resize", () => { resize(); spawnParticles(); });
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function initTheme() {
  const btn = $("themeToggle");
  const icon = btn.querySelector(".theme-icon");
  const saved = localStorage.getItem("cc-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  icon.textContent = saved === "dark" ? "☀️" : "🌙";

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    icon.textContent = next === "dark" ? "☀️" : "🌙";
    localStorage.setItem("cc-theme", next);
  });
}

/* ============================================================
   GITHUB API FETCHING
   ============================================================ */

/** Fetch JSON from GitHub API, throws on error */
async function ghFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: "application/vnd.github+json" }
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("NOT_FOUND");
    if (res.status === 403) throw new Error("RATE_LIMIT");
    throw new Error(`API_ERROR_${res.status}`);
  }
  return res.json();
}

/** Fetch up to maxPages pages of repos (100 per page) */
async function fetchAllRepos(username, maxPages = 3) {
  const all = [];
  for (let page = 1; page <= maxPages; page++) {
    const repos = await ghFetch(`/users/${username}/repos?per_page=100&sort=pushed&page=${page}`);
    all.push(...repos);
    if (repos.length < 100) break;
  }
  return all;
}

/* ============================================================
   DATA PROCESSING
   ============================================================ */

/** Aggregate all the interesting metrics from raw API data */
function processProfile(user, repos) {
  const now = new Date();
  const created = new Date(user.created_at);

  // Account age in years (float)
  const accountAgeYears = (now - created) / (1000 * 60 * 60 * 24 * 365.25);

  // Total stars across all repos
  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

  // Most used language
  const langCounts = {};
  repos.forEach(r => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });
  const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Days since last push (across all repos)
  const pushDates = repos.map(r => r.pushed_at ? new Date(r.pushed_at) : null).filter(Boolean);
  const lastPush = pushDates.length ? Math.max(...pushDates) : null;
  const daysSinceLastPush = lastPush
    ? (now - new Date(lastPush)) / (1000 * 60 * 60 * 24)
    : 9999;

  // Repos without description
  const undescribedRepoRatio = repos.length
    ? repos.filter(r => !r.description).length / repos.length
    : 1;

  // Fork ratio
  const forkRatio = repos.length
    ? repos.filter(r => r.fork).length / repos.length
    : 0;

  // Top 6 repos by stars, filter out forks
  const ownRepos = repos.filter(r => !r.fork);
  const topRepos = [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6);

  return {
    ...user,
    _totalStars: totalStars,
    _topLang: topLang,
    _accountAgeYears: accountAgeYears,
    _daysSinceLastPush: daysSinceLastPush,
    _undescribedRepoRatio: undescribedRepoRatio,
    _forkRatio: forkRatio,
    _topRepos: topRepos,
    _allRepos: repos,
    _langCounts: langCounts,
  };
}

/* ============================================================
   CRIME SCORE CALCULATION
   ============================================================ */
function calcCrimeScore(data) {
  // Each sub-score 0-25, total 0-100

  // Activity (pushes frequently, has repos)
  let activity = 0;
  if (data.public_repos > 0) activity += 5;
  if (data.public_repos >= 10) activity += 5;
  if (data.public_repos >= 30) activity += 5;
  if (data._daysSinceLastPush < 30)  activity += 10;
  else if (data._daysSinceLastPush < 180) activity += 6;
  else if (data._daysSinceLastPush < 365) activity += 2;
  activity = Math.min(25, activity);

  // Documentation (has bio, repo descriptions, README)
  let docs = 0;
  if (data.bio) docs += 8;
  if (data._undescribedRepoRatio < 0.5) docs += 10;
  if (data._undescribedRepoRatio < 0.2) docs += 7;
  docs = Math.min(25, docs);

  // Consistency (account age vs activity)
  let consist = 0;
  if (data._accountAgeYears > 1)  consist += 5;
  if (data._accountAgeYears > 3)  consist += 5;
  if (data._forkRatio < 0.5)      consist += 5;
  if (data.public_repos > 5)      consist += 5;
  if (data._daysSinceLastPush < 90) consist += 5;
  consist = Math.min(25, consist);

  // Popularity (stars, followers)
  let pop = 0;
  if (data.followers > 0)   pop += 3;
  if (data.followers > 10)  pop += 3;
  if (data.followers > 100) pop += 4;
  if (data.followers > 1000) pop += 5;
  if (data._totalStars > 0)  pop += 3;
  if (data._totalStars > 50)  pop += 4;
  if (data._totalStars > 500) pop += 3;
  pop = Math.min(25, pop);

  const total = activity + docs + consist + pop;

  const verdicts = [
    [0, 20,  "🚨 GUILTY AS CHARGED"],
    [21, 40, "⚠️ HABITUAL OFFENDER"],
    [41, 60, "🔍 PERSON OF INTEREST"],
    [61, 80, "🤨 SUSPICIOUS BUT FINE"],
    [81, 100,"✅ SUSPICIOUSLY CLEAN"],
  ];
  const verdict = verdicts.find(([lo, hi]) => total >= lo && total <= hi)?.[2] || "❓ UNKNOWN";

  return { total, activity, docs, consist, pop, verdict };
}

/* ============================================================
   ROAST GENERATION
   ============================================================ */
function generateRoasts(data) {
  const results = [];

  ROAST_TEMPLATES.forEach(fn => {
    try {
      const r = fn(data);
      if (r) results.push(r);
    } catch (_) { /* skip broken templates */ }
  });

  // Shuffle and take a good mix (max 8)
  const shuffled = results.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8);
}

/* ============================================================
   BADGE GENERATION
   ============================================================ */
function generateBadges(data) {
  return BADGE_DEFS.filter(b => {
    try { return b.condition(data); } catch (_) { return false; }
  });
}

/* ============================================================
   LOADING STATE ANIMATION
   ============================================================ */
async function animateLoadingSteps() {
  const steps = ["ls1","ls2","ls3","ls4"];
  const delays = [0, 600, 1200, 1900];
  steps.forEach((id, i) => {
    setTimeout(() => {
      // Mark previous as done
      if (i > 0) $(steps[i-1])?.classList.replace("active","done");
      $(id)?.classList.add("active");
    }, delays[i]);
  });
}

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */

function renderProfile(data) {
  $("profileAvatar").src = data.avatar_url || "";
  $("profileAvatar").alt = `${data.login}'s avatar`;
  $("profileName").textContent = data.name || data.login;
  $("profileLogin").textContent = `@${data.login}`;
  $("profileBio").textContent = data.bio || "No bio provided. Classic move. Very mysterious. Very lazy.";
  $("profileLink").href = data.html_url || `https://github.com/${data.login}`;

  // Tags
  const tagsEl = $("profileTags");
  tagsEl.innerHTML = "";
  if (data.location) tagsEl.insertAdjacentHTML("beforeend", `<span class="profile-tag">📍 ${data.location}</span>`);
  if (data.company)  tagsEl.insertAdjacentHTML("beforeend", `<span class="profile-tag">🏢 ${data.company}</span>`);
  if (data.blog)     tagsEl.insertAdjacentHTML("beforeend", `<span class="profile-tag">🔗 Has website</span>`);
  if (data.twitter_username) tagsEl.insertAdjacentHTML("beforeend", `<span class="profile-tag">🐦 Twitter user</span>`);
}

function renderQuickStats(data) {
  const age = data._accountAgeYears;
  const ageStr = age >= 1 ? `${age.toFixed(1)}y` : `${Math.round(age * 12)}mo`;

  // Animate each count
  const anims = [
    ["statRepos",     data.public_repos],
    ["statStars",     data._totalStars],
    ["statFollowers", data.followers],
    ["statFollowing", data.following],
  ];
  anims.forEach(([id, val]) => {
    const el = $(id);
    if (el) countUp(el, val);
  });

  setText("statAge", ageStr);
  setText("statLang", data._topLang || "None 😬");
}

function renderCrimeScore(scores) {
  // Animate the score ring
  const ring = $("ringFill");
  const circumference = 2 * Math.PI * 80; // r=80
  if (ring) {
    setTimeout(() => {
      ring.style.strokeDashoffset = circumference - (circumference * scores.total / 100);
    }, 200);
  }

  // Inject SVG gradient defs if not already present
  if (!document.getElementById("scoreGrad")) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
    defs.innerHTML = `
      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#00d4ff"/>
        <stop offset="100%" stop-color="#9f5cf7"/>
      </linearGradient>`;
    ring?.closest("svg")?.prepend(defs);
  }

  // Animate score number
  const numEl = $("scoreNumber");
  if (numEl) countUp(numEl, scores.total, 1500);
  setText("scoreVerdict", scores.verdict);

  // Bars
  const bars = [
    ["barActivity", "barActivityVal", scores.activity, 25],
    ["barDocs",     "barDocsVal",     scores.docs,     25],
    ["barConsist",  "barConsistVal",  scores.consist,  25],
    ["barPop",      "barPopVal",      scores.pop,      25],
  ];
  bars.forEach(([fillId, valId, val, max]) => {
    const pct = Math.round((val / max) * 100);
    setTimeout(() => {
      const fill = $(fillId);
      const valEl = $(valId);
      if (fill) fill.style.width = `${pct}%`;
      if (valEl) valEl.textContent = `${pct}%`;
    }, 400);
  });
}

function renderRoasts(roasts) {
  const list = $("roastList");
  list.innerHTML = "";
  roasts.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = `roast-item${r.highlight ? " highlight" : ""}`;
    div.style.animationDelay = `${i * 80}ms`;
    div.innerHTML = `
      <span class="roast-icon">${r.icon}</span>
      <div class="roast-text">
        <span class="roast-charge">${r.charge}</span>
        <span class="roast-body">${r.body}</span>
      </div>`;
    list.appendChild(div);
  });
}

function renderBadges(badges) {
  const grid = $("badgesGrid");
  grid.innerHTML = "";
  if (badges.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);font-size:.85rem;font-style:italic;grid-column:1/-1">No badges earned. This itself is an achievement of sorts.</p>`;
    return;
  }
  badges.forEach((b, i) => {
    const div = document.createElement("div");
    div.className = "badge-card glass-card";
    div.style.animationDelay = `${i * 60}ms`;
    div.innerHTML = `
      <span class="badge-emoji">${b.emoji}</span>
      <span class="badge-name">${b.name}</span>
      <span class="badge-desc">${b.desc}</span>`;
    grid.appendChild(div);
  });
}

function renderRepos(repos) {
  const grid = $("reposGrid");
  grid.innerHTML = "";
  if (!repos || repos.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);font-size:.85rem;font-style:italic">No evidence found. They may have destroyed it.</p>`;
    return;
  }
  repos.forEach((r, i) => {
    const langColor = LANG_COLORS[r.language] || "#8ba3cc";
    const updated = r.pushed_at ? timeSince(new Date(r.pushed_at)) : "never";
    const div = document.createElement("div");
    div.className = "repo-card";
    div.style.animationDelay = `${i * 70}ms`;
    div.innerHTML = `
      <div class="repo-header">
        <span class="repo-icon">${r.fork ? "🍴" : "📁"}</span>
        <a class="repo-name" href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
      </div>
      <p class="repo-desc">${r.description || "<em>No description. A mystery repo. Very ominous.</em>"}</p>
      <div class="repo-meta">
        ${r.language ? `<span class="repo-meta-item"><span class="lang-dot" style="background:${langColor}"></span>${r.language}</span>` : ""}
        <span class="repo-meta-item">⭐ ${(r.stargazers_count||0).toLocaleString()}</span>
        <span class="repo-meta-item">🍴 ${(r.forks_count||0).toLocaleString()}</span>
      </div>
      <span class="repo-updated">Last updated ${updated}</span>`;
    grid.appendChild(div);
  });
}

/** Format a date to a human-readable "X ago" string */
function timeSince(date) {
  const secs = Math.floor((new Date() - date) / 1000);
  const intervals = [
    [31536000, "year"], [2592000, "month"], [86400, "day"],
    [3600, "hour"], [60, "minute"]
  ];
  for (const [s, n] of intervals) {
    const c = Math.floor(secs / s);
    if (c >= 1) return `${c} ${n}${c > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

/* ============================================================
   MAIN ANALYSE FUNCTION
   ============================================================ */
async function analyse(username) {
  username = username.trim().replace(/^@/, "");
  if (!username) {
    showToast("⚠️ Enter a username, genius.");
    return;
  }

  // Reset UI
  hideEl("resultsSection");
  hideEl("errorOverlay");
  showEl("loadingOverlay");
  $("analyzeBtn").disabled = true;

  // Reset loading steps
  ["ls1","ls2","ls3","ls4"].forEach(id => {
    const el = $(id);
    if (el) { el.classList.remove("active","done"); }
  });
  animateLoadingSteps();

  try {
    // Step 1: User profile
    const user = await ghFetch(`/users/${username}`);

    // Step 2: Repos (up to 300)
    const repos = await fetchAllRepos(username, 3);

    // Process data
    const data = processProfile(user, repos);
    currentData = data;

    // Generate roasts & badges
    currentRoasts = generateRoasts(data);
    const badges = generateBadges(data);
    const scores = calcCrimeScore(data);

    // Hide loading
    hideEl("loadingOverlay");
    $("analyzeBtn").disabled = false;

    // Render everything
    renderProfile(data);
    renderQuickStats(data);
    renderCrimeScore(scores);
    renderRoasts(currentRoasts);
    renderBadges(badges);
    renderRepos(data._topRepos);

    // Show results
    showEl("resultsSection");

    // Smooth scroll
    document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth", block: "start" });

    // Show scroll hint
    $("scrollHint").classList.remove("visible");

  } catch (err) {
    hideEl("loadingOverlay");
    $("analyzeBtn").disabled = false;

    const msgEl = $("errorMessage");
    if (err.message === "NOT_FOUND") {
      msgEl.textContent = `"${username}" doesn't exist. Either you mistyped it, they rage-quit GitHub, or this person is so underground they don't even have a profile. Respect, but also: useless to us.`;
    } else if (err.message === "RATE_LIMIT") {
      msgEl.textContent = `GitHub's API rate limit hit. Turns out investigating too many suspects in an hour makes GitHub suspicious. Wait ~60 minutes before your next investigation, detective.`;
    } else {
      msgEl.textContent = `Something went wrong: ${err.message}. The servers are judging you. Try again in a moment.`;
    }
    showEl("errorOverlay");
  }
}

/* ============================================================
   SHARE / COPY / DOWNLOAD
   ============================================================ */

function copyRoast() {
  if (!currentData || currentRoasts.length === 0) {
    showToast("Nothing to copy yet. Do an investigation first.");
    return;
  }
  const text = currentRoasts
    .map(r => `[${r.charge}]\n${r.body}`)
    .join("\n\n");
  const header = `=== COMMIT CRIMES REPORT: @${currentData.login} ===\n\n`;
  const footer = `\n\n— Generated by commitcrimes.dev`;
  navigator.clipboard.writeText(header + text + footer)
    .then(() => showToast("📋 Crime report copied. Use it wisely (or maliciously)."))
    .catch(() => showToast("Clipboard refused. Even the browser is judging you."));
}

function shareResults() {
  if (!currentData) return;
  const url = `https://github.com/${currentData.login}`;
  const text = `I just got roasted by Commit Crimes 🔥\n\nMy crime score: ${calcCrimeScore(currentData).total}/100\n\nCheck your own GitHub crimes at: `;
  if (navigator.share) {
    navigator.share({ title: "Commit Crimes Report", text, url })
      .catch(() => {});
  } else {
    navigator.clipboard.writeText(text + "https://github.com/commit-crimes")
      .then(() => showToast("🔗 Share text copied! Spread the shame."))
      .catch(() => showToast("Share failed. Some crimes cannot be shared."));
  }
}

function randomRoast() {
  if (!currentData) return;
  const allPossible = ROAST_TEMPLATES
    .map(fn => { try { return fn(currentData); } catch { return null; } })
    .filter(Boolean);
  if (allPossible.length === 0) return;
  const r = allPossible[Math.floor(Math.random() * allPossible.length)];
  showToast(`${r.icon} ${r.body.slice(0, 120)}…`);
}

function downloadReport() {
  if (!currentData) {
    showToast("Investigate someone first.");
    return;
  }
  // Generate a plaintext report and download it
  const scores = calcCrimeScore(currentData);
  const lines = [
    `╔═══════════════════════════════════════════════════╗`,
    `║         COMMIT CRIMES — OFFICIAL REPORT          ║`,
    `╚═══════════════════════════════════════════════════╝`,
    ``,
    `SUSPECT:       @${currentData.login}`,
    `NAME:          ${currentData.name || "Unknown (hiding something)"}`,
    `CRIME SCORE:   ${scores.total}/100  —  ${scores.verdict}`,
    `REPOS:         ${currentData.public_repos}`,
    `TOTAL STARS:   ${currentData._totalStars}`,
    `FOLLOWERS:     ${currentData.followers}`,
    `FOLLOWING:     ${currentData.following}`,
    `TOP LANGUAGE:  ${currentData._topLang || "None (worrying)"}`,
    `ACCOUNT AGE:   ${currentData._accountAgeYears.toFixed(1)} years`,
    ``,
    `━━━ SUB-SCORES ━━━`,
    `Activity:      ${Math.round(scores.activity/25*100)}%`,
    `Documentation: ${Math.round(scores.docs/25*100)}%`,
    `Consistency:   ${Math.round(scores.consist/25*100)}%`,
    `Popularity:    ${Math.round(scores.pop/25*100)}%`,
    ``,
    `━━━ INDICTMENT ━━━`,
    ...currentRoasts.map(r => `\n[${r.charge}]\n${r.body}`),
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Generated by Commit Crimes · No developers were permanently harmed.`,
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `commit-crimes-${currentData.login}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast("📄 Report downloaded. Evidence secured.");
}

/* ============================================================
   RESET / NEW SEARCH
   ============================================================ */
function resetToHero() {
  hideEl("resultsSection");
  hideEl("errorOverlay");
  currentData = null;
  currentRoasts = [];
  $("usernameInput").value = "";
  document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("usernameInput").focus(), 600);
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
function initEvents() {
  // Main analyse button
  $("analyzeBtn").addEventListener("click", () => {
    analyse($("usernameInput").value);
  });

  // Enter key in input
  $("usernameInput").addEventListener("keydown", e => {
    if (e.key === "Enter") analyse($("usernameInput").value);
  });

  // Example chips
  document.querySelectorAll(".example-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const user = chip.dataset.user;
      $("usernameInput").value = user;
      analyse(user);
    });
  });

  // Roast action buttons
  $("randomRoastBtn").addEventListener("click", randomRoast);
  $("copyRoastBtn").addEventListener("click", copyRoast);
  $("shareBtn").addEventListener("click", shareResults);

  // Footer buttons
  $("newSearchBtn").addEventListener("click", resetToHero);
  $("downloadBtn").addEventListener("click", downloadReport);

  // Error retry
  $("retryBtn").addEventListener("click", () => {
    hideEl("errorOverlay");
    resetToHero();
  });

  // Show scroll hint once results are rendered
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $("scrollHint")?.classList.add("visible");
      }
    });
  });
  const resultsEl = $("resultsSection");
  if (resultsEl) observer.observe(resultsEl);
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initFooter() {
  const el = $("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   SCROLL HINT VISIBILITY
   ============================================================ */
function initScrollHint() {
  const hint = $("scrollHint");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) hint.classList.remove("visible");
  }, { passive: true });
}

/* ============================================================
   ENTRY POINT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  initTheme();
  initEvents();
  initFooter();
  initScrollHint();

  // Autofocus input
  setTimeout(() => $("usernameInput")?.focus(), 300);
});
