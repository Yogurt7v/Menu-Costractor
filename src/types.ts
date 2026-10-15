export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  weight?: string;
}

export interface MenuBlock {
  id: string;
  title: string;
  items: MenuItem[];
  width: number; // 1-12 grid columns
  fixedPrice: boolean; // true = одна цена за весь блок
  blockPrice: string; // цена за весь блок (если fixedPrice = true)
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount?: string;
  validUntil?: string;
}

export interface HeaderPromo {
  title: string;
  price: string;
  note?: string;
}

export interface RestaurantMenu {
  name: string;
  logo: string | null;
  logoSize: number; // px
  headerPromo: HeaderPromo;
  dayOfWeek: string;
  blocks: MenuBlock[];
  promotions: Promotion[];
}
