import { verifyPasscode } from "./actions";

export default async function AccessPage(props: PageProps<"/access">) {
  const searchParams = await props.searchParams;
  const hasError = searchParams.error === "1";
  const next = typeof searchParams.next === "string" ? searchParams.next : "/";

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand">Enter access code</h1>
        <p className="mt-1 text-sm text-neutral-600">
          This site is for the Larrie Second-hand Clothing WhatsApp group. Enter the code shared
          there to continue.
        </p>
      </div>

      {hasError && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          That code wasn&apos;t right — please try again.
        </p>
      )}

      <form
        action={verifyPasscode}
        className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6"
      >
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm">
          Access code
          <input
            type="password"
            name="passcode"
            required
            autoFocus
            className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
