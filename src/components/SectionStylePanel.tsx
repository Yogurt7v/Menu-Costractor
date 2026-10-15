import React, { useState } from 'react';
import TextStyleControl from './TextStyleControl';
import BlockBorderControl from './BlockBorderControl';
import { TextStyle, BorderValue } from '../types';

interface Props {
  titleStyle: TextStyle;
  onTitleStyleChange: (style: TextStyle) => void;
  borderStyle?: BorderValue;
  borderWidth?: number;
  borderColor?: string;
  onBorderStyleChange: (style: BorderValue) => void;
  onBorderWidthChange: (width: number) => void;
  onBorderColorChange: (color: string) => void;
  children?: React.ReactNode;
}

export default function SectionStylePanel({
  titleStyle,
  onTitleStyleChange,
  borderStyle,
  borderWidth,
  borderColor,
  onBorderStyleChange,
  onBorderWidthChange,
  onBorderColorChange,
  children,
}: Props) {
  const [showStyleControls, setShowStyleControls] = useState(false);

  return (
    <div className="mb-2 edit-control">
      <button
        onClick={() => setShowStyleControls(!showStyleControls)}
        className="text-[9px] text-gray-400 hover:text-black transition-colors flex items-center gap-1 uppercase tracking-wider"
      >
        <span>🎨</span>
        <span>{showStyleControls ? 'Скрыть оформление' : 'Оформление раздела'}</span>
      </button>

      {showStyleControls && (
        <div className="mt-2 space-y-2 pl-2 border-l border-gray-200">
          <div>
            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Стиль заголовка</span>
            <TextStyleControl style={titleStyle} onChange={onTitleStyleChange} />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Рамка</span>
            <BlockBorderControl
              borderStyle={borderStyle}
              borderWidth={borderWidth}
              borderColor={borderColor}
              onBorderStyleChange={onBorderStyleChange}
              onBorderWidthChange={onBorderWidthChange}
              onBorderColorChange={onBorderColorChange}
            />
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
