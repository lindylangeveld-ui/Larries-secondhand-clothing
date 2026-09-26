"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSessionEmail, destroySession } from "@/lib/auth";
import {
  approveItem,
  rejectItem,
  addItemType,
  toggleItemTypeActive,
  setItemTypeCategory,
} from "@/lib/items";
import { CATEGORIES, type Category } from "@/lib/categories";
import { setSetting } from "@/lib/settings";

function parseCategory(value: FormDataEntryValue | null): Category | null {
  return CATEGORIES.includes(value as Category) ? (value as Category) : null;
}

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
  const category = parseCategory(formData.get("category")) ?? "uniform";
  if (name) await addItemType(name, category);
  revalidatePath("/admin");
}

export async function toggleType(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await toggleItemTypeActive(id);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const category = parseCategory(formData.get("category"));
  if (id && category) await setItemTypeCategory(id, category);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updatePasscode(formData: FormData) {
  await requireAdmin();
  const passcode = String(formData.get("passcode") ?? "").trim();
  if (passcode) await setSetting("site_passcode", passcode);
  revalidatePath("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
