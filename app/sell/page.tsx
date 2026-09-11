import { getActiveItemTypes } from "@/lib/items";
import SellItemsForm from "./SellItemsForm";

export default async function SellPage(props: PageProps<"/sell">) {
  const searchParams = await props.searchParams;
  const hasError = searchParams.error === "1";
  const itemTypes = await getActiveItemTypes();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sell items</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Add one or more items below. An admin will review them before they appear on the site.
        </p>
      </div>

      {hasError && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          Please check the form — something wasn&apos;t filled in correctly.
        </p>
      )}

      <SellItemsForm itemTypes={itemTypes} />
    </div>
  );
}
