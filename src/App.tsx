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
import { HeaderItemKind } from './types';
import Toolbar from './components/Toolbar';
import MenuBlockCard from './components/MenuBlockCard';
import DraggablePromotion from './components/DraggablePromotion';
import HeaderItemCard, { HEADER_ITEM_IDS } from './components/HeaderItemCard';

interface ListItem {
  id: string;
  type: 'block' | 'promotion';
}

const DEFAULT_HEADER_ORDER: HeaderItemKind[] = ['headerPromo', 'logo', 'dayOfWeek'];

function MenuEditor() {
  const { menu, reorderBlocks } = useMenu();

  const [headerOrder, setHeaderOrder] = useState<HeaderItemKind[]>(DEFAULT_HEADER_ORDER);

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

  // Visible header items (respect show flags), in their custom order
  const headerVisible: Record<HeaderItemKind, boolean> = {
    headerPromo: menu.showHeaderPromo,
    logo: menu.showLogo,
    dayOfWeek: menu.showDay,
  };
  const visibleHeaderItems = headerOrder.filter(kind => headerVisible[kind]);

  const handleHeaderDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromKind = headerOrder.find(kind => HEADER_ITEM_IDS[kind] === active.id);
    const toKind = headerOrder.find(kind => HEADER_ITEM_IDS[kind] === over.id);
    if (!fromKind || !toKind) return;
    setHeaderOrder(prev => {
      const oldIndex = prev.indexOf(fromKind);
      const newIndex = prev.indexOf(toKind);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

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

  // Group consecutive blocks together for grid layout
  const renderItems = () => {
    const elements: React.ReactNode[] = [];
    let currentBlockGroup: ListItem[] = [];
    let groupKey = 0;

    const flushBlockGroup = () => {
      if (currentBlockGroup.length > 0) {
        elements.push(
          <div key={`grid-${groupKey++}`} className="grid grid-cols-12 gap-4">
            {currentBlockGroup.map(item => {
              const block = menu.blocks.find(b => b.id === item.id);
              return block ? <MenuBlockCard key={item.id} block={block} /> : null;
            })}
          </div>
        );
        currentBlockGroup = [];
      }
    };

    itemOrder.forEach((item) => {
      if (item.type === 'block') {
        currentBlockGroup.push(item);
      } else {
        flushBlockGroup();
        const promotion = menu.promotions.find(p => p.id === item.id);
        if (promotion) {
          elements.push(<DraggablePromotion key={item.id} promotion={promotion} />);
        }
      }
    });

    flushBlockGroup();
    return elements;
  };

  return (
    <div className="min-h-screen bg-[#e8e4df]">
      <Toolbar />

      {/* A4 Page */}
      <div className="a4-page edit-mode">
        {/* Header zone */}
        {visibleHeaderItems.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleHeaderDragEnd}
          >
            <SortableContext
              items={visibleHeaderItems.map(kind => HEADER_ITEM_IDS[kind])}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-12 gap-4">
                {visibleHeaderItems.map(kind => (
                  <HeaderItemCard key={kind} kind={kind} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Black divider between header and main menu */}
        {visibleHeaderItems.length > 0 && (
          <div className="my-4 border-t border-black" />
        )}

        {/* Main menu zone */}
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
              {renderItems()}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {menu.blocks.length === 0 && menu.promotions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Добавьте раздел меню или акцию</p>
            <p className="text-gray-300 text-xs mt-1">Нажмите «+ Раздел» на панели выше и выберите тип</p>
          </div>
        )}

        {/* Gray divider at the end of the menu */}
        <div className="mt-6 border-t border-gray-300" />
      </div>

      {/* Help text */}
      <div className="no-print max-w-[210mm] mx-auto px-4 py-3 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Перетаскивайте шапку, разделы и акции за иконку ≡ · Изменяйте ширину кнопками или перетаскиванием · Данные сохраняются автоматически
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
