import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveModal({ isOpen, onClose }: Props) {
  const { menu, saveConfiguration } = useMenu();
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = name.trim() || menu.name || 'menu';
    saveConfiguration(trimmed);
    setName('');
    onClose();
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(menu, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (menu.name || 'menu')
      .replace(/[^\wа-яА-ЯёЁ\- ]+/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'menu';
    a.download = `${safeName}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-bold mb-4">Сохранить конфигурацию</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название конфигурации"
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-black"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm border border-black text-black rounded hover:bg-black hover:text-white transition-colors"
          >
            Скачать JSON
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
