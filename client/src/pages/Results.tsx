import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Trophy, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Results() {
  const { gameState, calculateResults, setPhase } = useGame();
  const [results, setResults] = useState<{
    liarWon: boolean;
    liarId: string;
    mostVotedPlayerId: string;
    voteCounts: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
  }, []);

  if (!results) {
    return null;
  }

  const liar = gameState.players.find((p) => p.id === results.liarId);
  const mostVotedPlayer = gameState.players.find((p) => p.id === results.mostVotedPlayerId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-8">
          {results.liarWon ? (
            <>
              <XCircle className="w-24 h-24 mx-auto text-destructive" />
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-destructive">
                  ¡El mentiroso gana!
                </h2>
                <div className="bg-destructive/20 p-8 rounded-2xl border-4 border-destructive">
                  <div className="text-6xl mb-4">{liar?.avatar}</div>
                  <p className="text-3xl font-bold">{liar?.name}</p>
                  <p className="text-2xl text-muted-foreground mt-2">
                    era el mentiroso y os ha engañado a todos
                  </p>
                  <p className="text-4xl font-black text-destructive mt-6">+2 puntos</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <Trophy className="w-24 h-24 mx-auto text-primary" />
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  ¡Inocentes ganan!
                </h2>
                <div className="bg-primary/20 p-8 rounded-2xl border-4 border-primary">
                  <div className="text-6xl mb-4">{liar?.avatar}</div>
                  <p className="text-3xl font-bold">{liar?.name}</p>
                  <p className="text-2xl text-muted-foreground mt-2">
                    era el mentiroso y ha sido descubierto
                  </p>
                </div>
                <p className="text-2xl text-primary font-bold">
                  +1 punto para quienes acertaron
                </p>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-center">Resumen de votos</h3>
          <div className="bg-card p-6 rounded-xl border-2 border-border space-y-3">
            {gameState.players.map((player) => {
              const voteCount = results.voteCounts[player.id] || 0;
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    player.id === results.liarId
                      ? "bg-destructive/20 border-2 border-destructive"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{player.avatar}</span>
                    <span className="text-xl font-semibold">{player.name}</span>
                    {player.id === results.liarId && (
                      <span className="text-sm font-bold text-destructive px-2 py-1 bg-destructive/20 rounded">
                        MENTIROSO
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold">
                    {voteCount} {voteCount === 1 ? "voto" : "votos"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
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
                    <span className="text-3xl">{player.avatar}</span>
                    <span className="text-xl font-semibold">{player.name}</span>
                  </div>
                  <div className="text-3xl font-black text-primary">{player.score}</div>
                </div>
              ))}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-20 text-3xl font-bold"
          onClick={() => setPhase("challenge")}
        >
          CONTINUAR
        </Button>
      </div>
    </div>
  );
}
