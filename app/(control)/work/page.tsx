import type { Metadata } from "next";

import { WorkPageShell } from "@/components/work/work-page-shell";
import { MOCK_WORK_INSTRUCTIONS } from "@/lib/dashboard/mock-data";

export const metadata: Metadata = {
  title: "작업",
};

export default function WorkPage() {
  return <WorkPageShell workInstructionItems={MOCK_WORK_INSTRUCTIONS} />;
}
