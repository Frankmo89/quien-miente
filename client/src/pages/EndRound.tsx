import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function EndRound() {
  const { resetRound, resetGame, setPhase, gameState } = useGame();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("game_finished", {
      round_number: gameState.roundNumber,
      player_count: gameState.players.length,
    });
  }, []);

  const handlePlayAgain = () => {
    resetRound();
    setPhase("role-assignment-intro");
  };

  const handleChangeGame = () => {
    resetGame();
    setPhase("home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-primary">
            ¿Listos para otra ronda?
          </h2>
          <p className="text-2xl text-muted-foreground">
            La diversión no tiene que terminar aquí
          </p>
        </div>

        <div className="space-y-6">
          <Button
            size="lg"
            className="w-full h-24 text-3xl font-bold flex items-center justify-center gap-4"
            onClick={handlePlayAgain}
          >
            <RotateCcw className="w-10 h-10" />
            JUGAR OTRA VEZ
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-20 text-2xl font-bold flex items-center justify-center gap-4"
            onClick={handleChangeGame}
          >
            <Home className="w-8 h-8" />
            VOLVER AL INICIO
          </Button>
        </div>

        <div className="text-center text-muted-foreground text-lg">
          <p>¡Gracias por jugar! 🎉</p>
        </div>
      </div>
    </div>
  );
}
