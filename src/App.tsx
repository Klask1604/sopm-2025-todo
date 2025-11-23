import { useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { useEffect, useState } from "react";

function App() {
  const { user, loading } = useAuth();
  const [forceShowApp, setForceShowApp] = useState(false);

  useEffect(() => {
    const absoluteTimeout = setTimeout(() => {
      if (loading && !forceShowApp) {
        console.warn(" FORCE LOADING COMPLETE - Timeout reached");
        setForceShowApp(true);
      }
    }, 6000);

    // Dacă loading se termină normal, clear timeout
    if (!loading) {
      clearTimeout(absoluteTimeout);
      setForceShowApp(false);
    }

    return () => clearTimeout(absoluteTimeout);
  }, [loading]);

  // Dacă loading = false SAU am forțat afișarea
  const shouldShowApp = !loading || forceShowApp;

  if (!shouldShowApp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
          <p className="text-gray-400 text-sm mt-2">
            Connecting to Supabase...
          </p>
        </div>
      </div>
    );
  }

  // Dacă am forțat și nu e user, presupunem că trebuie login
  if (forceShowApp && !user) {
    console.log("Forced load without user - showing login");
    return <Login />;
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;
