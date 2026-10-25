import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMenu } from '../context/MenuContext';
import { MenuBlock as MenuBlockType, TextStyle } from '../types';
import MenuItemCard from './MenuItemCard';
import SectionStylePanel from './SectionStylePanel';

interface Props {
  block: MenuBlockType;
}

const DEFAULT_TITLE_STYLE: TextStyle = { fontSize: 16, fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 500 };

const HEIGHT_STEP_MM = 25;

export default function MenuBlockCard({ block }: Props) {
  const {
    updateBlockTitle, updateBlockWidth, updateBlockFixedPrice, updateBlockPrice,
    removeBlock, addItem, isEditMode, updateBlockTitleStyle, updateBlockBorder,
    updateBlockShowTotalWeight, updateBlockSyncStyles, updateBlockMinHeight,
    duplicateBlock, updateBlockDensity, updateBlockStyleSync
  } = useMenu();
  const [isResizing, setIsResizing] = useState(false);
  const blockRef = useRef<HTMLDivElement | null>(null);
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
  } = useSortable({ id: block.id });

  const titleStyle = block.titleStyle || DEFAULT_TITLE_STYLE;
  const density = block.density ?? 1;
  const filledHeightSteps = Math.ceil((block.minHeight ?? 0) / HEIGHT_STEP_MM);

  const borderStyle = block.borderStyle || 'none';
  const borderWidth = block.borderWidth || 1;
  const borderColor = block.borderColor || '#000000';

  // Подсчёт общего веса
  const totalWeight = block.items.reduce((sum, item) => {
    const weight = parseInt(item.weight || '0', 10);
    return sum + (isNaN(weight) ? 0 : weight);
  }, 0);

  const borderCss = borderStyle !== 'none'
    ? {
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        padding: `${12 * density}px 12px`,
        color: borderColor,
      }
    : {};

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${block.width}`,
    minHeight: block.minHeight ? `${block.minHeight}mm` : undefined,
    ...borderCss,
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

  const handleHeightResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = block.minHeight ?? 0;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaMm = Math.round((ev.clientY - startYRef.current) / (96 / 25.4) / 5) * 5;
      updateBlockMinHeight(block.id, startHeightRef.current + deltaMm);
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
        isEditMode ? 'editable-block' : ''
      } ${borderStyle !== 'none' ? 'decorative-border' : ''}`}
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

      {isEditMode && (
        <button
          onClick={() => duplicateBlock(block.id)}
          className="absolute top-2 right-[5.5rem] p-1 hover:bg-gray-200 rounded transition-colors z-10 edit-control"
          title="Дублировать раздел со стилями и размерами"
        >
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-2M5 8h9a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2z" />
          </svg>
        </button>
      )}

      {isEditMode && (
        <button
          onClick={() => {
            if (window.confirm(`Удалить раздел "${block.title}"? Это действие нельзя отменить.`)) {
              removeBlock(block.id);
            }
          }}
          className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700 transition-colors edit-control shadow-sm z-20"
          title="Удалить раздел"
        >
          ✕
        </button>
      )}

      {/* Block content */}
      <div style={{ paddingTop: `${20 * density}px` }}>
        {/* Section title with checkbox and price */}
        <div className="flex items-center gap-2" style={{ marginBottom: `${12 * density}px` }}>
          {/* Fixed price checkbox */}
          {isEditMode && (
            <label className="flex items-center gap-1 edit-control cursor-pointer flex-shrink-0" title="Одна цена за весь блок">
              <input
                type="checkbox"
                checked={block.fixedPrice}
                onChange={(e) => updateBlockFixedPrice(block.id, e.target.checked)}
                className="w-3 h-3 accent-black cursor-pointer"
              />
              <span className="text-[9px] text-gray-500 uppercase tracking-wider whitespace-nowrap">Фикс. цена</span>
            </label>
          )}

          {/* Title */}
          {isEditMode ? (
            <input
              type="text"
              value={block.title}
              onChange={(e) => updateBlockTitle(block.id, e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none flex-1 min-w-0"
              style={{
                fontSize: `${titleStyle.fontSize}px`,
                fontFamily: titleStyle.fontFamily,
                fontWeight: titleStyle.fontWeight,
                fontVariant: 'small-caps',
                letterSpacing: '0.15em',
              }}
              placeholder="Название раздела"
            />
          ) : (
            <h2
              className="flex-1 min-w-0 break-words"
              style={{
                fontSize: `${titleStyle.fontSize}px`,
                fontFamily: titleStyle.fontFamily,
                fontWeight: titleStyle.fontWeight,
                fontVariant: 'small-caps',
                letterSpacing: '0.15em',
              }}
            >
              {block.title}
            </h2>
          )}

          {/* Total weight (if showTotalWeight is true) */}
          {block.showTotalWeight && totalWeight > 0 && (
            <div className="flex items-baseline gap-0.5 flex-shrink-0">
              <span
                className="whitespace-nowrap text-gray-500"
                style={{
                  fontSize: `${Math.max(10, titleStyle.fontSize - 4)}px`,
                  fontFamily: titleStyle.fontFamily,
                }}
              >
                {totalWeight}г
              </span>
            </div>
          )}

          {/* Block price (if fixedPrice is true) */}
          {block.fixedPrice && (block.blockPrice || isEditMode) && (
            <div className={`flex items-baseline gap-0.5 flex-shrink-0 ml-auto ${(block.blockPrice || '').trim() ? '' : 'print:hidden'}`}>
              {isEditMode ? (
                <input
                  type="text"
                  value={block.blockPrice}
                  onChange={(e) => updateBlockPrice(block.id, e.target.value)}
                  className="font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-12 text-right"
                  style={{
                    fontSize: `${titleStyle.fontSize - 2}px`,
                    fontFamily: titleStyle.fontFamily,
                  }}
                  placeholder="450"
                />
              ) : (
                <span
                  className="font-bold whitespace-nowrap"
                  style={{
                    fontSize: `${titleStyle.fontSize - 2}px`,
                    fontFamily: titleStyle.fontFamily,
                  }}
                >
                  {block.blockPrice} ₽
                </span>
              )}
            </div>
          )}
        </div>

        {isEditMode && (
          <div className="mb-2 flex items-center gap-1 edit-control">
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Ширина:</span>
            <div className="flex">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateBlockWidth(block.id, i + 1)}
                  className="group w-1.5 h-1.5 flex items-center justify-center"
                >
                  <span className={`block w-1.5 h-1.5 transition-colors ${
                    i < block.width ? 'bg-black' : 'bg-gray-300'
                  } group-hover:bg-black`} />
                </button>
              ))}
            </div>
            <span className="text-[9px] text-gray-500 normal-case tracking-normal tabular-nums">
              {block.width} кол.
            </span>
          </div>
        )}

        {/* Min height control — рядом с шириной, а не внутри свёрнутой панели оформления:
            спрятанный за двумя нажатиями контрол пользователь просто не найдёт. */}
        {isEditMode && (
          <div className="mb-2 flex items-center gap-1 edit-control">
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Высота:</span>
            <div className="flex">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateBlockMinHeight(
                    block.id,
                    block.minHeight === (i + 1) * HEIGHT_STEP_MM ? 0 : (i + 1) * HEIGHT_STEP_MM,
                  )}
                  className="group w-1.5 h-1.5 flex items-center justify-center"
                >
                  <span className={`block w-1.5 h-1.5 transition-colors ${
                    i < filledHeightSteps ? 'bg-black' : 'bg-gray-300'
                  } group-hover:bg-black`} />
                </button>
              ))}
            </div>
            <span className="text-[9px] text-gray-500 normal-case tracking-normal tabular-nums">
              {block.minHeight ? `${block.minHeight} мм` : 'по содержимому'}
            </span>
          </div>
        )}

        {isEditMode && (
          <div className="mb-2 flex items-center gap-1 edit-control">
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Плотность:</span>
            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={Math.round(density * 100)}
              onChange={(e) => updateBlockDensity(block.id, Number(e.target.value) / 100)}
              className="w-20 h-1 accent-black cursor-pointer"
              title="Сжатие вертикальных расстояний между блюдами внутри раздела"
            />
            <span className="text-[9px] text-gray-500 normal-case tracking-normal tabular-nums">
              {Math.round(density * 100)}%
            </span>
          </div>
        )}

        {/* Style and border controls */}
        {isEditMode && (
          <SectionStylePanel
            titleStyle={titleStyle}
            onTitleStyleChange={(s) => updateBlockTitleStyle(block.id, s)}
            borderStyle={borderStyle}
            borderWidth={borderWidth}
            borderColor={borderColor}
            onBorderStyleChange={(borderStyle) => updateBlockBorder(block.id, { borderStyle })}
            onBorderWidthChange={(borderWidth) => updateBlockBorder(block.id, { borderWidth })}
            onBorderColorChange={(borderColor) => updateBlockBorder(block.id, { borderColor })}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.showTotalWeight || false}
                onChange={(e) => updateBlockShowTotalWeight(block.id, e.target.checked)}
                className="w-3 h-3 accent-black cursor-pointer"
              />
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Показывать общий вес ({totalWeight}г)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.syncStyles || false}
                onChange={(e) => updateBlockSyncStyles(block.id, e.target.checked)}
                className="w-3 h-3 accent-black cursor-pointer"
              />
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Синхронизировать стили блюд</span>
            </div>
            {block.styleGroupId && (
              <div className="flex flex-col gap-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={block.styleSync === true}
                    onChange={(e) => updateBlockStyleSync(block.id, e.target.checked)}
                    className="w-3 h-3 accent-black cursor-pointer"
                  />
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Синхронизировать с копиями</span>
                </label>
                <span className="text-[9px] text-gray-400 leading-snug">
                  Шрифты, рамки, ширина, высота и плотность. При включении стиль этого раздела применяется ко всем копиям.
                </span>
              </div>
            )}
            </SectionStylePanel>
        )}

        {/* Divider */}
        <hr className="header-rule-thin" style={{ marginBottom: `${8 * density}px` }} />

        {/* Menu items */}
        <div className="flex flex-col pl-3" style={{ gap: `${4 * density}px` }}>
          {block.items.map((item) => (
            <MenuItemCard key={item.id} blockId={block.id} item={item} density={density} hidePrice={block.fixedPrice && !!block.blockPrice} />
          ))}
        </div>

        {/* Add item button */}
        {isEditMode && (
          <button
            onClick={() => addItem(block.id)}
            className="ml-3 py-1 text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1 edit-control"
            style={{ marginTop: `${8 * density}px` }}
          >
            <span className="text-gray-400">+</span> Добавить блюдо
          </button>
        )}
      </div>
    </div>
  );
}
