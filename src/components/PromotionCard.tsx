import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Promotion } from '../types';

interface Props {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: Props) {
  const { updatePromotion, removePromotion, isEditMode } = useMenu();

  return (
    <div className="group relative bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 hover:border-red-400 hover:shadow-lg transition-all">
      {/* Discount badge */}
      {promotion.discount && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
          {promotion.discount}
        </div>
      )}

      {isEditMode && (
        <button
          onClick={() => removePromotion(promotion.id)}
          className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          ✕
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="flex-1">
          {isEditMode ? (
            <input
              type="text"
              value={promotion.title}
              onChange={(e) => updatePromotion(promotion.id, { title: e.target.value })}
              className="font-bold text-red-800 bg-transparent border-b border-transparent hover:border-red-300 focus:border-red-500 outline-none w-full"
              placeholder="Название акции"
            />
          ) : (
            <h3 className="font-bold text-red-800">{promotion.title}</h3>
          )}

          {isEditMode ? (
            <textarea
              value={promotion.description}
              onChange={(e) => updatePromotion(promotion.id, { description: e.target.value })}
              className="text-sm text-red-600 bg-transparent border-b border-transparent hover:border-red-200 focus:border-red-400 outline-none w-full mt-1 resize-none"
              placeholder="Описание акции"
              rows={2}
            />
          ) : (
            <p className="text-sm text-red-600 mt-1">{promotion.description}</p>
          )}

          {isEditMode && (
            <div className="flex gap-3 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-400">Скидка:</span>
                <input
                  type="text"
                  value={promotion.discount || ''}
                  onChange={(e) => updatePromotion(promotion.id, { discount: e.target.value })}
                  className="text-xs text-red-700 bg-red-100 border border-red-200 rounded px-2 py-0.5 w-16 focus:border-red-400 outline-none"
                  placeholder="20%"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-400">Срок:</span>
                <input
                  type="text"
                  value={promotion.validUntil || ''}
                  onChange={(e) => updatePromotion(promotion.id, { validUntil: e.target.value })}
                  className="text-xs text-red-700 bg-red-100 border border-red-200 rounded px-2 py-0.5 w-32 focus:border-red-400 outline-none"
                  placeholder="До конца месяца"
                />
              </div>
            </div>
          )}

          {!isEditMode && promotion.validUntil && (
            <p className="text-xs text-red-400 mt-1">⏰ {promotion.validUntil}</p>
          )}
        </div>
      </div>
    </div>
  );
}
