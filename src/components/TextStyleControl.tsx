import React from 'react';
import { TextStyle } from '../types';

interface Props {
  style: TextStyle;
  onChange: (style: TextStyle) => void;
}

const FONT_FAMILIES = [
  { label: 'Serif', value: 'PT Serif, Georgia, serif' },
  { label: 'Display', value: 'Cormorant Garamond, Georgia, serif' },
  { label: 'Sans', value: 'Inter, system-ui, sans-serif' },
  { label: 'Mono', value: 'Courier New, monospace' },
];

export default function TextStyleControl({ style, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-gray-500 edit-control">
      {/* Font size */}
      <div className="flex items-center gap-1">
        <span>A</span>
        <input
          type="range"
          min="10"
          max="48"
          value={style.fontSize}
          onChange={(e) => onChange({ ...style, fontSize: Number(e.target.value) })}
          className="w-12 h-1 accent-black"
        />
        <span className="w-5 text-right">{style.fontSize}</span>
      </div>

      {/* Font family */}
      <select
        value={style.fontFamily}
        onChange={(e) => onChange({ ...style, fontFamily: e.target.value })}
        className="border border-gray-300 rounded px-1 py-0.5 text-[10px] bg-white"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Font weight */}
      <select
        value={style.fontWeight}
        onChange={(e) => onChange({ ...style, fontWeight: Number(e.target.value) })}
        className="border border-gray-300 rounded px-1 py-0.5 text-[10px] bg-white"
      >
        <option value={300}>Light</option>
        <option value={400}>Regular</option>
        <option value={500}>Medium</option>
        <option value={600}>Semibold</option>
        <option value={700}>Bold</option>
      </select>
    </div>
  );
}
