import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { trpc } from "@/lib/trpc";
import { Loader2, MessageCircleQuestion, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Question() {
  const { gameState, setCurrentQuestion, setPhase } = useGame();
  const { trackEvent } = useAnalytics();

  // Use unlocked packs or default to free pack
  const packsToUse = gameState.unlockedPacks.length > 0 ? gameState.unlockedPacks : ["para-romper-el-hielo"];

  const { data: question, isLoading, error, refetch } = trpc.game.getRandomQuestion.useQuery(
    {
      packIds: packsToUse,
      mode: gameState.mode!,
    },
    {
      enabled: !!gameState.mode,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (question) {
      setCurrentQuestion(question.questionText, question.id);
      trackEvent("question_shown", {
        mode: gameState.mode,
        question_id: question.id,
      });
    }
  }, [question, setCurrentQuestion, trackEvent, gameState.mode]);

  const handleNewQuestion = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
          <p className="text-2xl text-muted-foreground">Cargando pregunta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <h2 className="text-4xl font-bold text-destructive">Error al cargar la pregunta</h2>
          <p className="text-xl text-muted-foreground">{error.message}</p>
          <Button
            size="lg"
            className="w-full h-16 text-2xl font-bold"
            onClick={() => setPhase("home")}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header - visible for group */}
        <div className="text-center space-y-4">
          <MessageCircleQuestion className="w-16 h-16 md:w-20 md:h-20 mx-auto text-primary" />
          <p className="text-xl md:text-2xl text-muted-foreground uppercase tracking-widest font-semibold">
            Ronda {gameState.roundNumber || 1}
          </p>
        </div>

        {/* Main Question - Large text for group visibility */}
        <div className="bg-card/50 rounded-3xl p-8 md:p-12 border-2 border-border">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-foreground leading-tight">
            {gameState.currentQuestion}
          </h1>
        </div>

        {/* Instructions - Medium size for context */}
        <div className="text-center space-y-2">
          <p className="text-xl md:text-2xl text-muted-foreground">
            Cada jugador debe contar su historia.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground/80">
            El mentiroso debe inventar una historia convincente.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handleNewQuestion}
            className="flex-1 h-16 text-xl font-bold"
          >
            <RefreshCw className="w-6 h-6 mr-2" />
            Otra pregunta
          </Button>
          <Button
            size="lg"
            onClick={() => setPhase("voting-intro")}
            className="flex-1 h-16 text-xl font-bold"
          >
            EMPEZAR VOTACIÓN
          </Button>
        </div>
      </div>
    </div>
  );
}
