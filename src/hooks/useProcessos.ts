import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProcessos = () => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  return useQuery({
    queryKey: ['processos'],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/processos`);
      return res.data;
    },
  });
};
