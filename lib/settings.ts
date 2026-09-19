import { query } from "@/lib/db";

export async function getSetting(key: string): Promise<string | null> {
  const { rows } = await query<{ value: string }>(
    `select value from settings where key = $1`,
    [key]
  );
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  await query(
    `insert into settings (key, value, updated_at) values ($1, $2, now())
     on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at`,
    [key, value]
  );
}
