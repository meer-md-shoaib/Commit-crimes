import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateMockRoast } from "@/utils/mockRoaster";

export async function POST(req: NextRequest) {
  const payload = await req.json();
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
        temperature: 0.4,
        maxOutputTokens: 400,
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
      Readme Text Snapshot: "${payload.repo.readme?.slice(0, 1500) || "No readme documentation exists"}"
      Recent Commits: ${JSON.stringify(payload.repo.commits || [])}
      Languages Breakdown: ${JSON.stringify(payload.repo.languagesBreakdown || {})}
 
      Generate a JSON response conforming strictly to this structure:
      {
        "score": number, // 0 to 100. Higher score means better, cleaner developer. Lower score means more guilty of developer crimes (no stars, lazy commits, no documentation). E.g. 80-100 is "SUSPICIOUSLY CLEAN", 0-20 is "GUILTY AS CHARGED".
        "verdict": string, // Sarcastic all-caps status based on the score. Do NOT use emojis.
        "activityPercent": number, // 0 to 100.
        "docsPercent": number, // 0 to 100.
        "consistencyPercent": number, // 0 to 100.
        "popularityPercent": number, // 0 to 100.
        "charges": [
          {
            "icon": "hoarder" | "commit" | "readme" | "js" | "typescript" | "python" | "celebrity" | "clock" | "bug", // Select the single best matching tag. Do NOT use emojis.
            "charge": string, // Sarcastic all-caps charge name (e.g. "LAZY COMMITTING FELONY"). Do NOT use emojis.
            "body": string, // Witty, savage explanation roasting their stats/descriptions/commit messages. Keep it to exactly 1 short sentence. Reference their actual data. Do NOT use emojis.
            "highlight": boolean // Set to true for the most egregious crime.
          }
        ]
      }
      
      Generate EXACTLY 3 charges in the charges array. No more, no less. Refer to their actual numbers to make the roasts feel highly customized. Keep descriptions extremely concise to maximize response speed.
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
      Languages Used: ${JSON.stringify(payload.stats.sortedLangs || [])}
      Account Age: ${payload.stats.accountAgeYears.toFixed(1)} years
      Days Since Last Push: ${Math.round(payload.stats.daysSinceLastPush)}
      Undescribed Repos Ratio: ${(payload.stats.undescribedRepoRatio * 100).toFixed(0)}%
      Forked Repos Ratio: ${(payload.stats.forkRatio * 100).toFixed(0)}%
 
      Generate a JSON response conforming strictly to this structure:
      {
        "score": number, // 0 to 100. Higher score means better, cleaner developer. Lower score means more guilty of developer crimes (no stars, lazy commits, no documentation). E.g. 80-100 is "SUSPICIOUSLY CLEAN", 0-20 is "GUILTY AS CHARGED".
        "verdict": string, // Sarcastic all-caps status based on the score. Do NOT use emojis.
        "activityPercent": number, // 0 to 100.
        "docsPercent": number, // 0 to 100.
        "consistencyPercent": number, // 0 to 100.
        "popularityPercent": number, // 0 to 100.
        "charges": [
          {
            "icon": "hoarder" | "commit" | "readme" | "js" | "typescript" | "python" | "celebrity" | "clock" | "bug", // Select the single best matching tag. Do NOT use emojis.
            "charge": string, // Sarcastic all-caps charge name (e.g. "JAVASCRIPT ADDICTIONS"). Do NOT use emojis.
            "body": string, // Witty, savage explanation roasting their profile stats. Keep it to exactly 1 short sentence. Reference their actual data. Do NOT use emojis.
            "highlight": boolean // Set to true for the most egregious crime.
          }
        ]
      }
 
      Generate EXACTLY 3 charges in the charges array. No more, no less. Refer to their actual numbers to make the roasts feel highly customized. Keep descriptions extremely concise to maximize response speed.
      `;
    }
 
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    jsonResult = JSON.parse(text);
    usedAI = true;
  } catch (err: any) {
    console.warn("WARNING: Forensic AI roasting engine failed (API key issue or timeout). Falling back to mock engine. Error:", err.message || err);
    jsonResult = generateMockRoast(payload, isRepo);
  }
 
  // Programmatically strip emojis from output payload as a robust fail-safe
  const stripEmojis = (str: string) => {
    if (!str) return "";
    return str
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/gu, "")
      .replace(/[🚨⚠️🔍🤨⚡📜🌍📦🦋🐺⭐👑🦕🦉🔑🐛🐣👻💸☕🏜️🌙☀️]/g, "")
      .trim();
  };
 
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
 
  // Inject flag in response to let client know if mock fallback was triggered (useful for tips/warnings)
  return NextResponse.json({
    ...jsonResult,
    _isMock: !usedAI
  });
}
