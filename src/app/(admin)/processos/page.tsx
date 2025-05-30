'use client';

import React, { useEffect, useState } from 'react';
import { BotoesRequerimento } from '@/components/BotoesRequerimento';
import { ProcessoDto } from '@/dtos/processo.dto';

export default function Page() {
  const [processos, setProcessos] = useState<ProcessoDto[]>([]);
  const [editandoMovimentacoes, setEditandoMovimentacoes] = useState<Record<string, boolean>>({});

  const [filtros, setFiltros] = useState({
    status: 'todos',
    valorMin: '',
    valorMax: '',
    dataInicio: '',
    dataFim: '',
  });
  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof ProcessoDto;
    direcao: 'asc' | 'desc';
  }>({ campo: 'numero', direcao: 'asc' });

  const [loading, setLoading] = useState(true);
  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseURL}/processos`);
        const data = await res.json();
        setProcessos(data);
      } catch (error) {
        console.error('Erro ao buscar processos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseURL]);

  // 🧠 Filtro local
  const processosFiltrados = processos.filter((p) => {
    const deposito = p.valorDeposito ?? 0;
    const dataDep = p.dataDeposito ? new Date(p.dataDeposito) : null;

    const statusOk =
      filtros.status === 'todos' ||
      (filtros.status === 'comDeposito' && deposito > 0) ||
      (filtros.status === 'semDeposito' && deposito === 0);

    const valorOk =
      (!filtros.valorMin || deposito >= parseFloat(filtros.valorMin)) &&
      (!filtros.valorMax || deposito <= parseFloat(filtros.valorMax));

    const dataOk =
      (!filtros.dataInicio || (dataDep && dataDep >= new Date(filtros.dataInicio))) &&
      (!filtros.dataFim || (dataDep && dataDep <= new Date(filtros.dataFim)));

    return statusOk && valorOk && dataOk;
  });

  const processosOrdenados = [...processosFiltrados].sort((a, b) => {
    let valorA = a[ordenacao.campo];
    let valorB = b[ordenacao.campo];

    if (valorA === null || valorA === undefined) return 1;
    if (valorB === null || valorB === undefined) return -1;

    // 🧠 Conversão para número, se for string com vírgula
    if (typeof valorA === 'string' && valorA.includes(',')) {
      valorA = parseFloat(valorA.replace('.', '').replace(',', '.'));
    }
    if (typeof valorB === 'string' && valorB.includes(',')) {
      valorB = parseFloat(valorB.replace('.', '').replace(',', '.'));
    }

    if (typeof valorA === 'number' && typeof valorB === 'number') {
      return ordenacao.direcao === 'asc' ? valorA - valorB : valorB - valorA;
    }

    if (ordenacao.campo === 'vara') {
      const numA = parseInt(String(valorA));
      const numB = parseInt(String(valorB));
      if (!isNaN(numA) && !isNaN(numB)) {
        return ordenacao.direcao === 'asc' ? numA - numB : numB - numA;
      }
    }

    const valA = String(valorA).toLowerCase();
    const valB = String(valorB).toLowerCase();

    return ordenacao.direcao === 'asc'
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const alternarOrdenacao = (campo: keyof ProcessoDto) => {
    setOrdenacao((prev) => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc',
    }));
  };

  const togglePago = async (numeroProcesso: string, novoStatus: boolean) => {
    try {
      await fetch(`${baseURL}/processos/${numeroProcesso}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pago: novoStatus }),
      });

      setProcessos((prev) =>
        prev.map((p) =>
          p.numero === numeroProcesso ? { ...p, pago: novoStatus } : p
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const iniciarEdicao = (numero: string) => {
    setEditandoMovimentacoes((prev) => ({ ...prev, [numero]: true }));
  };

const salvarMovimentacao = async (numero: string, novaMov: string) => {
  try {
    const response = await fetch(`${baseURL}/processos/${numero}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ultimaMovimentacao: novaMov }),
    });

    if (!response.ok) throw new Error('Erro ao salvar');

    // ✅ Sucesso: fecha edição
    setEditandoMovimentacoes((prev) => ({ ...prev, [numero]: false }));
  } catch (err) {
    console.error('Erro ao atualizar movimentação:', err);
    // ❗ Aqui você pode exibir um toast de erro, se quiser
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Processos</h1>

      {/* 🔍 Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm">Status</label>
          <select
            name="status"
            value={filtros.status}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 bg-gray-50"
          >
            <option value="todos">Todos</option>
            <option value="comDeposito">Com depósito</option>
            <option value="semDeposito">Sem depósito</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Valor mínimo</label>
          <input
            type="number"
            name="valorMin"
            value={filtros.valorMin}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm">Valor máximo</label>
          <input
            type="number"
            name="valorMax"
            value={filtros.valorMax}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm">Data início</label>
          <input
            type="date"
            name="dataInicio"
            value={filtros.dataInicio}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm">Data fim</label>
          <input
            type="date"
            name="dataFim"
            value={filtros.dataFim}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* 🧾 Tabela */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-400">
                <th className="border p-2 text-left">Nº</th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('numero')}>
                  Nº Processo {ordenacao.campo === 'numero' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('requerente')}>
                  Requerente {ordenacao.campo === 'requerente' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('vara')}>
                  Vara {ordenacao.campo === 'vara' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('ultimaMovimentacao')}>
                  Última Movimentação {ordenacao.campo === 'ultimaMovimentacao' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('valorDeposito')}>
                  Valor Depósito {ordenacao.campo === 'valorDeposito' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('dataDeposito')}>
                  Data Depósito {ordenacao.campo === 'dataDeposito' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('valorDevolvido')}>
                  Valor Devolução {ordenacao.campo === 'valorDevolvido' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('dataDevolucao')}>
                  Data Devolução{ordenacao.campo === 'dataDevolucao' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left cursor-pointer" onClick={() => alternarOrdenacao('pago')}>
                  Pago {ordenacao.campo === 'pago' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 text-left">Expedição RPV</th>
              </tr>
            </thead>
            <tbody>
              {processosOrdenados.map((p, index) => (
                <tr key={p.numero} className="border-t hover:bg-gray-400">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{p.numero}</td>
                  <td className="border p-2">{p.requerente}</td>
                  <td className="border p-2">{p.vara}</td>
                  <td className="border p-2 relative max-w-xs">
                    {editandoMovimentacoes[p.numero] ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={p.ultimaMovimentacao || ''}
                          onChange={(e) =>
                            setProcessos((prev) =>
                              prev.map((proc) =>
                                proc.numero === p.numero
                                  ? { ...proc, ultimaMovimentacao: e.target.value }
                                  : proc
                              )
                            )
                          }
                          
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          autoFocus
                        />
                        <button
                          className="text-green-600 hover:text-green-800 text-sm z-10 relative cursor-pointer"
                          title="Salvar"
                          onClick={() => salvarMovimentacao(p.numero, p.ultimaMovimentacao)}
                        >
                          💾
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{p.ultimaMovimentacao || '—'}</span>
                        <button
                          onClick={() => iniciarEdicao(p.numero)}
                          className="text-gray-500 hover:text-blue-600 text-sm z-10 relative cursor-pointer"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="border p-2">
                    {p.valorDeposito !== undefined && p.valorDeposito !== null && !isNaN(Number(p.valorDeposito))
                      ? `R$ ${Number(p.valorDeposito).toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="border p-2">
                    {p.dataDeposito ? new Date(p.dataDeposito).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="border p-2">
                    {p.valorDevolvido !== undefined && p.valorDevolvido !== null && !isNaN(Number(p.valorDevolvido))
                      ? `R$ ${Number(p.valorDevolvido).toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="border p-2">
                    {p.dataDevolucao ? new Date(p.dataDevolucao).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={p.pago ?? false}
                      className='form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                      onChange={(e) => togglePago(p.numero, e.target.checked)}
                    />
                  </td>
                  <td className="border p-2">
                    <BotoesRequerimento numero={p.numero} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
