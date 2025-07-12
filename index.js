import settings from "./settings.jsx";
import { storage } from "@vendetta/plugin";
import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

// WebSocket Debugger for Kettu
class KettuDebugger {
  constructor() {
    this.serverUrl = storage.debugServerUrl ?? 'ws://192.168.56.1:8081';
    this.ws = null;
    this.isConnected = false;
  }

  connect() {
    if (!storage.debugMode) return;
    
    try {
      console.log(`[KettuDebug] Connecting to ${this.serverUrl}...`);
      this.ws = new WebSocket(this.serverUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[KettuDebug] ✅ Connected to debug server');
        this.send({
          type: 'connection',
          plugin: 'AntiBloat',
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[KettuDebug] 📨 Received:', data);
        } catch (e) {
          console.log('[KettuDebug] 📨 Raw:', event.data);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('[KettuDebug] ❌ Connection closed');
      };

      this.ws.onerror = (error) => {
        console.log('[KettuDebug] 🚨 Error:', error);
      };
    } catch (error) {
      console.log('[KettuDebug] ❌ Failed to connect:', error);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  log(message, data = null) {
    const logData = {
      type: 'log',
      message: message,
      data: data,
      timestamp: new Date().toISOString()
    };
    console.log(`[AntiBloat] ${message}`, data);
    this.send(logData);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

let patches = [];
let wsDebugger = null;

// Function to hide bloat elements
const hideElements = () => {
  if (!storage.enabled) return;

  // Hide Nitro tab
  const nitroElements = document.querySelectorAll('[aria-label*="Nitro"], [class*="nitro"], [href*="/store"], [data-list-item-id*="nitro"]');
  nitroElements.forEach(el => el.style.display = 'none');

  // Hide Shop/Store elements
  const shopElements = document.querySelectorAll('[aria-label*="Shop"], [class*="shop"], [href*="/shop"]');
  shopElements.forEach(el => el.style.display = 'none');

  // Hide Quest elements
  const questElements = document.querySelectorAll('[aria-label*="Quest"], [class*="quest"], [href*="/quests"]');
  questElements.forEach(el => el.style.display = 'none');

  // Hide Monetization/Premium elements
  const premiumElements = document.querySelectorAll('[class*="premium"], [class*="monetization"]');
  premiumElements.forEach(el => el.style.display = 'none');
};

export default {
  settings,

  onLoad() {
    console.log("[AntiBloat] Loaded!");

    // Set default values
    storage.enabled ??= true;

    if (storage.enabled) {
      console.log("[AntiBloat] Anti-bloat is enabled!");
      
      // Initial cleanup
      hideElements();

      // Set up observer to continuously monitor for new elements
      const observer = new MutationObserver(() => {
        if (storage.enabled) {
          hideElements();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Store observer for cleanup
      this.observer = observer;

      // Try to patch navigation components
      try {
        const NavigationUtils = findByName("NavigationUtils");
        if (NavigationUtils) {
          patches.push(after("transitionTo", NavigationUtils, (args) => {
            setTimeout(hideElements, 100);
          }));
        }
      } catch (e) {
        console.warn("[AntiBloat] Could not patch NavigationUtils:", e);
      }

      // Inject custom CSS to hide known bloat elements
      const style = document.createElement('style');
      style.id = 'antibloat-style';
      style.textContent = `
        /* Hide Nitro elements */
        [class*="nitro"]:not([class*="nitrogen"]),
        [aria-label*="Nitro"],
        [href*="/store"],
        [data-list-item-id*="nitro"],
        /* Hide Shop elements */
        [aria-label*="Shop"],
        [class*="shop"],
        [href*="/shop"],
        /* Hide Quest elements */
        [aria-label*="Quest"],
        [class*="quest"],
        [href*="/quests"],
        /* Hide Premium/Monetization elements */
        [class*="premium"]:not([class*="premium-badge"]),
        [class*="monetization"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      this.styleElement = style;

      // Initialize debugger
      wsDebugger = new KettuDebugger();
      wsDebugger.connect();

    } else {
      console.log("[AntiBloat] Anti-bloat is disabled!");
    }
  },

  onUnload() {
    console.log("[AntiBloat] Unloaded!");
    
    // Clean up patches
    patches.forEach(unpatch => unpatch());
    patches = [];

    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Remove injected styles
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }

    // Show all hidden elements again
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');
    hiddenElements.forEach(el => {
      el.style.display = '';
    });

    // Disconnect debugger
    if (wsDebugger) {
      wsDebugger.disconnect();
      wsDebugger = null;
    }
  }
};
