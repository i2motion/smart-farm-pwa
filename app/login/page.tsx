import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import { firstQueryValue, resolveSearchParamsRecord } from "@/lib/next/resolve-page-args";

export const metadata: Metadata = {
  title: "로그인",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await resolveSearchParamsRecord(searchParams);
  const next = firstQueryValue(sp.next);

  return (
    <div className="sf-login-shell relative flex min-h-dvh flex-col">
      <main className="flex flex-1 flex-col justify-center px-5 pb-20 pt-12 sm:px-8">
        <LoginForm initialNext={next} />
      </main>
    </div>
  );
}
