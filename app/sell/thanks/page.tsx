import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="max-w-lg space-y-3">
      <h1 className="text-2xl font-semibold">Thanks!</h1>
      <p className="text-neutral-600">
        Your item has been submitted and is waiting for admin approval. Once approved, it will
        appear on the <Link href="/" className="underline">browse page</Link>.
      </p>
      <p className="text-neutral-600">
        When it sells, come back to <Link href="/my-items" className="underline">My items</Link> and
        mark it as sold using your phone number.
      </p>
    </div>
  );
}
