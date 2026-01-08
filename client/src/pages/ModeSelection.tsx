import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Users, Wine } from "lucide-react";

export default function ModeSelection() {
  const { setMode, setPhase } = useGame();
  const { trackEvent } = useAnalytics();

  const handleModeSelect = (mode: "familiar" | "adultos") => {
    setMode(mode);
    trackEvent("mode_selected", { mode });
    setPhase("player-count");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">
            ¿Qué tipo de noche es hoy?
          </h2>
        </div>

        <div className="grid gap-6">
          <Button
            size="lg"
            variant="default"
            className="h-32 text-3xl font-bold flex flex-col gap-3"
            onClick={() => handleModeSelect("familiar")}
          >
            <Users className="w-12 h-12" />
            MODO FAMILIAR
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="h-32 text-3xl font-bold flex flex-col gap-3"
            onClick={() => handleModeSelect("adultos")}
          >
            <Wine className="w-12 h-12" />
            MODO ADULTOS
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            className="text-xl"
            onClick={() => setPhase("home")}
          >
            ← Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
