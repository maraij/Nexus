// src/components/payments/PaymentModal.jsx
import { useState } from "react";
import { X, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";

const config = {
  deposit: { title: "Deposit Funds", icon: ArrowDownToLine, color: "text-blue-600 bg-blue-50" },
  withdraw: { title: "Withdraw Funds", icon: ArrowUpFromLine, color: "text-blue-600 bg-blue-50" },
  transfer: { title: "Transfer Funds", icon: ArrowLeftRight, color: "text-blue-600 bg-blue-50" },
};

export default function PaymentModal({ type, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  const { title, icon: Icon, color } = config[type];

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return setError("Enter a valid amount");
    if (type === "transfer" && !recipient.trim()) return setError("Enter a recipient");

    onConfirm({ type, amount: num, recipient: recipient.trim() || "Self" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${color}`}>
              <Icon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <label className="text-xs font-medium text-gray-500 mb-1 block">
          Amount
        </label>
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 pl-7 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {type === "transfer" && (
          <>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Recipient
            </label>
            <input
              type="text"
              placeholder="Recipient name"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}