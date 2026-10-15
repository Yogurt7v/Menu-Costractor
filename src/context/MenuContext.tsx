import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RestaurantMenu, MenuBlock, MenuItem, Promotion } from '../types';

const defaultMenu: RestaurantMenu = {
  name: 'РЕСТОРАНЪ',
  subtitle: 'КУХНЯ И БАР',
  address: 'ул. Тверская, 15',
  phone: '+7 (495) 123-45-67',
  workHours: 'Пн–Пт: 8:00–22:00',
  logo: null,
  blocks: [
    {
      id: 'block-1',
      title: 'Завтраки',
      width: 6,
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

interface MenuContextType {
  menu: RestaurantMenu;
  updateMenuField: (field: keyof RestaurantMenu, value: string | null) => void;
  updateLogo: (logo: string | null) => void;
  addBlock: () => void;
  removeBlock: (id: string) => void;
  updateBlockTitle: (blockId: string, title: string) => void;
  updateBlockWidth: (blockId: string, width: number) => void;
  reorderBlocks: (blocks: MenuBlock[]) => void;
  addItem: (blockId: string) => void;
  removeItem: (blockId: string, itemId: string) => void;
  updateItem: (blockId: string, itemId: string, updates: Partial<MenuItem>) => void;
  addPromotion: () => void;
  removePromotion: (id: string) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<RestaurantMenu>(() => {
    const saved = localStorage.getItem('restaurant-menu-v2');
    if (saved) {
      try {
        return { ...defaultMenu, ...JSON.parse(saved) };
      } catch {
        return defaultMenu;
      }
    }
    return defaultMenu;
  });

  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('restaurant-menu-v2', JSON.stringify(menu));
  }, [menu]);

  const updateMenuField = useCallback((field: keyof RestaurantMenu, value: string | null) => {
    setMenu(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateLogo = useCallback((logo: string | null) => {
    setMenu(prev => ({ ...prev, logo }));
  }, []);

  const addBlock = useCallback(() => {
    setMenu(prev => ({
      ...prev,
      blocks: [...prev.blocks, { id: generateId(), title: 'Новый раздел', width: 6, items: [] }],
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

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  return (
    <MenuContext.Provider value={{
      menu, updateMenuField, updateLogo, addBlock, removeBlock,
      updateBlockTitle, updateBlockWidth, reorderBlocks,
      addItem, removeItem, updateItem,
      addPromotion, removePromotion, updatePromotion,
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
