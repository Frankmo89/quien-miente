import { useCallback, useEffect, useState } from "react";
import { Purchases, LOG_LEVEL, type CustomerInfo, type PurchasesStoreProduct } from "@revenuecat/purchases-capacitor";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { Capacitor } from "@capacitor/core";

// RevenueCat API Keys - Replace with your actual keys
const REVENUECAT_API_KEY_IOS = "your_ios_api_key_here";
const REVENUECAT_API_KEY_ANDROID = "your_android_api_key_here";

// Storage keys prefix for unlocked packs
const STORAGE_KEY_PREFIX = "unlocked_pack_";

interface UsePurchasesReturn {
  isInitialized: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  error: string | null;
  setupPurchases: () => Promise<void>;
  purchasePack: (packId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  isPurchased: (packId: string) => Promise<boolean>;
  getProducts: (productIds: string[]) => Promise<PurchasesStoreProduct[]>;
}

/**
 * Custom hook for managing in-app purchases with RevenueCat
 * Includes offline persistence with SecureStorage and haptic feedback
 */
export function usePurchases(): UsePurchasesReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if running on a native platform (iOS/Android)
   */
  const isNativePlatform = useCallback((): boolean => {
    return Capacitor.isNativePlatform();
  }, []);

  /**
   * Save unlocked pack to secure storage for offline access
   */
  const saveUnlockedPack = useCallback(async (packId: string): Promise<void> => {
    try {
      await SecureStoragePlugin.set({
        key: `${STORAGE_KEY_PREFIX}${packId}`,
        value: JSON.stringify({
          unlockedAt: new Date().toISOString(),
          packId,
        }),
      });
    } catch (err) {
      console.error("[usePurchases] Failed to save unlocked pack:", err);
    }
  }, []);

  /**
   * Check if pack is unlocked in secure storage (offline check)
   */
  const isPackUnlockedLocally = useCallback(async (packId: string): Promise<boolean> => {
    try {
      const result = await SecureStoragePlugin.get({
        key: `${STORAGE_KEY_PREFIX}${packId}`,
      });
      return result.value !== null && result.value !== undefined;
    } catch {
      // Key doesn't exist or error reading
      return false;
    }
  }, []);

  /**
   * Trigger haptic feedback
   */
  const triggerHaptic = useCallback(async (type: "success" | "error" | "warning"): Promise<void> => {
    if (!isNativePlatform()) return;

    try {
      switch (type) {
        case "success":
          await Haptics.notification({ type: NotificationType.Success });
          break;
        case "error":
          await Haptics.notification({ type: NotificationType.Error });
          break;
        case "warning":
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        default:
          await Haptics.impact({ style: ImpactStyle.Medium });
      }
    } catch (err) {
      console.warn("[usePurchases] Haptics not available:", err);
    }
  }, [isNativePlatform]);

  /**
   * Initialize RevenueCat SDK
   */
  const setupPurchases = useCallback(async (): Promise<void> => {
    if (isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

      // Skip initialization on web
      if (!isNativePlatform()) {
        console.log("[usePurchases] Running on web, skipping RevenueCat setup");
        setIsInitialized(true);
        return;
      }

      // Set log level for debugging (remove in production)
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

      // Get the appropriate API key for the platform
      const platform = Capacitor.getPlatform();
      const apiKey = platform === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

      // Configure RevenueCat
      await Purchases.configure({
        apiKey,
      });

      // Get initial customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info.customerInfo);
      setIsInitialized(true);

      console.log("[usePurchases] RevenueCat initialized successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize purchases";
      setError(errorMessage);
      console.error("[usePurchases] Setup failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isNativePlatform]);

  /**
   * Purchase a pack by its product ID
   */
  const purchasePack = useCallback(async (packId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // On web, simulate purchase for testing
      if (!isNativePlatform()) {
        console.log("[usePurchases] Web purchase simulation for:", packId);
        await saveUnlockedPack(packId);
        await triggerHaptic("success");
        return true;
      }

      // Ensure SDK is initialized
      if (!isInitialized) {
        await setupPurchases();
      }

      // Get the product
      const products = await Purchases.getProducts({
        productIdentifiers: [packId],
      });

      if (!products.products || products.products.length === 0) {
        throw new Error(`Product not found: ${packId}`);
      }

      const product = products.products[0];

      // Attempt purchase
      const purchaseResult = await Purchases.purchaseStoreProduct({
        product,
      });

      // Check if purchase was successful
      if (purchaseResult.customerInfo) {
        setCustomerInfo(purchaseResult.customerInfo);

        // Save to secure storage for offline access
        await saveUnlockedPack(packId);

        // Trigger success haptic
        await triggerHaptic("success");

        console.log("[usePurchases] Purchase successful:", packId);
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Purchase failed";
      setError(errorMessage);
      console.error("[usePurchases] Purchase failed:", err);

      // Trigger error haptic
      await triggerHaptic("error");

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isNativePlatform, isInitialized, setupPurchases, saveUnlockedPack, triggerHaptic]);

  /**
   * Restore previous purchases
   */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // On web, skip restore
      if (!isNativePlatform()) {
        console.log("[usePurchases] Web platform, skipping restore");
        return true;
      }

      // Ensure SDK is initialized
      if (!isInitialized) {
        await setupPurchases();
      }

      const restoreResult = await Purchases.restorePurchases();

      if (restoreResult.customerInfo) {
        setCustomerInfo(restoreResult.customerInfo);

        // Save all entitled products to secure storage
        const entitlements = restoreResult.customerInfo.entitlements.active;
        for (const key of Object.keys(entitlements)) {
          const entitlement = entitlements[key];
          if (entitlement.productIdentifier) {
            await saveUnlockedPack(entitlement.productIdentifier);
          }
        }

        await triggerHaptic("success");
        console.log("[usePurchases] Restore successful");
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Restore failed";
      setError(errorMessage);
      console.error("[usePurchases] Restore failed:", err);

      await triggerHaptic("error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isNativePlatform, isInitialized, setupPurchases, saveUnlockedPack, triggerHaptic]);

  /**
   * Check if a pack is purchased (checks both RevenueCat and local storage)
   */
  const isPurchased = useCallback(async (packId: string): Promise<boolean> => {
    // First check local storage (offline-first)
    const locallyUnlocked = await isPackUnlockedLocally(packId);
    if (locallyUnlocked) return true;

    // If on web or not initialized, return local result
    if (!isNativePlatform() || !isInitialized) {
      return locallyUnlocked;
    }

    // Check RevenueCat entitlements
    try {
      const info = await Purchases.getCustomerInfo();
      const entitlements = info.customerInfo.entitlements.active;

      // Check if any active entitlement matches the pack
      for (const key of Object.keys(entitlements)) {
        const entitlement = entitlements[key];
        if (entitlement.productIdentifier === packId) {
          // Sync to local storage
          await saveUnlockedPack(packId);
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error("[usePurchases] Failed to check purchase status:", err);
      return locallyUnlocked;
    }
  }, [isNativePlatform, isInitialized, isPackUnlockedLocally, saveUnlockedPack]);

  /**
   * Get products by IDs
   */
  const getProducts = useCallback(async (productIds: string[]): Promise<PurchasesStoreProduct[]> => {
    if (!isNativePlatform()) {
      console.log("[usePurchases] Web platform, returning empty products");
      return [];
    }

    try {
      const result = await Purchases.getProducts({
        productIdentifiers: productIds,
      });
      return result.products || [];
    } catch (err) {
      console.error("[usePurchases] Failed to get products:", err);
      return [];
    }
  }, [isNativePlatform]);

  // Initialize on mount if on native platform
  useEffect(() => {
    if (isNativePlatform() && !isInitialized) {
      setupPurchases();
    }
  }, [isNativePlatform, isInitialized, setupPurchases]);

  return {
    isInitialized,
    isLoading,
    customerInfo,
    error,
    setupPurchases,
    purchasePack,
    restorePurchases,
    isPurchased,
    getProducts,
  };
}
