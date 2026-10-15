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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Toolbar />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Promotions section */}
        {menu.promotions.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-red-800">Акции и спецпредложения</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu.promotions.map((promo) => (
                <PromotionCard key={promo.id} promotion={promo} />
              ))}
            </div>
          </section>
        )}

        {/* Menu blocks */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menu.blocks.map((b) => b.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-12 gap-4 auto-rows-auto">
              {menu.blocks.map((block) => (
                <MenuBlockCard key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {menu.blocks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-amber-600 text-lg">Добавьте первый раздел меню</p>
            <p className="text-amber-400 text-sm mt-1">Нажмите кнопку «Раздел» на панели выше</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-amber-900/90 text-amber-200/80 text-center py-4 text-sm mt-12">
        <p>© 2024 {menu.name} • Меню ресторана</p>
        {isEditMode && (
          <p className="text-amber-400/60 text-xs mt-1">
            💡 Перетаскивайте блоки за иконку ≡ • Изменяйте ширину кнопками или перетаскиванием • Данные сохраняются автоматически
          </p>
        )}
      </footer>
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
