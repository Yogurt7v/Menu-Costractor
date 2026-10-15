import React from 'react';
import { useMenu } from '../context/MenuContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: Props) {
  const { savedConfigs, loadConfiguration, deleteConfiguration } = useMenu();

  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">История сохранений</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {savedConfigs.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Нет сохранённых конфигураций</p>
          ) : (
            <div className="space-y-2">
              {savedConfigs.map((config) => (
                <div
                  key={config.id}
                  className="border border-gray-200 rounded p-3 hover:border-gray-400 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{config.name}</h4>
                      <p className="text-xs text-gray-500">{formatDate(config.timestamp)}</p>
                    </div>
                    <button
                      onClick={() => deleteConfiguration(config.id)}
                      className="text-red-500 hover:text-red-700 text-xs ml-2"
                    >
                      Удалить
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      loadConfiguration(config.id);
                      onClose();
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Загрузить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
