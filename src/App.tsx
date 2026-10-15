import React from 'react';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { MenuProvider, useMenu } from './context/MenuContext';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import MenuBlockCard from './components/MenuBlockCard';
import PromotionCard from './components/PromotionCard';

function MenuEditor() {
  const { menu, reorderBlocks, isEditMode } = useMenu();

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
      const oldIndex = menu.blocks.findIndex((b) => b.id === active.id);
      const newIndex = menu.blocks.findIndex((b) => b.id === over.id);
      reorderBlocks(arrayMove(menu.blocks, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen bg-[#e8e4df]">
      <Toolbar />

      {/* A4 Page */}
      <div className={`a4-page ${isEditMode ? 'edit-mode' : ''}`}>
        {/* Page header */}
        <Header />

        {/* Promotions section */}
        {menu.promotions.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <hr className="header-rule flex-1" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-gray-600 font-medium px-2">
                Спецпредложения
              </h2>
              <hr className="header-rule flex-1" />
            </div>
            <div>
              {menu.promotions.map((promo) => (
                <PromotionCard key={promo.id} promotion={promo} />
              ))}
            </div>
          </section>
        )}

        {/* Menu blocks grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menu.blocks.map((b) => b.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-12 gap-x-4 gap-y-2 auto-rows-auto">
              {menu.blocks.map((block) => (
                <MenuBlockCard key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {menu.blocks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Добавьте раздел меню</p>
            <p className="text-gray-300 text-xs mt-1">Нажмите «+ Раздел» на панели выше</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <div className="flex items-center gap-3 justify-center mb-2">
            <hr className="header-rule-thin flex-1 max-w-[60px]" />
            <span className="text-gray-300 text-[10px]">✦</span>
            <hr className="header-rule-thin flex-1 max-w-[60px]" />
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em]">
            {menu.name} · {menu.address}
          </p>
          {menu.phone && (
            <p className="text-[10px] text-gray-400 mt-0.5">{menu.phone}</p>
          )}
        </div>
      </div>

      {/* Help text */}
      {isEditMode && (
        <div className="no-print max-w-[210mm] mx-auto px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Перетаскивайте блоки за иконку ≡ · Изменяйте ширину кнопками или перетаскиванием · Данные сохраняются автоматически
          </p>
        </div>
      )}
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
