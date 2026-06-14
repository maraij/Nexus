// src/context/WalletContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(1000);
  const [transactions, setTransactions] = useState([]);

  const addTransaction = useCallback(({ type, amount, recipient }) => {
    if (!amount || amount <= 0) return { success: false, message: "Invalid amount" };

    let result = { success: true, message: "Success" };

    setBalance((currentBalance) => {
      const isOutgoing = type === "withdraw" || type === "transfer" || type === "funding";

      if (isOutgoing && amount > currentBalance) {
        result = { success: false, message: "Insufficient funds" };

        setTransactions((prev) => [
          {
            id: crypto.randomUUID(),
            type,
            amount,
            sender: "You",
            receiver: recipient || "You",
            status: "Failed",
            date: new Date().toLocaleString(),
          },
          ...prev,
        ]);

        return currentBalance; // balance unchanged
      }

      setTransactions((prev) => [
        {
          id: crypto.randomUUID(),
          type,
          amount,
          sender: type === "deposit" ? "External" : "You",
          receiver: type === "transfer" || type === "funding" ? recipient : "You",
          status: "Success",
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);

      return type === "deposit" ? currentBalance + amount : currentBalance - amount;
    });

    return result;
  }, []);

  return (
    <WalletContext.Provider value={{ balance, transactions, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);