import { InstallGuide } from "./InstallGuide.jsx";
import { MisterConnection } from "./MisterConnection.jsx";
import { RatioSettings } from "./RatioSettings.jsx";
import { WhoAmI } from "./WhoAmI.jsx";

export const LigaSection = () => (
  <>
    <WhoAmI />
    <MisterConnection />
    <InstallGuide />
    <RatioSettings />
  </>
);
