import { CONDITION_LABELS, getItemsByPhone } from "@/lib/items";
import { markSold } from "./actions";

function formatPrice(price: string | null) {
  if (!price) return "—";
  return `R${Number(price).toFixed(2)}`;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending approval",
  approved: "Live on site",
};

export default async function MyItemsPage(props: PageProps<"/my-items">) {
  const searchParams = await props.searchParams;
  const phone = typeof searchParams.phone === "string" ? searchParams.phone.trim() : "";
  const items = phone ? await getItemsByPhone(phone) : [];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My items</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Enter the phone number you used when submitting an item to see and manage your
          listings.
        </p>
      </div>

      <form className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input
          type="tel"
          name="phone"
          defaultValue={phone}
          required
          placeholder="Your phone number"
          className="flex-1 rounded border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-1.5 text-sm text-white"
        >
          Look up
        </button>
      </form>

      {phone && items.length === 0 && (
        <p className="text-neutral-600">No active items found for that phone number.</p>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-600">
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Size</th>
                <th className="px-3 py-2 font-medium">Condition</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-3 py-2">{item.itemTypeName}</td>
                  <td className="px-3 py-2">{item.size}</td>
                  <td className="px-3 py-2">{CONDITION_LABELS[item.condition]}</td>
                  <td className="px-3 py-2">{formatPrice(item.price)}</td>
                  <td className="px-3 py-2">{STATUS_LABELS[item.status] ?? item.status}</td>
                  <td className="px-3 py-2 text-right">
                    <form action={markSold}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <input type="hidden" name="phone" value={phone} />
                      <button
                        type="submit"
                        className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50"
                      >
                        Mark as sold
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
