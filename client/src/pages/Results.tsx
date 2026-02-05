import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Trophy, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

/**
 * Trigger haptic feedback for results
 */
async function triggerResultsHaptic(liarWon: boolean): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    // Different feedback based on outcome
    await Haptics.notification({ 
      type: liarWon ? NotificationType.Warning : NotificationType.Success 
    });
  } catch (err) {
    console.warn("[Results] Haptics not available:", err);
  }
}

export default function Results() {
  const { gameState, calculateResults, setPhase } = useGame();
  const [results, setResults] = useState<{
    liarWon: boolean;
    liarId: string;
    mostVotedPlayerId: string;
    voteCounts: Record<string, number>;
  } | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    
    // Trigger haptic when results are shown
    if (calculatedResults) {
      triggerResultsHaptic(calculatedResults.liarWon);
    }
  }, [calculateResults]);

  useEffect(() => {
    // Auto-reveal after a short delay for dramatic effect
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!results) {
    return null;
  }

  const liar = gameState.players.find((p) => p.id === results.liarId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-4xl w-full space-y-12">
        {/* Main Result - Extra large for group visibility */}
        <div 
          className="text-center space-y-8"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "scale(1)" : "scale(0.95)",
            transition: "opacity 300ms ease-out, transform 300ms ease-out"
          }}
        >
          {results.liarWon ? (
            <>
              <div className="space-y-4">
                <Trophy className="w-24 h-24 md:w-32 md:h-32 mx-auto text-yellow-500" />
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-yellow-500 uppercase">
                  ¡El Mentiroso Gana!
                </h1>
              </div>
              <p className="text-2xl md:text-3xl text-muted-foreground">
                Nadie descubrió la verdad
              </p>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <Target className="w-24 h-24 md:w-32 md:h-32 mx-auto text-primary" />
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-primary uppercase">
                  ¡Descubierto!
                </h1>
              </div>
              <p className="text-2xl md:text-3xl text-muted-foreground">
                Los inocentes encontraron al mentiroso
              </p>
            </>
          )}
        </div>

        {/* Liar Reveal - Large and clear */}
        <div 
          className="bg-card/50 rounded-3xl p-8 md:p-10 border-2 border-border text-center space-y-6"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 400ms ease-out 200ms, transform 400ms ease-out 200ms"
          }}
        >
          <p className="text-xl md:text-2xl text-muted-foreground uppercase tracking-widest">
            El mentiroso era
          </p>
          <div className="flex items-center justify-center gap-6">
            <span className="text-7xl md:text-8xl">{liar?.avatar}</span>
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              {liar?.name}
            </span>
          </div>
        </div>

        {/* Vote Summary - Visible for group discussion */}
        <div 
          className="bg-card/30 rounded-2xl p-6 md:p-8 border border-border space-y-6"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 400ms ease-out 400ms"
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <Users className="w-6 h-6 text-muted-foreground" />
            <p className="text-xl md:text-2xl font-semibold text-muted-foreground">
              Resultados de la votación
            </p>
          </div>
          
          <div className="grid gap-4">
            {gameState.players.map((player) => {
              const voteCount = results.voteCounts[player.id] || 0;
              const isLiar = player.id === results.liarId;
              const isMostVoted = player.id === results.mostVotedPlayerId;
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    isMostVoted 
                      ? "bg-primary/20 border-2 border-primary" 
                      : "bg-card/50 border border-border"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl md:text-5xl">{player.avatar}</span>
                    <div className="text-left">
                      <span className="text-xl md:text-2xl font-bold text-foreground">
                        {player.name}
                      </span>
                      {isLiar && (
                        <span className="ml-3 text-sm md:text-base px-3 py-1 bg-destructive/20 text-destructive rounded-full font-semibold">
                          Mentiroso
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl md:text-4xl font-black text-foreground">
                      {voteCount}
                    </span>
                    <span className="text-lg md:text-xl text-muted-foreground ml-2">
                      {voteCount === 1 ? "voto" : "votos"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scores Section */}
        <div 
          className="space-y-4"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 400ms ease-out 500ms"
          }}
        >
          <h3 className="text-3xl font-bold text-center">Puntuaciones</h3>
          <div className="bg-card p-6 rounded-xl border-2 border-border space-y-3">
            {[...gameState.players]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? "bg-primary/20 border-2 border-primary" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-muted-foreground w-8">
                      #{index + 1}
                    </span>
                    <span className="text-2xl font-bold text-primary">{player.avatar}</span>
                    <span className="text-xl font-semibold">{player.name}</span>
                  </div>
                  <div className="text-3xl font-black text-primary">{player.score}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          size="lg"
          className="w-full h-20 text-2xl md:text-3xl font-bold"
          onClick={() => setPhase("challenge")}
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 400ms ease-out 600ms"
          }}
        >
          CONTINUAR AL RETO
        </Button>
      </div>
    </div>
  );
}
