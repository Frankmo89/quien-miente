import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";

export default function PlayerCount() {
  const { setPlayerCount, setPhase } = useGame();
  const { trackEvent } = useAnalytics();

  const handlePlayerCountSelect = (count: number) => {
    setPlayerCount(count);
    trackEvent("players_selected", { player_count: count });
    setPhase("player-setup");
  };

  const playerCounts = [3, 4, 5, 6, 7, 8];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ¿Cuántos van a jugar?
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {playerCounts.map((count) => (
            <Button
              key={count}
              size="lg"
              variant="default"
              className="h-24 text-4xl font-bold"
              onClick={() => handlePlayerCountSelect(count)}
            >
              {count}
            </Button>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            className="text-xl"
            onClick={() => setPhase("mode-selection")}
          >
            ← Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
