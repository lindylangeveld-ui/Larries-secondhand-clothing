import { CONDITION_LABELS, getAllItemTypes, getPendingItems } from "@/lib/items";
import { getSetting } from "@/lib/settings";
import { approve, reject, addType, toggleType, updatePasscode } from "./actions";

function formatPrice(price: string | null) {
  if (!price) return "—";
  return `R${Number(price).toFixed(2)}`;
}

export default async function AdminDashboardPage() {
  const [pending, itemTypes, passcode] = await Promise.all([
    getPendingItems(),
    getAllItemTypes(),
    getSetting("site_passcode"),
  ]);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Site access code</h2>
        <p className="text-sm text-neutral-600">
          Buyers and sellers need this code to get into the site. Share it in the WhatsApp group.
        </p>
        <form action={updatePasscode} className="flex max-w-sm gap-2">
          <input
            type="text"
            name="passcode"
            required
            defaultValue={passcode ?? ""}
            className="flex-1 rounded border border-neutral-300 px-2 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white"
          >
            Update
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pending items ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-neutral-600">Nothing waiting for review.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-600">
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 font-medium">Size</th>
                  <th className="px-3 py-2 font-medium">Condition</th>
                  <th className="px-3 py-2 font-medium">Price</th>
                  <th className="px-3 py-2 font-medium">Seller</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {pending.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-3 py-2">{item.itemTypeName}</td>
                    <td className="px-3 py-2">{item.size}</td>
                    <td className="px-3 py-2">{CONDITION_LABELS[item.condition]}</td>
                    <td className="px-3 py-2">{formatPrice(item.price)}</td>
                    <td className="px-3 py-2">{item.sellerName}</td>
                    <td className="px-3 py-2">{item.sellerPhone}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <form action={approve} className="inline">
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded bg-neutral-900 px-2 py-1 text-xs text-white"
                        >
                          Approve
                        </button>
                      </form>{" "}
                      <form action={reject} className="inline">
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded border border-neutral-300 px-2 py-1 text-xs"
                        >
                          Reject
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Item types</h2>
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-[360px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-600">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {itemTypes.map((t) => (
                <tr key={t.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-3 py-2">{t.name}</td>
                  <td className="px-3 py-2">{t.active ? "Active" : "Inactive"}</td>
                  <td className="px-3 py-2 text-right">
                    <form action={toggleType}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        className="rounded border border-neutral-300 px-2 py-1 text-xs"
                      >
                        {t.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={addType} className="flex max-w-sm gap-2">
          <input
            type="text"
            name="name"
            required
            placeholder="New item type name"
            className="flex-1 rounded border border-neutral-300 px-2 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
}
