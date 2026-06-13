# Commit Crimes 🕵️‍♂️🔥

**Commit Crimes** is a forensic audit and profiling tool designed to investigate suspicious developer activity on GitHub. It scans public profiles and repositories, calculates a precise crime score, dynamically upgrades indictments using AI, awards personalized badges of (dis)honor, and generates official digital arrest warrants.

No developer is innocent. Especially you.

---

## What the Project Accomplishes

This project transforms dry GitHub statistics into a gamified, humorous forensic investigation report. It accomplishes this through the following core features:

### 🔎 Forensic Suspect Profiling
- Scans any public GitHub suspect profile or repository by querying Git metrics in real-time.
- Captures details including repository counts, total star metrics, follower-to-following ratios, account age, and scan-level chronological data.

### ⚡ Speed-of-Light Asynchronous Hydration (Dual Mode)
- **Instant Initial Audit**: The application generates and loads a rules-based mock roast synchronously in under 1 second to ensure instant responsiveness.
- **Asynchronous AI Upgrading**: A background worker connects to the Forensic AI engine to analyze code patterns, languages, and repo statistics. It then dynamically replaces the mock indictments with highly personalized, custom-tailored AI roasts while displaying a live pulsing status indicator.

### ⚖️ The Crime Score™ & Chronology
- Calculates an indictment score with absolute scientific precision based on activity density, documentation levels, and repository hygiene.
- Features a detailed **Crime Hours Analysis** chart tracking commit timestamps to identify peak desperation/productivity hours (e.g., peak code pushes at 3:00 AM).

### 🏆 Badges of (Dis)Honor (Dynamic & Self-Hosted)
- Displays custom achievement badges based on the suspect's Git personality.
- Dynamically generates custom meme images (via the stateless Memegen API) with personalized text including the user's username and top language.
- Built with a hybrid fallback that automatically serves local, high-quality animated GIFs (`/memes/*.gif`) if the external API is unreachable.
- Badge categories include *Commit Machine*, *README Warrior*, *Lone Wolf*, *Language Loyalist*, *Bug Hunter*, *The Ghost*, and *Open Source Philanthropist*.

### 📸 Digital Arrest Warrants
- Generates an **Official Indictment Warrant** modal featuring the suspect's profile avatar inside a glowing cyber-border, tech framing brackets, and official indictment charges.
- Allows suspects to export and download their official warrant as a high-resolution PNG image directly from the browser canvas.
