import { useState } from "react";

export function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={`cp${done ? " done" : ""}`}
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
    >
      {done ? "✓ Copied" : "Copy"}
    </button>
  );
}

export function Tag({ label, v = "ta" }) {
  return <span className={`tag ${v}`}>{label}</span>;
}

export function Chip({ label, on, onClick }) {
  return (
    <div className={`ch${on ? " on" : ""}`} onClick={onClick}>
      {on ? "✓ " : ""}
      {label}
    </div>
  );
}

export function Ring({ score }) {
  const c = score >= 70 ? "sr-h" : score >= 45 ? "sr-m" : "sr-l";
  return <div className={`sring ${c}`}>{score}</div>;
}

export function Radar({ size = 72 }) {
  return (
    <div className="radar" style={{ width: size, height: size }}>
      <div className="rcirc" />
      <div className="rcirc" />
      <div className="rcirc" />
      <div className="rsw" />
      <div className="rdot" />
    </div>
  );
}
