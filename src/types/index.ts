export type UserRole = 'retailer' | 'importer';

export type ProductCategory = 
  | 'all'
  | 'high-tech'
  | 'fashion'
  | 'beauty'
  | 'home'
  | 'tools'
  | 'auto';

export type ProductStatus = 
  | 'in_stock_local'       // En stock dans l'entrepôt local (retrait 24h)
  | 'customs_clearance'    // En cours de dédouanement (port/aéroport)
  | 'in_transit'           // En transit international maritime/aérien
  | 'group_order';         // Commande groupée ouverte

export interface WarehouseLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  type: 'hub_central' | 'depot_local' | 'point_relais';
  openingHours: string;
  canPickup: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  rccm: string; // Registre de commerce
  avatar: string;
  verified: boolean;
  verificationLevel: 'gold' | 'silver' | 'pending';
  rating: number;
  reviewsCount: number;
  totalImportsTons: number;
  originHubs: string[];
  specialties: string[];
  phone: string;
  city: string;
  warehouse: WarehouseLocation;
  memberSince: string;
  responseRate: string;
  isPremium: boolean;
}

export interface ProductLot {
  id: string;
  title: string;
  category: ProductCategory;
  description: string;
  image: string;
  unitPrice: number;              // Prix d'achat de gros unitaire
  suggestedRetailPrice: number;   // Prix de vente public conseillé
  moq: number;                    // Quantité minimum de commande
  availableUnits: number;
  totalUnitsInBatch: number;
  originCountry: string;          // Chine, Turquie, Dubaï, etc.
  originCity: string;             // Yiwu, Guangzhou, Istanbul, Dubaï...
  status: ProductStatus;
  etaDays: number;                // 0 si déjà en stock local
  containerCode?: string;
  customsDutyPaid: boolean;       // Dédouanement et taxes inclus
  importerId: string;
  importer: Supplier;
  specifications: { label: string; value: string }[];
  tags: string[];
}

export interface OrderTimelineStep {
  step: string;
  date: string;
  description: string;
  completed: boolean;
  current: boolean;
  location?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  lotId: string;
  lotTitle: string;
  lotImage: string;
  importer: Supplier;
  retailerName: string;
  units: number;
  unitPrice: number;
  subtotal: number;
  escrowFee: number;
  totalAmount: number;
  paymentMethod: 'edahabia' | 'cib' | 'cash' | 'orange_money' | 'wave' | 'apple_pay' | 'google_pay' | 'card';
  paymentStatus: 'held_in_escrow' | 'released_to_seller' | 'refunded';
  orderStatus: 'created' | 'customs_processing' | 'in_transit' | 'arrived_warehouse' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  estimatedDeliveryDate: string;
  timeline: OrderTimelineStep[];
  inspectionCode: string;
}

export interface MessageOffer {
  id: string;
  lotId: string;
  lotTitle: string;
  units: number;
  offeredUnitPrice: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
  offer?: MessageOffer;
  attachment?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  };
}

export interface Conversation {
  id: string;
  importer: Supplier;
  retailerName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  relatedLotTitle?: string;
}

export interface KYCProfile {
  businessName: string;
  rccm: string;
  taxNumber: string;
  contactName: string;
  idDocumentType: 'passport' | 'id_card' | 'driving_license';
  idDocumentNumber: string;
  status: 'verified' | 'pending' | 'draft';
  submittedAt?: string;
  verificationBadgeUnlocked: boolean;
}
