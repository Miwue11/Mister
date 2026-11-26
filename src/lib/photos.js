import { MISTER_CDN } from "../config/constants.js";

const fromMister = url => typeof url === "string" && url.startsWith(MISTER_CDN);

export const playerPhotoUrl = p =>
  fromMister(p.foto) ? p.foto : p.misterId ? `${MISTER_CDN}file/cdn-common/players/${encodeURIComponent(p.misterId)}.png` : null;

export const teamBadgeUrl = p => (fromMister(p.escudo) ? p.escudo : null);
