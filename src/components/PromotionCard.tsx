import React, { useState, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import { Promotion, TextStyle } from '../types';
import SectionStylePanel from './SectionStylePanel';

interface Props {
  promotion: Promotion;
}

const DEFAULT_TITLE_STYLE: TextStyle = { fontSize: 14, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 };

export default function PromotionCard({ promotion }: Props) {
  const { updatePromotion, isEditMode } = useMenu();

  const titleStyle = promotion.titleStyle || DEFAULT_TITLE_STYLE;
  const borderStyle = promotion.borderStyle || 'solid';
  const borderWidth = promotion.borderWidth || 1;
  const borderColor = promotion.borderColor || '#000000';
  const borderCss = borderStyle !== 'none'
    ? {
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        color: borderColor,
      }
    : {};

  return (
    <div
      className={`py-3 px-4 ${borderStyle !== 'none' ? 'decorative-border' : ''}`}
      style={borderCss}
    >
      {/* Section styling (editable) */}
      {isEditMode && (
        <SectionStylePanel
          titleStyle={titleStyle}
          onTitleStyleChange={(s) => updatePromotion(promotion.id, { titleStyle: s })}
          borderStyle={borderStyle}
          borderWidth={borderWidth}
          borderColor={borderColor}
          onBorderStyleChange={(borderStyle) => updatePromotion(promotion.id, { borderStyle })}
          onBorderWidthChange={(borderWidth) => updatePromotion(promotion.id, { borderWidth })}
          onBorderColorChange={(borderColor) => updatePromotion(promotion.id, { borderColor })}
        />
      )}

      <div className="flex items-baseline gap-3">
        <div className="flex-1">
          {isEditMode ? (
            <input
              type="text"
              value={promotion.title}
              onChange={(e) => updatePromotion(promotion.id, { title: e.target.value })}
              className="uppercase tracking-wider bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-full"
              style={{ fontSize: `${titleStyle.fontSize}px`, fontFamily: titleStyle.fontFamily, fontWeight: titleStyle.fontWeight }}
              placeholder="Название акции"
            />
          ) : (
            <h3 className="uppercase tracking-wider" style={{ fontSize: `${titleStyle.fontSize}px`, fontFamily: titleStyle.fontFamily, fontWeight: titleStyle.fontWeight }}>{promotion.title}</h3>
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
