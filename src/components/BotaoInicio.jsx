import { useState, useEffect } from "react";

export function BotaoInicio() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => {
      setVisivel(window.scrollY > 100);
    };
    window.addEventListener("scroll", aoRolar);
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const irParaTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visivel) return null;

  return (
    <button
      onClick={irParaTopo}
      className="fixed bottom-20 right-6 bg-black/70 text-white rounded-full p-4 shadow-lg hover:bg-black/90 transition-colors z-50"
      aria-label="Ir para o topo"
    >
      ↑
    </button>
  );
}