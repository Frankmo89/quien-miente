import { useGame, enableDemoMode, disableDemoMode } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function DemoMode() {
  const { gameState } = useGame();
  const [isDemoEnabled, setIsDemoEnabled] = useState(false);

  useEffect(() => {
    const demoMode = localStorage.getItem("demo_mode") === "true";
    setIsDemoEnabled(demoMode);
  }, []);

  const handleEnableDemo = () => {
    if (confirm("¿Activar modo demo? Todos los packs estarán desbloqueados.")) {
      enableDemoMode();
    }
  };

  const handleDisableDemo = () => {
    if (confirm("¿Desactivar modo demo? Solo los packs comprados estarán disponibles.")) {
      disableDemoMode();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            Modo Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Acceso ilimitado a todos los packs de preguntas
          </p>
        </div>

        <div className="bg-card p-8 rounded-xl border-2 border-border space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Estado Actual</h2>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-lg font-semibold">Modo Demo:</span>
              <span className={`text-xl font-bold ${isDemoEnabled ? "text-primary" : "text-destructive"}`}>
                {isDemoEnabled ? "✓ ACTIVADO" : "✗ DESACTIVADO"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Packs Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "para-romper-el-hielo", name: "Para Romper el Hielo", status: "Gratis" },
                { id: "salseo-total", name: "Salseo Total", status: isDemoEnabled ? "✓ Desbloqueado" : "Premium" },
                { id: "dilemas-morales", name: "Dilemas Morales", status: isDemoEnabled ? "✓ Desbloqueado" : "Premium" },
                { id: "recuerdos-infancia", name: "Recuerdos de la Infancia", status: isDemoEnabled ? "✓ Desbloqueado" : "Premium" },
                { id: "historias-viaje", name: "Historias de Viaje", status: isDemoEnabled ? "✓ Desbloqueado" : "Premium" },
                { id: "office-secrets", name: "Office Secrets", status: isDemoEnabled ? "✓ Desbloqueado" : "Premium" },
                { id: "extreme-travel", name: "Extreme Travel Anecdotes", status: isDemoEnabled ? "✓ Desbloqueado" : "Premium" },
                { id: "icebreaker", name: "Icebreaker", status: isDemoEnabled ? "✓ Desbloqueado" : "Premium" },
              ].map((pack) => (
                <div key={pack.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">{pack.name}</span>
                  <span className={`text-sm font-bold ${pack.status === "Gratis" || pack.status.includes("✓") ? "text-primary" : "text-muted-foreground"}`}>
                    {pack.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-xl font-bold">Acciones</h3>
            <div className="space-y-3">
              {!isDemoEnabled ? (
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                  onClick={handleEnableDemo}
                >
                  Activar Modo Demo
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full h-14 text-lg font-bold"
                  onClick={handleDisableDemo}
                >
                  Desactivar Modo Demo
                </Button>
              )}
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> El modo demo desbloquea todos los packs de preguntas para que puedas jugar sin restricciones con amigos cercanos. 
              Este modo es solo para desarrollo y pruebas.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="text-lg font-bold h-14"
            onClick={() => window.location.href = "/"}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
