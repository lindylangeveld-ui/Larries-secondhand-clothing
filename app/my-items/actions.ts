"use server";

import { redirect } from "next/navigation";
import { markItemSold } from "@/lib/items";

export async function markSold(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();

  if (itemId && phone) {
    await markItemSold(itemId, phone);
  }

  redirect(`/my-items?phone=${encodeURIComponent(phone)}`);
}
