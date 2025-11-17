import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth';
import { AuthContextType } from '@/types/api/auth';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}