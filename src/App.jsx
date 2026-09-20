import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import "./index.css";
import IntroScene from "./scenes/IntroScene";
import OpeningScene from "./scenes/OpeningScene";
import IdentityScene from "./scenes/IdentityScene";
import NameScene from "./scenes/NameScene";
import RevealScene from "./scenes/RevealScene";
import TicketScene from "./scenes/TicketScene";
import EndingScene from "./scenes/EndingScene";
import useSound from "./hooks/useSound";
import { generateTicketId, sanitizeName } from "./data/event";

const SCENES = [
  "intro",
  "opening",
  "identity",
  "name",
  "reveal",
  "ticket",
  "ending",
];

function App() {
  const [scene, setScene] = useState("intro");
  const [name, setName] = useState("");
  const [archetype, setArchetype] = useState(null);
  const ticketId = useMemo(() => generateTicketId(), []);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const goTo = useCallback((next) => setScene(next), []);

  const advance = useCallback(() => {
    const idx = SCENES.indexOf(scene);
    if (idx < SCENES.length - 1) setScene(SCENES[idx + 1]);
  }, [scene]);

  const restart = useCallback(() => {
    setScene("intro");
  }, []);

  const handleName = useCallback(
    (n) => {
      setName(sanitizeName(n).toUpperCase());
      goTo("reveal");
    },
    [goTo],
  );

  return (
    <div className="App min-h-screen w-full relative overflow-x-hidden grain vignette">
      {scene === "intro" && (
        <IntroScene
          onNext={() => goTo("opening")}
          reducedMotion={reducedMotion}
          onSound={play}
        />
      )}
      {scene === "opening" && (
        <OpeningScene
          onNext={() => goTo("identity")}
          reducedMotion={reducedMotion}
          onSound={play}
        />
      )}
      {scene === "identity" && (
        <IdentityScene
          onNext={(a) => {
            setArchetype(a);
            goTo("name");
          }}
          onSound={play}
        />
      )}
      {scene === "name" && (
        <NameScene onSubmit={handleName} archetype={archetype} onSound={play} />
      )}
      {scene === "reveal" && (
        <RevealScene
          name={name}
          onNext={() => goTo("ticket")}
          reducedMotion={reducedMotion}
          onSound={play}
        />
      )}
      {scene === "ticket" && (
        <TicketScene
          name={name}
          ticketId={ticketId}
          onNext={() => goTo("ending")}
          onSound={play}
        />
      )}
      {scene === "ending" && <EndingScene name={name} ticketId={ticketId} onSound={play} />}
    </div>
  );
}

export default App;
