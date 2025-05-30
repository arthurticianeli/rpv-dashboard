'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiUpload, FiList, FiBarChart2 } from 'react-icons/fi';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Dashboard', icon: <FiBarChart2 /> },
  { href: '/processos', label: 'Processos', icon: <FiList /> },
  { href: '/importar', label: 'Importar CSV', icon: <FiUpload /> },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão hambúrguer */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded shadow-lg"
      >
        <FiMenu />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="text-xl font-bold px-6 py-4 border-b border-gray-700">
          📚 RPV Tracker
        </div>
        <nav className="flex flex-col px-4 py-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${
                pathname === link.href ? 'bg-gray-800 font-semibold' : ''
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
