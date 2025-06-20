'use client';

import { ProcessoDto } from '@/dtos/processo.dto';
import { PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar } from 'recharts';

export default function Charts({ processos }: { processos?: ProcessoDto[] }) {

  const safeProcessos = Array.isArray(processos) ? processos : [];

  const totalAtual = safeProcessos.reduce(
    (soma, p) => soma + (p.valorEstimadoAtual ?? 0),
    0
  );

  const porStatus = Object.values(
    safeProcessos.reduce((acc: { [key: string]: { name: string; total: number } }, p) => {
      const key = p.pago === true ? 'Pago' : 'Não pago';
      acc[key] = acc[key] || { name: key, total: 0 };
      acc[key].total++;
      return acc;
    }, {} as { [key: string]: { name: string; total: number } })
  );

  const porVara = Object.values(
    safeProcessos.reduce((acc: { [key: string]: { name: string; total: number } }, p) => {
      acc[p.vara] = acc[p.vara] || { name: p.vara, total: 0 };
      acc[p.vara].total++;
      return acc;
    }, {} as { [key: string]: { name: string; total: number } })
  );

  const totalDepositado = safeProcessos.reduce((sum, p) => sum + Number(p.valorDeposito || 0), 0);
  const totalDevolvido = safeProcessos.reduce((sum, p) => sum + Number(p.valorDevolvido || 0), 0);


  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <h2 className="text-lg mb-2 font-semibold">Por Status</h2>
          <PieChart width={400} height={300}>
            <Pie dataKey="total" data={porStatus} cx="50%" cy="50%" outerRadius={100} label>
              {porStatus.map((_, i) => (
                <Cell key={i} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][i % 4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-lg mb-2 font-semibold">Por Vara</h2>
          <BarChart width={400} height={300} data={porVara}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Totais Financeiros</h2>

        <p className="text-lg">
          💰 Valor estimado total atualizado até hoje:{' '}
          <strong>R$ {totalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
        </p>
        <p>Valor depositado: R$ {totalDepositado?.toFixed(2)}</p>
        <p>Valor devolvido: R$ {totalDevolvido?.toFixed(2)}</p>
      </div>
    </div>
  );
}
