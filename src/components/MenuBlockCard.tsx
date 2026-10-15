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
  const { updateBlockTitle, updateBlockWidth, updateBlockFixedPrice, updateBlockPrice, removeBlock, addItem, isEditMode } = useMenu();
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
  } = useSortable({ id: block.id });

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
      className={`relative transition-all duration-200 ${
        isDragging ? 'opacity-40 z-50' : ''
      } ${isResizing ? 'ring-1 ring-black' : ''} ${
        isEditMode ? 'editable-block p-2' : ''
      }`}
    >
      {/* Drag handle */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors z-10 edit-control"
          title="Перетащите для изменения порядка"
        >
          <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z"/>
          </svg>
        </div>
      )}

      {/* Resize handle */}
      {isEditMode && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute top-2 right-10 cursor-col-resize p-1 hover:bg-gray-200 rounded transition-colors z-10 edit-control"
          title="Потяните для изменения ширины"
        >
          <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l7-7z"/>
            <path d="M16 5v14l-7-7z" transform="translate(4, 0)"/>
          </svg>
        </div>
      )}

      {/* Remove button */}
      {isEditMode && (
        <button
          onClick={() => removeBlock(block.id)}
          className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700 transition-colors edit-control shadow-sm"
          title="Удалить раздел"
        >
          ✕
        </button>
      )}

      {/* Block content */}
      <div className="pt-5">
        {/* Section title with checkbox and price */}
        <div className="mb-3 flex items-center gap-2">
          {/* Fixed price checkbox */}
          {isEditMode && (
            <label className="flex items-center gap-1 edit-control cursor-pointer" title="Одна цена за весь блок">
              <input
                type="checkbox"
                checked={block.fixedPrice}
                onChange={(e) => updateBlockFixedPrice(block.id, e.target.checked)}
                className="w-3 h-3 accent-black cursor-pointer"
              />
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Фикс. цена</span>
            </label>
          )}

          {/* Title */}
          {isEditMode ? (
            <input
              type="text"
              value={block.title}
              onChange={(e) => updateBlockTitle(block.id, e.target.value)}
              className="section-title text-base text-black bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none flex-1"
              placeholder="Название раздела"
            />
          ) : (
            <h2 className="section-title text-base text-black flex-1">{block.title}</h2>
          )}

          {/* Block price (if fixedPrice is true) */}
          {block.fixedPrice && (
            <div className="flex items-baseline gap-0.5 flex-shrink-0">
              {isEditMode ? (
                <input
                  type="text"
                  value={block.blockPrice}
                  onChange={(e) => updateBlockPrice(block.id, e.target.value)}
                  className="text-sm font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-12 text-right"
                  placeholder="450"
                />
              ) : (
                <span className="text-sm font-bold">{block.blockPrice}</span>
              )}
              <span className="text-xs text-gray-600">₽</span>
            </div>
          )}
        </div>

        {/* Width control */}
        {isEditMode && (
          <div className="mb-2 flex items-center gap-1 edit-control">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider">Ширина:</span>
            <div className="flex gap-px">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateBlockWidth(block.id, i + 1)}
                  className={`w-2 h-2 transition-colors ${
                    i < block.width ? 'bg-black' : 'bg-gray-200'
                  } hover:bg-black`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <hr className="header-rule-thin mb-2" />

        {/* Menu items */}
        <div className="space-y-1 pl-3">
          {block.items.map((item) => (
            <MenuItemCard key={item.id} blockId={block.id} item={item} hidePrice={block.fixedPrice} />
          ))}
        </div>

        {/* Add item button */}
        {isEditMode && (
          <button
            onClick={() => addItem(block.id)}
            className="mt-2 ml-3 py-1 text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1 edit-control"
          >
            <span className="text-gray-400">+</span> Добавить блюдо
          </button>
        )}
      </div>
    </div>
  );
}
