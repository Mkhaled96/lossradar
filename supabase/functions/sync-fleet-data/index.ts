// supabase/functions/sync-fleet-data/index.ts
//
// This function:
// 1. Loops through every row in the `clients` table
// 2. For each client that has a google_sheet_id, reads their Google Sheet
// 3. Upserts each row into `fleet_data`, tagged with that client's id
//
// Deploy with: supabase functions deploy sync-fleet-data
// Trigger manually with: supabase functions invoke sync-fleet-data
// Or schedule it (see README section at the bottom of this file)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SignJWT, importPKCS8 } from "https://esm.sh/jose@5";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GOOGLE_SERVICE_ACCOUNT = Deno.env.get("GOOGLE_SERVICE_ACCOUNT")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Get a Google API access token using the service account ---
async function getGoogleAccessToken(): Promise<string> {
  const sa = JSON.parse(GOOGLE_SERVICE_ACCOUNT);
  const privateKey = await importPKCS8(sa.private_key, "RS256");

  const jwt = await new SignJWT({
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(sa.client_email)
    .setSubject(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Failed to get Google access token: " + JSON.stringify(data));
  }
  return data.access_token;
}

// --- Read all values from a client's sheet ---
async function readSheet(sheetId: string, tabName: string, token: string) {
  const range = encodeURIComponent(`${tabName}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Sheet read failed for ${sheetId}: ${JSON.stringify(data)}`);
  }
  return data.values as string[][] | undefined;
}

// --- Convert sheet rows into structured objects using the header row ---
function rowsToObjects(values: string[][]) {
  if (!values || values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map((row, idx) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = row[i] ?? ""));
    return { rowIndex: idx + 2, data: obj }; // +2 because row 1 is header, sheet rows are 1-indexed
  });
}

Deno.serve(async (_req) => {
  try {
    const { data: clients, error } = await supabase
      .from("clients")
      .select("id, name, google_sheet_id, sheet_tab_name")
      .not("google_sheet_id", "is", null);

    if (error) throw error;

    const token = await getGoogleAccessToken();
    const results: Record<string, unknown> = {};

    for (const client of clients ?? []) {
      try {
        const values = await readSheet(
          client.google_sheet_id,
          client.sheet_tab_name || "Sheet1",
          token
        );
        const rows = rowsToObjects(values ?? []);

        let inserted = 0;
        for (const row of rows) {
          const sheetRowId = `${client.google_sheet_id}-${row.rowIndex}`;

          const { error: upsertError } = await supabase
            .from("fleet_data")
            .upsert(
              {
                client_id: client.id,
                row_data: row.data,
                sheet_row_id: sheetRowId,
                synced_at: new Date().toISOString(),
              },
              { onConflict: "client_id,sheet_row_id" }
            );

          if (!upsertError) inserted++;
        }
        results[client.name] = { synced_rows: inserted };
      } catch (clientErr) {
        results[client.name] = { error: String(clientErr) };
      }
    }

    return new Response(JSON.stringify({ success: true, results }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// ============================================================
// README — deployment & scheduling
// ============================================================
// 1. Save this file at: supabase/functions/sync-fleet-data/index.ts
// 2. Deploy: supabase functions deploy sync-fleet-data
// 3. Test manually: supabase functions invoke sync-fleet-data
//
// To run automatically every hour, use Supabase's built-in Cron
// (Project Settings -> Integrations -> Cron Jobs), or in SQL Editor run:
//
//   select cron.schedule(
//     'sync-fleet-data-hourly',
//     '0 * * * *',
//     $$
//     select net.http_post(
//       url := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/sync-fleet-data',
//       headers := jsonb_build_object('Authorization', 'Bearer <YOUR_SERVICE_ROLE_KEY>')
//     );
//     $$
//   );
