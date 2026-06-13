export interface RoastCharge {
  icon: string; // The semantic tag mapped to a Flaticon SVG
  charge: string;
  body: string;
  highlight?: boolean;
}

export interface RoastResult {
  score: number;
  verdict: string;
  activityPercent: number;
  docsPercent: number;
  consistencyPercent: number;
  popularityPercent: number;
  charges: RoastCharge[];
}

export function generateMockRoast(data: any, isRepo = false): RoastResult {
  // Simple algorithm to compute scores from data
  if (isRepo) {
    const stars = data.repo.stars || 0;
    const size = data.repo.size || 0;
    const commitsCount = data.repo.commits?.length || 0;
    
    // Calculate sub-scores (0-25 each)
    const activity = Math.min(25, Math.round((commitsCount / 30) * 25));
    const docs = data.repo.readme ? 25 : 5;
    const consistency = size > 1000 ? 20 : 10;
    const popularity = Math.min(25, Math.round((stars / 100) * 25));
    const total = activity + docs + consistency + popularity;

    const charges: RoastCharge[] = [];

    // Commits charge
    const badCommits = data.repo.commits?.filter((c: any) => 
      /^(fix|wip|update|test|asd|temp|commit)/i.test(c.message)
    ).length || 0;

    if (badCommits > 3) {
      charges.push({
        icon: "commit",
        charge: "LAZY COMMITTING FELONY",
        body: `Detected ${badCommits} commits with messages like "fix" or "wip". You treat your git history like a personal scratchpad. Your team secretly hates merging your pull requests.`,
        highlight: true
      });
    } else {
      charges.push({
        icon: "commit",
        charge: "GENERIC INDICTMENT",
        body: `Your commit history contains standard developer statements. They aren't inspiring, but at least you didn't just type 'asdf' repeatedly. Low effort, but acceptable.`,
      });
    }

    // README charge
    if (!data.repo.readme) {
      charges.push({
        icon: "readme",
        charge: "README ABANDONMENT",
        body: "Zero documentation. An empty repository with a description that probably says 'My project'. This is the coding equivalent of leaving unlabeled left-overs in a shared fridge.",
        highlight: true
      });
    } else if (data.repo.readme.length < 200) {
      charges.push({
        icon: "readme",
        charge: "MINIMALIST PACKAGING CRIMES",
        body: "Your README contains less than 200 characters. Writing 'Coming soon...' or a single-line usage instructions does not qualify as documentation. Try harder.",
      });
    } else {
      charges.push({
        icon: "readme",
        charge: "AESTHETIC DECEPTION",
        body: "Your README looks detailed, but mostly contains templated shields and build badges. You care more about the visual facade than whether your code actually builds.",
      });
    }

    // Size / Language charge
    if (size > 50000) {
      charges.push({
        icon: "hoarder",
        charge: "MONOLITHIC BULK PACKAGING",
        body: `This project is ${Math.round(size / 1000)}MB. You are checking in node_modules, compiled assets, or huge database exports. Git is not Google Drive.`,
      });
    }

    const verdict = total > 80 ? "SUSPICIOUSLY CLEAN" : total > 50 ? "PERSON OF INTEREST" : "GUILTY AS CHARGED";

    return {
      score: total,
      verdict,
      activityPercent: Math.round((activity / 25) * 100),
      docsPercent: Math.round((docs / 25) * 100),
      consistencyPercent: Math.round((consistency / 25) * 100),
      popularityPercent: Math.round((popularity / 25) * 100),
      charges
    };
  }

  // PROFILE ROAST MOCK
  const user = data.user;
  const stats = data.stats;
  
  const reposCount = user.public_repos || 0;
  const stars = stats.totalStars || 0;
  const followers = user.followers || 0;
  const following = user.following || 0;

  // Calculate scores
  const activity = Math.min(25, Math.round((reposCount / 40) * 12) + (stats.daysSinceLastPush < 30 ? 13 : 5));
  const docs = (user.bio ? 10 : 0) + (stats.undescribedRepoRatio < 0.4 ? 15 : stats.undescribedRepoRatio < 0.7 ? 8 : 2);
  const consistency = Math.min(25, (stats.forkRatio < 0.4 ? 15 : 5) + (stats.accountAgeYears > 3 ? 10 : 4));
  const popularity = Math.min(25, (followers > 50 ? 15 : 5) + (stars > 100 ? 10 : 2));
  const total = activity + docs + consistency + popularity;

  const charges: RoastCharge[] = [];

  // Repo count roast
  if (reposCount > 50) {
    charges.push({
      icon: "hoarder",
      charge: "SERIAL HOARDING MISDEMEANOR",
      body: `You have ${reposCount} public repositories. You are hoarding code repositories like a digital raccoon. Have you touched 90% of these in the last 12 months? We know the answer.`,
      highlight: true
    });
  } else if (reposCount < 5 && reposCount > 0) {
    charges.push({
      icon: "hoarder",
      charge: "UNDERACHIEVER DETECTED",
      body: `Only ${reposCount} repositories. You treat GitHub like a backup drive for school projects. It's time to build something public that isn't a calculator.`,
    });
  }

  // Language roast
  if (stats.topLang === "JavaScript") {
    charges.push({
      icon: "js",
      charge: "JAVASCRIPT DEPENDENCY FELONY",
      body: "Your top language is JavaScript. You are the reason NPM installs require 3GB of disk space. Every 'undefined is not a function' error on the web is your legacy.",
      highlight: true
    });
  } else if (stats.topLang === "TypeScript") {
    charges.push({
      icon: "typescript",
      charge: "TYPE SAFETY MANIA",
      body: "TypeScript devotee. You spend 4 hours designing generic type arguments to avoid a single compilation error, then write business logic containing 42 nested if-statements.",
    });
  } else if (stats.topLang === "Python") {
    charges.push({
      icon: "python",
      charge: "INDENTATION EVANGELISM",
      body: "Python coder. You think white space counts as structure, and have at least 8 unfinished scraping scripts and a Jupyter Notebook that crashes on line 4.",
    });
  }

  // Stars roast
  if (stars === 0 && reposCount > 5) {
    charges.push({
      icon: "readme",
      charge: "ZERO CULTURAL INFLUENCE",
      body: "Zero stars across all repos. Not a single developer (not even your mom or a rogue GitHub crawler bot) found your code worth bookmarking. Impressive in a tragic way.",
      highlight: true
    });
  }

  // Follower/Following roast
  if (following > followers * 3 && following > 15) {
    charges.push({
      icon: "celebrity",
      charge: "DESPERATE NETWORKING ATTEMPT",
      body: `Following ${following} accounts but only followed by ${followers}. The classic follow-for-follow gamble that did not pay off. This is GitHub, not Instagram.`,
    });
  }

  const verdict = total > 80 ? "SUSPICIOUSLY CLEAN" : total > 50 ? "PERSON OF INTEREST" : "GUILTY AS CHARGED";

  return {
    score: total,
    verdict,
    activityPercent: Math.round((activity / 25) * 100),
    docsPercent: Math.round((docs / 25) * 100),
    consistencyPercent: Math.round((consistency / 25) * 100),
    popularityPercent: Math.round((popularity / 25) * 100),
    charges
  };
}
