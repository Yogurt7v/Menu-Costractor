import React from 'react';
import { useMenu } from '../context/MenuContext';

export default function Toolbar() {
  const { addBlock, addPromotion, isEditMode, toggleEditMode } = useMenu();

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-amber-700 font-medium">
            {isEditMode ? '🔧 Режим редактирования' : '👁 Режим просмотра'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isEditMode && (
            <>
              <button
                onClick={addBlock}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Раздел
              </button>
              <button
                onClick={addPromotion}
                className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Акция
              </button>
            </>
          )}
          <button
            onClick={toggleEditMode}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
              isEditMode
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {isEditMode ? '✓ Готово' : '✏️ Редактировать'}
          </button>
        </div>
      </div>
    </div>
  );
}
