'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase';
import { IconBrandCodesandbox } from '@tabler/icons-react';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 isolate opacity-65">
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
      </div>
      
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-background/80 p-8 backdrop-blur-lg border border-border/40">
          <div className="flex flex-col items-center gap-4">
            <IconBrandCodesandbox className="h-12 w-12 text-primary" stroke={1.5} />
            <h2 className="text-center text-3xl font-light tracking-tight text-foreground">
              Sign in to LeetCoach
            </h2>
          </div>
          
          <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl px-5 py-3 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign in with Google</span>
              )}
            </button>
          </div>
          
          {error && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}