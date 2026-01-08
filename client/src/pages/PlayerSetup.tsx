import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/contexts/GameContext";
import { useState } from "react";

const AVATARS = ["😀", "😎", "🤓", "😈", "🤠", "🥳", "🤡", "👻", "👽", "🤖", "🐶", "🐱", "🦊", "🐼", "🦁", "🐸"];

export default function PlayerSetup() {
  const { gameState, addPlayer, setPhase } = useGame();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      addPlayer({ name: playerName.trim(), avatar: selectedAvatar });
      setPlayerName("");
      setSelectedAvatar(AVATARS[(currentPlayerIndex + 1) % AVATARS.length]);
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    }
  };

  const handleContinue = () => {
    if (gameState.players.length === gameState.playerCount) {
      setPhase("role-assignment-intro");
    }
  };

  const isComplete = gameState.players.length === gameState.playerCount;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Presentaos, jugadores
          </h2>
          <p className="text-xl text-muted-foreground">
            Jugador {gameState.players.length + 1} de {gameState.playerCount}
          </p>
        </div>

        {!isComplete && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-2xl font-semibold">Tu nombre:</label>
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Escribe tu nombre"
                className="h-16 text-2xl"
                maxLength={20}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddPlayer();
                  }
                }}
              />
            </div>

            <div className="space-y-3">
              <label className="text-2xl font-semibold">Elige tu avatar:</label>
              <div className="grid grid-cols-8 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-3 rounded-lg border-4 transition-all ${
                      selectedAvatar === avatar
                        ? "border-primary bg-primary/10 scale-110"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-16 text-2xl font-bold"
              onClick={handleAddPlayer}
              disabled={!playerName.trim()}
            >
              Añadir Jugador
            </Button>
          </div>
        )}

        {gameState.players.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Jugadores añadidos:</h3>
            <div className="grid gap-3">
              {gameState.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border-2 border-border"
                >
                  <span className="text-4xl">{player.avatar}</span>
                  <span className="text-2xl font-semibold">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isComplete && (
          <Button
            size="lg"
            className="w-full h-20 text-3xl font-bold"
            onClick={handleContinue}
          >
            ¡LISTOS!
          </Button>
        )}

        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            className="text-xl"
            onClick={() => setPhase("player-count")}
          >
            ← Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
