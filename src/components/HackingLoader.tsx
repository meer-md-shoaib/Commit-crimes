"use client";
 
import { useEffect, useState, useRef } from "react";
import FlatIcon from "./FlatIcon";
 
interface HackingLoaderProps {
  username: string;
  repo?: string;
}
 
export default function HackingLoader({ username, repo }: HackingLoaderProps) {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
 
  const logsList = [
    `[CONN] Connecting to api.github.com:443...`,
    `[AUTH] Authentication headers attached securely.`,
    `[INIT] Initializing forensic investigation for suspect: @${username}...`,
    repo ? `[REPO] Accessing repository target: /${repo}...` : `[REPO] Accessing public repository index...`,
    `[PROC] Running commit density analyzer...`,
    `[EVAL] Calculating repository-to-description ratios...`,
    `[CODE] Auditing syntax files and parsing code comments...`,
    `[USER] Checking user bio and social media link presence...`,
    `[CALC] Running final Crime Score metrics algorithm...`,
    `[GEN] Generating personalized sarcastic indictment...`,
    `[SAVE] SECURING EVIDENCE CARD FOR TRIAL...`
  ];
 
  useEffect(() => {
    // 1. Percentage counter animation (0 to 100) - Speed up step timer
    let percentTimer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(percentTimer);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4; // Faster steps (4% - 12% at a time)
        return Math.min(100, prev + step);
      });
    }, 40); // 40ms interval instead of 80ms
 
    // 2. Typing logs stream - Speed up typewriter feel
    let logIndex = 0;
    const printLog = () => {
      if (logIndex < logsList.length) {
        setLogs((prev) => [...prev, logsList[logIndex]]);
        logIndex++;
        setTimeout(printLog, Math.random() * 80 + 40); // 40-120ms delay instead of 150-450ms
      }
    };
    printLog();
 
    return () => {
      clearInterval(percentTimer);
    };
  }, [username, repo]);
 
  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
 
  const activeStep = Math.floor(percent / 25);
 
  return (
    <div className="loading-overlay">
      <div className="loading-card glass-card">
        <div className="loading-spinner"></div>
        <p className="loading-title">Gathering Evidence...</p>
        <p className="loading-sub">Rummaging through your repos like a detective with commitment issues ({percent}%)</p>
        
        {/* Animated steps */}
        <div className="loading-steps">
          <div className={`load-step ${activeStep > 0 ? "done" : activeStep === 0 ? "active" : ""} flex items-center gap-2`}>
            <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
              {activeStep > 0 ? (
                <FlatIcon name="check" size={12} />
              ) : activeStep === 0 ? (
                <FlatIcon name="dot" size={12} className="animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full border border-[var(--border-color)]" />
              )}
            </div>
            <span>Pinging GitHub servers...</span>
          </div>
          <div className={`load-step ${activeStep > 1 ? "done" : activeStep === 1 ? "active" : ""} flex items-center gap-2`}>
            <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
              {activeStep > 1 ? (
                <FlatIcon name="check" size={12} />
              ) : activeStep === 1 ? (
                <FlatIcon name="dot" size={12} className="animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full border border-[var(--border-color)]" />
              )}
            </div>
            <span>Profiling your activity...</span>
          </div>
          <div className={`load-step ${activeStep > 2 ? "done" : activeStep === 2 ? "active" : ""} flex items-center gap-2`}>
            <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
              {activeStep > 2 ? (
                <FlatIcon name="check" size={12} />
              ) : activeStep === 2 ? (
                <FlatIcon name="dot" size={12} className="animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full border border-[var(--border-color)]" />
              )}
            </div>
            <span>Calculating how bad it really is...</span>
          </div>
          <div className={`load-step ${activeStep > 3 ? "done" : activeStep === 3 ? "active" : ""} flex items-center gap-2`}>
            <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
              {activeStep > 3 ? (
                <FlatIcon name="check" size={12} />
              ) : activeStep === 3 ? (
                <FlatIcon name="dot" size={12} className="animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full border border-[var(--border-color)]" />
              )}
            </div>
            <span>Writing your indictment...</span>
          </div>
        </div>
 
        {/* Live console logs box */}
        <div
          ref={logContainerRef}
          style={{
            marginTop: "1.5rem",
            height: "110px",
            background: "rgba(5, 7, 14, 0.6)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem",
            overflowY: "auto",
            textAlign: "left",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          {logs.map((log, idx) => (
            <div key={idx} style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--accent-green)", marginRight: "6px" }}>&gt;</span>
              {log}
            </div>
          ))}
          {percent < 100 && (
            <div style={{ color: "var(--accent-cyan)" }}>
              <span style={{ color: "var(--accent-green)", marginRight: "6px" }}>&gt;</span>
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "10px",
                  background: "var(--accent-cyan)",
                  opacity: 0.8
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
