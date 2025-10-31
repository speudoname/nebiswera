"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [storageValue, setStorageValue] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formErrors, setFormErrors] = useState({ name: "", email: "" });
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Feature 2: Dark Mode - Check saved preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }

    // Feature 3: Local Storage - Load saved value
    const saved = localStorage.getItem("demoValue") || "";
    setStorageValue(saved);

    // Feature 7: Check notification support
    setNotificationSupported("Notification" in window);

    // Feature 9: Install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Feature 8: Online/Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Feature 2: Dark Mode Toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Feature 3: Local Storage
  const saveToStorage = () => {
    localStorage.setItem("demoValue", storageValue);
    alert("Saved to local storage!");
  };

  // Feature 4: Geolocation
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          alert("Location access denied or unavailable");
        }
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  // Feature 5: Camera Access
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      alert("Camera access granted! (Stream available but not displaying in this demo)");
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      alert("Camera access denied or unavailable");
    }
  };

  // Feature 6: Form Validation
  const validateForm = () => {
    const errors = { name: "", email: "" };

    if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    setFormErrors(errors);

    if (!errors.name && !errors.email) {
      alert("Form is valid! ✓");
    }
  };

  // Feature 7: Push Notifications
  const requestNotification = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Nebiswera Demo", {
          body: "Notifications are now enabled!",
          icon: "/icon-192x192.png",
        });
      }
    }
  };

  // Feature 9: Install App
  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallPrompt(null);
      }
    } else {
      alert("App is already installed or install prompt not available");
    }
  };

  // Feature 10: Touch Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      setSwipeDirection(diff > 0 ? "👈 Swiped Left" : "👉 Swiped Right");
      setTimeout(() => setSwipeDirection(""), 2000);
    }

    setTouchStart(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-blue-600 dark:bg-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">🚀 Nebiswera</h1>
              <p className="text-blue-100">Web App Feature Demonstrations</p>

              {/* Online Status Indicator */}
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm">{isOnline ? 'Online' : 'Offline (Service Worker Active)'}</span>
              </div>
            </div>

            {/* Prominent Install Button */}
            {installPrompt ? (
              <button
                onClick={installApp}
                className="bg-white text-blue-600 dark:text-blue-800 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2 self-start sm:self-auto"
              >
                <span className="text-2xl">📲</span>
                <span>Install as App</span>
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg text-sm max-w-xs">
                <p className="font-semibold mb-1">📱 Install this app:</p>
                <p className="text-xs text-blue-100">
                  On iPhone: Tap Share <span className="inline-block">↗</span> then "Add to Home Screen"
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Swipe Indicator */}
        {swipeDirection && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-4 rounded-lg text-2xl z-50">
            {swipeDirection}
          </div>
        )}

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Feature 1: Responsive Design */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">📱 1. Responsive Design</h2>
            <p className="text-purple-100">This layout adapts to all screen sizes! Resize your browser or view on different devices.</p>
            <div className="mt-3 text-sm">
              <div className="hidden sm:block">✓ Small screens and up</div>
              <div className="hidden md:block">✓ Medium screens and up</div>
              <div className="hidden lg:block">✓ Large screens and up</div>
            </div>
          </div>

          {/* Feature 2: Dark Mode */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">🌙 2. Dark Mode</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Toggle between light and dark themes. Your preference is saved!</p>
            <button
              onClick={toggleDarkMode}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          {/* Feature 3: Local Storage */}
          <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">💾 3. Local Storage</h2>
            <p className="text-green-100 mb-4">Data persists even after closing the browser!</p>
            <input
              type="text"
              value={storageValue}
              onChange={(e) => setStorageValue(e.target.value)}
              placeholder="Type something..."
              className="w-full p-3 rounded-lg text-gray-900 mb-3"
            />
            <button
              onClick={saveToStorage}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all"
            >
              Save to Storage
            </button>
          </div>

          {/* Feature 4: Geolocation */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">📍 4. Geolocation</h2>
            <p className="text-orange-100 mb-4">Get your current location coordinates</p>
            <button
              onClick={getLocation}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all mb-3"
            >
              Get Location
            </button>
            {location && (
              <div className="bg-white/20 p-3 rounded-lg text-sm">
                <p>Lat: {location.lat.toFixed(6)}</p>
                <p>Lng: {location.lng.toFixed(6)}</p>
              </div>
            )}
          </div>

          {/* Feature 5: Camera Access */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">📸 5. Camera Access</h2>
            <p className="text-indigo-100 mb-4">Request access to device camera</p>
            <button
              onClick={openCamera}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
            >
              Open Camera
            </button>
          </div>

          {/* Feature 6: Form Validation */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">✅ 6. Form Validation</h2>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name (min 3 chars)"
                  className="w-full p-3 rounded-lg text-gray-900 border border-gray-300"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="w-full p-3 rounded-lg text-gray-900 border border-gray-300"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>
              <button
                onClick={validateForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Validate Form
              </button>
            </div>
          </div>

          {/* Feature 7: Push Notifications */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">🔔 7. Push Notifications</h2>
            <p className="text-yellow-100 mb-4">
              {notificationSupported ? "Receive notifications even when app is closed" : "Not supported in this browser"}
            </p>
            <button
              onClick={requestNotification}
              disabled={!notificationSupported}
              className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enable Notifications
            </button>
          </div>

          {/* Feature 8: Service Worker / Offline Mode */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">⚡ 8. Offline Mode</h2>
            <p className="text-cyan-100 mb-4">Service Worker caches assets for offline use</p>
            <div className="bg-white/20 p-4 rounded-lg">
              <p className="text-sm">Try: Turn off your internet connection and reload the page. It should still work!</p>
            </div>
          </div>

          {/* Feature 9: Install App (PWA) */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">📲 9. Install App</h2>
            <p className="text-pink-100 mb-4">Add this web app to your home screen</p>
            <button
              onClick={installApp}
              className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all"
            >
              {installPrompt ? "Install App" : "Already Installed / Not Available"}
            </button>
          </div>

          {/* Feature 10: Touch Gestures */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-3">👆 10. Touch Gestures</h2>
            <p className="text-emerald-100 mb-4">Swipe left or right anywhere on this page!</p>
            <div className="bg-white/20 p-4 rounded-lg">
              <p className="text-sm">👈 Swipe detection is active across the entire page</p>
              <p className="text-sm mt-2">Try swiping on mobile or with trackpad!</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">About This Demo</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is a Progressive Web App (PWA) built with Next.js, React, TypeScript, and Tailwind CSS.
            All 10 features are fully functional and demonstrate modern web capabilities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Next.js 16</span>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">React 19</span>
            <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm">TypeScript</span>
            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">PWA</span>
          </div>
        </div>
      </main>
    </div>
  );
}
