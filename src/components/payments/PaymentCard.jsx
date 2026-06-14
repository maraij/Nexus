// src/components/payments/PaymentCard.jsx
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, ShieldCheck } from "lucide-react";

export default function PaymentCard({ balance, onAction }) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-6 max-w-md mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-indigo-100 tracking-wide uppercase">
          Wallet Balance
        </h2>
        <span className="flex items-center gap-1 text-xs bg-white/15 backdrop-blur px-2 py-1 rounded-full">
          <ShieldCheck size={12} />
          Simulation
        </span>
      </div>

      <p className="text-4xl font-bold mb-6 tracking-tight">
        ${balance.toFixed(2)}
      </p>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onAction("deposit")}
          className="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/20 active:scale-95 transition-all py-3 rounded-xl text-sm font-medium"
        >
          <ArrowDownToLine size={18} />
          Deposit
        </button>
        <button
          onClick={() => onAction("withdraw")}
          className="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/20 active:scale-95 transition-all py-3 rounded-xl text-sm font-medium"
        >
          <ArrowUpFromLine size={18} />
          Withdraw
        </button>
        <button
          onClick={() => onAction("transfer")}
          className="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/20 active:scale-95 transition-all py-3 rounded-xl text-sm font-medium"
        >
          <ArrowLeftRight size={18} />
          Transfer
        </button>
      </div>
    </div>
  );
}