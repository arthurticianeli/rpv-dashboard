'use client';

type Props = {
  numero: string;
};

export const BotoesRequerimento = ({ numero }: Props) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  return (
    <div className="flex gap-2">
      <a
        href={`${baseURL}/processos/${numero}/requerimento.pdf`}
        target="_blank"
        className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
      >
        PDF
      </a>
      <a
        href={`${baseURL}/processos/${numero}/requerimento.docx`}
        target="_blank"
        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
      >
        DOCX
      </a>
    </div>
  );
};
