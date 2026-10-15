import React from 'react';
import { MenuBlock } from '../types';

interface Props {
  block: MenuBlock;
  onBorderStyleChange: (style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double') => void;
  onBorderWidthChange: (width: number) => void;
  onBorderColorChange: (color: string) => void;
}

const BORDER_COLORS = [
  { label: 'Чёрный', value: '#000000' },
  { label: 'Тёмно-серый', value: '#333333' },
  { label: 'Серый', value: '#666666' },
  { label: 'Светло-серый', value: '#999999' },
  { label: 'Красный', value: '#8b0000' },
  { label: 'Золотой', value: '#b8860b' },
];

export default function BlockBorderControl({ block, onBorderStyleChange, onBorderWidthChange, onBorderColorChange }: Props) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-gray-500 edit-control flex-wrap">
      <span className="uppercase tracking-wider">Рамка:</span>

      {/* Border style */}
      <select
        value={block.borderStyle || 'none'}
        onChange={(e) => onBorderStyleChange(e.target.value as any)}
        className="border border-gray-300 rounded px-1 py-0.5 text-[10px] bg-white"
      >
        <option value="none">Нет</option>
        <option value="solid">Сплошная</option>
        <option value="dashed">Пунктир</option>
        <option value="dotted">Точки</option>
        <option value="double">Двойная</option>
      </select>

      {block.borderStyle && block.borderStyle !== 'none' && (
        <>
          {/* Border width */}
          <div className="flex items-center gap-1">
            <span>Толщина:</span>
            <input
              type="range"
              min="1"
              max="5"
              value={block.borderWidth || 1}
              onChange={(e) => onBorderWidthChange(Number(e.target.value))}
              className="w-12 h-1 accent-black"
            />
            <span className="w-3 text-right">{block.borderWidth || 1}</span>
          </div>

          {/* Border color */}
          <div className="flex items-center gap-1">
            <span>Цвет:</span>
            <select
              value={block.borderColor || '#000000'}
              onChange={(e) => onBorderColorChange(e.target.value)}
              className="border border-gray-300 rounded px-1 py-0.5 text-[10px] bg-white"
            >
              {BORDER_COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
