import { useState } from "react";
import { teamBadgeUrl } from "../../../lib/photos.js";

export function TeamBadge({ player }) {
  const [failed, setFailed] = useState(false);
  const url = teamBadgeUrl(player);
  if (!url || failed) return null;
  return <img className="badge-team" alt="" loading="lazy" src={url} onError={() => setFailed(true)} />;
}
