import type { NextRequest } from "next/server";
import { renderQR } from "@/lib/qr-render";

// Public QR image endpoint. Format via ?format=svg|png|jpg (default svg).
export function GET(req: NextRequest) {
  return renderQR(req);
}
