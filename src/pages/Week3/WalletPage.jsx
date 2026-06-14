import React, { useState, useCallback } from "react";
import PaymentCard from "../../components/payments/PaymentCard";
import PaymentModal from "../../components/payments/PaymentModal";
import TransactionTable from "../../components/payments/TransactionTable";

export default function WalletPage() {
  const [balance, setBalance] = useState(1000);
  const [transactions, setTransactions] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // shared helper so success/failure records stay in sync
  const logTransaction = (record) => {
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
        ...record,
      },
      ...prev,
    ]);
  };

  const handleConfirm = useCallback(
    ({ type, amount, recipient }) => {
      // Defensive validation (modal should already prevent these,
      // but never trust upstream input alone)
      if (!amount || amount <= 0) {
        showToast("Enter a valid amount", "error");
        return;
      }

      const isOutgoing = type === "withdraw" || type === "transfer";

      // Insufficient funds check
      if (isOutgoing && amount > balance) {
        logTransaction({
          type,
          amount,
          sender: "You",
          receiver: recipient || "You",
          status: "Failed",
        });
        showToast("Insufficient funds", "error");
        return;
      }

      // Update balance
      setBalance((prev) =>
        type === "deposit" ? prev + amount : prev - amount
      );

      // Log successful transaction
      logTransaction({
        type,
        amount,
        sender: type === "deposit" ? "External" : "You",
        receiver: type === "transfer" ? recipient : "You",
        status: "Success",
      });

      showToast(
        `${type.charAt(0).toUpperCase() + type.slice(1)} successful!`
      );
    },
    [balance]
  );

  return (
    <div className="space-y-6 p-6 relative">
      <h1 className="text-3xl font-bold text-gray-800">
        💰 Wallet Dashboard
      </h1>

      {/* Low balance warning */}
      {balance < 50 && (
        <div className="bg-yellow-50 text-yellow-700 text-sm px-3 py-2 rounded-lg border border-yellow-200">
          ⚠️ Your balance is low. Consider depositing funds.
        </div>
      )}

      <PaymentCard balance={balance} onAction={setModalType} />

      {modalType && (
        <PaymentModal
          type={modalType}
          onClose={() => setModalType(null)}
          onConfirm={handleConfirm}
        />
      )}

      <TransactionTable transactions={transactions} />

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-opacity ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.type === "error" ? "❌ " : "✅ "}
          {toast.message}
        </div>
      )}
    </div>
  );
}