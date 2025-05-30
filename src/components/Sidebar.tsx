'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUpload, FiList, FiBarChart2 } from 'react-icons/fi';

const links = [
  { href: '/', label: 'Dashboard', icon: <FiBarChart2 /> },
  { href: '/processos', label: 'Processos', icon: <FiList /> },
  { href: '/importar', label: 'Importar CSV', icon: <FiUpload /> },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="text-xl font-bold px-6 py-4 border-b border-gray-700">
        📚 RPV Tracker
      </div>

      <nav className="flex-1 px-2 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${
              pathname === link.href ? 'bg-gray-800 font-semibold' : ''
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
