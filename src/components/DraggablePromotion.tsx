import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMenu } from '../context/MenuContext';
import { Promotion } from '../types';
import PromotionCard from './PromotionCard';

interface Props {
  promotion: Promotion;
}

export default function DraggablePromotion({ promotion }: Props) {
  const { isEditMode, removePromotion } = useMenu();

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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 ${
        isDragging ? 'opacity-40 z-50' : ''
      } ${isEditMode ? 'editable-block p-2' : ''}`}
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
