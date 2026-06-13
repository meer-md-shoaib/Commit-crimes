"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  verdict: string;
  activityPercent: number;
  docsPercent: number;
  consistencyPercent: number;
  popularityPercent: number;
}

export default function ScoreRing({
  score,
  verdict,
  activityPercent,
  docsPercent,
  consistencyPercent,
  popularityPercent,
}: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(502.65); // Circumference for r=80

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // 1. Animate score number
    const duration = 1500;
    const start = performance.now();
    
    let timerId = requestAnimationFrame(function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      
      setAnimatedScore(Math.round(score * ease));
      
      if (progress < 1) {
        timerId = requestAnimationFrame(animate);
      }
    });

    // 2. Animate SVG circle stroke dashoffset
    const targetOffset = circumference - (score / 100) * circumference;
    const offsetTimeout = setTimeout(() => {
      setAnimatedOffset(targetOffset);
    }, 200);

    return () => {
      cancelAnimationFrame(timerId);
      clearTimeout(offsetTimeout);
    };
  }, [score, circumference]);

  // Sub-score bars list
  const subScores = [
    { label: "Activity", val: activityPercent },
    { label: "Documentation", val: docsPercent },
    { label: "Consistency", val: consistencyPercent },
    { label: "Popularity", val: popularityPercent },
  ];

  return (
    <div className="crime-score-layout">
      {/* Dynamic SVG Gauge */}
      <div className="score-ring-wrap glass-card">
        <svg className="score-ring" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#9f5cf7" />
            </linearGradient>
          </defs>
          
          {/* Background circle track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            className="ring-bg"
          />
          
          {/* Fill circle gauge */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            className="ring-fill"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            transform="rotate(-90 100 100)"
            style={{
              transition: "stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="score-center">
          <span className="score-number">
            {animatedScore}
          </span>
          <span className="score-label">
            / 100
          </span>
          <span className="score-verdict">
            {verdict}
          </span>
        </div>
      </div>

      {/* Score Bars List */}
      <div className="score-bars">
        {subScores.map((bar, idx) => (
          <div key={idx} className="score-bar-item">
            <div className="sbi-header">
              <span className="sbi-label">{bar.label}</span>
              <span className="sbi-val">{bar.val}%</span>
            </div>
            
            {/* Progress Track */}
            <div className="sbi-track">
              {/* Progress Fill */}
              <div
                className="sbi-fill"
                style={{
                  width: `${bar.val}%`,
                  transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${idx * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
