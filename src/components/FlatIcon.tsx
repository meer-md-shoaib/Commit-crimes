"use client";

interface FlatIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function FlatIcon({ name, className = "", size = 32 }: FlatIconProps) {
  const iconName = name.toLowerCase().trim();

  // Custom high-quality Flaticon-style SVG vectors
  const renderSvg = () => {
    switch (iconName) {
      case "hoarder": // Stacked colored file folders
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 48H14C11.8 48 10 46.2 10 44V16C10 13.8 11.8 12 14 12H24.5C26.1 12 27.6 12.8 28.5 14.2L31.5 18.8C32 19.5 32.7 20 33.5 20H50C52.2 20 54 21.8 54 24V44C54 46.2 52.2 48 50 48Z" fill="#FFA800" />
            <path d="M48 54H16C13.8 54 12 52.2 12 50V24H52V50C52 52.2 50.2 54 48 54Z" fill="#FFC72C" />
            <rect x="22" y="32" width="20" height="12" rx="2" fill="#FFFFFF" opacity="0.8" />
            <line x1="26" y1="36" x2="38" y2="36" stroke="#FFA800" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="40" x2="34" y2="40" stroke="#FFA800" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case "commit": // Branch nodes with neon colors
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10V54" stroke="#9F5CF7" strokeWidth="4" strokeLinecap="round" />
            <path d="M22 36C32 36 34 22 42 22" stroke="#00D4FF" strokeWidth="4" strokeLinecap="round" />
            <circle cx="22" cy="18" r="8" fill="#FF3C5C" stroke="#080B14" strokeWidth="2" />
            <circle cx="22" cy="46" r="8" fill="#9F5CF7" stroke="#080B14" strokeWidth="2" />
            <circle cx="42" cy="22" r="8" fill="#00D4FF" stroke="#080B14" strokeWidth="2" />
          </svg>
        );

      case "readme": // Colored document with a magnifying glass
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M46 54H18C15.8 54 14 52.2 14 50V14C14 11.8 15.8 10 18 10H36L50 24V50C50 52.2 48.2 54 46 54Z" fill="#3A86FF" />
            <path d="M36 10V24H50L36 10Z" fill="#00B4D8" />
            <line x1="20" y1="20" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="28" x2="44" y2="28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="36" x2="44" y2="36" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="44" x2="36" y2="44" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case "js":
      case "javascript": // Flat yellow JS badge
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#F7DF1E" />
            <path d="M34 44C34.6 44.4 35.4 44.6 36.2 44.6C37.6 44.6 38.6 43.8 38.6 42V28H42.6V42C42.6 46 39.8 48 36.2 48C33.8 48 32.4 46.8 31.6 45.4L34 44ZM49.4 41.2C49.4 44.2 47 48 41.8 48C37.8 48 35.6 45.6 34.6 43.4L37.8 41.4C38.4 43 39.4 44.8 41.8 44.8C43.8 44.8 45 43.8 45 42.4C45 40.8 43.8 40.2 41.8 39.4L40 38.8C36.6 37.6 35.2 35.6 35.2 32.8C35.2 29.8 37.6 26.8 41.6 26.8C45.2 26.8 47.2 28.8 48 30.6L45 32.6C44.6 31.6 43.6 30.2 41.6 30.2C40 30.2 38.8 31.2 38.8 32.4C38.8 33.8 39.8 34.4 41.8 35.2L43.6 35.8C47.4 37.2 49.4 39 49.4 41.2Z" fill="#000000" />
          </svg>
        );

      case "typescript": // Flat TS badge
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#3178C6" />
            <path d="M18 20H34V24H28V46H24V24H18V20ZM38.4 41.2C38.4 44.2 36 48 30.8 48C26.8 48 24.6 45.6 23.6 43.4L26.8 41.4C27.4 43 28.4 44.8 30.8 44.8C32.8 44.8 34 43.8 34 42.4C34 40.8 32.8 40.2 30.8 39.4L29 38.8C25.6 37.6 24.2 35.6 24.2 32.8C24.2 29.8 26.6 26.8 30.6 26.8C34.2 26.8 36.2 28.8 37 30.6L34 32.6C33.6 31.6 32.6 30.2 30.6 30.2C29 30.2 27.8 31.2 27.8 32.4C27.8 33.8 28.8 34.4 30.8 35.2L32.6 35.8C36.4 37.2 38.4 39 38.4 41.2Z" fill="#FFFFFF" />
          </svg>
        );

      case "python": // Flat Python snake logo
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 6C23.6 6 22 7.7 22 13.5V19.5H32.2V21H18.2C12.4 21 10.7 22.6 10.7 31C10.7 39.4 12.4 41 18.2 41H21.2V36.8C21.2 29.8 25.8 26 32.8 26H42.8V13.5C42.8 7.7 41 6 32 6Z" fill="#3776AB" />
            <path d="M32 58C40.4 58 42 56.3 42 50.5V44.5H31.8V43H45.8C51.6 43 53.3 41.4 53.3 33C53.3 24.6 51.6 23 45.8 23H42.8V27.2C42.8 34.2 38.2 38 31.2 38H21.2V50.5C21.2 56.3 23 58 32 58Z" fill="#FFD43B" />
            <circle cx="27" cy="11.5" r="2.5" fill="#FFFFFF" />
            <circle cx="37" cy="52.5" r="2.5" fill="#080B14" />
          </svg>
        );

      case "shell":
      case "bash":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="52" height="44" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="3" />
            <path d="M16 22L24 28L16 34" stroke="#00D4FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="28" y1="34" x2="42" y2="34" stroke="#00D4FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "kotlin":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10H54L10 54V10Z" fill="url(#kotlin-grad-1)" />
            <path d="M10 54H54L32 32L54 10H10V54Z" fill="url(#kotlin-grad-2)" />
            <defs>
              <linearGradient id="kotlin-grad-1" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#E57E25" />
                <stop offset="0.5" stop-color="#805299" />
                <stop offset="1" stop-color="#3786F3" />
              </linearGradient>
              <linearGradient id="kotlin-grad-2" x1="10" y1="54" x2="54" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#3786F3" />
                <stop offset="0.5" stop-color="#805299" />
                <stop offset="1" stop-color="#E57E25" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "dart":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 10L14 28L20 48L46 48L50 28L32 10Z" fill="#00B4AB" />
            <path d="M32 10L46 24L40 44L20 44L14 28L32 10Z" fill="#00D4FF" />
            <path d="M32 10L50 28H32V10Z" fill="#007ACC" />
          </svg>
        );

      case "vue":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 54L54 16H42L32 33L22 16H10L32 54Z" fill="#41B883" />
            <path d="M32 54L46 30H38L32 40L26 30H18L32 54Z" fill="#35495E" />
          </svg>
        );

      case "svelte":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 14C36 14 34 22 28 26C22 30 20 26 20 22C20 18 24 14 32 14H44Z" fill="#FF3E00" />
            <path d="M20 50C28 50 30 42 36 38C42 34 44 38 44 42C44 46 40 50 32 50H20Z" fill="#FF3E00" />
            <path d="M32 14C46 14 46 26 36 32C26 38 24 44 32 44C40 44 42 40 42 36" stroke="#FF3E00" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case "elixir":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 10C32 10 14 26 14 40C14 50 22 56 32 56C42 56 50 50 50 40C50 26 32 10 32 10Z" fill="#6E4A7E" />
            <path d="M32 14C32 14 20 28 20 38C20 46 26 50 32 50C38 50 44 46 44 38C44 28 32 14 32 14Z" fill="#A87FBC" />
          </svg>
        );

      case "haskell":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 14L22 32L10 50H18L30 32L18 14H10Z" fill="#5E5086" />
            <path d="M22 14L34 32L22 50H30L42 32L30 14H22Z" fill="#8F4E8B" />
            <path d="M36 28H54V32H36V28ZM40 36H54V40H40V36Z" fill="#5E5086" />
          </svg>
        );

      case "lua":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="24" stroke="#000080" strokeWidth="4" />
            <circle cx="32" cy="32" r="14" fill="#000080" />
            <circle cx="48" cy="16" r="5" fill="#FFA800" />
          </svg>
        );

      case "r":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="28" cy="28" rx="20" ry="14" fill="#7F8C8D" opacity="0.3" />
            <path d="M18 14H32C38 14 42 18 42 24C42 30 38 34 32 34H24V50H18V14ZM24 20V28H32C35 28 36 27 36 24C36 21 35 20 32 20H24Z" fill="#198CE7" />
            <path d="M32 30L44 50H50L37 30H32Z" fill="#198CE7" />
          </svg>
        );

      case "scala":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 46L32 34L52 46L32 58L12 46Z" fill="#DC322F" />
            <path d="M12 30L32 18L52 30L32 42L12 30Z" fill="#DE5B58" />
            <path d="M12 14L32 6L52 14L32 26L12 14Z" fill="#E88381" />
          </svg>
        );

      case "matlab":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 42C10 42 16 16 32 16C48 16 54 42 54 42L32 50L10 42Z" fill="#E16737" />
            <path d="M22 28C22 28 28 12 32 12C36 12 42 28 42 28L32 34L22 28Z" fill="#FFC72C" />
          </svg>
        );

      case "celebrity": // Flat gold crown
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50L6 20L22 34L32 14L42 34L58 20L54 50H10Z" fill="#FFD700" />
            <rect x="10" y="46" width="44" height="6" fill="#DAA520" />
            <circle cx="32" cy="14" r="4" fill="#FF4500" />
            <circle cx="6" cy="20" r="4" fill="#FF4500" />
            <circle cx="58" cy="20" r="4" fill="#FF4500" />
            <circle cx="22" cy="46" r="3" fill="#00D4FF" />
            <circle cx="32" cy="46" r="3" fill="#9F5CF7" />
            <circle cx="42" cy="46" r="3" fill="#00D4FF" />
          </svg>
        );

      case "clock": // Flat colored alarm clock
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="36" r="20" fill="#FF5B5B" />
            <circle cx="32" cy="36" r="16" fill="#FFFFFF" />
            <path d="M32 24V36H40" stroke="#080B14" strokeWidth="4" strokeLinecap="round" />
            <path d="M10 16L18 10" stroke="#080B14" strokeWidth="5" strokeLinecap="round" />
            <path d="M54 16L46 10" stroke="#080B14" strokeWidth="5" strokeLinecap="round" />
            <circle cx="14" cy="54" r="4" fill="#666666" />
            <circle cx="50" cy="54" r="4" fill="#666666" />
          </svg>
        );

      case "bug": // Flat red bug/beetle
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="22" r="8" fill="#4B4B4B" />
            <path d="M32 24C22 24 18 34 18 46C18 56 24 58 32 58C40 58 46 56 46 46C46 34 42 24 32 24Z" fill="#E63946" />
            <line x1="32" y1="24" x2="32" y2="58" stroke="#080B14" strokeWidth="3" />
            <circle cx="26" cy="34" r="3" fill="#080B14" />
            <circle cx="38" cy="34" r="3" fill="#080B14" />
            <circle cx="24" cy="46" r="4" fill="#080B14" />
            <circle cx="40" cy="46" r="4" fill="#080B14" />
            {/* Legs */}
            <path d="M12 28C16 30 18 34 18 34M12 40C16 40 18 42 18 42M12 52C16 50 18 48 18 48" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
            <path d="M52 28C48 30 46 34 46 34M52 40C48 40 46 42 46 42M52 52C48 50 46 48 46 48" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case "fork": // Branch fork node representation
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="18" r="8" fill="#00D4FF" stroke="#080B14" strokeWidth="2" />
            <circle cx="18" cy="46" r="8" fill="#9F5CF7" stroke="#080B14" strokeWidth="2" />
            <circle cx="46" cy="46" r="8" fill="#9F5CF7" stroke="#080B14" strokeWidth="2" />
            <path d="M32 26V34C32 38 18 38 18 42M32 34C32 38 46 38 46 42" stroke="var(--text-primary)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "folder": // Repository directory representation
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M54 48H10V16C10 13.8 11.8 12 14 12H26L32 18H54C56.2 18 58 19.8 58 22V44C58 46.2 56.2 48 54 48Z" fill="#FFA800" />
            <path d="M54 52H10V22H58V48C58 50.2 56.2 52 54 52Z" fill="#FFC72C" />
          </svg>
        );

      case "alert": // Alert warning light siren
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="38" width="20" height="18" rx="4" fill="#4B4B4B" />
            <path d="M14 38C14 28 22 20 32 20C42 20 50 28 50 38H14Z" fill="#FF3C5C" />
            <circle cx="32" cy="12" r="6" fill="#ffe566" />
            <rect x="30" y="18" width="4" height="20" fill="#ffe566" />
          </svg>
        );

      case "badge_machine": // Lightning bolt medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#FFA800" stroke="#FFC72C" strokeWidth="2" />
            <path d="M36 12L20 34H32L28 52L44 30H32L36 12Z" fill="#FFE566" />
          </svg>
        );

      case "badge_warrior": // Scroll medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#3A86FF" stroke="#00B4D8" strokeWidth="2" />
            <rect x="20" y="18" width="24" height="28" rx="2" fill="#FFFFFF" />
            <line x1="24" y1="24" x2="36" y2="24" stroke="#3A86FF" strokeWidth="2" />
            <line x1="24" y1="30" x2="40" y2="30" stroke="#3A86FF" strokeWidth="2" />
            <line x1="24" y1="36" x2="40" y2="36" stroke="#3A86FF" strokeWidth="2" />
          </svg>
        );

      case "badge_explorer": // Globe medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#00FF88" stroke="#10B981" strokeWidth="2" />
            <circle cx="32" cy="32" r="20" fill="#3A86FF" />
            <path d="M32 12C36 16 36 28 32 52C28 28 28 16 32 12Z" fill="#00FF88" />
            <line x1="12" y1="32" x2="52" y2="32" stroke="#00FF88" strokeWidth="2" />
          </svg>
        );

      case "badge_hoarder": // Box/package medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#FFC72C" stroke="#FFA800" strokeWidth="2" />
            <path d="M32 14L16 22L32 30L48 22L32 14Z" fill="#FFA800" />
            <path d="M16 24V40L32 48V32L16 24Z" fill="#D48800" />
            <path d="M48 24V40L32 48V32L48 24Z" fill="#B76E00" />
          </svg>
        );

      case "badge_social": // Butterfly medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#9F5CF7" stroke="#FF3C5C" strokeWidth="2" />
            <path d="M32 20C32 20 20 12 16 24C12 36 28 34 32 44C32 44 36 34 52 34C52 22 40 12 32 20Z" fill="#FF3C5C" />
            <circle cx="32" cy="32" r="2" fill="#FFFFFF" />
          </svg>
        );

      case "badge_wolf": // Wolf/night medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#0F172A" stroke="#475569" strokeWidth="2" />
            <path d="M22 22C26 22 36 30 38 42C26 42 22 36 22 22Z" fill="#94A3B8" />
            <circle cx="36" cy="22" r="2" fill="#FFFFFF" />
          </svg>
        );

      case "badge_collector": // Star collector medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#FFA800" stroke="#FFE566" strokeWidth="2" />
            <path d="M32 14L37 25L49 26L40 34L43 46L32 40L21 46L24 34L15 26L27 25L32 14Z" fill="#FFE566" />
          </svg>
        );

      case "badge_celebrity": // Crown medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
            <path d="M18 44L15 24L26 32L32 18L38 32L49 24L46 44H18Z" fill="#DAA520" />
          </svg>
        );

      case "badge_ancient": // Dinosaur medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#00FF88" stroke="#10B981" strokeWidth="2" />
            <path d="M20 44C20 44 22 22 36 22C42 22 46 26 46 30C46 34 38 36 38 40H20Z" fill="#047857" />
            <circle cx="38" cy="26" r="2" fill="#FFFFFF" />
          </svg>
        );

      case "badge_owl": // Owl medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#0D1220" stroke="#9F5CF7" strokeWidth="2" />
            <circle cx="25" cy="30" r="6" fill="#FFFFFF" />
            <circle cx="39" cy="30" r="6" fill="#FFFFFF" />
            <circle cx="25" cy="30" r="2" fill="#000000" />
            <circle cx="39" cy="30" r="2" fill="#000000" />
            <path d="M32 34L29 38H35L32 34Z" fill="#FFA800" />
          </svg>
        );

      case "badge_loyalist": // Key medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#FFA800" stroke="#FFC72C" strokeWidth="2" />
            <circle cx="32" cy="22" r="6" stroke="#FFFFFF" strokeWidth="4" />
            <rect x="30" y="28" width="4" height="20" fill="#FFFFFF" />
            <rect x="34" y="36" width="6" height="4" fill="#FFFFFF" />
            <rect x="34" y="42" width="6" height="4" fill="#FFFFFF" />
          </svg>
        );

      case "badge_bug": // Bug hunter medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#FF3C5C" stroke="#B91C1C" strokeWidth="2" />
            <circle cx="32" cy="24" r="5" fill="#FFFFFF" />
            <rect x="28" y="29" width="8" height="15" rx="3" fill="#FFFFFF" />
          </svg>
        );

      case "badge_fresh": // Hatching egg medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#FFA800" stroke="#FFC72C" strokeWidth="2" />
            <path d="M22 36C22 26 42 26 42 36C42 46 22 46 22 36Z" fill="#FFFFFF" />
            <path d="M22 36H42L36 32L32 36L28 32L22 36Z" fill="#FFC72C" />
          </svg>
        );

      case "badge_ghost": // Ghost medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
            <path d="M20 42V28C20 20 44 20 44 28V42L38 38L32 42L26 38L20 42Z" fill="#FFFFFF" />
            <circle cx="26" cy="28" r="2" fill="#000000" />
            <circle cx="38" cy="28" r="2" fill="#000000" />
          </svg>
        );

      case "badge_philanthropist": // Cash medallion
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#00FF88" stroke="#047857" strokeWidth="2" />
            <rect x="18" y="22" width="28" height="20" rx="2" fill="#FFFFFF" />
            <circle cx="32" cy="32" r="5" fill="#00FF88" />
          </svg>
        );

      case "star": // Sleek gold star
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 10L40.2 26.6L58.6 29.3L45.3 42.3L48.4 60.7L32 52L15.6 60.7L18.7 42.3L5.4 29.3L23.8 26.6L32 10Z" fill="#FFA800" stroke="#FFC72C" strokeWidth="2" />
          </svg>
        );

      case "go": // Go Gopher vector style letters
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#00ADD8" />
            <path d="M14 22H28V26H18V34H26V38H18V46H14V22ZM34 34C34 42 39 46 45 46C51 46 56 42 56 34V32H45V36H52C52 40 49 42 45 42C41 42 38 40 38 34C38 28 41 26 45 26C49 26 52 28 52 32H56C56 24 51 22 45 22C39 22 34 26 34 34Z" fill="#FFFFFF" />
          </svg>
        );

      case "rust": // Rust Gear medallion style
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="24" stroke="#DEA584" strokeWidth="6" strokeDasharray="6 4" />
            <circle cx="32" cy="32" r="16" fill="#080B14" stroke="#DEA584" strokeWidth="3" />
            <path d="M26 24H34C38 24 40 26 40 29C40 31 38 33 36 34L41 42H36L32 35H30V42H26V24ZM30 28V32H34C35.5 32 36.5 31.5 36.5 30C36.5 28.5 35.5 28 34 28H30Z" fill="#DEA584" />
          </svg>
        );

      case "java": // Java Coffee cup
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 46C14 46 12 50 12 52C12 54 22 56 32 56C42 56 52 54 52 52C52 50 50 46 42 46H22Z" fill="#B07219" />
            <path d="M38 10C38 10 32 16 32 22C32 28 36 32 36 38" stroke="#E63946" strokeWidth="4" strokeLinecap="round" />
            <path d="M28 16C28 16 22 22 22 28C22 34 26 38 26 44" stroke="#FFA800" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "cpp": // C++ Pink badge
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#F34B7D" />
            <path d="M30 32C30 38 26 42 20 42C14 42 10 38 10 32C10 26 14 22 20 22C26 22 30 26 30 32Z" stroke="#FFFFFF" strokeWidth="4" fill="none" />
            <path d="M38 32H48M43 27V37M50 32H60M55 27V37" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "c": // C Grey badge
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#555555" />
            <path d="M44 24C40 20 34 20 30 20C20 20 16 26 16 32C16 38 20 44 30 44C34 44 40 44 44 40" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" />
          </svg>
        );

      case "csharp": // C# Green badge
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#178600" />
            <path d="M28 24C25 21 21 21 18 21C11 21 8 26 8 32C8 38 11 43 18 43C21 43 25 43 28 40" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M38 24V40M46 24V40M34 29H50M34 35H50" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "php": // PHP Purple badge
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="32" rx="28" ry="18" fill="#4F5D95" />
            <path d="M18 24H24C27 24 28 25 28 27C28 29 27 30 24 30H20V36H16V24ZM20 27H24V28H20V27Z" fill="#FFFFFF" />
            <path d="M30 24H34V29H38V24H42V36H38V31H34V36H30V24ZM48 24H54C57 24 58 25 58 27C58 29 57 30 54 30H50V36H46V24ZM50 27H54V28H50V27Z" fill="#FFFFFF" />
          </svg>
        );

      case "ruby": // Ruby Red gem
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 54L10 28L20 12H44L54 28L32 54Z" fill="#701516" stroke="#FF3C5C" strokeWidth="2" />
            <path d="M32 54L20 12M32 54L44 12M10 28H54" stroke="#FF3C5C" strokeWidth="1" />
          </svg>
        );

      case "swift": // Swift Orange bird
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#F05138" />
            <path d="M50 48C40 48 14 36 14 20C14 26 22 32 30 36C26 30 22 22 24 14C24 20 30 28 42 34C40 26 36 16 42 16C42 22 46 30 52 34C52 28 48 18 52 18C54 26 54 38 50 48Z" fill="#FFFFFF" />
          </svg>
        );

      case "html": // HTML5 Orange shield
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 10L16 48L32 54L48 48L52 10H12Z" fill="#E34C26" />
            <path d="M32 14V50L44 46L47 14H32Z" fill="#F05138" />
            <path d="M32 22H22L23 28H32V22ZM32 34H23L23.5 39H32V34ZM32 46L24 44L23.5 39H18.5L20 48L32 51V46Z" fill="#FFFFFF" />
            <path d="M32 22V28H41.5L40.5 34H32V39H40L39 44L32 46V51L44 48L46 22H32Z" fill="#ECECEC" />
          </svg>
        );

      case "css": // CSS3 Blue shield
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 10L16 48L32 54L48 48L52 10H12Z" fill="#264DE4" />
            <path d="M32 14V50L44 46L47 14H32Z" fill="#2965F1" />
            <path d="M32 22H22L23 28H32V22ZM32 34H23L23.5 39H32V34ZM32 46L24 44L23.5 39H18.5L20 48L32 51V46Z" fill="#FFFFFF" opacity="0.9" />
            <path d="M32 22V28H41.5L40.5 34H32V39H40L39 44L32 46V51L44 48L46 22H32Z" fill="#ECECEC" />
          </svg>
        );

      case "download":
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 12V42M32 42L20 30M32 42L44 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 50H50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case "code": // Stylized code brackets icon
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 20L10 32L22 44" stroke="#00D4FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 20L54 32L42 44" stroke="#00D4FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="16" x2="28" y2="48" stroke="#9F5CF7" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "sun": // Neon glowing sun
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="12" fill="#FFE566" stroke="#FFA800" strokeWidth="2" />
            <path d="M32 6V14M32 50V58M6 32H14M50 32H58M13.6 13.6L19.2 19.2M44.8 44.8L50.4 50.4M13.6 50.4L19.2 44.8M44.8 19.2L50.4 13.6" stroke="#FFA800" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "moon": // Cyberpunk crescent moon
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M46.5 42C39.5 44 26 38.5 24.5 27.5C23.5 20.5 27 15 28.5 13.5C18.5 14.5 10.5 23 10.5 33.5C10.5 45.4 20.1 55 32 55C41.5 55 49.5 48.5 51.5 40C50 41 48.5 41.5 46.5 42Z" fill="#9F5CF7" stroke="#FF3C5C" strokeWidth="2" />
          </svg>
        );

      case "search": // Search magnifying glass icon
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="16" stroke="#00D4FF" strokeWidth="5" />
            <line x1="40" y1="40" x2="54" y2="54" stroke="#9F5CF7" strokeWidth="6" strokeLinecap="round" />
            <circle cx="24" cy="24" r="6" fill="#FFFFFF" opacity="0.4" />
          </svg>
        );

      case "ping": // Server connection ping antenna
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 44V54M22 54H42M32 20C22.1 20 14 28.1 14 38H18C18 30.3 24.3 24 32 24C39.7 24 46 30.3 46 38H50C50 28.1 41.9 20 32 20ZM32 28C26.5 28 22 32.5 22 38H26C26 34.7 28.7 32 32 32C35.3 32 38 34.7 38 38H42C42 32.5 37.5 28 32 28ZM32 34C29.8 34 28 35.8 28 38H36C36 35.8 34.2 34 32 34Z" fill="#00D4FF" />
          </svg>
        );

      case "social": // Overlapping user silhouettes representing social network / following
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="26" r="8" fill="#9F5CF7" opacity="0.6" />
            <path d="M8 50C8 42 16 38 24 38C28 38 31 39.2 33.5 41.2" stroke="#9F5CF7" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            <circle cx="42" cy="22" r="10" fill="#00D4FF" />
            <path d="M24 50C24 40 33 36 44 36C55 36 64 40 64 50V54H24V50Z" fill="#00D4FF" />
          </svg>
        );

      case "profile": // User profile silhouette
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="22" r="10" fill="#9F5CF7" />
            <path d="M12 50C12 40 21 36 32 36C43 36 52 40 52 50V54H12V50Z" fill="#9F5CF7" />
          </svg>
        );

      case "chart": // Analysis stats bar chart
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="34" width="8" height="20" rx="1.5" fill="#FFC72C" />
            <rect x="28" y="18" width="8" height="36" rx="1.5" fill="#00FF88" />
            <rect x="42" y="26" width="8" height="28" rx="1.5" fill="#00D4FF" />
          </svg>
        );

      case "write": // Feather pen / writing indictment
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L14 46V54H22L58 18L50 10Z" fill="#FF3C5C" stroke="#B91C1C" strokeWidth="2" />
            <line x1="42" y1="18" x2="50" y2="26" stroke="#B91C1C" strokeWidth="3" />
          </svg>
        );

      case "check": // Modern verification checkmark
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="26" fill="#00FF88" opacity="0.2" />
            <path d="M18 32L28 42L46 20" stroke="#00FF88" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case "dot": // Pulsing status dot
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="16" fill="#00D4FF" />
            <circle cx="32" cy="32" r="28" stroke="#00D4FF" strokeWidth="4" opacity="0.3" />
          </svg>
        );

      default: // Code brackets fallback (safe neutral fallback for unknown languages/icons)
        return (
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 20L10 32L22 44" stroke="#00D4FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 20L54 32L42 44" stroke="#00D4FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="16" x2="28" y2="48" stroke="#9F5CF7" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`flat-icon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      {renderSvg()}
    </div>
  );
}
