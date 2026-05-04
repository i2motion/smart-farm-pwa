"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
      setError("아이디와 비밀번호를 입력하세요.");
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
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md">
          <LogIn className="size-5 stroke-[1] text-primary" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-[1.75rem]">사계리 농장</h1>
          <p className="text-muted-foreground text-[13px] leading-relaxed">데모 로그인 · 로컬 세션</p>
        </div>
      </div>

      <Card className="sf-glass rounded-3xl border-white/[0.08] shadow-none">
        <CardHeader className="gap-1 border-b border-white/[0.06] px-6 pb-5 pt-6">
          <CardTitle className="text-[15px] font-medium tracking-tight">로그인</CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">목업 인증</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="px-6 pt-6 pb-2">
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="sf-username" className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  아이디
                </FieldLabel>
                <Input
                  id="sf-username"
                  name="username"
                  autoComplete="username"
                  inputMode="text"
                  placeholder=""
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                  className="mt-1.5 h-11 rounded-xl border-white/[0.08] bg-white/[0.03] text-base md:h-10 md:text-sm"
                  aria-invalid={Boolean(error)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sf-password" className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  비밀번호
                </FieldLabel>
                <Input
                  id="sf-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder=""
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="mt-1.5 h-11 rounded-xl border-white/[0.08] bg-white/[0.03] text-base md:h-10 md:text-sm"
                  aria-invalid={Boolean(error)}
                />
                <FieldDescription className="text-[10px] text-muted-foreground/90">
                  빈 칸이 아닌 값이면 통과합니다.
                </FieldDescription>
              </Field>
              {error ? <FieldError>{error}</FieldError> : null}
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col gap-3 border-t border-white/[0.06] px-6 pt-5 pb-7">
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="h-11 w-full rounded-full text-[13px] font-medium tracking-tight sm:h-10"
            >
              {pending ? "처리 중…" : "시작"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
