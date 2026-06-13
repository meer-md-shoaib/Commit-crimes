"use client";

import { useEffect, useRef } from "react";
import FlatIcon from "./FlatIcon";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  name: string;
  score: number;
  verdict: string;
  topLang: string;
  charges: Array<{ charge: string; body: string }>;
  avatarUrl?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  username,
  name,
  score,
  verdict,
  topLang,
  charges,
  avatarUrl,
}: CertificateModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Focus trap & escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Custom high-resolution canvas certificate drawing
  const generatePng = () => {
    // 1. Create high-res canvas (retina ready, 2x scale)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 800;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // 2. Draw Background (Cyberpunk dark grid)
    ctx.fillStyle = "#080b14";
    ctx.fillRect(0, 0, width, height);

    // Draw tech grids
    ctx.strokeStyle = "rgba(99, 179, 255, 0.04)";
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer Cyberpunk border
    ctx.strokeStyle = "rgba(99, 179, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Tech corners brackets
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 4;
    const bracketSize = 25;
    const corners = [
      [30, 30, 1, 1], // Top-Left
      [width - 30, 30, -1, 1], // Top-Right
      [30, height - 30, 1, -1], // Bottom-Left
      [width - 30, height - 30, -1, -1], // Bottom-Right
    ];
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + bracketSize * dy);
      ctx.lineTo(x, y);
      ctx.lineTo(x + bracketSize * dx, y);
      ctx.stroke();
    });

    // 3. Header Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff3c5c";
    ctx.font = "bold 18px Courier New";
    ctx.fillText("DEPARTMENT OF DEVELOPER FORENSICS · ACTIVE INDICTMENT", width / 2, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px Arial Black";
    ctx.fillText("WARRANT OF ARREST", width / 2, 150);

    ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 180);
    ctx.lineTo(width - 100, 180);
    ctx.stroke();

    // 4. Suspect Data Block
    ctx.textAlign = "left";
    ctx.fillStyle = "#8ba3cc";
    ctx.font = "16px Courier New";
    ctx.fillText("SUSPECT ID:", 150, 240);
    ctx.fillText("NAME:", 150, 280);
    ctx.fillText("TOP LANGUAGE:", 150, 320);
    ctx.fillText("CRIME SCORE:", 150, 360);
    ctx.fillText("VERDICT STATUS:", 150, 400);

    ctx.fillStyle = "#00d4ff";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`@${username.toUpperCase()}`, 300, 240);
    ctx.fillText(name || "UNKNOWN ALIAS", 300, 280);
    ctx.fillText(topLang?.toUpperCase() || "NONE (EXCLUSIVELY PROCRASTINATING)", 300, 320);
    
    ctx.fillStyle = "#ff3c5c";
    ctx.font = "bold 22px Arial";
    ctx.fillText(`${score} / 100`, 300, 360);
    ctx.fillText(verdict, 300, 400);

    // 5. Official Stamp "GUILTY"
    ctx.save();
    ctx.translate(width - 320, 290);
    ctx.rotate(-0.25); // Slight tilt
    ctx.strokeStyle = "rgba(255, 60, 92, 0.65)";
    ctx.lineWidth = 6;
    ctx.strokeRect(-120, -45, 240, 90);
    
    ctx.fillStyle = "rgba(255, 60, 92, 0.65)";
    ctx.textAlign = "center";
    ctx.font = "bold 42px Arial Black";
    ctx.fillText("GUILTY", 0, 15);
    ctx.restore();

    // 6. Indictment Charges Box
    ctx.fillStyle = "rgba(13, 18, 32, 0.8)";
    ctx.strokeStyle = "rgba(99, 179, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.fillRect(100, 460, width - 200, 220);
    ctx.strokeRect(100, 460, width - 200, 220);

    ctx.fillStyle = "#9f5cf7";
    ctx.font = "bold 15px Courier New";
    ctx.fillText("SPECIFIED INDICTMENT CHARGES AND EVIDENCE DETECTED:", 120, 495);

    ctx.fillStyle = "#8ba3cc";
    ctx.font = "italic 14px Arial";
    
    // Draw first 2 charges
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    let chargeY = 535;
    charges.slice(0, 2).forEach((c, index) => {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px Arial";
      ctx.fillText(`${index + 1}. [${c.charge.toUpperCase()}]`, 120, chargeY);
      
      ctx.fillStyle = "#8ba3cc";
      ctx.font = "italic 13px Arial";
      const lines = wrapText(c.body, width - 260);
      lines.slice(0, 2).forEach((line, lineIdx) => {
        ctx.fillText(line, 130, chargeY + 22 + (lineIdx * 18));
      });

      chargeY += 75;
    });

    // 7. Footer Seal & Signature
    ctx.textAlign = "left";
    ctx.fillStyle = "#4a6288";
    ctx.font = "12px Courier New";
    ctx.fillText(`DATE ISSUE: ${new Date().toISOString().split("T")[0]}`, 100, 725);
    ctx.fillText("SEAL STATUS: AUDITED & ENCRYPTED", 100, 745);

    ctx.textAlign = "right";
    ctx.fillText("AUTHORIZED BY: FORENSICS BOARD", width - 100, 725);
    ctx.fillStyle = "#00d4ff";
    ctx.font = "italic 16px Courier New";
    ctx.fillText("CommitCrimes.dev", width - 100, 750);

    // 8. Download Triggers
    const link = document.createElement("a");
    link.download = `COMMIT_CRIMES_${username}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-pop-in"
      style={{
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)"
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-2">
            <FlatIcon name="hoarder" size={24} />
            <span className="font-display-bebas text-2xl text-[var(--text-primary)] tracking-wide">
              Official Indictment Warrant
            </span>
          </div>
          <button
            onClick={onClose}
            className="transition-colors p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] hover:text-white cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Certificate Display Layout */}
        <div
          className="p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden select-none"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)"
          }}
        >
          {/* Tech Corner Bracket Elements inside Certificate Card */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: "var(--accent-cyan)" }} />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: "var(--accent-cyan)" }} />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: "var(--accent-cyan)" }} />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: "var(--accent-cyan)" }} />

          {/* Watermark GUILTY Stamp */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 px-8 py-3 font-display-bebas text-6xl rounded-lg pointer-events-none uppercase"
            style={{
              borderColor: "rgba(255, 60, 92, 0.15)",
              color: "rgba(255, 60, 92, 0.15)"
            }}
          >
            Guilty
          </div>

          <div
            className="text-center font-mono text-[9px] tracking-widest uppercase"
            style={{ color: "var(--accent-red)" }}
          >
            OFFICIAL CRIMINAL REPORT WARRANT
          </div>

          <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
            {avatarUrl ? (
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
                style={{
                  border: "2px solid var(--accent-cyan)",
                  boxShadow: "0 0 10px rgba(0, 212, 255, 0.15)"
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)"
                }}
              >
                <FlatIcon name="alert" size={42} />
              </div>
            )}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex gap-2">
                <span className="font-mono text-[var(--text-muted)]">SUSPECT:</span>
                <span className="font-bold" style={{ color: "var(--accent-cyan)" }}>@{username}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-[var(--text-muted)]">NAME:</span>
                <span className="text-[var(--text-secondary)]">{name || "Unknown"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-[var(--text-muted)]">CRIME SCORE:</span>
                <span className="font-bold" style={{ color: "var(--accent-red)" }}>{score}/100 ({verdict})</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2" style={{ borderTop: "1px solid var(--border-color)" }}>
            <span className="font-mono text-[10px] uppercase tracking-wider block mb-2" style={{ color: "var(--accent-violet)" }}>
              Primary Charges Registered:
            </span>
            <div className="flex flex-col gap-3">
              {charges.slice(0, 2).map((c, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 text-xs">
                  <span className="font-bold text-[var(--text-primary)]">
                    {idx + 1}. [{c.charge}]
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic">
                    &quot;{c.body}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex gap-3 justify-end pt-2" style={{ borderTop: "1px solid var(--border-color)" }}>
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-lg transition-all text-xs font-bold flex items-center justify-center border border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--bg-card)] hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={generatePng}
            className="h-10 px-6 rounded-lg text-black font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.25)]"
            style={{
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))"
            }}
          >
            <FlatIcon name="download" size={14} />
            Download PNG Image
          </button>
        </div>
      </div>
    </div>
  );
}
