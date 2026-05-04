import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "경매",
};

export default function AuctionPage() {
  return (
    <div className="rounded-2xl border-0 bg-card/80 p-6 shadow-md ring-1 ring-border/30">
      <h1 className="text-lg font-semibold tracking-tight">경매</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        출하·경매 연동은 아직 설정되지 않았습니다. 목록·입찰 흐름은 추후 연결 예정입니다.
      </p>
    </div>
  );
}
