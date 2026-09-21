"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createItems, type Condition } from "@/lib/items";
import { notifyAdminOfNewSubmissions } from "@/lib/email";
import { query } from "@/lib/db";

const conditionValues = ["unused", "like_new", "fair"] as const;

const sellerSchema = z.object({
  sellerName: z.string().trim().min(1).max(100),
  sellerPhone: z.string().trim().min(6).max(20).regex(/^\d+$/),
});

const itemSchema = z.object({
  itemTypeId: z.string().uuid(),
  size: z.string().trim().min(1).max(50),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional()
    .or(z.literal("")),
  condition: z.enum(conditionValues),
});

export async function submitItems(formData: FormData) {
  const seller = sellerSchema.safeParse({
    sellerName: formData.get("sellerName"),
    sellerPhone: formData.get("sellerPhone"),
  });
  if (!seller.success) {
    redirect("/sell?error=1");
  }

  const itemTypeIds = formData.getAll("itemTypeId");
  const sizes = formData.getAll("size");
  const prices = formData.getAll("price");
  const conditions = formData.getAll("condition");

  if (
    itemTypeIds.length === 0 ||
    itemTypeIds.length !== sizes.length ||
    itemTypeIds.length !== prices.length ||
    itemTypeIds.length !== conditions.length
  ) {
    redirect("/sell?error=1");
  }

  const items = itemTypeIds.map((_, index) => {
    const parsed = itemSchema.safeParse({
      itemTypeId: itemTypeIds[index],
      size: sizes[index],
      price: prices[index],
      condition: conditions[index],
    });
    if (!parsed.success) {
      redirect("/sell?error=1");
    }
    return parsed.data;
  });

  const { rows: activeTypes } = await query<{ id: string; name: string }>(
    `select id, name from item_types where id = any($1::uuid[]) and active = true`,
    [items.map((item) => item.itemTypeId)]
  );
  const nameByTypeId = new Map(activeTypes.map((t) => [t.id, t.name]));

  if (items.some((item) => !nameByTypeId.has(item.itemTypeId))) {
    redirect("/sell?error=1");
  }

  const { sellerName, sellerPhone } = seller.data;

  await createItems(
    items.map((item) => ({
      itemTypeId: item.itemTypeId,
      size: item.size,
      price: item.price || null,
      sellerName,
      sellerPhone,
      condition: item.condition as Condition,
    }))
  );

  notifyAdminOfNewSubmissions({
    sellerName,
    items: items.map((item) => ({
      itemType: nameByTypeId.get(item.itemTypeId)!,
      size: item.size,
    })),
  }).catch(() => {});

  redirect("/sell/thanks");
}
