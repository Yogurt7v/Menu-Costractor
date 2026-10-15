import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMenu } from '../context/MenuContext';
import { MenuBlock as MenuBlockType } from '../types';
import MenuItemCard from './MenuItemCard';

interface Props {
  block: MenuBlockType;
}

export default function MenuBlockCard({ block }: Props) {
  const { updateBlockTitle, updateBlockWidth, removeBlock, addItem, isEditMode } = useMenu();
  const [isResizing, setIsResizing] = useState(false);
  const blockRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { type: 'block', block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${block.width}`,
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = block.width;

    const handleMouseMove = (e: MouseEvent) => {
      const container = blockRef.current?.parentElement;
      if (!container) return;
      const containerWidth = container.offsetWidth;
      const colWidth = containerWidth / 12;
      const delta = e.clientX - startXRef.current;
      const deltaCols = Math.round(delta / colWidth);
      const newWidth = Math.max(3, Math.min(12, startWidthRef.current + deltaCols));
      updateBlockWidth(block.id, newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        blockRef.current = node;
      }}
      style={style}
      className={`relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95 z-50' : ''
      } ${isEditMode ? 'border-amber-200 hover:border-amber-400' : 'border-transparent'} ${
        isResizing ? 'ring-2 ring-amber-400' : ''
      }`}
    >
      {/* Drag handle */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-amber-200/50 transition-colors z-10"
          title="Перетащите для изменения порядка"
        >
          <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z"/>
          </svg>
        </div>
      )}

      {/* Resize handle */}
      {isEditMode && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute top-2 right-2 cursor-col-resize p-1.5 rounded-lg hover:bg-amber-200/50 transition-colors z-10"
          title="Потяните для изменения ширины"
        >
          <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l7-7z"/>
            <path d="M16 5v14l-7-7z" transform="translate(4, 0)"/>
          </svg>
        </div>
      )}

      {/* Remove button */}
      {isEditMode && (
        <button
          onClick={() => removeBlock(block.id)}
          className="absolute top-2 right-10 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
          title="Удалить раздел"
        >
          ✕
        </button>
      )}

      {/* Block content */}
      <div className="p-4 pt-10">
        {/* Block title */}
        <div className="mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
          {isEditMode ? (
            <input
              type="text"
              value={block.title}
              onChange={(e) => updateBlockTitle(block.id, e.target.value)}
              className="text-xl font-bold text-amber-900 bg-transparent border-b-2 border-transparent hover:border-amber-300 focus:border-amber-500 outline-none flex-1"
              placeholder="Название раздела"
            />
          ) : (
            <h2 className="text-xl font-bold text-amber-900">{block.title}</h2>
          )}
        </div>

        {/* Width indicator */}
        {isEditMode && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] text-amber-500 uppercase tracking-wider">Ширина:</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateBlockWidth(block.id, i + 1)}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    i < block.width ? 'bg-amber-400' : 'bg-amber-200/50'
                  } hover:bg-amber-500`}
                />
              ))}
            </div>
            <span className="text-[10px] text-amber-500">{block.width}/12</span>
          </div>
        )}

        {/* Menu items */}
        <div className="space-y-2">
          {block.items.map((item) => (
            <MenuItemCard key={item.id} blockId={block.id} item={item} />
          ))}
        </div>

        {/* Add item button */}
        {isEditMode && (
          <button
            onClick={() => addItem(block.id)}
            className="mt-3 w-full py-2 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 text-sm hover:border-amber-500 hover:bg-amber-100/50 transition-all flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить блюдо
          </button>
        )}
      </div>
    </div>
  );
}
