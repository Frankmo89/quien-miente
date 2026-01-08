import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { Check, Loader2, ShoppingBag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";

export default function Store() {
  const { setPhase, isPackUnlocked, unlockPack } = useGame();
  const { trackEvent } = useAnalytics();

  const { data: packs, isLoading } = trpc.game.getPacks.useQuery();
  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  useEffect(() => {
    trackEvent("pack_viewed");
  }, []);

  // Check for purchase result in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchaseStatus = params.get("purchase");
    const packId = params.get("pack");

    if (purchaseStatus === "success" && packId) {
      unlockPack(packId);
      trackEvent("pack_purchased", { pack_id: packId });
      toast.success("¡Pack desbloqueado con éxito!");
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (purchaseStatus === "canceled") {
      toast.error("Compra cancelada");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [unlockPack]);

  const handlePurchase = async (packId: string) => {
    try {
      toast.info("Redirigiendo a la página de pago...");
      const result = await createCheckoutMutation.mutateAsync({ packId });
      
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      toast.error(error.message || "Error al crear la sesión de pago");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
          <p className="text-2xl text-muted-foreground">Cargando packs...</p>
        </div>
      </div>
    );
  }

  const freePacks = packs?.filter((p) => p.price === 0) || [];
  const premiumPacks = packs?.filter((p) => p.price > 0) || [];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-12 py-8">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-20 h-20 mx-auto text-primary" />
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Tienda de Packs
          </h1>
          <p className="text-2xl text-muted-foreground">
            Nuevas preguntas, nuevas historias
          </p>
        </div>

        {freePacks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Packs Gratuitos</h2>
            <div className="grid gap-6">
              {freePacks.map((pack) => (
                <div
                  key={pack.id}
                  className="bg-card p-6 rounded-xl border-2 border-border space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-card-foreground">{pack.name}</h3>
                      <p className="text-lg text-muted-foreground">{pack.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold px-3 py-1 bg-primary/20 text-primary rounded-full">
                          {pack.mode === "both" ? "Familiar y Adultos" : pack.mode === "familiar" ? "Familiar" : "Adultos"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Check className="w-8 h-8" />
                      <span className="text-xl font-bold">GRATIS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {premiumPacks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-accent">Packs Premium</h2>
            <div className="grid gap-6">
              {premiumPacks.map((pack) => {
                const unlocked = isPackUnlocked(pack.packId);
                return (
                  <div
                    key={pack.id}
                    className="bg-card p-6 rounded-xl border-2 border-border space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-2xl font-bold text-card-foreground">{pack.name}</h3>
                        {unlocked && (
                          <span className="flex items-center gap-2 text-primary text-lg font-bold">
                            <Check className="w-6 h-6" />
                            Desbloqueado
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground">{pack.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold px-3 py-1 bg-accent/20 text-accent rounded-full">
                          {pack.mode === "both" ? "Familiar y Adultos" : pack.mode === "familiar" ? "Familiar" : "Adultos"}
                        </span>
                      </div>
                    </div>
                    
                    {!unlocked && (
                      <Button
                        size="lg"
                        className="w-full h-14 text-xl font-bold"
                        onClick={() => handlePurchase(pack.packId)}
                        disabled={createCheckoutMutation.isPending}
                      >
                        {createCheckoutMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Desbloquear por ${(pack.price / 100).toFixed(2)}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center pt-8">
          <Button
            variant="outline"
            size="lg"
            className="text-xl font-bold h-16"
            onClick={() => setPhase("home")}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
