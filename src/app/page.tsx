'use client';

import { useProcessos } from '@/hooks/useProcessos';
import Charts from './dashboard/charts';

export default function DashboardPage() {
  const { data: processos = [], isLoading } = useProcessos();

  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Processos</h1>
      <Charts processos={processos} />
    </div>
  );
}
