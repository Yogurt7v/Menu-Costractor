import React from 'react';
import { useMenu } from '../context/MenuContext';

export default function Toolbar() {
  const { addBlock, addPromotion, isEditMode, toggleEditMode } = useMenu();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[210mm] mx-auto px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">
            {isEditMode ? 'Редактирование' : 'Просмотр'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isEditMode && (
            <>
              <button
                onClick={addBlock}
                className="px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                + Раздел
              </button>
              <button
                onClick={addPromotion}
                className="px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                + Акция
              </button>
            </>
          )}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-black text-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Печать
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
  );
}
