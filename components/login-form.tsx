"use client";

import { Cpu, Factory, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { persistMockSession } from "@/lib/auth/session-client";

type LoginFormProps = {
  initialNext?: string;
};

export function LoginForm({ initialNext }: LoginFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      setError("Enter username and password.");
      return;
    }

    setPending(true);
    persistMockSession(u);

    const candidate = initialNext ?? "/dashboard";
    const destination =
      candidate.startsWith("/") && !candidate.startsWith("//")
        ? candidate
        : "/dashboard";

    router.replace(destination);
    router.refresh();
    setPending(false);
  }

  return (
    <div className="mx-auto w-full max-w-[min(100%,380px)]">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 shadow-inner ring-1 ring-black/5 dark:bg-primary/15 dark:ring-white/10">
          <Factory className="text-primary size-7" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Industrial IoT · Jeju Site
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Smart farm console
          </h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            Secure mock login — credentials stay on-device for demo purposes.
          </p>
        </div>
        <Badge variant="outline" className="rounded-md border-primary/25 px-3 py-1 font-mono text-[11px]">
          <ShieldCheck className="size-3.5" aria-hidden />
          MOCK AUTH · LOCAL SESSION
        </Badge>
      </div>

      <Card className="rounded-xl border-border bg-card/90 shadow-lg ring-1 ring-black/5 backdrop-blur-md dark:bg-card/80 dark:ring-white/10">
        <CardHeader className="gap-2 border-b border-border pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="font-heading text-lg">Operator sign-in</CardTitle>
              <CardDescription className="font-mono text-xs">
                Production telemetry gateway v0 · offline-capable PWA
              </CardDescription>
            </div>
            <Cpu className="text-muted-foreground size-8 shrink-0" aria-hidden />
          </div>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="pt-6 pb-2">
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="sf-username" className="font-mono text-xs uppercase tracking-wide">
                  Username
                </FieldLabel>
                <Input
                  id="sf-username"
                  name="username"
                  autoComplete="username"
                  inputMode="text"
                  placeholder="operator.id"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                  className="h-11 rounded-md font-mono text-base md:h-10 md:text-sm"
                  aria-invalid={Boolean(error)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sf-password" className="font-mono text-xs uppercase tracking-wide">
                  Password
                </FieldLabel>
                <Input
                  id="sf-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="h-11 rounded-md font-mono text-base md:h-10 md:text-sm"
                  aria-invalid={Boolean(error)}
                />
                <FieldDescription className="font-mono text-[11px]">
                  Demo mode accepts any non-empty username and password.
                </FieldDescription>
              </Field>
              {error ? <FieldError>{error}</FieldError> : null}
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col gap-3 border-t border-border pt-4 pb-6">
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="h-11 w-full rounded-md text-base font-semibold tracking-wide sm:h-10 sm:text-sm"
            >
              {pending ? "Signing in…" : "Authenticate"}
            </Button>
            <p className="text-muted-foreground text-center text-[11px] leading-snug font-mono">
              Session stored in localStorage + lightweight cookie for routing.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
