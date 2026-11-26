import { POSITIONS } from "../../../config/constants.js";

export const PositionBadge = ({ position }) =>
  POSITIONS[position] ? <span className={`pos pos${position}`}>{POSITIONS[position]}</span> : null;
