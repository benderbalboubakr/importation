import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Compass, 
  Building2, 
  Package, 
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Supplier, ProductLot } from '../../types';

interface SupplierLocatorProps {
  suppliers: Supplier[];
  lots: ProductLot[];
  selectedSupplierId?: string | null;
  onOpenChatWithSupplier: (supplierId: string) => void;
  onSelectLot: (lot: ProductLot) => void;
}

export const SupplierLocator: React.FC<SupplierLocatorProps> = ({
  suppliers,
  lots,
  selectedSupplierId,
  onOpenChatWithSupplier,
  onSelectLot,
}) => {
  const [activeSupplierId, setActiveSupplierId] = useState<string | null>(
    selectedSupplierId || suppliers[0]?.id || null
  );
  const [radiusFilter, setRadiusFilter] = useState<number>(25); // km
  const [filterOnlyVerified, setFilterOnlyVerified] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);

  const activeSupplier = suppliers.find((s) => s.id === activeSupplierId) || suppliers[0];

  const filteredSuppliers = suppliers.filter((s) => {
    const withinRadius = s.warehouse.distanceKm <= radiusFilter;
    const matchesVerified = filterOnlyVerified ? s.verified : true;
    return withinRadius && matchesVerified;
  });

  const supplierLots = lots.filter((l) => l.importerId === activeSupplier?.id);

  // Approximate relative coordinates for an aesthetic interactive radar/map canvas
  const mapNodes = [
    { id: 'sup_1', x: 50, y: 38, name: 'Roissy Hub CDG', code: 'CDG-4B', distance: 3.4 },
    { id: 'sup_2', x: 30, y: 65, name: 'Saint-Priest Dépôt', code: 'STP-02', distance: 7.8 },
    { id: 'sup_3', x: 68, y: 78, name: 'Fos Portuaire', code: 'FOS-P2', distance: 14.2 },
    { id: 'sup_4', x: 62, y: 22, name: 'Lesquin Fret', code: 'LSQ-05', distance: 22.5 },
  ];

  return (
    <div className="flex-1 w-full flex flex-col overflow-y-auto no-scrollbar bg-slate-950 text-slate-100">
      {/* Top Controls Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold text-white">Géolocalisation des Fournisseurs B2B</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Votre boutique : Paris 11e</span>
          </div>
        </div>

        {/* Radius Filter Pills */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
          {[5, 15, 25, 50].map((km) => (
            <button
              key={km}
              onClick={() => setRadiusFilter(km)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                radiusFilter === km
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Rayon &lt; {km} km
            </button>
          ))}
          <button
            onClick={() => setFilterOnlyVerified(!filterOnlyVerified)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors shrink-0 flex items-center gap-1 ${
              filterOnlyVerified
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Certifiés Gold</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Area */}
      <div className="relative w-full h-64 sm:h-72 bg-slate-900 border-b border-slate-800 overflow-hidden select-none">
        {/* Subtle grid pattern for technical B2B logistics map */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        {/* Road & Corridor Visual Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800" strokeWidth="1.5">
          <line x1="45%" y1="50%" x2="50%" y2="38%" strokeDasharray="3 3" className="stroke-emerald-500/40" />
          <line x1="45%" y1="50%" x2="30%" y2="65%" strokeDasharray="3 3" className="stroke-slate-700" />
          <line x1="45%" y1="50%" x2="68%" y2="78%" strokeDasharray="3 3" className="stroke-slate-700" />
          <line x1="45%" y1="50%" x2="62%" y2="22%" strokeDasharray="3 3" className="stroke-slate-700" />
        </svg>

        {/* User Shop Center Pin */}
        <div className="absolute top-[50%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[10px] text-blue-300 font-semibold shadow-sm whitespace-nowrap">
            Votre Boutique
          </div>
        </div>

        {/* Importer Warehouse Pins */}
        {mapNodes.map((node) => {
          const isSelected = activeSupplierId === node.id;
          const isFilteredIn = node.distance <= radiusFilter;

          if (!isFilteredIn) return null;

          return (
            <button
              key={node.id}
              onClick={() => setActiveSupplierId(node.id)}
              style={{ top: `${node.y}%`, left: `${node.x}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-200 flex flex-col items-center ${
                isSelected ? 'scale-115' : 'hover:scale-105'
              }`}
            >
              {/* Ping Ring for Selected */}
              {isSelected && (
                <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></span>
              )}

              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 border-white text-slate-950 shadow-emerald-500/50'
                    : 'bg-slate-900 border-emerald-500 text-emerald-400'
                }`}
              >
                <Package className="w-4 h-4" />
              </div>

              {/* Pin Tag */}
              <div
                className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-tight shadow-md border whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-emerald-300 border-emerald-500/80'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800'
                }`}
              >
                <span>{node.name}</span>
                <span className="ml-1 text-[9px] text-slate-400">({node.distance} km)</span>
              </div>
            </button>
          );
        })}

        {/* Bottom map overlay indicator */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
          <span>{filteredSuppliers.length} dépôts dans le rayon sélectionné</span>
          <span className="text-emerald-400 font-medium">Retrait express disponible</span>
        </div>
      </div>

      {/* Selected Supplier Highlight Card */}
      {activeSupplier && (
        <div className="p-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img
                  src={activeSupplier.avatar}
                  alt={activeSupplier.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{activeSupplier.companyName}</span>
                    {activeSupplier.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activeSupplier.name} · Importateur vérifié ({activeSupplier.totalImportsTons} tonnes importées)
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="text-amber-400 font-semibold">★ {activeSupplier.rating}</span>
                    <span>({activeSupplier.reviewsCount} avis)</span>
                    <span>·</span>
                    <span className="text-emerald-400">{activeSupplier.responseRate}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeSupplier.warehouse.distanceKm} km</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">de votre boutique</div>
              </div>
            </div>

            {/* Warehouse details */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-white">{activeSupplier.warehouse.name}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                  Ouvert aujourd'hui
                </span>
              </div>
              <p className="text-slate-400 text-[11px] pl-5">
                {activeSupplier.warehouse.address}, {activeSupplier.warehouse.city}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pl-5 pt-1 border-t border-slate-900">
                <span>Horaires : {activeSupplier.warehouse.openingHours}</span>
                <span className="text-emerald-400">Accès camions & fourgons</span>
              </div>
            </div>

            {/* Hubs & Origin Corridors */}
            <div className="text-xs space-y-1">
              <span className="text-slate-400 font-medium">Couloirs d'importation directs :</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {activeSupplier.originHubs.map((hub, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px]"
                  >
                    {hub}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onOpenChatWithSupplier(activeSupplier.id)}
                className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message & Devis</span>
              </button>

              <button
                onClick={() => setShowDirectionsModal(true)}
                className="min-h-[44px] px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Itinéraire</span>
              </button>
            </div>
          </div>

          {/* Available Lots at this Warehouse */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">
                Lots disponibles au dépôt ({supplierLots.length})
              </span>
              <span className="text-slate-400 text-[11px]">Retrait sur place disponible</span>
            </div>

            <div className="space-y-2">
              {supplierLots.map((lot) => (
                <div
                  key={lot.id}
                  onClick={() => onSelectLot(lot)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={lot.image}
                    alt={lot.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {lot.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      MOQ: {lot.moq} pcs · Dispo: {lot.availableUnits} pcs
                    </div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">
                      {lot.unitPrice.toFixed(2)} € <span className="text-[10px] text-slate-400 font-normal">/ u</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-200 border border-slate-700">
                      Voir lot
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simulated Directions / Navigation Modal */}
      {showDirectionsModal && activeSupplier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">Itinéraire vers le Dépôt</h4>
              </div>
              <button 
                onClick={() => setShowDirectionsModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-semibold text-white">{activeSupplier.warehouse.name}</div>
                <div className="text-slate-400 mt-0.5">{activeSupplier.warehouse.address}, {activeSupplier.warehouse.city}</div>
                <div className="text-emerald-400 font-medium mt-1">Distance : {activeSupplier.warehouse.distanceKm} km (~18 min en voiture/utilitaire)</div>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                  <span>Prendre la sortie N°4 direction Zone Fret Cargo / Quai d'enlèvement.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                  <span>Présenter le code d'enlèvement séquestre <strong>SEC-8924-PASS</strong> au poste de garde.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[10px] font-bold">3</div>
                  <span>Chargement direct au quai 4B avec aide cariste offerte.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDirectionsModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
            >
              Fermer l'itinéraire
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
