import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Box, 
  Clock, 
  ChevronRight, 
  X, 
  DollarSign, 
  MessageSquare, 
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
  Filter,
  Heart,
  Bell,
  BellRing,
  TrendingDown,
  Truck,
  Tag,
  AlertCircle,
  Check
} from 'lucide-react';
import { ProductLot, ProductCategory, ProductStatus } from '../../types';

export interface FavoriteAlert {
  id: string;
  lotId: string;
  lotTitle: string;
  type: 'price_drop' | 'stock_status';
  title: string;
  message: string;
  oldValue: string;
  newValue: string;
  badgeText: string;
  timestamp: string;
  read: boolean;
}

interface ProductExplorerProps {
  lots: ProductLot[];
  onSelectLot: (lot: ProductLot) => void;
  onInitiateOrder: (lot: ProductLot) => void;
  onOpenChatWithSupplier: (supplierId: string, lotTitle?: string) => void;
  onOpenMapToSupplier: (supplierId: string) => void;
}

export const ProductExplorer: React.FC<ProductExplorerProps> = ({
  lots,
  onSelectLot,
  onInitiateOrder,
  onOpenChatWithSupplier,
  onOpenMapToSupplier,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [maxMoq, setMaxMoq] = useState<number>(100);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedLotForDetail, setSelectedLotForDetail] = useState<ProductLot | null>(null);

  // Local state for favorite lots
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['lot_tech_01', 'lot_fashion_01']);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Notifications system for favorite products (price drop & stock status)
  const [favoriteAlerts, setFavoriteAlerts] = useState<FavoriteAlert[]>([
    {
      id: 'alert_1',
      lotId: 'lot_tech_01',
      lotTitle: 'Écouteurs Pro TWS Bluetooth 5.4',
      type: 'price_drop',
      title: 'Baisse de prix B2B (-11.7%)',
      message: 'Remise déstockage appliquée par Karim Benali sur le lot à Roissy.',
      oldValue: '14.50 €/u',
      newValue: '12.80 €/u',
      badgeText: '-1.70 € / pièce',
      timestamp: 'Il y a 12 min',
      read: false,
    },
    {
      id: 'alert_2',
      lotId: 'lot_fashion_01',
      lotTitle: 'Sacs Cabas Cuir Grainé Istanbul',
      type: 'stock_status',
      title: 'Stock dédouané & disponible au dépôt',
      message: 'Le conteneur TR-IST-9102-FR est arrivé à Saint-Priest. Retrait 24h prêt.',
      oldValue: 'En dédouanement',
      newValue: 'En stock local · Retrait 24h',
      badgeText: 'Retrait 24h dispo',
      timestamp: 'Il y a 45 min',
      read: false,
    },
  ]);

  const [showAlertsPanel, setShowAlertsPanel] = useState(true);

  // Filter alerts matching active favorite lots
  const activeFavoriteAlerts = useMemo(() => {
    return favoriteAlerts.filter((alert) => favoriteIds.includes(alert.lotId));
  }, [favoriteAlerts, favoriteIds]);

  const unreadAlertsCount = useMemo(() => {
    return activeFavoriteAlerts.filter((a) => !a.read).length;
  }, [activeFavoriteAlerts]);

  const markAlertAsRead = (alertId: string) => {
    setFavoriteAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const dismissAlert = (alertId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const simulatePriceDropOrStockChange = () => {
    const targetLot = favoriteLots[0] || lots[0];
    const isPriceDrop = Math.random() > 0.4;
    const alertId = `alert_${Date.now()}`;

    if (isPriceDrop) {
      const discountedPrice = Math.max(1, Number((targetLot.unitPrice * 0.88).toFixed(2)));
      const diff = (targetLot.unitPrice - discountedPrice).toFixed(2);
      const newAlert: FavoriteAlert = {
        id: alertId,
        lotId: targetLot.id,
        lotTitle: targetLot.title.slice(0, 32),
        type: 'price_drop',
        title: `Flash Promo : Baisse de prix immédiate`,
        message: `Offre grossiste mise à jour : le tarif baisse de ${targetLot.unitPrice.toFixed(2)}€ à ${discountedPrice.toFixed(2)}€ par unité.`,
        oldValue: `${targetLot.unitPrice.toFixed(2)} €/u`,
        newValue: `${discountedPrice.toFixed(2)} €/u`,
        badgeText: `-${diff} € / u`,
        timestamp: 'À l’instant',
        read: false,
      };
      setFavoriteAlerts((prev) => [newAlert, ...prev]);
    } else {
      const newAlert: FavoriteAlert = {
        id: alertId,
        lotId: targetLot.id,
        lotTitle: targetLot.title.slice(0, 32),
        type: 'stock_status',
        title: `Statut logistique : Contrôle douanier validé`,
        message: `Les palettes sont étiquetées au quai de déchargement. Disponibles pour enlèvement immédiat.`,
        oldValue: 'En transit conteneur',
        newValue: 'En stock local · Prêt 24h',
        badgeText: 'Dispo immédiate',
        timestamp: 'À l’instant',
        read: false,
      };
      setFavoriteAlerts((prev) => [newAlert, ...prev]);
    }
    setShowAlertsPanel(true);
  };

  // Profit margin calculation state in detail sheet
  const [customRetailPrice, setCustomRetailPrice] = useState<number>(0);

  const toggleFavorite = (lotId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavoriteIds((prev) =>
      prev.includes(lotId) ? prev.filter((id) => id !== lotId) : [...prev, lotId]
    );
  };

  const favoriteLots = useMemo(() => {
    return lots.filter((lot) => favoriteIds.includes(lot.id));
  }, [lots, favoriteIds]);

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: 'Tous les lots' },
    { key: 'high-tech', label: 'High-Tech' },
    { key: 'fashion', label: 'Mode & Cuir' },
    { key: 'beauty', label: 'Beauté & Soins' },
    { key: 'tools', label: 'Outillage' },
    { key: 'home', label: 'Maison' },
  ];

  const origins = ['all', 'Chine', 'Turquie', 'Émirats Arabes Unis'];

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      if (showOnlyFavorites && !favoriteIds.includes(lot.id)) {
        return false;
      }

      const matchesSearch = 
        lot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.importer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || lot.category === selectedCategory;
      const matchesOrigin = selectedOrigin === 'all' || lot.originCountry === selectedOrigin;
      const matchesStatus = selectedStatus === 'all' || lot.status === selectedStatus;
      const matchesMoq = lot.moq <= maxMoq;

      return matchesSearch && matchesCategory && matchesOrigin && matchesStatus && matchesMoq;
    });
  }, [lots, searchQuery, selectedCategory, selectedOrigin, selectedStatus, maxMoq, showOnlyFavorites, favoriteIds]);

  const openLotDetail = (lot: ProductLot) => {
    setSelectedLotForDetail(lot);
    setCustomRetailPrice(lot.suggestedRetailPrice);
  };

  const getStatusLabel = (status: ProductStatus, etaDays: number) => {
    switch (status) {
      case 'in_stock_local':
        return { label: 'En stock local · Retrait 24h', color: 'text-emerald-400' };
      case 'customs_clearance':
        return { label: `Dédouanement en cours · Dispo dans ${etaDays}j`, color: 'text-amber-400' };
      case 'in_transit':
        return { label: `Cargo en transit · ETA ${etaDays}j`, color: 'text-sky-400' };
      case 'group_order':
        return { label: 'Commande groupée ouverte', color: 'text-purple-400' };
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col overflow-y-auto no-scrollbar bg-slate-950 text-slate-100">
      {/* Top Search & Filter Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 pt-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher écouteurs, sacs cuir, outillage..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilterDrawer(true)}
            className={`min-h-[40px] px-3 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-colors ${
              selectedOrigin !== 'all' || selectedStatus !== 'all' || maxMoq < 100
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtres</span>
            {(selectedOrigin !== 'all' || selectedStatus !== 'all' || maxMoq < 100) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>

        {/* Category Horizontal Segmented Filter */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              showOnlyFavorites
                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/80 text-rose-400 hover:text-rose-300 border border-rose-500/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites || favoriteLots.length > 0 ? 'fill-current' : ''}`} />
            <span>Favoris ({favoriteLots.length})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = !showOnlyFavorites && selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setShowOnlyFavorites(false);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-100 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Product Lots Feed */}
      <div className="p-4 space-y-4">
        {/* Banner with B2B Value Proposition */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Importations Directes & Séquestre Garanti</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Commandez sans intermédiaire auprès des micro-importateurs vérifiés. Vos paiements restent bloqués jusqu'à inspection conforme de vos colis.
            </p>
          </div>
        </div>

        {/* Section Dédiée : Mes Lots Favoris */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/20 space-y-3.5 shadow-sm">
          {/* Header with Title and Alerts Counter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Mes Lots Favoris</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                    {favoriteLots.length}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Lots présélectionnés pour suivi et commande rapide</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Alert Notifications Toggle Pill */}
              <button
                type="button"
                onClick={() => setShowAlertsPanel(!showAlertsPanel)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
                  unreadAlertsCount > 0
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Afficher les alertes de baisse de prix et de statut de stock"
              >
                {unreadAlertsCount > 0 ? (
                  <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Alertes ({activeFavoriteAlerts.length})</span>
                {unreadAlertsCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                )}
              </button>

              {favoriteLots.length > 0 && (
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors pl-1"
                >
                  {showOnlyFavorites ? 'Tout afficher' : 'Filtrer'}
                </button>
              )}
            </div>
          </div>

          {/* Système de Notifications & Alertes Baisse de Prix & Statut de Stock */}
          {showAlertsPanel && (
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Alertes Prix & Stock en Temps Réel</span>
                  {unreadAlertsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                      {unreadAlertsCount} nouvelle{unreadAlertsCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Simulation button so tester can trigger a live notification */}
                <button
                  type="button"
                  onClick={simulatePriceDropOrStockChange}
                  className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] text-emerald-400 font-medium flex items-center gap-1 transition-colors"
                  title="Simuler une notification de baisse de prix ou d'arrivée en stock"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Simuler alerte</span>
                </button>
              </div>

              {activeFavoriteAlerts.length > 0 ? (
                <div className="space-y-2">
                  {activeFavoriteAlerts.map((alert) => {
                    const isPriceDrop = alert.type === 'price_drop';
                    const targetLot = lots.find((l) => l.id === alert.lotId);

                    return (
                      <div
                        key={alert.id}
                        className={`p-2.5 rounded-xl border transition-all text-xs relative ${
                          alert.read
                            ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                            : isPriceDrop
                            ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 shadow-sm'
                            : 'bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border-sky-500/40 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                isPriceDrop
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              }`}
                            >
                              {isPriceDrop ? (
                                <TrendingDown className="w-4 h-4" />
                              ) : (
                                <Truck className="w-4 h-4" />
                              )}
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-white text-[11px] leading-tight">
                                  {alert.title}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    isPriceDrop
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  }`}
                                >
                                  {alert.badgeText}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-300 leading-snug">
                                {alert.message}
                              </p>

                              {/* Price or Stock Comparison Row */}
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                                <span>Avant : <span className="line-through">{alert.oldValue}</span></span>
                                <span>→</span>
                                <span className="font-bold text-white">Nouveau : <span className={isPriceDrop ? 'text-emerald-400' : 'text-sky-400'}>{alert.newValue}</span></span>
                                <span>·</span>
                                <span className="text-slate-500">{alert.timestamp}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => dismissAlert(alert.id, e)}
                              className="text-slate-500 hover:text-slate-300 p-0.5"
                              title="Masquer l'alerte"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {!alert.read && (
                              <button
                                type="button"
                                onClick={() => markAlertAsRead(alert.id)}
                                className="text-[9px] text-emerald-400 hover:underline pt-1"
                              >
                                Lu
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Action CTA inside the alert */}
                        {targetLot && (
                          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              Lot : {alert.lotTitle}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openLotDetail(targetLot)}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium transition-colors"
                              >
                                Voir fiche
                              </button>
                              <button
                                type="button"
                                onClick={() => onInitiateOrder(targetLot)}
                                className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold transition-colors"
                              >
                                Commander
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-900/60 text-center text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Aucune alerte active sur vos lots favoris pour le moment.</span>
                  <button
                    type="button"
                    onClick={simulatePriceDropOrStockChange}
                    className="text-emerald-400 hover:underline font-medium"
                  >
                    Déclencher un test
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Carrousel des Lots Favoris */}
          {favoriteLots.length > 0 ? (
            <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5">
              {favoriteLots.map((favLot) => {
                const lotAlert = activeFavoriteAlerts.find((a) => a.lotId === favLot.id);

                return (
                  <div
                    key={favLot.id}
                    onClick={() => openLotDetail(favLot)}
                    className="w-56 shrink-0 bg-slate-950/90 rounded-xl border border-slate-800 hover:border-slate-700 p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] relative group"
                  >
                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                      <img
                        src={favLot.image}
                        alt={favLot.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />

                      {/* Visual Alert Badge on the card if price dropped or stock arrived */}
                      {lotAlert && (
                        <div
                          className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md flex items-center gap-1 ${
                            lotAlert.type === 'price_drop'
                              ? 'bg-emerald-500 text-slate-950 animate-pulse'
                              : 'bg-sky-500 text-slate-950'
                          }`}
                        >
                          {lotAlert.type === 'price_drop' ? (
                            <TrendingDown className="w-2.5 h-2.5" />
                          ) : (
                            <Truck className="w-2.5 h-2.5" />
                          )}
                          <span>{lotAlert.badgeText}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(favLot.id, e)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-md border border-rose-400 transition-transform active:scale-90"
                        title="Retirer des favoris"
                        aria-label="Retirer des favoris"
                      >
                        <Heart className="w-3 h-3 fill-current" />
                      </button>

                      <div className="absolute bottom-1 left-1.5 text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-900/90 text-emerald-400 border border-slate-700/60">
                        {favLot.unitPrice.toFixed(2)} €/u
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold text-white line-clamp-1">
                        {favLot.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>MOQ: {favLot.moq} pcs</span>
                        <span className="text-slate-300 truncate max-w-[100px]">{favLot.importer.companyName}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInitiateOrder(favLot);
                        }}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold text-center transition-colors"
                      >
                        Commander
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenChatWithSupplier(favLot.importer.id, favLot.title);
                        }}
                        className="py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] border border-slate-800 transition-colors"
                        title="Négocier"
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-1">
              <p className="text-[11px] text-slate-400">
                Vous n'avez aucun lot en favori pour le moment.
              </p>
              <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                <span>Cliquez sur l'icône</span>
                <Heart className="w-3 h-3 text-rose-400 fill-current inline" />
                <span>sur n'importe quel lot pour activer le suivi et les alertes.</span>
              </p>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            {showOnlyFavorites ? `Favoris (${filteredLots.length})` : `${filteredLots.length} lot${filteredLots.length > 1 ? 's' : ''} disponible${filteredLots.length > 1 ? 's' : ''}`}
          </span>
          <span className="text-[11px]">Prix d'achat direct de gros</span>
        </div>

        {/* Lot Cards List */}
        <div className="grid grid-cols-1 gap-3.5">
          {filteredLots.map((lot) => {
            const statusInfo = getStatusLabel(lot.status, lot.etaDays);
            const marginPercent = Math.round(((lot.suggestedRetailPrice - lot.unitPrice) / lot.suggestedRetailPrice) * 100);
            const isFav = favoriteIds.includes(lot.id);

            return (
              <div
                key={lot.id}
                onClick={() => openLotDetail(lot)}
                className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer shadow-sm"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={lot.image}
                    alt={lot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/50">
                      Origine {lot.originCountry} ({lot.originCity})
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 shadow-sm">
                        +{marginPercent}% marge
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(lot.id, e)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                          isFav
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-950 border border-rose-400'
                            : 'bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-rose-400 border border-slate-700/60'
                        }`}
                        title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">À partir de</div>
                      <div className="text-base font-bold text-white tracking-tight">
                        {lot.unitPrice.toFixed(2)} € <span className="text-[10px] text-slate-400 font-normal">/ unité</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 space-y-2.5">
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                    {lot.title}
                  </h3>

                  {/* Unboxed Metadata with · separator */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>MOQ: {lot.moq} pcs</span>
                    <span aria-hidden="true">·</span>
                    <span>Stock: {lot.availableUnits} pcs</span>
                    <span aria-hidden="true">·</span>
                    <span>Revente: ~{lot.suggestedRetailPrice.toFixed(2)} €</span>
                  </div>

                  {/* Supplier & Location Row */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={lot.importer.avatar}
                        alt={lot.importer.name}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <span className="text-slate-300 truncate font-medium">
                        {lot.importer.companyName}
                      </span>
                      {lot.importer.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 shrink-0 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{lot.importer.warehouse.distanceKm} km</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLots.length === 0 && (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
            <Box className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">Aucun lot ne correspond aux critères</div>
            <p className="text-xs text-slate-500">Essayez de réinitialiser vos filtres ou de modifier votre terme de recherche.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedOrigin('all');
                setSelectedStatus('all');
                setMaxMoq(100);
              }}
              className="mt-2 px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>

      {/* Filter Bottom Drawer Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">Filtres d'importation B2B</h4>
              </div>
              <button 
                onClick={() => setShowFilterDrawer(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Origin Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Pays / Hub d'origine</label>
              <div className="grid grid-cols-2 gap-2">
                {origins.map((origin) => (
                  <button
                    key={origin}
                    onClick={() => setSelectedOrigin(origin)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-colors ${
                      selectedOrigin === origin
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {origin === 'all' ? 'Toutes origines' : origin}
                  </button>
                ))}
              </div>
            </div>

            {/* Status / Availability Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Disponibilité logistique</label>
              <div className="space-y-1.5">
                {[
                  { key: 'all', label: 'Toutes les disponibilités' },
                  { key: 'in_stock_local', label: 'En stock local (Retrait ou coursier < 24h)' },
                  { key: 'customs_clearance', label: 'En cours de dédouanement (Sous 48h)' },
                  { key: 'in_transit', label: 'En transit conteneur (Arrivage prévu)' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedStatus(item.key)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-medium border text-left transition-colors ${
                      selectedStatus === item.key
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Order Quantity (MOQ) Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Quantité minimale max (MOQ)</span>
                <span className="text-emerald-400 font-bold">{maxMoq} pièces</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxMoq}
                onChange={(e) => setMaxMoq(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>5 pcs (micro-lots)</span>
                <span>50 pcs</span>
                <span>100 pcs (gros volume)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedOrigin('all');
                  setSelectedStatus('all');
                  setMaxMoq(100);
                  setShowFilterDrawer(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
              >
                Appliquer ({filteredLots.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Lot Detailed Sheet Modal */}
      {selectedLotForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Sheet Header with Close */}
            <div className="relative aspect-[16/10] w-full bg-slate-950 shrink-0">
              <img
                src={selectedLotForDetail.image}
                alt={selectedLotForDetail.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(selectedLotForDetail.id, e)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                    favoriteIds.includes(selectedLotForDetail.id)
                      ? 'bg-rose-500 text-white border border-rose-400 shadow-md shadow-rose-950'
                      : 'bg-slate-950/80 border border-slate-700 text-slate-200 hover:text-rose-400'
                  }`}
                  title={favoriteIds.includes(selectedLotForDetail.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  aria-label={favoriteIds.includes(selectedLotForDetail.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className={`w-4 h-4 ${favoriteIds.includes(selectedLotForDetail.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setSelectedLotForDetail(null)}
                  className="w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs text-slate-200">
                Hub {selectedLotForDetail.originCity} ({selectedLotForDetail.originCountry})
              </div>
            </div>

            {/* Scrollable Details */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  {selectedLotForDetail.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {selectedLotForDetail.description}
                </p>
              </div>

              {/* Price & MOQ Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[11px] text-slate-400">Prix unitaire</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {selectedLotForDetail.unitPrice.toFixed(2)} €
                  </div>
                </div>
                <div className="border-x border-slate-800/80">
                  <div className="text-[11px] text-slate-400">MOQ Minimum</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {selectedLotForDetail.moq} pcs
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Disponible</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {selectedLotForDetail.availableUnits} pcs
                  </div>
                </div>
              </div>

              {/* Profit & Margin Calculator */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Calculateur de Marge Commerçant</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Achat: {selectedLotForDetail.unitPrice} €</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-slate-400">Prix de vente envisagé en magasin (€)</label>
                    <input
                      type="number"
                      value={customRetailPrice}
                      onChange={(e) => setCustomRetailPrice(Math.max(1, Number(e.target.value)))}
                      className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Bénéfice estimé / pièce</div>
                    <div className="text-base font-bold text-emerald-400">
                      +{(customRetailPrice - selectedLotForDetail.unitPrice).toFixed(2)} €
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-emerald-500/10">
                  <span>Gain total sur le carton de {selectedLotForDetail.moq} pièces :</span>
                  <span className="font-bold text-white">
                    +{((customRetailPrice - selectedLotForDetail.unitPrice) * selectedLotForDetail.moq).toFixed(2)} € net
                  </span>
                </div>
              </div>

              {/* Importer / Supplier Profile */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedLotForDetail.importer.avatar}
                      alt={selectedLotForDetail.importer.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{selectedLotForDetail.importer.companyName}</span>
                        {selectedLotForDetail.importer.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {selectedLotForDetail.importer.name} · Membre depuis {selectedLotForDetail.importer.memberSince}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onOpenMapToSupplier(selectedLotForDetail.importer.id);
                      setSelectedLotForDetail(null);
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1"
                    title="Voir l'entrepôt sur la carte"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedLotForDetail.importer.warehouse.distanceKm} km</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{selectedLotForDetail.importer.warehouse.name} ({selectedLotForDetail.importer.warehouse.city})</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-300">Spécifications & Conformité</h4>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {selectedLotForDetail.specifications.map((spec, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <span className="text-slate-400">{spec.label}</span>
                      <span className="text-slate-200 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Sticky in Sheet */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  onOpenChatWithSupplier(selectedLotForDetail.importer.id, selectedLotForDetail.title);
                  setSelectedLotForDetail(null);
                }}
                className="flex-1 min-h-[44px] px-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Négocier / Devis</span>
              </button>

              <button
                onClick={() => {
                  onInitiateOrder(selectedLotForDetail);
                  setSelectedLotForDetail(null);
                }}
                className="flex-1 min-h-[44px] px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Payer sous Séquestre</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
