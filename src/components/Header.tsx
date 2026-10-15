import React, { useRef } from 'react';
import { useMenu } from '../context/MenuContext';

export default function Header() {
  const { menu, updateMenuName, updateLogo, isEditMode } = useMenu();
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
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-8 flex items-center gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          {menu.logo ? (
            <div className="relative group">
              <img
                src={menu.logo}
                alt="Логотип"
                className="w-20 h-20 object-contain rounded-xl bg-white/10 p-2 backdrop-blur-sm border border-white/20"
              />
              {isEditMode && (
                <button
                  onClick={() => updateLogo(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            isEditMode && (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 border-2 border-dashed border-white/40 rounded-xl flex flex-col items-center justify-center hover:border-white/70 hover:bg-white/5 transition-all cursor-pointer"
              >
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] text-white/60 mt-1">Лого</span>
              </button>
            )
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>

        {/* Restaurant name */}
        <div className="flex-1">
          {isEditMode ? (
            <input
              type="text"
              value={menu.name}
              onChange={(e) => updateMenuName(e.target.value)}
              className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-transparent hover:border-white/30 focus:border-amber-300 outline-none transition-colors w-full max-w-md"
              placeholder="Название ресторана"
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide">{menu.name}</h1>
          )}
          <p className="text-amber-200/80 mt-1 text-sm">Меню ресторана</p>
        </div>

        {/* Decorative */}
        <div className="hidden md:flex items-center gap-2 text-amber-200/60">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
