'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

export function CSVUploader() {
  type CsvRow = Record<string, string>;
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data as CsvRow[]);
      },
    });
  };

  const sendToServer = async () => {
    if (!csvData.length) return;
    setUploading(true);
    try {
      await axios.post(`${baseURL}/processos/importar`, csvData);
      setSuccess(true);
    } catch (err) {
      console.error('Erro ao importar:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Importar Planilha de Processos</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {csvData.length > 0 && (
        <>
          <p className="mb-2">Pré-visualização: {csvData.length} registros</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={sendToServer}
            disabled={uploading}
          >
            {uploading ? 'Enviando...' : 'Importar'}
          </button>
        </>
      )}

      {success && (
        <p className="mt-4 text-green-600 font-semibold">
          ✅ Importação concluída com sucesso!
        </p>
      )}
    </div>
  );
}
