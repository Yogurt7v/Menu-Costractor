import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMenu, WIDTH_FIELD, START_FIELD, MIN_HEIGHT_FIELD, maxStartColumn } from '../context/MenuContext';
import { HeaderItemKind, TextStyle, SectionStyle } from '../types';
import SectionStylePanel from './SectionStylePanel';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export const HEADER_ITEM_IDS: Record<HeaderItemKind, string> = {
  headerPromo: '__header_promo__',
  logo: '__header_logo__',
  dayOfWeek: '__header_day__',
};

// MIN_HEADER_WIDTH обязан совпадать с минимумом clampWidth() в MenuContext:
// иначе выбор точки даст значение, которое загрузка страницы тихо перепишет.
const MIN_HEADER_WIDTH = 3;
const MAX_HEADER_WIDTH = 12;

const HEIGHT_STEP_MM = 25;

const DEFAULT_PROMO_TITLE_STYLE: TextStyle = { fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400 };
const DEFAULT_DAY_TITLE_STYLE: TextStyle = { fontSize: 24, fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 700 };

interface Props {
  kind: HeaderItemKind;
  suggestedStart: number;
}

export default function HeaderItemCard({ kind, suggestedStart }: Props) {
  const {
    menu, updateMenuField, updateHeaderPromo, updateLogo, updateLogoSize,
    updateDayOfWeek, removeHeaderItem, updateHeaderSectionStyle, updateHeaderStartColumn,
    updateHeaderMinHeight, isEditMode,
  } = useMenu();
  const [isResizing, setIsResizing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const width = menu[WIDTH_FIELD[kind]];
  const minHeight = menu[MIN_HEIGHT_FIELD[kind]] ?? 0;
  const filledHeightSteps = Math.ceil(minHeight / HEIGHT_STEP_MM);

  const rawStart = menu[START_FIELD[kind]];
  const maxStart = maxStartColumn(width);
  const start = rawStart == null ? null : Math.min(maxStart, Math.max(1, Math.round(rawStart)));

  // Per-section style (promo / day only; logo has no styling)
  const sectionStyle: SectionStyle | undefined =
    kind === 'headerPromo' ? menu.headerPromoStyle
    : kind === 'dayOfWeek' ? menu.dayStyle
    : undefined;

  const titleStyle: TextStyle =
    kind === 'headerPromo' ? (sectionStyle?.titleStyle || DEFAULT_PROMO_TITLE_STYLE)
    : kind === 'dayOfWeek' ? (sectionStyle?.titleStyle || DEFAULT_DAY_TITLE_STYLE)
    : DEFAULT_PROMO_TITLE_STYLE;

  const hasStyle = kind !== 'logo';
  const borderStyle = sectionStyle?.borderStyle || 'none';
  const borderWidth = sectionStyle?.borderWidth || 1;
  const borderColor = sectionStyle?.borderColor || '#000000';
  const borderCss = borderStyle !== 'none'
    ? {
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        padding: '12px',
        color: borderColor,
      }
    : {};

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: HEADER_ITEM_IDS[kind] });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: start !== null ? `${start} / span ${width}` : `span ${width}`,
    minHeight: minHeight ? `${minHeight}mm` : undefined,
    ...borderCss,
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    const handleMouseMove = (ev: MouseEvent) => {
      const container = cardRef.current?.parentElement;
      if (!container) return;
      const colWidth = container.offsetWidth / 12;
      const delta = ev.clientX - startXRef.current;
      const deltaCols = Math.round(delta / colWidth);
      const newWidth = Math.max(MIN_HEADER_WIDTH, Math.min(MAX_HEADER_WIDTH, startWidthRef.current + deltaCols));
      updateMenuField(WIDTH_FIELD[kind], newWidth);
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
    startHeightRef.current = minHeight;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaMm = Math.round((ev.clientY - startYRef.current) / (96 / 25.4) / 5) * 5;
      updateHeaderMinHeight(kind, startHeightRef.current + deltaMm);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateLogo(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const renderContent = () => {
    if (kind === 'headerPromo') {
      return isEditMode ? (
        <div className="space-y-0.5 text-left">
          <input
            type="text"
            value={menu.headerPromo.title}
            onChange={(e) => updateHeaderPromo({ title: e.target.value })}
            className="uppercase tracking-[0.2em] text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none block w-full"
            style={{ fontSize: `${titleStyle.fontSize}px`, fontFamily: titleStyle.fontFamily, fontWeight: titleStyle.fontWeight }}
            placeholder="Название акции"
          />
          <div className="flex items-baseline gap-1">
            <input
              type="text"
              value={menu.headerPromo.price}
              onChange={(e) => updateHeaderPromo({ price: e.target.value })}
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-20"
              placeholder="450"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            />
            <span className="text-sm text-gray-600">₽</span>
          </div>
          <input
            type="text"
            value={menu.headerPromo.note || ''}
            onChange={(e) => updateHeaderPromo({ note: e.target.value })}
            className="text-[10px] text-gray-500 italic bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none block w-full"
            placeholder="суп + горячее + напиток"
          />
        </div>
      ) : (
        <div className="text-left">
          <p className="uppercase tracking-[0.2em] text-gray-600" style={{ fontSize: `${titleStyle.fontSize}px`, fontFamily: titleStyle.fontFamily, fontWeight: titleStyle.fontWeight }}>
            {menu.headerPromo.title}
          </p>
          <p className="text-2xl font-bold mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {menu.headerPromo.price} <span className="text-sm font-normal text-gray-600">₽</span>
          </p>
          {menu.headerPromo.note && (
            <p className="text-[10px] text-gray-500 italic mt-0.5">{menu.headerPromo.note}</p>
          )}
        </div>
      );
    }

    if (kind === 'logo') {
      return (
        <div className="flex flex-col items-center">
          {menu.logo ? (
            <div className="relative group">
              <img
                src={menu.logo}
                alt="Логотип"
                style={{ height: `${menu.logoSize}px`, maxWidth: '100%' }}
                className="object-contain"
              />
              {isEditMode && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer edit-control"
                  title="Нажмите, чтобы заменить логотип"
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase tracking-wider text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    Заменить
                  </span>
                </button>
              )}
            </div>
          ) : isEditMode ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 border border-dashed border-gray-400 flex flex-col items-center justify-center hover:border-black transition-colors edit-control"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[9px] text-gray-400 mt-1">ЛОГО</span>
            </button>
          ) : (
            <div className="w-20 h-20 flex items-center justify-center">
              <span className="text-xs text-gray-300 uppercase tracking-widest" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {menu.name}
              </span>
            </div>
          )}

          {isEditMode && menu.logo && (
            <div className="mt-1 flex items-center gap-1 edit-control">
              <button
                onClick={() => updateLogoSize(menu.logoSize - 10)}
                className="w-4 h-4 text-[10px] border border-gray-300 hover:bg-black hover:text-white transition-colors flex items-center justify-center"
              >
                −
              </button>
              <input
                type="range"
                min="40"
                max="300"
                value={menu.logoSize}
                onChange={(e) => updateLogoSize(Number(e.target.value))}
                className="w-16 h-1 accent-black"
              />
              <button
                onClick={() => updateLogoSize(menu.logoSize + 10)}
                className="w-4 h-4 text-[10px] border border-gray-300 hover:bg-black hover:text-white transition-colors flex items-center justify-center"
              >
                +
              </button>
              <span className="text-[9px] text-gray-400 w-8 text-center">{menu.logoSize}px</span>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      );
    }

    return (
      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-600">Меню</p>
        {isEditMode ? (
          <select
            value={menu.dayOfWeek}
            onChange={(e) => updateDayOfWeek(e.target.value)}
            className="font-bold mt-0.5 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none block w-full text-right cursor-pointer"
            style={{ fontSize: `${titleStyle.fontSize}px`, fontFamily: titleStyle.fontFamily, fontWeight: titleStyle.fontWeight }}
          >
            {DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        ) : (
          <p className="font-bold mt-0.5" style={{ fontSize: `${titleStyle.fontSize}px`, fontFamily: titleStyle.fontFamily, fontWeight: titleStyle.fontWeight }}>
            {menu.dayOfWeek}
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node;
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

      {isEditMode && (
        <button
          onClick={() => {
            const names: Record<string, string> = { headerPromo: 'Бизнес-ланч', logo: 'Логотип', dayOfWeek: 'День недели' };
            if (window.confirm(`Удалить "${names[kind]}" с макета? Это действие нельзя отменить.`)) {
              removeHeaderItem(kind);
            }
          }}
          className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700 transition-colors edit-control shadow-sm z-20"
          title="Удалить с макета"
        >
          ✕
        </button>
      )}

      <div className="pt-5">
        {isEditMode && (
          <div className="mb-2 flex items-center gap-1 edit-control">
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Ширина:</span>
            <div className="flex">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateMenuField(WIDTH_FIELD[kind], Math.max(MIN_HEADER_WIDTH, Math.min(MAX_HEADER_WIDTH, i + 1)))}
                  className="group w-1.5 h-1.5 flex items-center justify-center"
                >
                  <span className={`block w-1.5 h-1.5 transition-colors ${
                    i < width ? 'bg-black' : 'bg-gray-300'
                  } group-hover:bg-black`} />
                </button>
              ))}
            </div>
            <span className="text-[9px] text-gray-500 normal-case tracking-normal tabular-nums">
              {width} кол.
            </span>
          </div>
        )}

        {/* Min height control — рядом с шириной, а не внутри свёрнутой панели оформления */}
        {isEditMode && (
          <div className="mb-2 flex items-center gap-1 edit-control">
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Высота:</span>
            <div className="flex">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateHeaderMinHeight(kind, minHeight === (i + 1) * HEIGHT_STEP_MM ? 0 : (i + 1) * HEIGHT_STEP_MM)}
                  className="group w-1.5 h-1.5 flex items-center justify-center"
                >
                  <span className={`block w-1.5 h-1.5 transition-colors ${
                    i < filledHeightSteps ? 'bg-black' : 'bg-gray-300'
                  } group-hover:bg-black`} />
                </button>
              ))}
            </div>
            <span className="text-[9px] text-gray-500 normal-case tracking-normal tabular-nums">
              {minHeight ? `${minHeight} мм` : 'по содержимому'}
            </span>
          </div>
        )}

        {/* Explicit column: the section keeps its place when other sections are removed */}
        {isEditMode && (
          <div className="mb-2 flex items-center gap-1.5 edit-control">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={start !== null}
                onChange={(e) => updateHeaderStartColumn(kind, e.target.checked ? Math.min(maxStart, suggestedStart) : null)}
                className="w-3 h-3 accent-black cursor-pointer"
              />
              <span className="text-[9px] text-gray-400 uppercase tracking-wider whitespace-nowrap">Колонка:</span>
            </label>
            {start !== null ? (
              <div className="flex">
                {Array.from({ length: maxStart }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => updateHeaderStartColumn(kind, i + 1)}
                    className="group w-1.5 h-1.5 flex items-center justify-center"
                  >
                    <span className={`block w-1.5 h-1.5 transition-colors ${
                      i === start - 1 ? 'bg-black' : 'bg-gray-300'
                    } group-hover:bg-black`} />
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[9px] text-gray-500 normal-case tracking-normal">авто</span>
            )}
          </div>
        )}

        {/* Style and border controls (logo excluded) */}
        {isEditMode && hasStyle && (
          <SectionStylePanel
            titleStyle={titleStyle}
            onTitleStyleChange={(s) => updateHeaderSectionStyle(kind as 'headerPromo' | 'dayOfWeek', { titleStyle: s })}
            borderStyle={borderStyle}
            borderWidth={borderWidth}
            borderColor={borderColor}
            onBorderStyleChange={(borderStyle) => updateHeaderSectionStyle(kind as 'headerPromo' | 'dayOfWeek', { borderStyle })}
            onBorderWidthChange={(borderWidth) => updateHeaderSectionStyle(kind as 'headerPromo' | 'dayOfWeek', { borderWidth })}
            onBorderColorChange={(borderColor) => updateHeaderSectionStyle(kind as 'headerPromo' | 'dayOfWeek', { borderColor })}
          />
        )}

        {renderContent()}
      </div>
    </div>
  );
}
