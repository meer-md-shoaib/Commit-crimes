"use client";

import { useEffect, useState } from "react";

interface RepolyticsProps {
  commits: Array<{ message: string; date: string; author: string }> | null;
}

export default function Repolytics({ commits }: RepolyticsProps) {
  const [data, setData] = useState({
    night: 0,   // 12am - 6am (Goblin Hour)
    morning: 0, // 6am - 12pm (Corporate Drone Hour)
    afternoon: 0, // 12pm - 6pm (Active procrastination)
    evening: 0,  // 6pm - 12am (Overtime/Panicking)
  });

  useEffect(() => {
    if (!commits || commits.length === 0) {
      // Generate randomized realistic developer stats if no commits are passed
      setData({
        night: Math.floor(Math.random() * 25) + 30, // 30-55%
        morning: Math.floor(Math.random() * 15) + 5, // 5-20%
        afternoon: Math.floor(Math.random() * 20) + 15, // 15-35%
        evening: Math.floor(Math.random() * 25) + 20, // 20-45%
      });
      return;
    }

    // Parse commit dates
    let night = 0;
    let morning = 0;
    let afternoon = 0;
    let evening = 0;

    commits.forEach((c) => {
      try {
        const hour = new Date(c.date).getHours();
        if (hour >= 0 && hour < 6) night++;
        else if (hour >= 6 && hour < 12) morning++;
        else if (hour >= 12 && hour < 18) afternoon++;
        else evening++;
      } catch {
        evening++;
      }
    });

    const total = commits.length || 1;
    setData({
      night: Math.round((night / total) * 100),
      morning: Math.round((morning / total) * 100),
      afternoon: Math.round((afternoon / total) * 100),
      evening: Math.round((evening / total) * 100),
    });
  }, [commits]);

  const categories = [
    {
      label: "Night",
      time: "12:00 AM - 6:00 AM",
      percent: data.night,
      subtitle: "Chaos Goblin Zone",
      desc: "Commits typed in pitch darkness, fueled by bad postures and energy drinks.",
      colorClass: "night"
    },
    {
      label: "Morning",
      time: "6:00 AM - 12:00 PM",
      percent: data.morning,
      subtitle: "Ghost Town",
      desc: "Practically inactive. Either sleeping off the night shift or ignoring standups.",
      colorClass: "morning"
    },
    {
      label: "Afternoon",
      time: "12:00 PM - 6:00 PM",
      percent: data.afternoon,
      subtitle: "Active Procrastination",
      desc: "Slow commits made just in time to show activity before standdown.",
      colorClass: "afternoon"
    },
    {
      label: "Evening",
      time: "6:00 PM - 12:00 AM",
      percent: data.evening,
      subtitle: "Overtime Panic",
      desc: "Hurried commits to meet deadlines, containing mostly 'fix typo' comments.",
      colorClass: "evening"
    }
  ];

  return (
    <div className="repolytics-container">
      {/* 24h Vertical Chart */}
      <div className="heatmap-card glass-card">
        <div className="heatmap-title">
          Commit Activity Heatmap by Time of Day
        </div>

        {categories.map((cat, idx) => (
          <div key={idx} className="heatmap-bar-col">
            {/* Tooltip / value */}
            <span className="heatmap-val">
              {cat.percent}%
            </span>
            
            {/* The Bar */}
            <div className="heatmap-bar-track">
              <div
                className={`heatmap-bar-fill ${cat.colorClass}`}
                style={{
                  height: `${Math.max(5, cat.percent)}%`,
                }}
              />
            </div>

            {/* Label */}
            <span className="heatmap-label">
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Description breakdown list */}
      <div className="heatmap-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="heatmap-detail-card glass-card">
            <div className="heatmap-detail-header">
              <span className="heatmap-detail-label">{cat.label}</span>
              <span className="heatmap-detail-time">{cat.time}</span>
            </div>
            <span className="heatmap-detail-subtitle">{cat.subtitle} ({cat.percent}%)</span>
            <p className="heatmap-detail-desc">
              {cat.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
