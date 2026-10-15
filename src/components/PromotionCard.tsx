import React, { useState, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import { Promotion } from '../types';

interface Props {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: Props) {
  const { updatePromotion, isEditMode } = useMenu();

  return (
    <div className="border border-black py-3 px-4">

      <div className="flex items-baseline gap-3">
        {/* Discount badge */}
        {promotion.discount && (
          <div className="flex-shrink-0">
            {isEditMode ? (
              <input
                type="text"
                value={promotion.discount}
                onChange={(e) => updatePromotion(promotion.id, { discount: e.target.value })}
                className="text-lg font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-16 text-center"
                placeholder="450₽"
              />
            ) : (
              <span className="text-lg font-bold">{promotion.discount}</span>
            )}
          </div>
        )}

        <div className="flex-1">
          {isEditMode ? (
            <input
              type="text"
              value={promotion.title}
              onChange={(e) => updatePromotion(promotion.id, { title: e.target.value })}
              className="text-sm font-bold uppercase tracking-wider bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-full"
              placeholder="Название акции"
            />
          ) : (
            <h3 className="text-sm font-bold uppercase tracking-wider">{promotion.title}</h3>
          )}

          {isEditMode ? (
            <input
              type="text"
              value={promotion.description}
              onChange={(e) => updatePromotion(promotion.id, { description: e.target.value })}
              className="text-xs text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-full mt-0.5"
              placeholder="Описание"
            />
          ) : (
            <p className="text-xs text-gray-600 mt-0.5">{promotion.description}</p>
          )}

          {promotion.validUntil && (
            isEditMode ? (
              <input
                type="text"
                value={promotion.validUntil}
                onChange={(e) => updatePromotion(promotion.id, { validUntil: e.target.value })}
                className="text-[10px] text-gray-500 uppercase tracking-wider bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-full mt-1"
                placeholder="Срок действия"
              />
            ) : (
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{promotion.validUntil}</p>
            )
          )}
        </div>

        {/* Price field (optional) */}
        {(promotion.price || isEditMode) && (
          <div className="flex items-baseline gap-0.5 flex-shrink-0 ml-auto">
            {isEditMode ? (
              <>
                <input
                  type="text"
                  value={promotion.price || ''}
                  onChange={(e) => updatePromotion(promotion.id, { price: e.target.value })}
                  className="text-lg font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-16 text-right"
                  placeholder="Цена"
                />
                <span className="text-sm text-gray-600">₽</span>
              </>
            ) : promotion.price ? (
              <>
                <span className="text-lg font-bold whitespace-nowrap">{promotion.price}</span>
                <span className="text-sm text-gray-600">₽</span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
