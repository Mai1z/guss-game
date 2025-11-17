import { AuthContextType } from '@/types/api/auth';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType | null>(null);