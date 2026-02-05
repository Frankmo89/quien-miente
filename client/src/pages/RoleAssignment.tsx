import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

/**
 * Trigger heavy haptic feedback when showing role
 */
async function triggerRoleRevealHaptic(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (err) {
    console.warn("[RoleAssignment] Haptics not available:", err);
  }
}

export function RoleAssignmentIntro() {
  const { setPhase, assignRoles } = useGame();

  const handleStart = () => {
    assignRoles();
    setPhase("role-assignment");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-primary">
            ¡Empieza el misterio!
          </h2>
          <p className="text-2xl md:text-3xl text-foreground">
            Pasad el teléfono para recibir su rol en secreto.
          </p>
          <p className="text-xl text-muted-foreground">
            Uno de ustedes será el mentiroso. Los demás, inocentes.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full h-20 text-3xl font-bold"
          onClick={handleStart}
        >
          EMPEZAR REPARTO
        </Button>
      </div>
    </div>
  );
}

type RoleAssignmentState = "waiting" | "revealing" | "shown";

export function RoleAssignment() {
  const { gameState, nextPlayer, setPhase } = useGame();
  const [viewState, setViewState] = useState<RoleAssignmentState>("waiting");

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isLastPlayer = gameState.currentPlayerIndex === gameState.players.length - 1;

  const handleReady = useCallback(async () => {
    setViewState("revealing");
    // Small delay for anticipation, then show role with haptic
    await new Promise(resolve => setTimeout(resolve, 300));
    await triggerRoleRevealHaptic();
    setViewState("shown");
  }, []);

  const handleHideAndNext = useCallback(() => {
    setViewState("waiting");
    if (isLastPlayer) {
      setPhase("role-assignment-complete");
    } else {
      nextPlayer();
    }
  }, [isLastPlayer, nextPlayer, setPhase]);

  if (!currentPlayer) {
    return null;
  }

  // Waiting state - "Pass phone to [Name]"
  if (viewState === "waiting") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="space-y-6">
            <div className="text-8xl">{currentPlayer.avatar}</div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Pasa el teléfono a
            </h2>
            <p className="text-5xl md:text-6xl font-bold text-primary">
              {currentPlayer.name}
            </p>
            <p className="text-xl text-muted-foreground">
              Jugador {gameState.currentPlayerIndex + 1} de {gameState.players.length}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Asegúrate de que nadie más pueda ver la pantalla
            </p>
            <Button
              size="lg"
              className="w-full h-20 text-2xl font-bold"
              onClick={handleReady}
            >
              <Eye className="w-8 h-8 mr-3" />
              ESTOY LISTO
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Revealing state - brief transition
  if (viewState === "revealing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-2xl w-full text-center">
          <div 
            className="text-4xl font-bold text-muted-foreground"
            style={{ 
              opacity: 0.7,
              transform: "scale(0.95)",
              transition: "opacity 150ms ease-out, transform 150ms ease-out"
            }}
          >
            Revelando rol...
          </div>
        </div>
      </div>
    );
  }

  // Shown state - Private Mode with role visible
  const isMentiroso = currentPlayer.role === "mentiroso";

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-200 ${
        isMentiroso 
          ? "bg-destructive/10" 
          : "bg-primary/10"
      }`}
    >
      {/* Private Mode Indicator Border */}
      <div 
        className={`fixed inset-0 pointer-events-none border-8 ${
          isMentiroso 
            ? "border-destructive/60" 
            : "border-primary/60"
        }`}
        style={{ 
          opacity: 1,
          transition: "opacity 200ms ease-out"
        }}
      />
      
      {/* Privacy Warning Banner */}
      <div 
        className={`fixed top-0 left-0 right-0 py-3 text-center font-bold text-lg ${
          isMentiroso 
            ? "bg-destructive text-destructive-foreground" 
            : "bg-primary text-primary-foreground"
        }`}
      >
        🔒 MODO PRIVADO - Solo {currentPlayer.name} debe mirar
      </div>

      <div className="max-w-2xl w-full text-center space-y-10 mt-8">
        <div className="space-y-4">
          <div className="text-7xl">{currentPlayer.avatar}</div>
          <p className="text-2xl font-semibold text-foreground">
            {currentPlayer.name}
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-xl text-muted-foreground uppercase tracking-widest">
            Tu rol es
          </p>
          <div 
            className={`text-6xl md:text-7xl font-black uppercase tracking-tight ${
              isMentiroso 
                ? "text-destructive" 
                : "text-primary"
            }`}
            style={{
              opacity: 1,
              transform: "scale(1)",
              transition: "opacity 200ms ease-out, transform 200ms ease-out"
            }}
          >
            {isMentiroso ? "MENTIROSO" : "INOCENTE"}
          </div>
          
          {isMentiroso ? (
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Debes inventar una historia convincente. ¡Que no te descubran!
            </p>
          ) : (
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Escucha atentamente y descubre quién miente.
            </p>
          )}
        </div>

        <Button
          size="lg"
          variant={isMentiroso ? "destructive" : "default"}
          className="w-full h-20 text-2xl font-bold"
          onClick={handleHideAndNext}
        >
          <EyeOff className="w-8 h-8 mr-3" />
          ENTENDIDO (OCULTAR)
          <ChevronRight className="w-8 h-8 ml-3" />
        </Button>
      </div>
    </div>
  );
}

export function RoleAssignmentComplete() {
  const { setPhase, gameState } = useGame();
  const liarCount = gameState.players.filter(p => p.role === "mentiroso").length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-primary">
            ¡Todos tienen su rol!
          </h2>
          <p className="text-2xl md:text-3xl text-foreground">
            {liarCount} mentiroso{liarCount > 1 ? "s" : ""} entre ustedes...
          </p>
          <p className="text-xl text-muted-foreground">
            Es hora de ver la pregunta y empezar a contar historias.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full h-20 text-3xl font-bold"
          onClick={() => setPhase("question")}
        >
          VER LA PREGUNTA
        </Button>
      </div>
    </div>
  );
}
        >
          MOSTRAR PREGUNTA
        </Button>
      </div>
    </div>
  );
}
