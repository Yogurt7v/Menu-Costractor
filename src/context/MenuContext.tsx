import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RestaurantMenu, MenuBlock, MenuItem, Promotion, HeaderPromo, TextStyle } from '../types';

const defaultMenu: RestaurantMenu = {
  name: 'РЕСТОРАНЪ',
  logo: null,
  logoSize: 80,
  dayOfWeek: 'Понедельник',
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
    },
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
  addBlock: () => void;
  removeBlock: (id: string) => void;
  updateBlockTitle: (blockId: string, title: string) => void;
  updateBlockWidth: (blockId: string, width: number) => void;
  updateBlockFixedPrice: (blockId: string, fixedPrice: boolean) => void;
  updateBlockPrice: (blockId: string, price: string) => void;
  updateBlockTitleStyle: (blockId: string, style: TextStyle) => void;
  updateBlockBorder: (blockId: string, updates: { borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double'; borderWidth?: number; borderColor?: string }) => void;
  updateBlockShowTotalWeight: (blockId: string, show: boolean) => void;
  updateBlockSyncStyles: (blockId: string, sync: boolean) => void;
  reorderBlocks: (blocks: MenuBlock[]) => void;
  addItem: (blockId: string) => void;
  removeItem: (blockId: string, itemId: string) => void;
  updateItem: (blockId: string, itemId: string, updates: Partial<MenuItem>) => void;
  updateItemNameStyle: (blockId: string, itemId: string, style: TextStyle) => void;
  updateItemDescriptionStyle: (blockId: string, itemId: string, style: TextStyle) => void;
  updateItemPriceStyle: (blockId: string, itemId: string, style: TextStyle) => void;
  addPromotion: () => void;
  removePromotion: (id: string) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  saveConfiguration: (name: string) => void;
  loadConfiguration: (id: string) => void;
  deleteConfiguration: (id: string) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<RestaurantMenu>(() => {
    const saved = localStorage.getItem('restaurant-menu-v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Миграция: добавляем недостающие поля для блоков
        if (parsed.blocks) {
          parsed.blocks = parsed.blocks.map((block: any) => {
            const blockPrice = block.blockPrice ?? '';
            // Если fixedPrice включен, но цена пустая - сбрасываем в false
            const fixedPrice = (block.fixedPrice && blockPrice) ? true : false;
            return {
              ...block,
              fixedPrice,
              blockPrice,
              showTotalWeight: block.showTotalWeight ?? false,
              syncStyles: block.syncStyles ?? true,
            };
          });
        }
        return { ...defaultMenu, ...parsed };
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

  useEffect(() => {
    localStorage.setItem('restaurant-menu-v3', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('restaurant-menu-history', JSON.stringify(savedConfigs));
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

  const addBlock = useCallback(() => {
    setMenu(prev => ({
      ...prev,
      blocks: [...prev.blocks, { id: generateId(), title: 'Новый раздел', width: 6, fixedPrice: false, blockPrice: '', showTotalWeight: false, syncStyles: true, items: [] }],
    }));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setMenu(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
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

  const reorderBlocks = useCallback((blocks: MenuBlock[]) => {
    setMenu(prev => ({ ...prev, blocks }));
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
    setMenu(prev => ({
      ...prev,
      promotions: [...prev.promotions, { id: generateId(), title: 'Новая акция', description: '' }],
    }));
  }, []);

  const removePromotion = useCallback((id: string) => {
    setMenu(prev => ({ ...prev, promotions: prev.promotions.filter(p => p.id !== id) }));
  }, []);

  const updatePromotion = useCallback((id: string, updates: Partial<Promotion>) => {
    setMenu(prev => ({
      ...prev,
      promotions: prev.promotions.map(p => p.id === id ? { ...p, ...updates } : p),
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
      setMenu(config.menu);
    }
  }, [savedConfigs]);

  const deleteConfiguration = useCallback((id: string) => {
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  return (
    <MenuContext.Provider value={{
      menu, savedConfigs, updateMenuField, updateHeaderPromo, updateLogo, updateLogoSize, updateDayOfWeek,
      addBlock, removeBlock, updateBlockTitle, updateBlockWidth, updateBlockFixedPrice, updateBlockPrice,
      updateBlockTitleStyle, updateBlockBorder, updateBlockShowTotalWeight, updateBlockSyncStyles, reorderBlocks,
      addItem, removeItem, updateItem, updateItemNameStyle, updateItemDescriptionStyle, updateItemPriceStyle,
      addPromotion, removePromotion, updatePromotion,
      saveConfiguration, loadConfiguration, deleteConfiguration,
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
