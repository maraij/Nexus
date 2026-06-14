// src/components/payments/TransactionTable.jsx
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Wallet } from "lucide-react";

const typeConfig = {
  deposit: { icon: ArrowDownToLine, color: "text-green-600 bg-green-50", sign: "+" },
  withdraw: { icon: ArrowUpFromLine, color: "text-red-600 bg-red-50", sign: "-" },
  transfer: { icon: ArrowLeftRight, color: "text-blue-600 bg-blue-50", sign: "-" },
  funding: { icon: Wallet, color: "text-purple-600 bg-purple-50", sign: "-" },
};

export default function TransactionTable({ transactions }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Transaction History</h3>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-400 border-b text-xs uppercase tracking-wide">
            <th className="py-2 font-medium">Type</th>
            <th className="py-2 font-medium">Date</th>
            <th className="py-2 font-medium">Sender</th>
            <th className="py-2 font-medium">Receiver</th>
            <th className="py-2 font-medium text-right">Amount</th>
            <th className="py-2 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-8 text-gray-400">
                No transactions yet
              </td>
            </tr>
          )}
          {transactions.map((tx) => {
            const cfg = typeConfig[tx.type] || typeConfig.transfer;
            const Icon = cfg.icon;
            return (
              <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg ${cfg.color}`}>
                      <Icon size={14} />
                    </span>
                    <span className="capitalize font-medium text-gray-700">{tx.type}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-500">{tx.date}</td>
                <td className="py-3 text-gray-700">{tx.sender}</td>
                <td className="py-3 text-gray-700">{tx.receiver}</td>
                <td className={`py-3 text-right font-semibold ${cfg.sign === "+" ? "text-green-600" : "text-gray-800"}`}>
                  {cfg.sign}${tx.amount.toFixed(2)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}