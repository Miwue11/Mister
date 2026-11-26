import { useState } from "react";
import { playerPhotoUrl } from "../lib/photos.js";

export function PlayerPhoto({ player, className = "ph" }) {
  const [failed, setFailed] = useState(false);
  const url = playerPhotoUrl(player);
  if (!url || failed) return <div className={className} aria-hidden="true" />;
  return <img className={className} alt="" loading="lazy" src={url} onError={() => setFailed(true)} />;
}
