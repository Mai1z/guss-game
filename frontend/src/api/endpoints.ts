import { apiClient } from './client';
import {
  LoginRequest,
  AuthResponse,
  GetRoundsResponse,
  CreateRoundResponse,
  GetRoundDetailsResponse,
  TapResponse,
} from '@/types/api';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const getRounds = async (): Promise<GetRoundsResponse> => {
  const response = await apiClient.get<GetRoundsResponse>('/rounds');
  return response.data;
};

export const createRound = async (): Promise<CreateRoundResponse> => {
  const response = await apiClient.post<CreateRoundResponse>('/rounds');
  return response.data;
};

export const getRoundById = async (id: string): Promise<GetRoundDetailsResponse> => {
  const response = await apiClient.get<GetRoundDetailsResponse>(`/rounds/${id}`);
  return response.data;
};

export const tap = async (roundId: string): Promise<TapResponse> => {
  const response = await apiClient.post<TapResponse>(`/rounds/${roundId}/tap`);
  return response.data;
};