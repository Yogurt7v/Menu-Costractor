import React, { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMenu } from '../context/MenuContext';
import { Promotion } from '../types';
import PromotionCard from './PromotionCard';

interface Props {
  promotion: Promotion;
}

export default function DraggablePromotion({ promotion }: Props) {
  const { isEditMode, removePromotion, updatePromotionWidth, updatePromotionMinHeight } = useMenu();
  const [isResizing, setIsResizing] = useState(false);
  const promoRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: promotion.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${promotion.width}`,
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = promotion.width;

    const handleMouseMove = (ev: MouseEvent) => {
      const container = promoRef.current?.parentElement;
      if (!container) return;
      const colWidth = container.offsetWidth / 12;
      const delta = ev.clientX - startXRef.current;
      const deltaCols = Math.round(delta / colWidth);
      updatePromotionWidth(promotion.id, startWidthRef.current + deltaCols);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleHeightResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = promotion.minHeight ?? 0;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaMm = Math.round((ev.clientY - startYRef.current) / (96 / 25.4) / 5) * 5;
      updatePromotionMinHeight(promotion.id, startHeightRef.current + deltaMm);
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
        promoRef.current = node;
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
          title="Перетащите для изменения позиции"
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
          className="absolute top-2 right-9 cursor-col-resize p-1 hover:bg-gray-200 rounded transition-colors z-10 edit-control"
          title="Потяните для изменения ширины"
        >
          <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l7-7z"/>
            <path d="M16 5v14l-7-7z" transform="translate(4, 0)"/>
          </svg>
        </div>
      )}

      {/* Height resize handle */}
      {isEditMode && (
        <div
          onMouseDown={handleHeightResizeStart}
          className="absolute top-2 right-16 cursor-row-resize p-1 hover:bg-gray-200 rounded transition-colors z-10 edit-control"
          title="Потяните для изменения высоты"
        >
          <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 8h14l-7 7z"/>
            <path d="M5 16h14l-7-7z"/>
          </svg>
        </div>
      )}

      {/* Remove button */}
      {isEditMode && (
        <button
          onClick={() => removePromotion(promotion.id)}
          className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700 transition-colors edit-control shadow-sm z-10"
          title="Удалить акцию"
        >
          ✕
        </button>
      )}

      <PromotionCard promotion={promotion} />
    </div>
  );
}