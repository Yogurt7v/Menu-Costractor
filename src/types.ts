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
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount?: string;
  validUntil?: string;
}

export interface RestaurantMenu {
  name: string;
  logo: string | null;
  blocks: MenuBlock[];
  promotions: Promotion[];
}
