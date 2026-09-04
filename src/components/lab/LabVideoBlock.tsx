"use client";

import { useRef, type CSSProperties } from "react";
import type { LabVideo } from "@/lib/lab";
import styles from "./LabVideoBlock.module.css";

function ratioStyle(ratio: number): CSSProperties {
  return { aspectRatio: String(ratio) };
}

export default function LabVideoBlock({
  video,
  ariaLabel,
}: {
  video: LabVideo;
  ariaLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekTo = (index: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.pause();
    v.currentTime = (v.duration * (index + 0.5)) / video.frames.length;
  };

  const resume = () => {
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div className={styles.block}>
      <div className={styles.stage} style={ratioStyle(video.ratio)}>
        <video
          ref={videoRef}
          className={styles.video}
          src={video.src}
          poster={video.frames[0]?.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className={styles.videoLabel}>{video.label}</div>

      <div className={styles.filmstrip} onMouseLeave={resume}>
        {video.frames.map((frame, i) => (
          <button
            key={frame.src}
            type="button"
            className={styles.frame}
            style={ratioStyle(frame.ratio)}
            onMouseEnter={() => seekTo(i)}
            onFocus={() => seekTo(i)}
            onBlur={resume}
            aria-label={`${ariaLabel} — ${video.label} — frame ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
