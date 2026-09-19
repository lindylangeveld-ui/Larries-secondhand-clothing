"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitItems } from "./actions";

interface ItemTypeOption {
  id: string;
  name: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Submit for approval"}
    </button>
  );
}

export default function SellItemsForm({ itemTypes }: { itemTypes: ItemTypeOption[] }) {
  const [rowIds, setRowIds] = useState<number[]>([0]);

  function addRow() {
    setRowIds((ids) => [...ids, Math.max(...ids) + 1]);
  }

  function removeRow(id: number) {
    setRowIds((ids) => (ids.length > 1 ? ids.filter((rowId) => rowId !== id) : ids));
  }

  return (
    <form action={submitItems} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
      <div className="max-w-sm space-y-4">
        <div>
          <label className="block text-sm">
            Your first name
            <input
              type="text"
              name="sellerName"
              required
              maxLength={100}
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
            />
          </label>
          <p className="mt-1 text-xs text-neutral-500">This will be visible on the site.</p>
        </div>

        <div>
          <label className="block text-sm">
            Your phone number
            <input
              type="tel"
              name="sellerPhone"
              required
              maxLength={20}
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
            />
          </label>
          <p className="mt-1 text-xs text-neutral-500">
            Shown as a WhatsApp contact link once your item is approved, and used so you can
            manage your own listings later.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {rowIds.map((id, index) => (
          <div key={id} className="space-y-4 rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-700">Item {index + 1}</h3>
              {rowIds.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(id)}
                  className="text-xs text-red-600 underline"
                >
                  Remove
                </button>
              )}
            </div>

            <label className="block text-sm">
              Item
              <select
                name="itemTypeId"
                required
                defaultValue=""
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
              >
                <option value="" disabled>
                  Select an item
                </option>
                {itemTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              Size
              <input
                type="text"
                name="size"
                required
                maxLength={50}
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
                placeholder="e.g. 32 or Large"
              />
            </label>

            <label className="block text-sm">
              Price (optional)
              <input
                type="text"
                name="price"
                inputMode="decimal"
                pattern="^\d+(\.\d{1,2})?$"
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
                placeholder="0.00"
              />
            </label>

            <label className="block text-sm">
              Condition
              <select
                name="condition"
                required
                defaultValue=""
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5"
              >
                <option value="" disabled>
                  Select condition
                </option>
                <option value="unused">Unused</option>
                <option value="like_new">Like New</option>
                <option value="fair">Fair</option>
              </select>
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="w-full rounded border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        + Add another item
      </button>

      <SubmitButton />
    </form>
  );
}
