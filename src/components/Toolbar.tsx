import React, { useState, useRef, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import SaveModal from './SaveModal';
import HistoryPanel from './HistoryPanel';

export default function Toolbar() {
  const { menu, addBlock, addPromotion, addHeaderItem, isEditMode, toggleEditMode, updateMenuField, exportMenu, importMenu, resetProject } = useMenu();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setShowTypeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chooseType = (add: () => void) => {
    add();
    setShowTypeMenu(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importMenu(file);
    e.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewProject = () => {
    if (window.confirm('Начать новый проект? Текущее меню и все сохранённые конфигурации будут удалены. Это действие нельзя отменить.')) {
      resetProject();
    }
  };

  return (
    <>
      <div className="no-print bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[210mm] mx-auto px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">
              {isEditMode ? 'Редактирование' : 'Просмотр'}
            </span>
            <label className="flex items-center gap-1.5">
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-400">
                Заведение
              </span>
              <input
                type="text"
                value={menu.name || ''}
                onChange={(e) => updateMenuField('name', e.target.value)}
                placeholder="Название ресторана"
                className="w-32 text-xs text-black bg-transparent py-0 border-b border-gray-300 hover:border-gray-500 focus:border-black outline-none transition-colors"
              />
            </label>
            {isEditMode && (
              <label className="flex items-center gap-1.5">
                <span className="text-[9px] font-medium uppercase tracking-wider text-gray-400">
                  Отступ
                </span>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={menu.blockGapMm}
                  onChange={(e) => updateMenuField('blockGapMm', Number(e.target.value))}
                  className="w-16 h-1 accent-black cursor-pointer"
                  title="Вертикальный отступ между разделами"
                />
                <span className="text-[9px] text-gray-500 normal-case tracking-normal tabular-nums">
                  {menu.blockGapMm} мм
                </span>
              </label>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isEditMode && (
              <div className="relative" ref={typeMenuRef}>
                <button
                  onClick={() => setShowTypeMenu(v => !v)}
                  className="px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  + Раздел ▾
                </button>
                {showTypeMenu && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 shadow-lg z-50 py-1">
                    <button
                      onClick={() => chooseType(addBlock)}
                      className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Классический раздел
                    </button>
                    <button
                      onClick={() => chooseType(() => addHeaderItem('logo'))}
                      className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Логотип
                    </button>
                    <button
                      onClick={() => chooseType(() => addHeaderItem('headerPromo'))}
                      className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Бизнес-ланч
                    </button>
                    <button
                      onClick={() => chooseType(addPromotion)}
                      className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Акция
                    </button>
                    <button
                      onClick={() => chooseType(() => addHeaderItem('dayOfWeek'))}
                      className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      День недели
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleNewProject}
              className="px-3 py-1.5 border border-red-600 text-red-600 text-xs uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors"
              title="Сбросить меню и сохранённые конфигурации"
            >
              Новый проект
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-3 py-1.5 border border-black text-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              💾 Сохранить
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="px-3 py-1.5 border border-black text-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              📋 История
            </button>
            <button
              onClick={exportMenu}
              className="px-3 py-1.5 border border-black text-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              ⬇ Экспорт
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 border border-black text-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              ⬆ Импорт
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 border border-black text-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Печать / PDF
            </button>
            <button
              onClick={toggleEditMode}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                isEditMode
                  ? 'bg-green-700 text-white hover:bg-green-800'
                  : 'border border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {isEditMode ? '✓ Готово' : '✏ Изменить'}
            </button>
          </div>
        </div>
      </div>

      <SaveModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} />
      <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
}
