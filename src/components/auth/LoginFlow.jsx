// src/components/auth/LoginFlow.jsx
import { useState, useRef } from "react";
import { Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginFlow({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const inputsRef = useRef([]);

  const mockOtp = "123456"; // hardcoded for the demo

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill all fields");
    setError("");
    setInfo(`A 6-digit code was sent to ${email}. (Demo code: ${mockOtp})`);
    setStep(2);
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only allow single digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next box
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const entered = otp.join("");
    if (entered.length < 6) return setError("Enter all 6 digits");

    if (entered === mockOtp) {
      onLoginSuccess(email);
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6 mt-10">
      {step === 1 && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-3">Sign in to continue</p>

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
            Continue
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpSubmit} className="space-y-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Verify your identity</h2>
          </div>

          {info && (
            <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">{info}</p>
          )}

          <div className="flex justify-between gap-2 my-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                className="w-10 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
            Verify & Login
          </button>
        </form>
      )}
    </div>
  );
}