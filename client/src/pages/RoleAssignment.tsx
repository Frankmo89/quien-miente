import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
            Pasad el teléfono para recibir vuestro rol en secreto.
          </p>
          <p className="text-xl text-muted-foreground">
            Uno de vosotros será el mentiroso. Los demás, inocentes.
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

export function RoleAssignment() {
  const { gameState, nextPlayer, setPhase } = useGame();
  const [showRole, setShowRole] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isLastPlayer = gameState.currentPlayerIndex === gameState.players.length - 1;

  const handleShowRole = () => {
    setShowRole(true);
  };

  const handleNext = () => {
    setShowRole(false);
    if (isLastPlayer) {
      setPhase("role-assignment-complete");
    } else {
      nextPlayer();
    }
  };

  if (!currentPlayer) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        {!showRole ? (
          <>
            <div className="space-y-6">
              <div className="text-6xl">{currentPlayer.avatar}</div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {currentPlayer.name}
              </h2>
              <p className="text-2xl text-muted-foreground">
                Mira la pantalla y pulsa para revelar tu rol
              </p>
            </div>

            <Button
              size="lg"
              className="w-full h-20 text-3xl font-bold flex items-center justify-center gap-4"
              onClick={handleShowRole}
            >
              <Eye className="w-8 h-8" />
              VER MI ROL
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-8">
              <div
                className={`p-12 rounded-2xl border-4 ${
                  currentPlayer.role === "mentiroso"
                    ? "bg-destructive/20 border-destructive"
                    : "bg-primary/20 border-primary"
                }`}
              >
                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  {currentPlayer.role === "mentiroso" ? "ERES EL MENTIROSO" : "ERES INOCENTE"}
                </h2>
                <p className="text-2xl font-semibold">
                  {currentPlayer.role === "mentiroso"
                    ? "Tu objetivo: que no te descubran"
                    : "Tu objetivo: encontrar al mentiroso"}
                </p>
              </div>

              <p className="text-xl text-muted-foreground">
                Memoriza tu rol y no lo reveles a nadie
              </p>
            </div>

            <Button
              size="lg"
              className="w-full h-20 text-3xl font-bold flex items-center justify-center gap-4"
              onClick={handleNext}
            >
              <EyeOff className="w-8 h-8" />
              OCULTAR Y PASAR EL TELÉFONO
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function RoleAssignmentComplete() {
  const { setPhase } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-primary">
            La suerte está echada
          </h2>
          <p className="text-2xl md:text-3xl text-foreground">
            Leed la siguiente pregunta en voz alta.
          </p>
          <p className="text-xl text-muted-foreground">
            El mentiroso debe inventar. Los demás, contad la verdad.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full h-20 text-3xl font-bold"
          onClick={() => setPhase("question")}
        >
          MOSTRAR PREGUNTA
        </Button>
      </div>
    </div>
  );
}
