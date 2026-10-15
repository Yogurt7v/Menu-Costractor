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
    <div className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all">
      {isEditMode && (
        <button
          onClick={() => removeItem(blockId, item.id)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
        >
          ✕
        </button>
      )}

      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          {isEditMode ? (
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(blockId, item.id, { name: e.target.value })}
              className="font-semibold text-amber-900 bg-transparent border-b border-transparent hover:border-amber-300 focus:border-amber-500 outline-none w-full text-sm"
              placeholder="Название блюда"
            />
          ) : (
            <h4 className="font-semibold text-amber-900 text-sm">{item.name}</h4>
          )}

          {isEditMode ? (
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(blockId, item.id, { description: e.target.value })}
              className="text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-400 outline-none w-full mt-1"
              placeholder="Описание"
            />
          ) : (
            item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          )}

          {isEditMode ? (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={item.weight || ''}
                onChange={(e) => updateItem(blockId, item.id, { weight: e.target.value })}
                className="text-xs text-gray-400 bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-400 outline-none w-16"
                placeholder="Вес"
              />
            </div>
          ) : (
            item.weight && <span className="text-xs text-gray-400 mt-1 inline-block">{item.weight}</span>
          )}
        </div>

        <div className="flex-shrink-0">
          {isEditMode ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={item.price}
                onChange={(e) => updateItem(blockId, item.id, { price: e.target.value })}
                className="w-16 text-right font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 text-sm focus:border-amber-400 outline-none"
                placeholder="Цена"
              />
              <span className="text-xs text-amber-600">₽</span>
            </div>
          ) : (
            <span className="font-bold text-amber-700 text-sm whitespace-nowrap">{item.price} ₽</span>
          )}
        </div>
      </div>
    </div>
  );
}
