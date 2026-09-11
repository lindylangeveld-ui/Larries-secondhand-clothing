import { sendMagicLink } from "./actions";

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const sent = searchParams.sent === "1";

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold">Admin sign in</h1>

      {sent ? (
        <p className="rounded bg-green-50 px-3 py-3 text-sm text-green-800">
          If that email is an admin account, a sign-in link is on its way. Check your inbox.
        </p>
      ) : (
        <form action={sendMagicLink} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <label className="block text-sm">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            Send sign-in link
          </button>
        </form>
      )}
    </div>
  );
}
