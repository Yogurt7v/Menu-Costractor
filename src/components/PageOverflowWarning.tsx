import React, { useEffect, useState } from 'react';

// Печатная высота одного листа A4: 297 мм листа минус поля 10 мм сверху и снизу
// из блока @media print в src/index.css. Экранные поля шире (15 мм), поэтому
// замеренная на экране высота содержимого слегка завышает печатную — это
// безопасная сторона для предупреждения.
const PRINTABLE_MM = 277;
// Экранный замер завышает печатную высоту (у input на экране есть padding,
// который печатный CSS убирает). Несколько миллиметров «переполнения» —
// это погрешность, а не реальный перенос на вторую страницу.
const OVERFLOW_TOLERANCE_MM = 3;
const PX_PER_MM = 96 / 25.4;

function measureContentMm(): number | null {
  const page = document.querySelector('.a4-page');
  if (!page) return null;
  const hidden = document.createElement('div');
  hidden.style.cssText = 'position:absolute;visibility:hidden;top:0;left:0;width:210mm;pointer-events:none;';
  document.body.appendChild(hidden);
  try {
    const clone = page.cloneNode(true) as HTMLElement;
    clone.classList.remove('edit-mode');
    clone.style.minHeight = 'auto';
    clone.style.margin = '0';
    clone.style.padding = '10mm 15mm';
    clone.querySelectorAll('.edit-control, .no-print, .edit-mode-banner').forEach(el => el.remove());
    hidden.appendChild(clone);
    const height = clone.scrollHeight - 20 * PX_PER_MM;
    if (!Number.isFinite(height) || height <= 0) return null;
    return height / PX_PER_MM;
  } finally {
    document.body.removeChild(hidden);
  }
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
    let frame: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const measure = () => setContentMm(measureContentMm());

    const scheduleMeasure = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        measure();
      });
    };

    measure();

    const page = document.querySelector('.a4-page');
    if (page) {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      resizeObserver.observe(page);
      mutationObserver = new MutationObserver(scheduleMeasure);
      mutationObserver.observe(page, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    window.addEventListener('resize', scheduleMeasure);
    document.fonts?.ready.then(measure);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, []);

  if (contentMm === null || contentMm <= PRINTABLE_MM + OVERFLOW_TOLERANCE_MM) return null;

  const pages = Math.ceil(contentMm / PRINTABLE_MM);
  const extraMm = contentMm - PRINTABLE_MM;
  const sheetShare = Math.min(100, (PRINTABLE_MM / contentMm) * 100);

  return (
    <div className="no-print max-w-[210mm] mx-auto px-3 pt-2">
      <div
        role="status"
        className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-950 shadow-sm"
      >
        <svg
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v4m0 4h.01M10.29 3.86l-8.09 14a2 2 0 001.71 3h16.18a2 2 0 001.71-3l-8.09-14a2 2 0 00-3.42 0z"
          />
        </svg>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold">Меню не помещается на один лист A4</p>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            Высота содержимого <span className="font-medium tabular-nums">{formatMm(contentMm)}</span> мм при
            доступных {PRINTABLE_MM} мм. Лишние <span className="font-medium tabular-nums">{formatMm(extraMm)}</span> мм
            {' — '}при печати получится {pages} {plural(pages, 'страница', 'страницы', 'страниц')}.
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
            Уменьшите плотность разделов, отступ между разделами или высоту блоков.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-amber-200">
              <div
                className="h-full rounded-full bg-amber-600"
                style={{ width: `${sheetShare}%` }}
              />
            </div>
            <span className="shrink-0 text-[10px] tabular-nums text-amber-800">
              {Math.floor(sheetShare)}% помещается
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
