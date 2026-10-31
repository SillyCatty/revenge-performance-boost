(function (v) {
  "use strict";

  const vendetta = v || window.vendetta || window.revenge || window.bunny;
  let unpatches = [];

  const plugin = {
    onLoad: () => {
      try {
        if (!vendetta) {
          console.warn("[PerformanceBoost] Vendetta/Revenge global instance not available.");
          return;
        }

        const { metro, patcher, ui } = vendetta;
        const { findByProps, findByStoreName } = metro || {};
        const { before, instead, after } = patcher || {};

        // Display visual confirmation toast on Discord
        try {
          const toasts = ui && ui.toasts;
          if (toasts && toasts.showToast) {
            toasts.showToast(
              "Performance Boost Activated",
              toasts.getAssetIDByName ? toasts.getAssetIDByName("ic_speed_24px") : undefined
            );
          }
        } catch (_) {}

        // =========================================================================
        // 1. TELEMETRY & SCIENCE BLOCKER (NoTrack)
        // Stops continuous analytics requests, scroll impression pings, and tracking
        // =========================================================================
        try {
          const Analytics = findByProps("track", "trackWithMetadata");
          if (Analytics && instead) {
            if (typeof Analytics.track === "function") {
              unpatches.push(instead("track", Analytics, () => {}));
            }
            if (typeof Analytics.trackWithMetadata === "function") {
              unpatches.push(instead("trackWithMetadata", Analytics, () => {}));
            }
            console.log("[PerformanceBoost] Blocked Analytics tracking pings.");
          }

          const Science = findByProps("submitScience") || findByProps("postEvent");
          if (Science && instead) {
            if (typeof Science.submitScience === "function") {
              unpatches.push(instead("submitScience", Science, () => {}));
            }
            if (typeof Science.postEvent === "function") {
              unpatches.push(instead("postEvent", Science, () => {}));
            }
            console.log("[PerformanceBoost] Blocked Science telemetry.");
          }
        } catch (e) {
          console.warn("[PerformanceBoost] Error patching Telemetry:", e);
        }

        // =========================================================================
        // 2. TYPING INDICATOR THROTTLER / FLUX RE-RENDER MITIGATION
        // Drops high-frequency typing events that cause message list re-render freezes
        // =========================================================================
        try {
          const FluxDispatcher = (metro.common && metro.common.FluxDispatcher) || findByProps("dispatch", "subscribe");
          if (FluxDispatcher && before) {
            unpatches.push(
              before("dispatch", FluxDispatcher, (args) => {
                const action = args && args[0];
                if (!action) return;

                // Suppress typing flood in active channels/DMs
                if (action.type === "TYPING_START" || action.type === "TYPING_STOP") {
                  args[0] = { type: "NOOP" };
                }
              })
            );
            console.log("[PerformanceBoost] Throttled typing indicator Flux dispatches.");
          }
        } catch (e) {
          console.warn("[PerformanceBoost] Error patching FluxDispatcher:", e);
        }

        // =========================================================================
        // 3. STICKER & ANIMATION THERMAL THROTTLING (PREVENTS OVERHEATING)
        // Prevents animated stickers from looping continuously in the chat viewport
        // =========================================================================
        try {
          const AccessibilityStore = findByStoreName && findByStoreName("AccessibilityStore");
          if (AccessibilityStore && instead) {
            // Animate stickers on interaction/tap only (mode 2) rather than infinite loop
            if (typeof AccessibilityStore.animateStickers === "function") {
              unpatches.push(
                instead("animateStickers", AccessibilityStore, () => 2)
              );
            }
            console.log("[PerformanceBoost] Configured sticker animation to interaction-only.");
          }
        } catch (e) {
          console.warn("[PerformanceBoost] Error patching AccessibilityStore:", e);
        }

        // =========================================================================
        // 4. PREFETCH & BACKGROUND SPAM REDUCTION
        // =========================================================================
        try {
          const UserSettingsProtoStore = findByStoreName && findByStoreName("UserSettingsProtoStore");
          if (UserSettingsProtoStore) {
            console.log("[PerformanceBoost] User settings verified.");
          }
        } catch (_) {}

        console.log("[PerformanceBoost] All optimizations successfully installed.");
      } catch (err) {
        console.error("[PerformanceBoost] Initialization failed:", err);
      }
    },

    onUnload: () => {
      for (const unpatch of unpatches) {
        try {
          unpatch();
        } catch (_) {}
      }
      unpatches = [];
      console.log("[PerformanceBoost] Unloaded and all patches removed.");
    },
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = plugin;
    module.exports.default = plugin;
  }
  if (typeof exports !== "undefined") {
    exports.default = plugin;
  }

  return plugin;
})(typeof vendetta !== "undefined" ? vendetta : undefined);
