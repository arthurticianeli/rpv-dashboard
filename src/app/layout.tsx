import ReactQueryProvider from '@/lib/react-query/provider';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

export const metadata = {
  title: 'RPV Tracker',
  description: 'Acompanhamento de processos e geração de RPVs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="flex">
        <Sidebar />
        <main className="w-full min-h-screen bg-gray-50 md:ml-64 p-4">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
