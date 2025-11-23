import { useState } from "react";
import { useAuth } from "@Contexts/AuthContext";
import { Button } from "@Components/Shadcn/button";
import { Input } from "@Components/Shadcn/input";
import { Label } from "@Components/Shadcn/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@Components/Shadcn/card";

export function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Eroare la autentificare cu Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Te rog completează toate câmpurile");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { error: authError } = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (authError) {
        throw authError;
      }

      if (isSignUp) {
        setError("Cont creat! Verifică email-ul pentru confirmare.");
      }
    } catch (err: any) {
      setError(err.message || "Eroare la autentificare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Card className="w-full max-w-md glass-card border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold gradient-text text-center">
            Todo App
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {isSignUp ? "Crează cont nou" : "Autentifică-te pentru a continua"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
                error.includes("creat")
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Continuă cu Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                SAU
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="numele@exemplu.ro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Se încarcă..."
                : isSignUp
                ? "Crează cont"
                : "Autentificare"}
            </Button>
          </form>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp
              ? "Ai deja cont? Autentifică-te"
              : "Nu ai cont? Înregistrează-te"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
