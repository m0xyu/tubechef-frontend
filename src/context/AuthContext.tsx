import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '@/lib/apiClient';
import axios from 'axios';
import type { ValidationErrors } from '@/types/api';

interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthContextType {
  user: User | null;
  updateUser: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  errors: ValidationErrors | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // CSRFトークンを取得してからリクエストを送るヘルパー
  const csrf = () => apiClient.get('/sanctum/csrf-cookie');

  // 初回ロード時にユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get('/api/user');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = async () => {
    try {
      const res = await apiClient.get('/api/user');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const login = async (data: LoginRequest) => {
    setErrors(null);
    try {
      await csrf(); // 必須: CSRF保護
      await apiClient.post('/login', data);
      const res = await apiClient.get('/api/user');
      setUser(res.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 422) {
        const responseData = e.response.data as { errors: ValidationErrors };
        setErrors(responseData.errors);
      }
      throw e;
    }
  };

  const register = async (data: RegisterRequest) => {
    setErrors(null);
    try {
      await csrf();
      await apiClient.post('/register', data);
      const res = await apiClient.get('/api/user');
      setUser(res.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 422) {
        const responseData = e.response.data as { errors: ValidationErrors };
        setErrors(responseData.errors);
      }
      throw e;
    }
  };

  const logout = async () => {
    await apiClient.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext value={{ user, updateUser, login, register, logout, isLoading, errors }}>
      {children}
    </AuthContext>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

