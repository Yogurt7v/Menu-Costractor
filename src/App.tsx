import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MenuProvider, useMenu } from './context/MenuContext';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import MenuBlockCard from './components/MenuBlockCard';
import DraggablePromotion from './components/DraggablePromotion';

interface ListItem {
  id: string;
  type: 'block' | 'promotion';
}

function MenuEditor() {
  const { menu, reorderBlocks } = useMenu();
  
  const [itemOrder, setItemOrder] = useState<ListItem[]>(() => {
    const items: ListItem[] = [];
    menu.promotions.forEach(p => items.push({ id: p.id, type: 'promotion' }));
    menu.blocks.forEach(b => items.push({ id: b.id, type: 'block' }));
    return items;
  });

  // Sync itemOrder with menu changes
  useEffect(() => {
    setItemOrder(current => {
      const blockIds = new Set(menu.blocks.map(b => b.id));
      const promoIds = new Set(menu.promotions.map(p => p.id));
      
      // Keep existing order, but remove deleted items
      const filtered = current.filter(item => 
        (item.type === 'block' && blockIds.has(item.id)) ||
        (item.type === 'promotion' && promoIds.has(item.id))
      );
      
      // Add new items that aren't in the order yet
      const existingIds = new Set(filtered.map(i => i.id));
      menu.blocks.forEach(b => {
        if (!existingIds.has(b.id)) {
          filtered.push({ id: b.id, type: 'block' });
        }
      });
      menu.promotions.forEach(p => {
        if (!existingIds.has(p.id)) {
          filtered.push({ id: p.id, type: 'promotion' });
        }
      });
      
      return filtered;
    });
  }, [menu.blocks, menu.promotions]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = itemOrder.findIndex((item) => item.id === active.id);
      const newIndex = itemOrder.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(itemOrder, oldIndex, newIndex);
      setItemOrder(newOrder);

      // Update blocks order in context
      const blocksOrder = newOrder
        .filter(item => item.type === 'block')
        .map(item => menu.blocks.find(b => b.id === item.id))
        .filter((b): b is NonNullable<typeof b> => b !== undefined);
      reorderBlocks(blocksOrder);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8e4df]">
      <Toolbar />

      {/* A4 Page */}
      <div className="a4-page edit-mode">
        {/* Page header */}
        <Header />

        {/* All items (blocks + promotions) */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemOrder.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {itemOrder.map((item) => {
                if (item.type === 'block') {
                  const block = menu.blocks.find(b => b.id === item.id);
                  return block ? <MenuBlockCard key={item.id} block={block} /> : null;
                } else {
                  const promotion = menu.promotions.find(p => p.id === item.id);
                  return promotion ? <DraggablePromotion key={item.id} promotion={promotion} /> : null;
                }
              })}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {menu.blocks.length === 0 && menu.promotions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Добавьте раздел меню или акцию</p>
            <p className="text-gray-300 text-xs mt-1">Нажмите «+ Раздел» или «+ Акция» на панели выше</p>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="no-print max-w-[210mm] mx-auto px-4 py-3 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Перетаскивайте блоки и акции за иконку ≡ · Изменяйте ширину кнопок или перетаскиванием · Данные сохраняются автоматически
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <MenuEditor />
    </MenuProvider>
  );
}
