"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, KeyRound } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="bg-fo-surface border-border w-full shadow-2xl relative overflow-hidden">
        {/* Decorative radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,.12)_0%,transparent_70%)] pointer-events-none" />
        
        <CardHeader className="space-y-1 relative pb-4">
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-fo-indigo to-purple-500 flex items-center justify-center mb-3">
            <KeyRound size={20} className="text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-center tracking-tight">
            Admin Authentication
          </CardTitle>
          <CardDescription className="text-center text-fo-sub text-xs">
            This system is restricted to authorized personnel.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-fo-indigo" />
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: "Invalid email or password. Please try again.",
        });
      } else {
        toast({
          title: "Access Granted",
          description: "Welcome back, Admin.",
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during sign in.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-fo-surface border-border w-full shadow-2xl relative overflow-hidden">
      {/* Decorative radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,.12)_0%,transparent_70%)] pointer-events-none" />
      
      <CardHeader className="space-y-1 relative pb-4">
        <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-fo-indigo to-purple-500 flex items-center justify-center mb-3">
          <KeyRound size={20} className="text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-center tracking-tight">
          Admin Authentication
        </CardTitle>
        <CardDescription className="text-center text-fo-sub text-xs">
          This system is restricted to authorized personnel.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorParam && (
            <div className="p-3 rounded-lg bg-[rgba(244,63,94,.1)] border border-[rgba(244,63,94,.25)] text-fo-rose text-xs text-center">
              Authentication failed. Please verify your credentials.
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fo-muted uppercase tracking-wider block">
              Admin Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="bg-fo-surface2 border-border focus:border-fo-indigo text-sm h-10 rounded-lg text-fo-text placeholder:text-fo-muted"
              required
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fo-muted uppercase tracking-wider block">
              Security Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="bg-fo-surface2 border-border focus:border-fo-indigo text-sm h-10 rounded-lg text-fo-text placeholder:text-fo-muted"
              required
              suppressHydrationWarning
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fo-indigo to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold h-10 rounded-lg text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-indigo-500/20 gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Validating...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-fo-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fo-indigo/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[390px] relative z-10">
        {/* Logo / Header */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <img src="/favicon.png" alt="FounderOS Logo" className="w-8 h-8 object-contain" />
          <span className="font-display text-lg font-bold tracking-tight">
            Founder<span className="text-fo-indigo">OS</span>
          </span>
        </div>

        <Suspense fallback={
          <Card className="bg-fo-surface border-border w-full py-12 flex justify-center items-center">
            <Loader2 size={24} className="animate-spin text-fo-indigo" />
          </Card>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
