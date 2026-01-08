import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { Laugh, Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function Challenge() {
  const { gameState, setPhase } = useGame();

  const { data: challenge, isLoading } = trpc.game.getRandomChallenge.useQuery(
    {
      mode: gameState.mode!,
    },
    {
      enabled: !!gameState.mode,
      refetchOnWindowFocus: false,
    }
  );

  // Determine who gets the challenge
  const challengeRecipient = useMemo(() => {
    const voteCounts: Record<string, number> = {};
    gameState.votes.forEach((vote) => {
      voteCounts[vote.votedPlayerId] = (voteCounts[vote.votedPlayerId] || 0) + 1;
    });

    const mostVotedPlayerId = Object.entries(voteCounts).reduce(
      (max, [playerId, count]) => (count > max.count ? { playerId, count } : max),
      { playerId: "", count: 0 }
    ).playerId;

    const liarWon = mostVotedPlayerId !== gameState.liarId;

    if (liarWon) {
      // Liar won, so innocents with most votes get the challenge
      return gameState.players.find((p) => p.id === mostVotedPlayerId);
    } else {
      // Liar lost, so liar gets the challenge
      return gameState.players.find((p) => p.id === gameState.liarId);
    }
  }, [gameState]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
          <p className="text-2xl text-muted-foreground">Cargando reto...</p>
        </div>
      </div>
    );
  }

  if (!challenge || !challengeRecipient) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-8">
          <Laugh className="w-24 h-24 mx-auto text-accent" />
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-accent">
              ¡Alguien tiene que pagar!
            </h2>

            <div className="bg-card p-8 rounded-2xl border-4 border-accent">
              <div className="text-6xl mb-4">{challengeRecipient.avatar}</div>
              <p className="text-3xl font-bold mb-6">{challengeRecipient.name}</p>
              <div className="bg-accent/20 p-6 rounded-xl">
                <p className="text-2xl md:text-3xl font-semibold text-card-foreground leading-relaxed">
                  {challenge.challengeText}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xl text-muted-foreground">
            ¡A cumplir el reto! 🎭
          </p>
        </div>

        <Button
          size="lg"
          className="w-full h-20 text-3xl font-bold"
          onClick={() => setPhase("end-round")}
        >
          RETO CUMPLIDO
        </Button>
      </div>
    </div>
  );
}
