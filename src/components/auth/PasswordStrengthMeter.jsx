// src/components/auth/PasswordStrengthMeter.jsx
import { Check, X } from "lucide-react";

function getStrength(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
}

const levels = [
  { label: "Too Weak", color: "bg-red-500", textColor: "text-red-500" },
  { label: "Weak", color: "bg-orange-500", textColor: "text-orange-500" },
  { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500" },
  { label: "Good", color: "bg-blue-500", textColor: "text-blue-500" },
  { label: "Strong", color: "bg-green-500", textColor: "text-green-500" },
];

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const { score, checks } = getStrength(password);
  const level = levels[score];

  const requirements = [
    { key: "length", label: "At least 8 characters" },
    { key: "uppercase", label: "One uppercase letter" },
    { key: "number", label: "One number" },
    { key: "symbol", label: "One special character" },
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {levels.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= score - 1 ? level.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${level.textColor}`}>{level.label}</p>

      <ul className="grid grid-cols-2 gap-1 mt-1">
        {requirements.map((req) => (
          <li
            key={req.key}
            className={`flex items-center gap-1 text-xs ${
              checks[req.key] ? "text-green-600" : "text-gray-400"
            }`}
          >
            {checks[req.key] ? <Check size={12} /> : <X size={12} />}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}