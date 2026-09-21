import { query } from "@/lib/db";

export type Condition = "unused" | "like_new" | "fair";
export type ItemStatus = "pending" | "approved" | "sold";

export const CONDITION_LABELS: Record<Condition, string> = {
  unused: "Unused",
  like_new: "Like New",
  fair: "Fair",
};

export interface ItemType {
  id: string;
  name: string;
  active: boolean;
}

export interface Item {
  id: string;
  itemTypeId: string;
  itemTypeName: string;
  size: string;
  price: string | null;
  sellerName: string;
  sellerPhone: string;
  condition: Condition;
  status: ItemStatus;
  createdAt: Date;
}

function mapItemRow(row: Record<string, unknown>): Item {
  return {
    id: row.id as string,
    itemTypeId: row.item_type_id as string,
    itemTypeName: row.item_type_name as string,
    size: row.size as string,
    price: row.price as string | null,
    sellerName: row.seller_name as string,
    sellerPhone: row.seller_phone as string,
    condition: row.condition as Condition,
    status: row.status as ItemStatus,
    createdAt: row.created_at as Date,
  };
}

export async function getActiveItemTypes(): Promise<ItemType[]> {
  const { rows } = await query(
    `select id, name, active from item_types where active = true order by name`
  );
  return rows.map((r) => ({ id: r.id as string, name: r.name as string, active: r.active as boolean }));
}

export async function getAllItemTypes(): Promise<ItemType[]> {
  const { rows } = await query(
    `select id, name, active from item_types order by name`
  );
  return rows.map((r) => ({ id: r.id as string, name: r.name as string, active: r.active as boolean }));
}

export async function getDistinctApprovedSizes(): Promise<string[]> {
  const { rows } = await query(
    `select distinct size from items where status = 'approved' order by size`
  );
  return rows.map((r) => r.size as string);
}

export async function getApprovedItems(filters: {
  itemTypeId?: string;
  size?: string;
}): Promise<Item[]> {
  const conditions = [`i.status = 'approved'`];
  const params: unknown[] = [];

  if (filters.itemTypeId) {
    params.push(filters.itemTypeId);
    conditions.push(`i.item_type_id = $${params.length}`);
  }
  if (filters.size) {
    params.push(filters.size);
    conditions.push(`i.size = $${params.length}`);
  }

  const { rows } = await query(
    `select i.id, i.item_type_id, it.name as item_type_name, i.size, i.price,
            i.seller_name, i.seller_phone, i.condition, i.status, i.created_at
     from items i
     join item_types it on it.id = i.item_type_id
     where ${conditions.join(" and ")}
     order by it.name, i.size, i.created_at desc`,
    params
  );
  return rows.map(mapItemRow);
}

export async function getPendingItems(): Promise<Item[]> {
  const { rows } = await query(
    `select i.id, i.item_type_id, it.name as item_type_name, i.size, i.price,
            i.seller_name, i.seller_phone, i.condition, i.status, i.created_at
     from items i
     join item_types it on it.id = i.item_type_id
     where i.status = 'pending'
     order by i.created_at asc`
  );
  return rows.map(mapItemRow);
}

export async function getItemsByPhone(phone: string): Promise<Item[]> {
  const { rows } = await query(
    `select i.id, i.item_type_id, it.name as item_type_name, i.size, i.price,
            i.seller_name, i.seller_phone, i.condition, i.status, i.created_at
     from items i
     join item_types it on it.id = i.item_type_id
     where i.seller_phone = $1 and i.status <> 'sold'
     order by i.created_at desc`,
    [phone]
  );
  return rows.map(mapItemRow);
}

interface NewItem {
  itemTypeId: string;
  size: string;
  price: string | null;
  sellerName: string;
  sellerPhone: string;
  condition: Condition;
}

export async function createItems(items: NewItem[]) {
  if (items.length === 0) return;

  const values: string[] = [];
  const params: unknown[] = [];
  items.forEach((item, i) => {
    const base = i * 6;
    values.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`
    );
    params.push(
      item.itemTypeId,
      item.size,
      item.price,
      item.sellerName,
      item.sellerPhone,
      item.condition
    );
  });

  await query(
    `insert into items (item_type_id, size, price, seller_name, seller_phone, condition)
     values ${values.join(", ")}`,
    params
  );
}

export async function approveItem(id: string) {
  await query(
    `update items set status = 'approved', approved_at = now() where id = $1 and status = 'pending'`,
    [id]
  );
}

export async function rejectItem(id: string) {
  await query(`delete from items where id = $1 and status = 'pending'`, [id]);
}

export async function markItemSold(id: string, phone: string): Promise<boolean> {
  const { rowCount } = await query(
    `update items set status = 'sold', sold_at = now()
     where id = $1 and seller_phone = $2 and status in ('pending', 'approved')`,
    [id, phone]
  );
  return (rowCount ?? 0) > 0;
}

export async function addItemType(name: string) {
  await query(
    `insert into item_types (name) values ($1) on conflict (name) do update set active = true`,
    [name]
  );
}

export async function toggleItemTypeActive(id: string) {
  await query(`update item_types set active = not active where id = $1`, [id]);
}
