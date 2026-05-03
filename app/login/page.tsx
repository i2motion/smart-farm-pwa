import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="sf-login-shell relative flex min-h-dvh flex-col">
      <header className="absolute inset-x-0 top-0 z-10 flex justify-end p-4">
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col justify-center px-4 pb-16 pt-14 sm:px-6">
        <LoginForm initialNext={next} />
      </main>
    </div>
  );
}
