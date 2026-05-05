import type { Metadata } from "next";

import { SettingsPageShell } from "@/components/settings/settings-page-shell";

export const metadata: Metadata = {
  title: "설정",
};

export default function SettingsPage() {
  return <SettingsPageShell />;
}
