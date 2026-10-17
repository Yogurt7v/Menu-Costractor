import React, { useEffect, useState } from 'react';

// Печатная высота одного листа A4: 297 мм листа минус поля 10 мм сверху и снизу
// из блока @media print в src/index.css. Экранные поля шире (15 мм), поэтому
// замеренная на экране высота содержимого слегка завышает печатную — это
// безопасная сторона для предупреждения.
const PRINTABLE_MM = 277;
const PX_PER_MM = 96 / 25.4;

function measureContentMm(): number | null {
  const page = document.querySelector('.a4-page');
  if (!page) return null;
  const style = getComputedStyle(page);
  const contentPx = page.scrollHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  if (!Number.isFinite(contentPx) || contentPx <= 0) return null;
  return contentPx / PX_PER_MM;
}

const formatMm = (value: number) => value.toFixed(1).replace('.', ',');

function plural(n: number, one: string, few: string, many: string) {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export default function PageOverflowWarning() {
  const [contentMm, setContentMm] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => setContentMm(measureContentMm());

    measure();

    const page = document.querySelector('.a4-page');
    if (!page) return;

    const observer = new ResizeObserver(measure);
    observer.observe(page);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  if (contentMm === null || contentMm <= PRINTABLE_MM) return null;

  const pages = Math.ceil(contentMm / PRINTABLE_MM);
  const sheetShare = (PRINTABLE_MM / contentMm) * 100;

  return (
    <div className="no-print max-w-[210mm] mx-auto px-3 py-1.5">
      <div role="status" className="flex items-center gap-3">
        <div aria-hidden="true" className="shrink-0 w-[128px] space-y-[4px]">
          <div className="flex items-center gap-1.5">
            <span className="w-[26px] shrink-0 text-[8px] uppercase tracking-wider text-gray-400">лист</span>
            <div className="flex-1 h-[4px]">
              <div className="h-full rounded-full bg-gray-300" style={{ width: `${sheetShare}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-[26px] shrink-0 text-[8px] uppercase tracking-wider text-gray-400">меню</span>
            <div className="flex-1 h-[4px] rounded-full bg-amber-700/70 overflow-hidden">
              <div className="h-full rounded-full bg-gray-300" style={{ width: `${sheetShare}%` }} />
            </div>
          </div>
        </div>

        <p className="text-[10px] leading-relaxed text-gray-500">
          <span className="tabular-nums text-gray-700">{formatMm(contentMm)}</span> / {PRINTABLE_MM} мм
          <span className="text-gray-300"> · </span>
          <span className="tabular-nums text-gray-700">{pages}</span>{' '}
          {plural(pages, 'страница', 'страницы', 'страниц')}
        </p>
      </div>
    </div>
  );
}
