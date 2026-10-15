import React, { useRef } from 'react';
import { useMenu } from '../context/MenuContext';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export default function Header() {
  const { menu, updateHeaderPromo, updateLogo, updateLogoSize, updateDayOfWeek, isEditMode } = useMenu();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateLogo(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4 pb-4 border-b border-black">
      {/* Main 3-column header */}
      <div className="flex items-center justify-between gap-4">
        {/* LEFT: Promotion */}
        <div className="flex-1 text-left min-w-0">
          {isEditMode ? (
            <div className="space-y-0.5">
              <input
                type="text"
                value={menu.headerPromo.title}
                onChange={(e) => updateHeaderPromo({ title: e.target.value })}
                className="text-xs uppercase tracking-[0.2em] text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none block w-full"
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
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                {menu.headerPromo.title}
              </p>
              <p className="text-2xl font-bold mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {menu.headerPromo.price} <span className="text-sm font-normal text-gray-600">₽</span>
              </p>
              {menu.headerPromo.note && (
                <p className="text-[10px] text-gray-500 italic mt-0.5">{menu.headerPromo.note}</p>
              )}
            </div>
          )}
        </div>

        {/* CENTER: Logo */}
        <div className="flex-shrink-0 flex flex-col items-center">
          {menu.logo ? (
            <div className="relative group">
              <img
                src={menu.logo}
                alt="Логотип"
                style={{ height: `${menu.logoSize}px`, maxWidth: '400px' }}
                className="object-contain"
              />
              {isEditMode && (
                <button
                  onClick={() => updateLogo(null)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity edit-control"
                >
                  ✕
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

          {/* Logo size control */}
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

        {/* RIGHT: Menu title and day of week */}
        <div className="flex-1 text-right min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
            Меню
          </p>
          {isEditMode ? (
            <select
              value={menu.dayOfWeek}
              onChange={(e) => updateDayOfWeek(e.target.value)}
              className="text-2xl font-bold mt-0.5 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none block w-full text-right cursor-pointer"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {DAYS.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          ) : (
            <p className="text-2xl font-bold mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {menu.dayOfWeek}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
