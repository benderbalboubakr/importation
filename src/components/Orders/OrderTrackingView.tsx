import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  QrCode, 
  Building2, 
  ExternalLink, 
  ChevronRight, 
  AlertCircle,
  ArrowRight,
  Package,
  RotateCcw,
  Sparkles,
  Download
} from 'lucide-react';
import { Order, UserRole } from '../../types';

interface OrderTrackingViewProps {
  orders: Order[];
  userRole: UserRole;
  onAdvanceOrderStep: (orderId: string) => void;
  onReleaseEscrowFunds: (orderId: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  userRole,
  onAdvanceOrderStep,
  onReleaseEscrowFunds,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showReleaseConfirmModal, setShowReleaseConfirmModal] = useState(false);

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'edahabia':
        return 'Carte Edahabia (Algérie Poste)';
      case 'cib':
        return 'Carte CIB (Banques d’Algérie / SATIM)';
      case 'cash':
        return 'Espèces / Cash (Retrait Dépôt ou Livraison)';
      case 'orange_money':
        return 'Orange Money';
      case 'wave':
        return 'Wave Mobile';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return 'Carte bancaire';
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col overflow-y-auto no-scrollbar bg-slate-950 text-slate-100">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Suivi des Commandes en Temps Réel</span>
          </h2>
          <div className="text-[11px] text-slate-400">
            Du conteneur international jusqu'à l'inspection en boutique
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Séquestre Protégé</span>
        </div>
      </div>

      {/* Orders Segmented Carousel */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {orders.map((ord) => {
          const isSelected = ord.id === activeOrder?.id;
          return (
            <button
              key={ord.id}
              onClick={() => setSelectedOrderId(ord.id)}
              className={`p-2.5 rounded-xl border text-left shrink-0 transition-all min-w-[200px] ${
                isSelected
                  ? 'bg-slate-950 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-emerald-400 font-semibold">{ord.trackingNumber.slice(0, 16)}...</span>
                <span className="text-[10px] text-slate-400">{ord.units} pcs</span>
              </div>
              <div className="text-xs font-semibold text-white truncate mt-1">
                {ord.lotTitle}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{ord.totalAmount.toFixed(2)} €</span>
                <span className={ord.paymentStatus === 'held_in_escrow' ? 'text-amber-400' : 'text-emerald-400 font-medium'}>
                  {ord.paymentStatus === 'held_in_escrow' ? 'Séquestré' : 'Libéré'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {activeOrder ? (
        <div className="p-4 space-y-4">
          {/* Order Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={activeOrder.lotImage}
                alt={activeOrder.lotTitle}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-slate-400">
                  N° {activeOrder.trackingNumber}
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                  {activeOrder.lotTitle}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Fournisseur : <span className="text-slate-200">{activeOrder.importer.companyName}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Paiement : <span className="text-emerald-400 font-medium">{getPaymentMethodLabel(activeOrder.paymentMethod)}</span>
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Status Banner */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${activeOrder.paymentStatus === 'held_in_escrow' ? 'text-amber-400' : 'text-emerald-400'}`} />
                <div>
                  <div className="font-semibold text-white">
                    {activeOrder.paymentStatus === 'held_in_escrow'
                      ? 'Fonds sous Séquestre Garanti'
                      : 'Fonds Débloqués à l’Importateur'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeOrder.paymentStatus === 'held_in_escrow'
                      ? 'L’importateur ne recevra les fonds qu’après validation de vos colis.'
                      : 'Transaction clôturée avec succès après inspection.'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-white">
                  {activeOrder.totalAmount.toFixed(2)} €
                </div>
                <div className="text-[10px] text-slate-500">dont 2% séquestre</div>
              </div>
            </div>

            {/* Live Progress Simulation Button */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => onAdvanceOrderStep(activeOrder.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                title="Faire progresser l'étape en temps réel"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simuler l'avancement logistique</span>
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Code QR de retrait"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Interactive Timeline Stepper */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>Étapes d'acheminement & dédouanement</span>
              <span className="text-[11px] text-emerald-400">Suivi temps réel</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {activeOrder.timeline.map((item, idx) => {
                const isCompleted = item.completed;
                const isCurrent = item.current;

                return (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-slate-950 text-slate-950 shadow-sm'
                          : isCurrent
                          ? 'bg-slate-950 border-emerald-400 ring-4 ring-emerald-500/20'
                          : 'bg-slate-950 border-slate-700'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isCompleted || isCurrent ? 'text-white' : 'text-slate-500'}`}>
                          {item.step}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.location && (
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Escrow Release CTA */}
          {activeOrder.paymentStatus === 'held_in_escrow' && userRole === 'retailer' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Vous avez vérifié votre marchandise ?</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Si le carton et la quantité sont conformes au devis, libérez le paiement à l'importateur pour finaliser la commande.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReleaseConfirmModal(true)}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirmer l'inspection & Débloquer les fonds</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs">
          Aucune commande en cours.
        </div>
      )}

      {/* QR Code Inspection Modal */}
      {showQrModal && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
            <h4 className="text-sm font-bold text-white">Bordereau & QR Code d'Enlèvement</h4>
            <p className="text-xs text-slate-400">
              Présentez ce QR Code ou ce pass de sécurité au responsable du dépôt pour retirer vos cartons.
            </p>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-full h-full border-4 border-dashed border-slate-900 rounded-xl flex flex-col items-center justify-center text-slate-950">
                <QrCode className="w-28 h-28" />
                <span className="font-mono font-bold text-[10px] mt-1">{activeOrder.inspectionCode}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Code secret d'inspection : </span>
              <strong className="text-emerald-400 font-mono tracking-wider">{activeOrder.inspectionCode}</strong>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Escrow Release Confirmation Modal */}
      {showReleaseConfirmModal && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-sm font-bold text-white">Libérer le paiement séquestre ?</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Le montant de <strong className="text-white">{activeOrder.totalAmount.toFixed(2)} €</strong> sera immédiatement transféré sur le portefeuille de l'importateur <strong className="text-white">{activeOrder.importer.companyName}</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>✓ Lots réceptionnés et scellés conformes</div>
              <div>✓ Facture d'importation certifiée générée</div>
              <div>✓ Garantie revendeur 12 mois activée</div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowReleaseConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onReleaseEscrowFunds(activeOrder.id);
                  setShowReleaseConfirmModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
              >
                Valider & Débloquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
