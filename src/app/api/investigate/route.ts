import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateMockRoast } from "@/utils/mockRoaster";

const GITHUB_API = "https://api.github.com";

// Helper for making GitHub API requests with authorization headers
async function githubRequest(path: string) {
  const token = process.env.GITHUB_PAT;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${GITHUB_API}${path}`, {
    headers,
    next: { revalidate: 300 }, // Cache responses for 5 minutes
  });

  if (!res.ok) {
    if (res.status === 401) {
      console.warn("WARNING: GITHUB_PAT returned 401 Unauthorized. Retrying request unauthenticated.");
      const unauthHeaders: HeadersInit = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      };
      const retryRes = await fetch(`${GITHUB_API}${path}`, {
        headers: unauthHeaders,
        next: { revalidate: 300 },
      });
      if (retryRes.ok) {
        return retryRes.json();
      }
      if (retryRes.status === 404) throw new Error("NOT_FOUND");
      if (retryRes.status === 403 && retryRes.headers.get("x-ratelimit-remaining") === "0") {
        throw new Error("RATE_LIMIT");
      }
      throw new Error(`GITHUB_ERROR_${retryRes.status}`);
    }

    if (res.status === 404) throw new Error("NOT_FOUND");
    if (res.status === 403) {
      const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
      if (rateLimitRemaining === "0") {
        throw new Error("RATE_LIMIT");
      }
    }
    throw new Error(`GITHUB_ERROR_${res.status}`);
  }

  return res.json();
}

// Programmatic emoji stripper
const stripEmojis = (str: string) => {
  if (!str) return "";
  return str
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[🚨⚠️🔍🤨⚡📜🌍📦🦋🐺⭐👑🦕🦉🔑🐛🐣👻💸☕🏜️🌙☀️]/g, "")
    .trim();
};

// Server-side AI Roast Generator
async function getRoast(payload: any) {
  const isRepo = payload.type === "repository";
  const apiKey = process.env.GEMINI_API_KEY;
  let jsonResult;
  let usedAI = false;

  try {
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
      throw new Error("No Gemini API key configured.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let prompt = "";
    if (isRepo) {
      prompt = `
      You are a cynical, highly sarcastic code forensics auditor at "Commit Crimes". You are writing an official arrest warrant indictment for a specific GitHub repository.
      
      CRITICAL CONSTRAINT: Do NOT use emojis anywhere in the JSON response (including the verdict, charge, body, or icon fields). All status names, verdict titles, and descriptions must be plain text without any emojis or icon symbols.
      
      Analyze this repository data:
      Suspect Owner: @${payload.user.login}
      Project Name: ${payload.repo.name}
      Description: "${payload.repo.description || "No description provided"}"
      Stars: ${payload.repo.stars}
      Forks: ${payload.repo.forks}
      Primary Language: ${payload.repo.language}
      Size: ${payload.repo.size} KB
      Readme Size: ${payload.repo.readme?.length || 0} bytes
      Recent Commits: ${JSON.stringify(payload.repo.commits || [])}
      Languages Breakdown: ${JSON.stringify(payload.repo.languagesBreakdown || {})}

      Generate a JSON response conforming strictly to this structure:
      {
        "score": number, // 0 to 100. Higher score means better, cleaner developer. Lower score means more guilty of developer crimes (no stars, lazy commits, no documentation). E.g. 80-100 is "SUSPICIOUSLY CLEAN", 0-20 is "GUILTY AS CHARGED".
        "verdict": string, // Sarcastic all-caps status based on the score (e.g. "GUILTY AS CHARGED" for low scores, "SUSPICIOUSLY CLEAN" for high scores). Do NOT use emojis.
        "activityPercent": number, // 0 to 100. Higher means more active (frequent commits, recent activity).
        "docsPercent": number, // 0 to 100. Higher means better documentation (complete README, description).
        "consistencyPercent": number, // 0 to 100. Higher means more consistent (clean codebase size, good structure).
        "popularityPercent": number, // 0 to 100. Higher means more popular (more stars and forks).
        "charges": [
          {
            "icon": "hoarder" | "commit" | "readme" | "js" | "typescript" | "python" | "celebrity" | "clock" | "bug", // Select the single best matching tag. Do NOT use emojis.
            "charge": string, // Sarcastic all-caps charge name (e.g. "LAZY COMMITTING FELONY", "MONOLITHIC BLOAT MISDEMEANOR"). Do NOT use emojis.
            "body": string, // Witty, savage explanation roasting their stats/descriptions/commit messages. Keep it between 2-3 sentences. Reference their actual data. Do NOT use emojis.
            "highlight": boolean // Set to true for the most egregious crime.
          }
        ]
      }
      `;
    } else {
      prompt = `
      You are a cynical, highly sarcastic code forensics auditor at "Commit Crimes". You are writing an official arrest warrant indictment for a developer's GitHub profile.
      
      CRITICAL CONSTRAINT: Do NOT use emojis anywhere in the JSON response (including the verdict, charge, body, or icon fields). All status names, verdict titles, and descriptions must be plain text without any emojis or icon symbols.
      
      Analyze this user profile and aggregated statistics:
      Suspect Username: @${payload.user.login}
      Suspect Name: ${payload.user.name || "Unknown Alias"}
      Bio: "${payload.user.bio || "No bio provided"}"
      Public Repos: ${payload.user.public_repos}
      Followers: ${payload.user.followers}
      Following: ${payload.user.following}
      Total Stars: ${payload.stats.totalStars}
      Total Forks: ${payload.stats.totalForks}
      Top Language: ${payload.stats.topLang}
      Account Age: ${payload.stats.accountAgeYears.toFixed(1)} years
      Days Since Last Push: ${Math.round(payload.stats.daysSinceLastPush)}
      Undescribed Repos Ratio: ${(payload.stats.undescribedRepoRatio * 100).toFixed(0)}%
      Forked Repos Ratio: ${(payload.stats.forkRatio * 100).toFixed(0)}%

      Generate a JSON response conforming strictly to this structure:
      {
        "score": number, // 0 to 100. Higher score means better, cleaner developer. Lower score means more guilty of developer crimes (no stars, lazy commits, no documentation). E.g. 80-100 is "SUSPICIOUSLY CLEAN", 0-20 is "GUILTY AS CHARGED".
        "verdict": string, // Sarcastic all-caps status based on the score (e.g. "GUILTY AS CHARGED" for low scores, "SUSPICIOUSLY CLEAN" for high scores). Do NOT use emojis.
        "activityPercent": number, // 0 to 100. Higher means more active (frequent commits, recent activity).
        "docsPercent": number, // 0 to 100. Higher means better documentation (complete README, description).
        "consistencyPercent": number, // 0 to 100. Higher means more consistent (clean codebase size, good structure).
        "popularityPercent": number, // 0 to 100. Higher means more popular (more stars and followers).
        "charges": [
          {
            "icon": "hoarder" | "commit" | "readme" | "js" | "typescript" | "python" | "celebrity" | "clock" | "bug", // Select the single best matching tag. Do NOT use emojis.
            "charge": string, // Sarcastic all-caps charge name (e.g. "JAVASCRIPT ADDICTIONS", "NEGLIGIBLE CULTURAL IMPACT"). Do NOT use emojis.
            "body": string, // Witty, savage explanation roasting their profile stats. Keep it between 2-3 sentences. Reference their actual data. Do NOT use emojis.
            "highlight": boolean // Set to true for the most egregious crime.
          }
        ]
      }
      `;
    }

    const result = await model.generateContent(prompt);
    jsonResult = JSON.parse(result.response.text());
    usedAI = true;
  } catch (err) {
    jsonResult = generateMockRoast(payload, isRepo);
  }

  if (jsonResult) {
    if (jsonResult.verdict) jsonResult.verdict = stripEmojis(jsonResult.verdict);
    if (jsonResult.charges && Array.isArray(jsonResult.charges)) {
      jsonResult.charges.forEach((c: any) => {
        if (c.charge) c.charge = stripEmojis(c.charge);
        if (c.body) c.body = stripEmojis(c.body);
        if (c.icon) c.icon = stripEmojis(c.icon).toLowerCase();
      });
    }
  }

  return {
    ...jsonResult,
    _isMock: !usedAI,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.trim();
    const repo = searchParams.get("repo")?.trim();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // CASE 1: Specialized Repository Crimes Investigation
    if (repo) {
      const [userProfile, repoDetails, repoLanguages, repoCommits, repoReadme] = await Promise.all([
        githubRequest(`/users/${username}`),
        githubRequest(`/repos/${username}/${repo}`),
        githubRequest(`/repos/${username}/${repo}/languages`),
        githubRequest(`/repos/${username}/${repo}/commits?per_page=30`).catch(() => []),
        githubRequest(`/repos/${username}/${repo}/readme`).catch(() => null),
      ]);

      // Parse readme if present
      let readmeText = "";
      if (repoReadme && repoReadme.content) {
        readmeText = Buffer.from(repoReadme.content, "base64").toString("utf-8");
      }

      const dataPayload = {
        type: "repository",
        user: {
          login: userProfile.login,
          name: userProfile.name,
          avatar_url: userProfile.avatar_url,
          bio: userProfile.bio,
        },
        repo: {
          name: repoDetails.name,
          description: repoDetails.description,
          stars: repoDetails.stargazers_count,
          forks: repoDetails.forks_count,
          created_at: repoDetails.created_at,
          pushed_at: repoDetails.pushed_at,
          size: repoDetails.size,
          language: repoDetails.language,
          languagesBreakdown: repoLanguages,
          readme: readmeText.slice(0, 4000), // Limit readme length
          commits: repoCommits.map((c: any) => ({
            message: c.commit.message,
            date: c.commit.committer.date,
            author: c.commit.author.name,
          })),
        },
      };

      const roast = generateMockRoast(dataPayload, true);

      return NextResponse.json({
        ...dataPayload,
        roast,
      });
    }

    // CASE 2: Global Profile Crimes Investigation
    // Fetch profile and repos in parallel (cut delay in half)
    let userProfile;
    let repos: any[] = [];
    try {
      const [profileData, page1, page2] = await Promise.all([
        githubRequest(`/users/${username}`),
        githubRequest(`/users/${username}/repos?per_page=100&sort=pushed&page=1`).catch(() => []),
        githubRequest(`/users/${username}/repos?per_page=100&sort=pushed&page=2`).catch(() => []),
      ]);
      userProfile = profileData;
      repos = [...(page1 || []), ...(page2 || [])];
    } catch (err: any) {
      if (err.message === "NOT_FOUND") throw err;
      try {
        userProfile = await githubRequest(`/users/${username}`);
      } catch (profileErr) {
        throw profileErr;
      }
    }

    // Compute metrics on the server
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    
    const langCounts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    });

    const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
    const topLang = sortedLangs[0]?.[0] || null;

    const pushDates = repos.map((r) => r.pushed_at ? new Date(r.pushed_at).getTime() : 0).filter(Boolean);
    const lastPush = pushDates.length ? Math.max(...pushDates) : null;
    const daysSinceLastPush = lastPush
      ? (Date.now() - lastPush) / (1000 * 60 * 60 * 24)
      : 9999;

    const undescribedRepoRatio = repos.length
      ? repos.filter((r) => !r.description).length / repos.length
      : 1;

    const forkRatio = repos.length
      ? repos.filter((r) => r.fork).length / repos.length
      : 0;

    // Filter out forks and take top 6 repositories by stars
    const topRepos = [...repos]
      .filter((r) => !r.fork)
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        pushed_at: r.pushed_at,
      }));

    const accountAgeYears = (Date.now() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    const dataPayload = {
      type: "profile",
      user: {
        login: userProfile.login,
        name: userProfile.name,
        avatar_url: userProfile.avatar_url,
        bio: userProfile.bio,
        location: userProfile.location,
        company: userProfile.company,
        blog: userProfile.blog,
        twitter_username: userProfile.twitter_username,
        public_repos: userProfile.public_repos,
        followers: userProfile.followers,
        following: userProfile.following,
        created_at: userProfile.created_at,
      },
      stats: {
        totalStars,
        totalForks,
        topLang,
        sortedLangs: sortedLangs.slice(0, 5).map(([name, count]) => ({ name, count })),
        accountAgeYears,
        daysSinceLastPush,
        undescribedRepoRatio,
        forkRatio,
        topRepos,
      },
    };

    const roast = generateMockRoast(dataPayload, false);

    return NextResponse.json({
      ...dataPayload,
      roast,
    });

  } catch (err: any) {
    console.error("Investigation error:", err);
    if (err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    if (err.message === "RATE_LIMIT") {
      return NextResponse.json({ error: "RATE_LIMIT" }, { status: 429 });
    }
    return NextResponse.json({ error: err.message || "Failed to fetch GitHub data" }, { status: 500 });
  }
}
