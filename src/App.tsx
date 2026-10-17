import { useState } from 'react';
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
import { MenuProvider, useMenu, WIDTH_FIELD } from './context/MenuContext';
import { HeaderItemKind, LayoutItem } from './types';
import Toolbar from './components/Toolbar';
import MenuBlockCard from './components/MenuBlockCard';
import PageOverflowWarning from './components/PageOverflowWarning';
import DraggablePromotion from './components/DraggablePromotion';
import HeaderItemCard, { HEADER_ITEM_IDS } from './components/HeaderItemCard';

const DEFAULT_HEADER_ORDER: HeaderItemKind[] = ['headerPromo', 'logo', 'dayOfWeek'];

function MenuEditor() {
  const { menu, reorderLayout } = useMenu();

  const [headerOrder, setHeaderOrder] = useState<HeaderItemKind[]>(DEFAULT_HEADER_ORDER);

  // Порядок блоков и акций вперемешку приходит из контекста и сохраняется в меню
  const order: LayoutItem[] = menu.layout;

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

  const suggestedStarts = (() => {
    const acc: Record<HeaderItemKind, number> = { headerPromo: 1, logo: 1, dayOfWeek: 1 };
    let autoFlowColumn = 1;
    visibleHeaderItems.forEach((kind) => {
      acc[kind] = autoFlowColumn;
      autoFlowColumn += menu[WIDTH_FIELD[kind]];
    });
    return acc;
  })();

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
      const oldIndex = order.findIndex((item) => item.id === active.id);
      const newIndex = order.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      reorderLayout(arrayMove(order, oldIndex, newIndex));
    }
  };

  // Блоки и акции лежат в одной сетке из 12 колонок: ширину каждого задаёт gridColumn
  // элемента, поэтому акция уже не разрывает ряд, а встаёт в него бок о бок с блоком.
  const renderItems = () => (
    <div className="grid grid-cols-12 gap-4">
      {order.map((item) => {
        if (item.type === 'block') {
          const block = menu.blocks.find(b => b.id === item.id);
          return block ? <MenuBlockCard key={item.id} block={block} /> : null;
        }
        const promotion = menu.promotions.find(p => p.id === item.id);
        return promotion ? <DraggablePromotion key={item.id} promotion={promotion} /> : null;
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e8e4df]">
      {/* Тулбар и предупреждение липнут вместе. Само уведомление sticky не получает:
          высота тулбара меняется при переносе кнопок, и жёсткий top-offset уводил бы
          его то под тулбар, то поверх. Обёртка избавляет от магических чисел. */}
      <div className="sticky top-0 z-40 bg-white">
        <Toolbar />
        <PageOverflowWarning />
      </div>

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
                  <HeaderItemCard key={kind} kind={kind} suggestedStart={suggestedStarts[kind]} />
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
            items={order.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {renderItems()}
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
