import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useItems } from "../contexts/ItemContext";

const SwapRequestModal = ({ isOpen, onClose, requestedItem, offeredItem = null }) => {
  const { currentUser } = useAuth();
  const { items } = useItems();
  const [selectedItemId, setSelectedItemId] = useState("");

  const userItems = items.filter(
    (item) =>
      item.uploaderId === currentUser?.id &&
      item.status === "available" &&
      item.id !== requestedItem.id
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItemId) {
      toast.error("Please select one of your items to swap");
      return;
    }

    // Placeholder logic for swap request
    toast.success("Swap request sent (mocked, no DB action)");

    // Reset form and close modal
    setSelectedItemId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 z-10 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
            Propose Swap
          </Dialog.Title>

          <p className="text-gray-700 mb-4">
            Choose one of your available items to swap for{" "}
            <span className="font-semibold">{requestedItem.title}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="yourItem" className="block text-sm font-medium text-gray-700 mb-1">
                Your Item
              </label>
              <select
                id="yourItem"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Select an item</option>
                {userItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.size})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg"
            >
              Send Request
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default SwapRequestModal;
