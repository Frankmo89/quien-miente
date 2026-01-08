import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Check, Vote } from "lucide-react";
import { useState } from "react";

export function VotingIntro() {
  const { setPhase, gameState } = useGame();

  const handleStart = () => {
    // Reset to first player for voting
    setPhase("voting");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-6">
          <Vote className="w-24 h-24 mx-auto text-primary" />
          <h2 className="text-5xl md:text-6xl font-bold text-primary">
            El momento de la verdad
          </h2>
          <p className="text-2xl md:text-3xl text-foreground">
            Votad en secreto por la persona que creéis que miente.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full h-20 text-3xl font-bold"
          onClick={handleStart}
        >
          EMPEZAR VOTACIÓN
        </Button>
      </div>
    </div>
  );
}

export function Voting() {
  const { gameState, addVote, setPhase } = useGame();
  const { trackEvent } = useAnalytics();
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const currentVoter = gameState.players[currentVoterIndex];
  const isLastVoter = currentVoterIndex === gameState.players.length - 1;

  // Filter out the current voter from the list of votable players
  const votablePlayers = gameState.players.filter((p) => p.id !== currentVoter.id);

  const handleVote = (votedPlayerId: string) => {
    addVote(currentVoter.id, votedPlayerId);
    setHasVoted(true);
  };

  const handleNext = () => {
    setHasVoted(false);
    if (isLastVoter) {
      trackEvent("voting_completed", {
        player_count: gameState.players.length,
      });
      setPhase("results");
    } else {
      setCurrentVoterIndex(currentVoterIndex + 1);
    }
  };

  if (!currentVoter) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full space-y-12">
        {!hasVoted ? (
          <>
            <div className="text-center space-y-6">
              <div className="text-6xl">{currentVoter.avatar}</div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {currentVoter.name}
              </h2>
              <p className="text-2xl text-muted-foreground">
                ¿Quién crees que miente?
              </p>
            </div>

            <div className="grid gap-4">
              {votablePlayers.map((player) => (
                <Button
                  key={player.id}
                  size="lg"
                  variant="outline"
                  className="h-20 text-2xl font-bold flex items-center justify-start gap-4 hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleVote(player.id)}
                >
                  <span className="text-4xl">{player.avatar}</span>
                  <span>{player.name}</span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-8">
              <Check className="w-24 h-24 mx-auto text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                ¡Voto registrado!
              </h2>
              <p className="text-2xl text-muted-foreground">
                {isLastVoter
                  ? "Todos han votado. Vamos a ver los resultados..."
                  : "Pasa el teléfono al siguiente jugador"}
              </p>
            </div>

            <Button
              size="lg"
              className="w-full h-20 text-3xl font-bold"
              onClick={handleNext}
            >
              {isLastVoter ? "VER RESULTADOS" : "SIGUIENTE JUGADOR"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
