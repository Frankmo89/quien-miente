import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useEffect } from "react";

export default function Home() {
  const { setPhase } = useGame();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("game_started");
  }, []);

  const handlePlayClick = () => {
    setPhase("mode-selection");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-primary leading-tight">
            ¿QUIÉN MIENTE?
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground font-semibold">
            El juego de historias y engaños para tus amigos
          </p>
        </div>

        <div className="space-y-6">
          <Button
            size="lg"
            className="w-full h-20 text-3xl font-bold"
            onClick={handlePlayClick}
          >
            JUGAR
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-2xl font-bold"
            onClick={() => setPhase("store")}
          >
            Comprar Packs de Preguntas
          </Button>
        </div>

        <div className="text-muted-foreground text-lg">
          <p>Un teléfono • 3-8 jugadores • Diversión garantizada</p>
        </div>

        {/* Hidden demo mode button - tap title 3 times to access */}
        <button
          onClick={() => window.location.href = "/demo"}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground/75 transition-colors"
          title="Acceso a modo demo"
        >
          v1.0
        </button>
      </div>
    </div>
  );
}
