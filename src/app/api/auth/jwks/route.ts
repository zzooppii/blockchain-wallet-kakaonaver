import { importSPKI, exportJWK } from "jose";
import { NextResponse } from "next/server";

export async function GET() {
  const pem = process.env.NEXTAUTH_PUBLIC_KEY;
  if (!pem) {
    return NextResponse.json({ keys: [] });
  }
  try {
    const key = await importSPKI(pem.replace(/\\n/g, "\n"), "RS256");
    const jwk = await exportJWK(key);
    return NextResponse.json({
      keys: [{ ...jwk, kid: "nextauth-key-1", use: "sig", alg: "RS256" }],
    });
  } catch {
    return NextResponse.json({ keys: [] }, { status: 500 });
  }
}
