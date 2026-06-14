import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';
import { users } from '../data/users';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'business_nexus_user';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';
const OTP_STORAGE_KEY = 'business_nexus_otp'; // mock OTP store

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Generates and "sends" a 6-digit OTP (mock)
  const issueOtp = (target: User) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(OTP_STORAGE_KEY, otp);
    setPendingUser(target);
    setOtpRequired(true);
    console.log("ISSUE OTP RUNNING", target);
console.log("GENERATED OTP", otp);
    // In a real app this would be emailed/texted — for the demo we toast it
    toast.success(`Demo OTP sent: ${otp}`, { duration: 6000 });
  };
  

  // STEP 1: verify credentials, then trigger OTP instead of logging in directly
 const login = async (email: string, password: string, role: UserRole): Promise<void> => {
  setIsLoading(true);

  try {
    console.log("LOGIN CALLED", email, role);

    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = users.find(
      u => u.email === email && u.role === role
    );

    console.log("FOUND USER", foundUser);

    if (!foundUser) {
      throw new Error('Invalid credentials or user not found');
    }

    issueOtp(foundUser);
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
  // STEP 2: verify the OTP and complete login
  const verifyOtp = async (otp: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedOtp = sessionStorage.getItem(OTP_STORAGE_KEY);
      if (!pendingUser || otp !== storedOtp) {
        throw new Error('Invalid OTP. Please try again.');
      }

      setUser(pendingUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(pendingUser));
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      setPendingUser(null);
      setOtpRequired(false);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    if (!pendingUser) return;
    issueOtp(pendingUser);
  };

  const cancelLogin = () => {
    setPendingUser(null);
    setOtpRequired(false);
    sessionStorage.removeItem(OTP_STORAGE_KEY);
  };


  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (users.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      const newUser: User = {
        id: `${role[0]}${users.length + 1}`,
        name,
        email,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        bio: '',
        isOnline: true,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundUser = users.find(u => u.email === email);
      if (!foundUser) throw new Error('No account found with this email');
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) throw new Error('Invalid or expired reset token');
      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error('User not found');
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      if (user?.id === userId) {
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    pendingUser,
    otpRequired,
    login,
    verifyOtp,
    resendOtp,
    cancelLogin,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
