import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth";
import { logout } from "./actions";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span>{email}</span>
          <form action={logout}>
            <button type="submit" className="underline">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
