import React from 'react';
import { useMenu } from '../context/MenuContext';
import { MenuItem as MenuItemType } from '../types';

interface Props {
  blockId: string;
  item: MenuItemType;
}

export default function MenuItemCard({ blockId, item }: Props) {
  const { updateItem, removeItem, isEditMode } = useMenu();

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
            className="text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none flex-shrink-0 max-w-[60%]"
            placeholder="Название"
          />
        ) : (
          <span className="text-sm flex-shrink-0 max-w-[60%] truncate">{item.name}</span>
        )}

        <span className="price-line flex-1 mx-2">
          <span className="dots"></span>
        </span>

        <div className="flex items-baseline gap-0.5 flex-shrink-0">
          {isEditMode ? (
            <input
              type="text"
              value={item.price}
              onChange={(e) => updateItem(blockId, item.id, { price: e.target.value })}
              className="text-sm text-right bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-12"
              placeholder="0"
            />
          ) : (
            <span className="text-sm font-medium">{item.price}</span>
          )}
          <span className="text-xs text-gray-500">₽</span>
        </div>
      </div>

      {/* Description + weight */}
      {(item.description || item.weight || isEditMode) && (
        <div className="flex items-center gap-2 mt-0.5">
          {isEditMode ? (
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(blockId, item.id, { description: e.target.value })}
              className="text-xs text-gray-500 italic bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none flex-1"
              placeholder="Описание"
            />
          ) : (
            item.description && (
              <span className="text-xs text-gray-500 italic">{item.description}</span>
            )
          )}

          {isEditMode ? (
            <input
              type="text"
              value={item.weight || ''}
              onChange={(e) => updateItem(blockId, item.id, { weight: e.target.value })}
              className="text-xs text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-10 text-right"
              placeholder="г"
            />
          ) : (
            item.weight && (
              <span className="text-xs text-gray-400">{item.weight} г</span>
            )
          )}
        </div>
      )}
    </div>
  );
}
