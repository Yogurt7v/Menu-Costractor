import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { RestaurantMenu, LayoutItem, MenuBlock, MenuItem, Promotion, HeaderPromo, TextStyle, HeaderItemKind, SectionStyle } from '../types';

const defaultMenu: RestaurantMenu = {
  name: 'РЕСТОРАНЪ',
  logo: null,
  logoSize: 80,
  logoWidth: 4,
  logoStartColumn: null,
  showLogo: true,
  dayOfWeek: 'Понедельник',
  dayWidth: 4,
  dayStartColumn: null,
  showDay: true,
  headerPromoWidth: 4,
  headerPromoStartColumn: null,
  showHeaderPromo: true,
  headerPromo: {
    title: 'Бизнес-ланч',
    price: '450',
    note: 'суп + горячее + напиток',
  },
  blocks: [
    {
      id: 'block-1',
      title: 'Завтраки',
      width: 6,
      fixedPrice: false,
      blockPrice: '',
      items: [
        { id: 'item-1', name: 'Омлет с ветчиной', description: 'Яйца, ветчина, сыр, зелень', price: '350', weight: '280' },
        { id: 'item-2', name: 'Сырники со сметаной', description: 'Творожные сырники, сметана, мёд', price: '290', weight: '220' },
        { id: 'item-3', name: 'Каша овсяная', description: 'С ягодами и орехами', price: '220', weight: '250' },
        { id: 'item-3b', name: 'Круассан с лососем', description: 'Свежий круассан, слабосолёный лосось, крем-сыр', price: '380', weight: '180' },
      ],
    },
    {
      id: 'block-2',
      title: 'Бизнес-ланч',
      width: 6,
      fixedPrice: true,
      blockPrice: '450',
      items: [
        { id: 'item-4', name: 'Суп дня', description: 'Ежедневно свежий суп', price: '180', weight: '300' },
        { id: 'item-5', name: 'Котлета по-киевски', description: 'С картофельным пюре', price: '320', weight: '350' },
        { id: 'item-6', name: 'Салат Цезарь', description: 'С курицей и пармезаном', price: '280', weight: '200' },
        { id: 'item-7', name: 'Компот / Морс', description: 'Домашний, из сезонных ягод', price: '120', weight: '300' },
      ],
    },
    {
      id: 'block-3',
      title: 'Горячие блюда',
      width: 6,
      fixedPrice: false,
      blockPrice: '',
      items: [
        { id: 'item-8', name: 'Стейк из сёмги', description: 'На гриле, с овощами и соусом', price: '690', weight: '280' },
        { id: 'item-9', name: 'Ризотто с грибами', description: 'Белые грибы, пармезан, трюфельное масло', price: '520', weight: '320' },
        { id: 'item-10', name: 'Медальоны из телятины', description: 'С пюре из сельдерея', price: '780', weight: '300' },
      ],
    },
    {
      id: 'block-4',
      title: 'Десерты',
      width: 6,
      fixedPrice: false,
      blockPrice: '',
      items: [
        { id: 'item-11', name: 'Тирамису', description: 'Классический итальянский десерт', price: '320', weight: '150' },
        { id: 'item-12', name: 'Чизкейк Нью-Йорк', description: 'С ягодным соусом', price: '340', weight: '160' },
        { id: 'item-13', name: 'Штрудель яблочный', description: 'С ванильным мороженым', price: '290', weight: '180' },
      ],
    },
  ],
  promotions: [
    {
      id: 'promo-1',
      title: 'Бизнес-ланч',
      description: 'Комплексный обед: суп + горячее + напиток',
      discount: '450 ₽',
      validUntil: 'Пн–Пт, 12:00–16:00',
      width: 12,
      minHeight: 0,
    },
  ],
  // Акции сверху, блоки ниже — так выглядит меню у пользователей, созданных до поля layout
  layout: [
    { id: 'promo-1', type: 'promotion' },
    { id: 'block-1', type: 'block' },
    { id: 'block-2', type: 'block' },
    { id: 'block-3', type: 'block' },
    { id: 'block-4', type: 'block' },
  ],
};

import { SavedConfiguration } from '../types';

interface MenuContextType {
  menu: RestaurantMenu;
  savedConfigs: SavedConfiguration[];
  updateMenuField: <K extends keyof RestaurantMenu>(field: K, value: RestaurantMenu[K]) => void;
  updateHeaderPromo: (updates: Partial<HeaderPromo>) => void;
  updateLogo: (logo: string | null) => void;
  updateLogoSize: (size: number) => void;
  updateDayOfWeek: (day: string) => void;
  addHeaderItem: (kind: HeaderItemKind) => void;
  removeHeaderItem: (kind: HeaderItemKind) => void;
  updateHeaderSectionStyle: (kind: 'headerPromo' | 'dayOfWeek', updates: Partial<SectionStyle>) => void;
  updateHeaderStartColumn: (kind: HeaderItemKind, start: number | null) => void;
  updateHeaderMinHeight: (kind: HeaderItemKind, minHeight: number) => void;
  addBlock: () => void;
  removeBlock: (id: string) => void;
  updateBlockTitle: (blockId: string, title: string) => void;
  updateBlockWidth: (blockId: string, width: number) => void;
  updateBlockMinHeight: (blockId: string, minHeight: number) => void;
  updateBlockFixedPrice: (blockId: string, fixedPrice: boolean) => void;
  updateBlockPrice: (blockId: string, price: string) => void;
  updateBlockTitleStyle: (blockId: string, style: TextStyle) => void;
  updateBlockBorder: (blockId: string, updates: { borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double'; borderWidth?: number; borderColor?: string }) => void;
  updateBlockShowTotalWeight: (blockId: string, show: boolean) => void;
  updateBlockSyncStyles: (blockId: string, sync: boolean) => void;
  reorderLayout: (items: LayoutItem[]) => void;
  addItem: (blockId: string) => void;
  removeItem: (blockId: string, itemId: string) => void;
  updateItem: (blockId: string, itemId: string, updates: Partial<MenuItem>) => void;
  updateItemNameStyle: (blockId: string, itemId: string, style: TextStyle) => void;
  updateItemDescriptionStyle: (blockId: string, itemId: string, style: TextStyle) => void;
  updateItemPriceStyle: (blockId: string, itemId: string, style: TextStyle) => void;
  addPromotion: () => void;
  removePromotion: (id: string) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  updatePromotionWidth: (id: string, width: number) => void;
  updatePromotionMinHeight: (id: string, minHeight: number) => void;
  saveConfiguration: (name: string) => void;
  loadConfiguration: (id: string) => void;
  deleteConfiguration: (id: string) => void;
  exportMenu: () => void;
  importMenu: (file: File) => Promise<void>;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function clampWidth(value: any, fallback: number): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(3, Math.min(12, n));
}

// Ширина блока и акции: минимум 1, в отличие от шапки, где минимум 3.
function clampGridWidth(value: any, fallback: number): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(12, n));
}

// 0 = авто; верхняя граница 297 мм — высота листа A4
function clampMinHeight(value: any): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(297, n));
}

const HEADER_FLAG: Record<HeaderItemKind, 'showLogo' | 'showHeaderPromo' | 'showDay'> = {
  logo: 'showLogo',
  headerPromo: 'showHeaderPromo',
  dayOfWeek: 'showDay',
};

// Карта живёт здесь, а не в HeaderItemCard: карточка импортирует контекст, поэтому
// обратный импорт дал бы цикл. Рядом HEADER_FLAG — та же логика поля по виду секции.
export const WIDTH_FIELD: Record<HeaderItemKind, 'headerPromoWidth' | 'logoWidth' | 'dayWidth'> = {
  headerPromo: 'headerPromoWidth',
  logo: 'logoWidth',
  dayOfWeek: 'dayWidth',
};

export const START_FIELD: Record<HeaderItemKind, 'logoStartColumn' | 'headerPromoStartColumn' | 'dayStartColumn'> = {
  logo: 'logoStartColumn',
  headerPromo: 'headerPromoStartColumn',
  dayOfWeek: 'dayStartColumn',
};

export const MIN_HEIGHT_FIELD: Record<HeaderItemKind, 'headerPromoMinHeight' | 'logoMinHeight' | 'dayMinHeight'> = {
  headerPromo: 'headerPromoMinHeight',
  logo: 'logoMinHeight',
  dayOfWeek: 'dayMinHeight',
};

// Самая правая колонка, на которой секция ширины width ещё помещается в сетку из 12.
export function maxStartColumn(width: number): number {
  return Math.max(1, 13 - width);
}

// null = авто-раскладка. Число прижимается к [1, maxStartColumn(width)], иначе сужение
// ширины оставило бы закрепление за пределами сетки и CSS Grid тихо сбросил бы раскладку.
function normalizeStartColumn(value: any, width: number): number | null {
  if (value === null || value === undefined) return null;
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.min(maxStartColumn(width), n));
}

function normalizeMenu(parsed: any): RestaurantMenu {
  const menu = { ...defaultMenu, ...parsed };
  menu.headerPromoWidth = clampWidth(menu.headerPromoWidth, defaultMenu.headerPromoWidth);
  menu.logoWidth = clampWidth(menu.logoWidth, defaultMenu.logoWidth);
  menu.dayWidth = clampWidth(menu.dayWidth, defaultMenu.dayWidth);
  menu.logoStartColumn = normalizeStartColumn(menu.logoStartColumn, menu.logoWidth);
  menu.headerPromoStartColumn = normalizeStartColumn(menu.headerPromoStartColumn, menu.headerPromoWidth);
  menu.dayStartColumn = normalizeStartColumn(menu.dayStartColumn, menu.dayWidth);
  (Object.keys(MIN_HEIGHT_FIELD) as HeaderItemKind[]).forEach((kind) => {
    const field = MIN_HEIGHT_FIELD[kind];
    menu[field] = clampMinHeight(menu[field]);
  });
  menu.showLogo = menu.showLogo === false ? false : true;
  menu.showHeaderPromo = menu.showHeaderPromo === false ? false : true;
  menu.showDay = menu.showDay === false ? false : true;
  if (Array.isArray(menu.blocks)) {
    menu.blocks = menu.blocks.map((block: any) => {
      const blockPrice = block.blockPrice ?? '';
      const fixedPrice = block.fixedPrice === true;
      return {
        ...block,
        fixedPrice,
        blockPrice,
        minHeight: block.minHeight ?? 0,
        showTotalWeight: block.showTotalWeight ?? false,
        syncStyles: block.syncStyles ?? true,
        items: Array.isArray(block.items) ? block.items : [],
      };
    });
  } else {
    menu.blocks = defaultMenu.blocks;
  }
  // Акции без width из старых данных занимают всю ширину — как и раньше.
  menu.promotions = (Array.isArray(menu.promotions) ? menu.promotions : []).map((promo: any) => ({
    ...promo,
    width: clampGridWidth(promo.width, 12),
    minHeight: clampMinHeight(promo.minHeight),
  }));
  menu.layout = normalizeLayout(parsed?.layout, menu.blocks, menu.promotions);
  return menu;
}

// Приводит layout к валидному виду: выкидывает удалённые блоки/акции и неверный type,
// сохраняет взаимный порядок выживших, дописывает в конец новые блоки, затем новые акции.
// Без layout (старые данные) порядок прежний: сначала акции, затем блоки.
function normalizeLayout(raw: any, blocks: MenuBlock[], promotions: Promotion[]): LayoutItem[] {
  const kind: Record<string, 'block' | 'promotion'> = {};
  blocks.forEach((b) => { kind[b.id] = 'block'; });
  promotions.forEach((p) => { kind[p.id] = 'promotion'; });

  const result: LayoutItem[] = [];
  const seen = new Set<string>();
  const push = (id: string, type: 'block' | 'promotion') => {
    if (seen.has(id)) return;
    seen.add(id);
    result.push({ id, type });
  };

  if (Array.isArray(raw)) {
    raw.forEach((entry: any) => {
      if (entry && kind[entry.id] === entry.type) push(entry.id, entry.type);
    });
    blocks.forEach((b) => push(b.id, 'block'));
    promotions.forEach((p) => push(p.id, 'promotion'));
  } else {
    promotions.forEach((p) => push(p.id, 'promotion'));
    blocks.forEach((b) => push(b.id, 'block'));
  }
  return result;
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<RestaurantMenu>(() => {
    const saved = localStorage.getItem('restaurant-menu-v3');
    if (saved) {
      try {
        return normalizeMenu(JSON.parse(saved));
      } catch {
        return defaultMenu;
      }
    }
    return defaultMenu;
  });

  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>(() => {
    const saved = localStorage.getItem('restaurant-menu-history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isEditMode, setIsEditMode] = useState(true);

  // Эффекты сохранения перезапускаются на каждом изменении состояния, поэтому
  // предупреждение о переполнении квоты показываем один раз за сессию на каждый слот.
  const menuStorageWarned = useRef(false);
  const historyStorageWarned = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem('restaurant-menu-v3', JSON.stringify(menu));
    } catch {
      if (!menuStorageWarned.current) {
        menuStorageWarned.current = true;
        alert('Не удалось сохранить меню: хранилище браузера переполнено. Чаще всего причина — слишком большой логотип: уменьшите его размер или удалите логотип, затем попробуйте снова.');
      }
    }
  }, [menu]);

  useEffect(() => {
    try {
      localStorage.setItem('restaurant-menu-history', JSON.stringify(savedConfigs));
    } catch {
      if (!historyStorageWarned.current) {
        historyStorageWarned.current = true;
        alert('Не удалось сохранить список сохранённых конфигураций: хранилище браузера переполнено. Чаще всего причина — слишком большой логотип в меню: уменьшите его размер или удалите логотип, затем попробуйте снова.');
      }
    }
  }, [savedConfigs]);

  const updateMenuField = useCallback(<K extends keyof RestaurantMenu>(field: K, value: RestaurantMenu[K]) => {
    setMenu(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateHeaderPromo = useCallback((updates: Partial<HeaderPromo>) => {
    setMenu(prev => ({ ...prev, headerPromo: { ...prev.headerPromo, ...updates } }));
  }, []);

  const updateLogo = useCallback((logo: string | null) => {
    setMenu(prev => ({ ...prev, logo }));
  }, []);

  const updateLogoSize = useCallback((size: number) => {
    setMenu(prev => ({ ...prev, logoSize: Math.max(40, Math.min(300, size)) }));
  }, []);

  const updateDayOfWeek = useCallback((day: string) => {
    setMenu(prev => ({ ...prev, dayOfWeek: day }));
  }, []);

  const addHeaderItem = useCallback((kind: HeaderItemKind) => {
    setMenu(prev => ({ ...prev, [HEADER_FLAG[kind]]: true }));
  }, []);

  const removeHeaderItem = useCallback((kind: HeaderItemKind) => {
    setMenu(prev => ({ ...prev, [HEADER_FLAG[kind]]: false }));
  }, []);

  const updateHeaderSectionStyle = useCallback((kind: 'headerPromo' | 'dayOfWeek', updates: Partial<SectionStyle>) => {
    const field = kind === 'headerPromo' ? 'headerPromoStyle' : 'dayStyle';
    setMenu(prev => ({
      ...prev,
      [field]: { ...(prev[field] || {}), ...updates },
    }));
  }, []);

  const updateHeaderStartColumn = useCallback((kind: HeaderItemKind, start: number | null) => {
    setMenu(prev => ({
      ...prev,
      [START_FIELD[kind]]: normalizeStartColumn(start, prev[WIDTH_FIELD[kind]]),
    }));
  }, []);

  const updateHeaderMinHeight = useCallback((kind: HeaderItemKind, minHeight: number) => {
    setMenu(prev => ({
      ...prev,
      [MIN_HEIGHT_FIELD[kind]]: clampMinHeight(minHeight),
    }));
  }, []);

  const addBlock = useCallback(() => {
    setMenu(prev => {
      const id = generateId();
      return {
        ...prev,
        blocks: [...prev.blocks, { id, title: 'Новый раздел', width: 6, minHeight: 0, fixedPrice: false, blockPrice: '', showTotalWeight: false, syncStyles: true, items: [] }],
        layout: [...prev.layout, { id, type: 'block' }],
      };
    });
  }, []);

  const removeBlock = useCallback((id: string) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id),
      layout: prev.layout.filter(item => item.id !== id),
    }));
  }, []);

  const updateBlockTitle = useCallback((blockId: string, title: string) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, title } : b),
    }));
  }, []);

  const updateBlockWidth = useCallback((blockId: string, width: number) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, width } : b),
    }));
  }, []);

  // 0 = авто; верхняя граница 297 мм — высота листа A4
  const updateBlockMinHeight = useCallback((blockId: string, minHeight: number) => {
    const value = Number.isFinite(minHeight) ? Math.max(0, Math.min(297, Math.round(minHeight))) : 0;
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, minHeight: value } : b),
    }));
  }, []);

  const updateBlockFixedPrice = useCallback((blockId: string, fixedPrice: boolean) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, fixedPrice } : b),
    }));
  }, []);

  const updateBlockPrice = useCallback((blockId: string, price: string) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, blockPrice: price } : b),
    }));
  }, []);

  const updateBlockTitleStyle = useCallback((blockId: string, style: TextStyle) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, titleStyle: style } : b),
    }));
  }, []);

  const updateBlockBorder = useCallback((blockId: string, updates: { borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double'; borderWidth?: number; borderColor?: string }) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b),
    }));
  }, []);

  const updateBlockShowTotalWeight = useCallback((blockId: string, show: boolean) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, showTotalWeight: show } : b),
    }));
  }, []);

  const updateBlockSyncStyles = useCallback((blockId: string, sync: boolean) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, syncStyles: sync } : b),
    }));
  }, []);

  const reorderLayout = useCallback((items: LayoutItem[]) => {
    setMenu(prev => ({ ...prev, layout: items }));
  }, []);

  const addItem = useCallback((blockId: string) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId
          ? { ...b, items: [...b.items, { id: generateId(), name: 'Новое блюдо', description: '', price: '0', weight: '' }] }
          : b
      ),
    }));
  }, []);

  const removeItem = useCallback((blockId: string, itemId: string) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId ? { ...b, items: b.items.filter(i => i.id !== itemId) } : b
      ),
    }));
  }, []);

  const updateItem = useCallback((blockId: string, itemId: string, updates: Partial<MenuItem>) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId
          ? { ...b, items: b.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
          : b
      ),
    }));
  }, []);

  const updateItemNameStyle = useCallback((blockId: string, itemId: string, style: TextStyle) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => {
        if (b.id !== blockId) return b;
        // Если синхронизация включена, применяем стиль ко всем блюдам
        if (b.syncStyles) {
          return { ...b, items: b.items.map(i => ({ ...i, nameStyle: style })) };
        }
        return { ...b, items: b.items.map(i => i.id === itemId ? { ...i, nameStyle: style } : i) };
      }),
    }));
  }, []);

  const updateItemDescriptionStyle = useCallback((blockId: string, itemId: string, style: TextStyle) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => {
        if (b.id !== blockId) return b;
        if (b.syncStyles) {
          return { ...b, items: b.items.map(i => ({ ...i, descriptionStyle: style })) };
        }
        return { ...b, items: b.items.map(i => i.id === itemId ? { ...i, descriptionStyle: style } : i) };
      }),
    }));
  }, []);

  const updateItemPriceStyle = useCallback((blockId: string, itemId: string, style: TextStyle) => {
    setMenu(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => {
        if (b.id !== blockId) return b;
        if (b.syncStyles) {
          return { ...b, items: b.items.map(i => ({ ...i, priceStyle: style })) };
        }
        return { ...b, items: b.items.map(i => i.id === itemId ? { ...i, priceStyle: style } : i) };
      }),
    }));
  }, []);

  const addPromotion = useCallback(() => {
    setMenu(prev => {
      const id = generateId();
      return {
        ...prev,
        promotions: [...prev.promotions, { id, title: 'Новая акция', description: '', width: 12, minHeight: 0 }],
        layout: [...prev.layout, { id, type: 'promotion' }],
      };
    });
  }, []);

  const removePromotion = useCallback((id: string) => {
    setMenu(prev => ({
      ...prev,
      promotions: prev.promotions.filter(p => p.id !== id),
      layout: prev.layout.filter(item => item.id !== id),
    }));
  }, []);

  const updatePromotion = useCallback((id: string, updates: Partial<Promotion>) => {
    setMenu(prev => ({
      ...prev,
      promotions: prev.promotions.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const updatePromotionWidth = useCallback((id: string, width: number) => {
    setMenu(prev => ({
      ...prev,
      promotions: prev.promotions.map(p => p.id === id ? { ...p, width: clampGridWidth(width, 12) } : p),
    }));
  }, []);

  const updatePromotionMinHeight = useCallback((id: string, minHeight: number) => {
    setMenu(prev => ({
      ...prev,
      promotions: prev.promotions.map(p => p.id === id ? { ...p, minHeight: clampMinHeight(minHeight) } : p),
    }));
  }, []);

  const saveConfiguration = useCallback((name: string) => {
    const newConfig: SavedConfiguration = {
      id: 'config-' + Date.now(),
      name,
      timestamp: Date.now(),
      menu: { ...menu },
    };
    setSavedConfigs(prev => [newConfig, ...prev]);
  }, [menu]);

  const loadConfiguration = useCallback((id: string) => {
    const config = savedConfigs.find(c => c.id === id);
    if (config) {
      setMenu(normalizeMenu(config.menu));
    }
  }, [savedConfigs]);

  const deleteConfiguration = useCallback((id: string) => {
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
  }, []);

  const exportMenu = useCallback(() => {
    const dataStr = JSON.stringify(menu, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (menu.name || 'menu')
      .replace(/[^\wа-яА-ЯёЁ\- ]+/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'menu';
    a.download = `${safeName}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [menu]);

  const importMenu = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      // Поддерживаем и формат меню, и формат сохранённой конфигурации ({ menu: ... })
      const candidate = data && typeof data === 'object' && data.menu && Array.isArray(data.menu.blocks)
        ? data.menu
        : data;
      if (!candidate || typeof candidate !== 'object' || !Array.isArray(candidate.blocks)) {
        alert('Ошибка импорта: файл не похож на меню (нет блоков)');
        return;
      }
      setMenu(normalizeMenu(candidate));
    } catch {
      alert('Ошибка импорта: не удалось прочитать файл');
    }
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  return (
    <MenuContext.Provider value={{
      menu, savedConfigs, updateMenuField, updateHeaderPromo, updateLogo, updateLogoSize, updateDayOfWeek,
      addHeaderItem, removeHeaderItem, updateHeaderSectionStyle, updateHeaderStartColumn, updateHeaderMinHeight,
      addBlock, removeBlock, updateBlockTitle, updateBlockWidth, updateBlockMinHeight, updateBlockFixedPrice, updateBlockPrice,
      updateBlockTitleStyle, updateBlockBorder, updateBlockShowTotalWeight, updateBlockSyncStyles, reorderLayout,
      addItem, removeItem, updateItem, updateItemNameStyle, updateItemDescriptionStyle, updateItemPriceStyle,
      addPromotion, removePromotion, updatePromotion, updatePromotionWidth, updatePromotionMinHeight,
      saveConfiguration, loadConfiguration, deleteConfiguration,
      exportMenu, importMenu,
      isEditMode, toggleEditMode,
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
