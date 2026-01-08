import posthog from "posthog-js";
import { createContext, useContext, useEffect, ReactNode } from "react";

// PostHog configuration
const POSTHOG_KEY = "phc_S0TOX1d3fePdBYoQwRsd1jgwEaEqq1WaM9RZ7ZgdFp7"; // PostHog API Key
const POSTHOG_HOST = "https://app.posthog.com";

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize PostHog with the provided key
    if (POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        loaded: (posthog) => {
          if (import.meta.env.DEV) {
            posthog.debug();
          }
        },
        // Disable session recording for privacy
        disable_session_recording: true,
        // Disable autocapture to only track explicit events
        autocapture: false,
        // Capture pageviews manually
        capture_pageview: false,
      });
    }
  }, []);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (POSTHOG_KEY) {
      posthog.capture(eventName, properties);
    } else {
      // Log to console in development
      console.log("[Analytics]", eventName, properties);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
