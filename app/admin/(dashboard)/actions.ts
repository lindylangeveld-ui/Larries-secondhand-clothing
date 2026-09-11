"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSessionEmail, destroySession } from "@/lib/auth";
import { approveItem, rejectItem, addItemType, toggleItemTypeActive } from "@/lib/items";

async function requireAdmin() {
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");
}

export async function approve(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await approveItem(id);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function reject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await rejectItem(id);
  revalidatePath("/admin");
}

export async function addType(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (name) await addItemType(name);
  revalidatePath("/admin");
}

export async function toggleType(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await toggleItemTypeActive(id);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
