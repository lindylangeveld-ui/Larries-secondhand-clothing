import Link from "next/link";
import {
  CONDITION_LABELS,
  getActiveItemTypes,
  getApprovedItems,
  getDistinctApprovedSizes,
  type Item,
} from "@/lib/items";

function formatPrice(price: string | null) {
  if (!price) return null;
  return `R${Number(price).toFixed(2)}`;
}

interface SizeGroup {
  size: string;
  items: Item[];
}

interface ItemTypeGroup {
  itemTypeName: string;
  sizes: SizeGroup[];
}

function groupItems(items: Item[]): ItemTypeGroup[] {
  const typeGroups = new Map<string, Map<string, Item[]>>();
  for (const item of items) {
    if (!typeGroups.has(item.itemTypeName)) {
      typeGroups.set(item.itemTypeName, new Map());
    }
    const sizeGroups = typeGroups.get(item.itemTypeName)!;
    if (!sizeGroups.has(item.size)) {
      sizeGroups.set(item.size, []);
    }
    sizeGroups.get(item.size)!.push(item);
  }

  return Array.from(typeGroups.entries()).map(([itemTypeName, sizeGroups]) => ({
    itemTypeName,
    sizes: Array.from(sizeGroups.entries()).map(([size, sizeItems]) => ({
      size,
      items: sizeItems,
    })),
  }));
}

export default async function Page(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const itemTypeId = typeof searchParams.itemTypeId === "string" ? searchParams.itemTypeId : undefined;
  const size = typeof searchParams.size === "string" ? searchParams.size : undefined;

  const [itemTypes, sizes, items] = await Promise.all([
    getActiveItemTypes(),
    getDistinctApprovedSizes(),
    getApprovedItems({ itemTypeId, size }),
  ]);

  const groups = groupItems(items);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand">Available Items</h1>
        <p className="mt-1 text-sm text-neutral-600">
          For security, all purchases must be conducted by contacting the seller from within the
          Larrie Second-hand Clothing WhatsApp group.
        </p>
      </div>

      <form className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex flex-col text-sm">
          Item
          <select
            name="itemTypeId"
            defaultValue={itemTypeId ?? ""}
            className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 sm:w-auto sm:py-1"
          >
            <option value="">All items</option>
            {itemTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm">
          Size
          <select
            name="size"
            defaultValue={size ?? ""}
            className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 sm:w-auto sm:py-1"
          >
            <option value="">All sizes</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded bg-brand px-4 py-1.5 text-sm text-white"
          >
            Filter
          </button>
          {(itemTypeId || size) && (
            <Link href="/" className="text-sm text-neutral-600 underline">
              Clear filters
            </Link>
          )}
        </div>
      </form>

      {groups.length === 0 ? (
        <p className="text-neutral-600">No items match your filters yet.</p>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const total = group.sizes.reduce((sum, s) => sum + s.items.length, 0);
            return (
              <details
                key={group.itemTypeName}
                className="group rounded-lg border border-neutral-200 bg-brand/[6%]"
              >
                <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 font-semibold text-brand hover:bg-brand/10">
                  <span>
                    {group.itemTypeName}
                    <span className="ml-2 rounded-full bg-brand-accent px-2 py-0.5 text-xs font-medium text-brand">
                      {total} {total === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span className="text-base text-neutral-500 transition-transform group-open:rotate-90">
                    ▶
                  </span>
                </summary>

                <div className="space-y-3 border-t border-neutral-200 p-4">
                  {group.sizes.map((sizeGroup) => (
                    <details
                      key={sizeGroup.size}
                      className="group/size rounded border border-neutral-200 bg-brand/[3%]"
                    >
                      <summary className="flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-brand/[8%]">
                        <span>
                          {sizeGroup.size}
                          <span className="ml-2 text-xs font-normal text-neutral-500">
                            ({sizeGroup.items.length})
                          </span>
                        </span>
                        <span className="text-sm text-neutral-500 transition-transform group-open/size:rotate-90">
                          ▶
                        </span>
                      </summary>
                      <div className="overflow-x-auto border-t border-neutral-200">
                        <table className="w-full min-w-[480px] text-sm">
                          <thead>
                            <tr className="border-b border-neutral-200 text-left text-neutral-600">
                              <th className="px-3 py-2 font-medium">Condition</th>
                              <th className="px-3 py-2 font-medium">Price</th>
                              <th className="px-3 py-2 font-medium">Seller</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sizeGroup.items.map((item) => (
                              <tr key={item.id} className="border-b border-neutral-100 last:border-0">
                                <td className="px-3 py-2">{CONDITION_LABELS[item.condition]}</td>
                                <td className="px-3 py-2">{formatPrice(item.price) ?? "—"}</td>
                                <td className="px-3 py-2">{item.sellerName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
