import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useGame } from "./contexts/GameContext";
import Home from "./pages/Home";
import ModeSelection from "./pages/ModeSelection";
import PlayerCount from "./pages/PlayerCount";
import PlayerSetup from "./pages/PlayerSetup";
import { RoleAssignmentIntro, RoleAssignment, RoleAssignmentComplete } from "./pages/RoleAssignment";
import Question from "./pages/Question";
import { VotingIntro, Voting } from "./pages/Voting";
import Results from "./pages/Results";
import Challenge from "./pages/Challenge";
import EndRound from "./pages/EndRound";
import Store from "./pages/Store";
import DemoMode from "./pages/DemoMode";

function Router() {
  const { gameState } = useGame();

  // Phase-based routing for single-device game flow
  const renderPhase = () => {
    switch (gameState.phase) {
      case "home":
        return <Home />;
      case "mode-selection":
        return <ModeSelection />;
      case "player-count":
        return <PlayerCount />;
      case "player-setup":
        return <PlayerSetup />;
      case "role-assignment-intro":
        return <RoleAssignmentIntro />;
      case "role-assignment":
        return <RoleAssignment />;
      case "role-assignment-complete":
        return <RoleAssignmentComplete />;
      case "question":
        return <Question />;
      case "voting-intro":
        return <VotingIntro />;
      case "voting":
        return <Voting />;
      case "results":
        return <Results />;
      case "challenge":
        return <Challenge />;
      case "end-round":
        return <EndRound />;
      case "store":
        return <Store />;
      default:
        // Check for demo mode route
        if (window.location.pathname === "/demo") {
          return <DemoMode />;
        }
        return <Home />;
    }
  };

  return renderPhase();
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
