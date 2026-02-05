import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { getFreePacks, getPremiumPacks, type GamePack } from "@/config/store";
import { Check, Loader2, RefreshCw, ShoppingBag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { usePurchases } from "@/hooks/usePurchases";

export default function Store() {
  const { setPhase, isPackUnlocked, unlockPack } = useGame();
  const { trackEvent } = useAnalytics();
  const { 
    isLoading: isPurchaseLoading, 
    purchasePack, 
    restorePurchases,
    error: purchaseError 
  } = usePurchases();
  
  const [purchasingPackId, setPurchasingPackId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Packs cargados localmente (offline-first)
  const freePacks = getFreePacks();
  const premiumPacks = getPremiumPacks();

  useEffect(() => {
    trackEvent("pack_viewed");
  }, [trackEvent]);

  // Show error toast when purchase fails
  useEffect(() => {
    if (purchaseError) {
      toast.error(purchaseError);
    }
  }, [purchaseError]);

  const handlePurchase = async (pack: GamePack) => {
    setPurchasingPackId(pack.id);
    
    try {
      // Use the RevenueCat product ID if available, otherwise use pack ID
      const productId = pack.revenueCatId || pack.id;
      
      const success = await purchasePack(productId);
      
      if (success) {
        // Unlock the pack in game context
        unlockPack(pack.id);
        trackEvent("pack_purchased", { pack_id: pack.id });
        toast.success("¡Pack desbloqueado con éxito!");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar la compra";
      toast.error(errorMessage);
    } finally {
      setPurchasingPackId(null);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    
    try {
      const success = await restorePurchases();
      
      if (success) {
        toast.success("Compras restauradas correctamente");
        trackEvent("purchases_restored");
      } else {
        toast.info("No se encontraron compras previas");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al restaurar compras";
      toast.error(errorMessage);
    } finally {
      setIsRestoring(false);
    }
  };

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

        {/* Restore Purchases Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestorePurchases}
            disabled={isRestoring || isPurchaseLoading}
            className="text-muted-foreground"
          >
            {isRestoring ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Restaurando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Restaurar compras
              </>
            )}
          </Button>
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
                const unlocked = isPackUnlocked(pack.id);
                const isPurchasing = purchasingPackId === pack.id;
                const isDisabled = isPurchasing || isPurchaseLoading || isRestoring;
                
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
                        onClick={() => handlePurchase(pack)}
                        disabled={isDisabled}
                      >
                        {isPurchasing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Desbloquear por ${pack.price.toFixed(2)}
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
