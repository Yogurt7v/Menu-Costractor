import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RestaurantMenu, MenuBlock, MenuItem, Promotion } from '../types';

const defaultMenu: RestaurantMenu = {
  name: 'Ресторан',
  logo: null,
  blocks: [
    {
      id: 'block-1',
      title: 'Завтраки',
      width: 6,
      items: [
        { id: 'item-1', name: 'Омлет с овощами', description: 'Яйца, томаты, перец, зелень', price: '350', weight: '280г' },
        { id: 'item-2', name: 'Сырники со сметаной', description: 'Творожные сырники с домашней сметаной', price: '290', weight: '220г' },
        { id: 'item-3', name: 'Каша овсяная', description: 'С ягодами и мёдом', price: '220', weight: '250г' },
      ],
    },
    {
      id: 'block-2',
      title: 'Бизнес-ланч',
      width: 6,
      items: [
        { id: 'item-4', name: 'Суп дня', description: 'Ежедневно свежий суп', price: '180', weight: '300мл' },
        { id: 'item-5', name: 'Котлета с пюре', description: 'Домашняя котлета с картофельным пюре', price: '320', weight: '350г' },
        { id: 'item-6', name: 'Салат Цезарь', description: 'С курицей и соусом', price: '280', weight: '200г' },
        { id: 'item-7', name: 'Компот', description: 'Домашний компот из сезонных ягод', price: '120', weight: '300мл' },
      ],
    },
  ],
  promotions: [
    {
      id: 'promo-1',
      title: 'Счастливые часы',
      description: 'Скидка 20% на все напитки с 14:00 до 17:00',
      discount: '20%',
      validUntil: 'До конца месяца',
    },
  ],
};

interface MenuContextType {
  menu: RestaurantMenu;
  updateMenuName: (name: string) => void;
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
    const saved = localStorage.getItem('restaurant-menu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultMenu;
      }
    }
    return defaultMenu;
  });

  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('restaurant-menu', JSON.stringify(menu));
  }, [menu]);

  const updateMenuName = useCallback((name: string) => {
    setMenu(prev => ({ ...prev, name }));
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
      menu, updateMenuName, updateLogo, addBlock, removeBlock,
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
