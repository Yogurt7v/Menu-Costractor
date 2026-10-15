import React, { useRef } from 'react';
import { useMenu } from '../context/MenuContext';

export default function Header() {
  const { menu, updateMenuField, updateLogo, isEditMode } = useMenu();
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
    <div className="text-center mb-6">
      {/* Logo */}
      {menu.logo && (
        <div className="mb-3 flex justify-center relative group">
          <img
            src={menu.logo}
            alt="Логотип"
            className="h-16 object-contain"
          />
          {isEditMode && (
            <button
              onClick={() => updateLogo(null)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Upload logo button */}
      {!menu.logo && isEditMode && (
        <div className="mb-3 flex justify-center">
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1 border border-dashed border-gray-400 text-gray-500 text-xs hover:border-gray-600 hover:text-gray-700 transition-colors"
          >
            + Загрузить логотип
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      )}

      {/* Restaurant name */}
      {isEditMode ? (
        <input
          type="text"
          value={menu.name}
          onChange={(e) => updateMenuField('name', e.target.value)}
          className="text-3xl font-normal tracking-[0.2em] text-center bg-transparent border-b border-gray-300 focus:border-black outline-none w-full max-w-md mx-auto block"
          placeholder="Название"
          style={{ fontVariant: 'small-caps' }}
        />
      ) : (
        <h1 className="text-3xl tracking-[0.2em] text-center" style={{ fontVariant: 'small-caps' }}>
          {menu.name}
        </h1>
      )}

      {/* Subtitle */}
      {isEditMode ? (
        <input
          type="text"
          value={menu.subtitle}
          onChange={(e) => updateMenuField('subtitle', e.target.value)}
          className="text-xs tracking-[0.3em] text-center text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-full max-w-xs mx-auto block mt-1 uppercase"
          placeholder="Подзаголовок"
        />
      ) : (
        <p className="text-xs tracking-[0.3em] text-gray-500 text-center mt-1 uppercase">{menu.subtitle}</p>
      )}

      {/* Decorative line */}
      <div className="flex items-center gap-3 mt-4 justify-center">
        <hr className="header-rule flex-1 max-w-[80px]" />
        <span className="text-gray-400 text-xs">✦</span>
        <hr className="header-rule flex-1 max-w-[80px]" />
      </div>

      {/* Contact info */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap">
        {isEditMode ? (
          <>
            <input
              type="text"
              value={menu.address}
              onChange={(e) => updateMenuField('address', e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none text-center w-40"
              placeholder="Адрес"
            />
            <input
              type="text"
              value={menu.phone}
              onChange={(e) => updateMenuField('phone', e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none text-center w-36"
              placeholder="Телефон"
            />
            <input
              type="text"
              value={menu.workHours}
              onChange={(e) => updateMenuField('workHours', e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none text-center w-40"
              placeholder="Часы работы"
            />
          </>
        ) : (
          <>
            {menu.address && <span>{menu.address}</span>}
            {menu.phone && <span>· {menu.phone}</span>}
            {menu.workHours && <span>· {menu.workHours}</span>}
          </>
        )}
      </div>
    </div>
  );
}
