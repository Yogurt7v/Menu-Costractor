import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { MenuItem as MenuItemType, TextStyle } from '../types';
import TextStyleControl from './TextStyleControl';

interface Props {
  blockId: string;
  item: MenuItemType;
  hidePrice?: boolean;
}

const DEFAULT_NAME_STYLE: TextStyle = { fontSize: 14, fontFamily: 'PT Serif, Georgia, serif', fontWeight: 400 };
const DEFAULT_DESC_STYLE: TextStyle = { fontSize: 12, fontFamily: 'PT Serif, Georgia, serif', fontWeight: 400 };
const DEFAULT_PRICE_STYLE: TextStyle = { fontSize: 14, fontFamily: 'PT Serif, Georgia, serif', fontWeight: 500 };

export default function MenuItemCard({ blockId, item, hidePrice = false }: Props) {
  const { updateItem, removeItem, updateItemNameStyle, updateItemDescriptionStyle, updateItemPriceStyle, isEditMode } = useMenu();
  const [showStyleControls, setShowStyleControls] = useState(false);

  const nameStyle = item.nameStyle || DEFAULT_NAME_STYLE;
  const descStyle = item.descriptionStyle || DEFAULT_DESC_STYLE;
  const priceStyle = item.priceStyle || DEFAULT_PRICE_STYLE;

  return (
    <div className="group relative py-1.5">
      {isEditMode && (
        <button
          onClick={() => removeItem(blockId, item.id)}
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity edit-control"
        >
          ✕
        </button>
      )}

      {/* Name + dots + price line */}
      <div className="flex items-baseline gap-0">
        {isEditMode ? (
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItem(blockId, item.id, { name: e.target.value })}
            className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none flex-shrink-0 max-w-[60%]"
            style={{
              fontSize: `${nameStyle.fontSize}px`,
              fontFamily: nameStyle.fontFamily,
              fontWeight: nameStyle.fontWeight,
            }}
            placeholder="Название"
          />
        ) : (
          <span
            className="min-w-0 max-w-[60%] break-words"
            style={{
              fontSize: `${nameStyle.fontSize}px`,
              fontFamily: nameStyle.fontFamily,
              fontWeight: nameStyle.fontWeight,
            }}
          >
            {item.name}
          </span>
        )}

        {!hidePrice && (
          <>
            <span className="price-line flex-1 mx-2">
              <span className="dots"></span>
            </span>

            <div className="flex items-baseline gap-0.5 flex-shrink-0">
              {isEditMode ? (
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) => updateItem(blockId, item.id, { price: e.target.value })}
                  className="text-right bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-12"
                  style={{
                    fontSize: `${priceStyle.fontSize}px`,
                    fontFamily: priceStyle.fontFamily,
                    fontWeight: priceStyle.fontWeight,
                  }}
                  placeholder="0"
                />
              ) : (
                <span
                  className="font-medium text-black"
                  style={{
                    fontSize: `${priceStyle.fontSize}px`,
                    fontFamily: priceStyle.fontFamily,
                    fontWeight: priceStyle.fontWeight,
                  }}
                >
                  {item.price}
                </span>
              )}
              <span className="text-gray-600" style={{ fontSize: `${Math.max(10, priceStyle.fontSize - 2)}px` }}>₽</span>
            </div>
          </>
        )}
      </div>

      {/* Description + weight */}
      {(item.description || item.weight || isEditMode) && (
        <div className="flex items-center gap-2 mt-0.5">
          {isEditMode ? (
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(blockId, item.id, { description: e.target.value })}
              className="italic bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none flex-1"
              style={{
                fontSize: `${descStyle.fontSize}px`,
                fontFamily: descStyle.fontFamily,
                fontWeight: descStyle.fontWeight,
              }}
              placeholder="Описание"
            />
          ) : (
            item.description && (
              <span
                className="italic text-gray-500"
                style={{
                  fontSize: `${descStyle.fontSize}px`,
                  fontFamily: descStyle.fontFamily,
                  fontWeight: descStyle.fontWeight,
                }}
              >
                {item.description}
              </span>
            )
          )}

          {isEditMode ? (
            <input
              type="text"
              value={item.weight || ''}
              onChange={(e) => updateItem(blockId, item.id, { weight: e.target.value })}
              className="text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-10 text-right"
              placeholder="г"
            />
          ) : (
            item.weight && (
              <span className="text-xs text-gray-400">{item.weight} г</span>
            )
          )}
        </div>
      )}

      {/* Style controls toggle */}
      {isEditMode && (
        <div className="edit-control">
          <button
            onClick={() => setShowStyleControls(!showStyleControls)}
            className="text-[9px] text-gray-400 hover:text-black transition-colors mt-1 flex items-center gap-1"
          >
            <span>🎨</span>
            <span>{showStyleControls ? 'Скрыть стили' : 'Стили'}</span>
          </button>

          {showStyleControls && (
            <div className="mt-2 space-y-2 pl-2 border-l border-gray-200">
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Название</span>
                <TextStyleControl
                  style={nameStyle}
                  onChange={(s) => updateItemNameStyle(blockId, item.id, s)}
                />
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Описание</span>
                <TextStyleControl
                  style={descStyle}
                  onChange={(s) => updateItemDescriptionStyle(blockId, item.id, s)}
                />
              </div>
              {!hidePrice && (
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Цена</span>
                  <TextStyleControl
                    style={priceStyle}
                    onChange={(s) => updateItemPriceStyle(blockId, item.id, s)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
