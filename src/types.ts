export interface TextStyle {
  fontSize: number; // px
  fontFamily: string;
  fontWeight: number;
}

export type BorderValue = 'none' | 'solid' | 'dashed' | 'dotted' | 'double';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  weight?: string;
  nameStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  priceStyle?: TextStyle;
}

export interface MenuBlock {
  id: string;
  title: string;
  items: MenuItem[];
  width: number; // 1-12 grid columns
  fixedPrice: boolean; // true = одна цена за весь блок
  blockPrice: string; // цена за весь блок (если fixedPrice = true)
  titleStyle?: TextStyle;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderWidth?: number;
  borderColor?: string;
  showTotalWeight?: boolean; // показывать общий вес
  syncStyles?: boolean; // синхронизировать стили всех блюд
}

export interface SavedConfiguration {
  id: string;
  name: string;
  timestamp: number;
  menu: RestaurantMenu;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount?: string;
  validUntil?: string;
  price?: string;
  titleStyle?: TextStyle;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderWidth?: number;
  borderColor?: string;
}

export interface HeaderPromo {
  title: string;
  price: string;
  note?: string;
}

export type HeaderItemKind = 'headerPromo' | 'logo' | 'dayOfWeek';

export interface SectionStyle {
  titleStyle?: TextStyle;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderWidth?: number;
  borderColor?: string;
}

export interface RestaurantMenu {
  name: string;
  logo: string | null;
  logoSize: number; // px
  logoWidth: number; // 1-12 grid columns
  showLogo: boolean; // показывать логотип в шапке
  headerPromo: HeaderPromo;
  headerPromoWidth: number; // 1-12 grid columns
  showHeaderPromo: boolean; // показывать бизнес-ланч в шапке
  headerPromoStyle?: SectionStyle;
  dayOfWeek: string;
  dayWidth: number; // 1-12 grid columns
  showDay: boolean; // показывать день недели в шапке
  dayStyle?: SectionStyle;
  blocks: MenuBlock[];
  promotions: Promotion[];
}
