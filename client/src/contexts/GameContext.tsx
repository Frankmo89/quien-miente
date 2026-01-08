import React, { createContext, useContext, useState, ReactNode } from "react";

export type GameMode = "familiar" | "adultos";
export type PlayerRole = "inocente" | "mentiroso";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role?: PlayerRole;
  score: number;
}

export interface Vote {
  voterId: string;
  votedPlayerId: string;
}

export type GamePhase =
  | "home"
  | "mode-selection"
  | "player-count"
  | "player-setup"
  | "role-assignment-intro"
  | "role-assignment"
  | "role-assignment-complete"
  | "question"
  | "voting-intro"
  | "voting"
  | "results"
  | "challenge"
  | "end-round"
  | "store";

interface GameState {
  phase: GamePhase;
  mode: GameMode | null;
  playerCount: number;
  players: Player[];
  currentPlayerIndex: number;
  currentQuestion: string | null;
  currentQuestionId: number | null;
  votes: Vote[];
  liarId: string | null;
  roundNumber: number;
  unlockedPacks: string[];
  isDemoMode?: boolean;
}

interface GameContextType {
  gameState: GameState;
  setPhase: (phase: GamePhase) => void;
  setMode: (mode: GameMode) => void;
  setPlayerCount: (count: number) => void;
  addPlayer: (player: Omit<Player, "id" | "score">) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  assignRoles: () => void;
  nextPlayer: () => void;
  setCurrentQuestion: (question: string, questionId: number) => void;
  addVote: (voterId: string, votedPlayerId: string) => void;
  calculateResults: () => {
    liarWon: boolean;
    liarId: string;
    mostVotedPlayerId: string;
    voteCounts: Record<string, number>;
  };
  resetRound: () => void;
  resetGame: () => void;
  unlockPack: (packId: string) => void;
  isPackUnlocked: (packId: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    phase: "home",
    mode: null,
    playerCount: 0,
    players: [],
    currentPlayerIndex: 0,
    currentQuestion: null,
    currentQuestionId: null,
    votes: [],
    liarId: null,
    roundNumber: 0,
    unlockedPacks: ["para-romper-el-hielo"], // Free pack is always unlocked
  });

  const setPhase = (phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, phase }));
  };

  const setMode = (mode: GameMode) => {
    setGameState((prev) => ({ ...prev, mode }));
  };

  const setPlayerCount = (count: number) => {
    setGameState((prev) => ({ ...prev, playerCount: count }));
  };

  const addPlayer = (player: Omit<Player, "id" | "score">) => {
    const newPlayer: Player = {
      ...player,
      id: `player-${Date.now()}-${Math.random()}`,
      score: 0,
    };
    setGameState((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const assignRoles = () => {
    const playerIds = gameState.players.map((p) => p.id);
    const randomIndex = Math.floor(Math.random() * playerIds.length);
    const liarId = playerIds[randomIndex];

    setGameState((prev) => ({
      ...prev,
      liarId,
      players: prev.players.map((p) => ({
        ...p,
        role: p.id === liarId ? "mentiroso" : "inocente",
      })),
      currentPlayerIndex: 0,
    }));
  };

  const nextPlayer = () => {
    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: prev.currentPlayerIndex + 1,
    }));
  };

  const setCurrentQuestion = (question: string, questionId: number) => {
    setGameState((prev) => ({
      ...prev,
      currentQuestion: question,
      currentQuestionId: questionId,
    }));
  };

  const addVote = (voterId: string, votedPlayerId: string) => {
    setGameState((prev) => ({
      ...prev,
      votes: [...prev.votes, { voterId, votedPlayerId }],
    }));
  };

  const calculateResults = () => {
    const voteCounts: Record<string, number> = {};

    // Count votes
    gameState.votes.forEach((vote) => {
      voteCounts[vote.votedPlayerId] = (voteCounts[vote.votedPlayerId] || 0) + 1;
    });

    // Find most voted player
    let mostVotedPlayerId = "";
    let maxVotes = 0;

    Object.entries(voteCounts).forEach(([playerId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVotedPlayerId = playerId;
      }
    });

    const liarWon = mostVotedPlayerId !== gameState.liarId;

    // Update scores
    if (liarWon) {
      // Liar gets +2 points
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((p) =>
          p.id === prev.liarId ? { ...p, score: p.score + 2 } : p
        ),
      }));
    } else {
      // Players who voted for the liar get +1 point
      const correctVoters = gameState.votes
        .filter((v) => v.votedPlayerId === gameState.liarId)
        .map((v) => v.voterId);

      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((p) =>
          correctVoters.includes(p.id) ? { ...p, score: p.score + 1 } : p
        ),
      }));
    }

    return {
      liarWon,
      liarId: gameState.liarId!,
      mostVotedPlayerId,
      voteCounts,
    };
  };

  const resetRound = () => {
    setGameState((prev) => ({
      ...prev,
      votes: [],
      currentPlayerIndex: 0,
      currentQuestion: null,
      currentQuestionId: null,
      liarId: null,
      players: prev.players.map((p) => ({ ...p, role: undefined })),
      roundNumber: prev.roundNumber + 1,
    }));
  };

  const resetGame = () => {
    setGameState((prev) => ({
      phase: "home",
      mode: null,
      playerCount: 0,
      players: [],
      currentPlayerIndex: 0,
      currentQuestion: null,
      currentQuestionId: null,
      votes: [],
      liarId: null,
      roundNumber: 0,
      unlockedPacks: prev.unlockedPacks, // Keep unlocked packs
    }));
  };

  const unlockPack = (packId: string) => {
    setGameState((prev) => {
      if (prev.unlockedPacks.includes(packId)) {
        return prev;
      }
      
      // Save to localStorage
      const newUnlockedPacks = [...prev.unlockedPacks, packId];
      localStorage.setItem("unlocked_packs", JSON.stringify(newUnlockedPacks));
      
      return {
        ...prev,
        unlockedPacks: newUnlockedPacks,
      };
    });
  };

  const isPackUnlocked = (packId: string) => {
    // Check if demo mode is enabled
    const isDemoMode = localStorage.getItem("demo_mode") === "true";
    if (isDemoMode) return true;
    
    return gameState.unlockedPacks.includes(packId);
  };

  // Load unlocked packs from localStorage on mount
  React.useEffect(() => {
    // Check for demo mode (all packs unlocked)
    const isDemoMode = localStorage.getItem("demo_mode") === "true";
    
    if (isDemoMode) {
      // Unlock all packs in demo mode
      setGameState((prev) => ({
        ...prev,
        unlockedPacks: [
          "para-romper-el-hielo",
          "salseo-total",
          "dilemas-morales",
          "recuerdos-infancia",
          "historias-viaje",
          "office-secrets",
          "extreme-travel",
          "icebreaker"
        ],
      }));
      return;
    }
    
    const stored = localStorage.getItem("unlocked_packs");
    if (stored) {
      try {
        const packs = JSON.parse(stored);
        setGameState((prev) => ({
          ...prev,
          unlockedPacks: packs,
        }));
      } catch (e) {
        console.error("Failed to parse unlocked packs from localStorage", e);
      }
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPhase,
        setMode,
        setPlayerCount,
        addPlayer,
        updatePlayer,
        assignRoles,
        nextPlayer,
        setCurrentQuestion,
        addVote,
        calculateResults,
        resetRound,
        resetGame,
        unlockPack,
        isPackUnlocked,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

// Function to enable demo mode (all packs unlocked)
export function enableDemoMode() {
  localStorage.setItem("demo_mode", "true");
  window.location.reload();
}

// Function to disable demo mode
export function disableDemoMode() {
  localStorage.removeItem("demo_mode");
  window.location.reload();
}
