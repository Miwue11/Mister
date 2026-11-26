import { useEffect, useRef, useState } from "react";
import { AdminAlert } from "./components/AdminAlert.jsx";
import { AppHeader } from "./components/AppHeader.jsx";
import { Empty } from "./components/Card.jsx";
import { Tabs } from "./components/Tabs.jsx";
import { SECTIONS } from "./sections/index.js";
import { useLiga } from "./state/LigaProvider.jsx";

// La primera vez, si este móvil aún no tiene dueño, abre «Liga» para elegirlo.
function useInitialTab() {
  const { ready, me, canWrite } = useLiga();
  const [tab, setTab] = useState("plantillas");
  const decided = useRef(false);
  useEffect(() => {
    if (!ready || decided.current) return;
    decided.current = true;
    if (canWrite && !me) setTab("liga");
  }, [ready, me, canWrite]);
  return [tab, setTab];
}

export function App() {
  const { ready } = useLiga();
  const [tab, setTab] = useInitialTab();
  const Section = SECTIONS[tab];
  return (
    <div className="wrap">
      <AppHeader />
      <Tabs current={tab} onChange={setTab} />
      <main>
        {!ready ? <Empty>Cargando la liga…</Empty> : (
          <>
            {tab !== "pendientes" && <AdminAlert onGo={() => setTab("pendientes")} />}
            <Section goTo={setTab} />
          </>
        )}
      </main>
    </div>
  );
}
