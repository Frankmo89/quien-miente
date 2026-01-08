import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { trpc } from "@/lib/trpc";
import { Loader2, MessageCircle } from "lucide-react";
import { useEffect } from "react";

export default function Question() {
  const { gameState, setCurrentQuestion, setPhase } = useGame();
  const { trackEvent } = useAnalytics();

  const { data: question, isLoading, error } = trpc.game.getRandomQuestion.useQuery(
    {
      packIds: gameState.unlockedPacks,
      mode: gameState.mode!,
    },
    {
      enabled: !!gameState.mode && gameState.unlockedPacks.length > 0,
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
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <MessageCircle className="w-20 h-20 text-primary" />
          </div>
          
          <div className="bg-card p-8 md:p-12 rounded-2xl border-4 border-primary shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground leading-relaxed">
              {gameState.currentQuestion}
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-muted-foreground font-semibold">
              El mentiroso debe inventar una historia.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground font-semibold">
              Los demás, contad la verdad.
            </p>
            <p className="text-lg text-muted-foreground">
              ¡Que empiece la conversación!
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-20 text-3xl font-bold"
          onClick={() => setPhase("voting-intro")}
        >
          HEMOS TERMINADO DE HABLAR
        </Button>
      </div>
    </div>
  );
}
