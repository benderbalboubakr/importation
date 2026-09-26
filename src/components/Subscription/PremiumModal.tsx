import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Percent, 
  Video, 
  Headphones 
} from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremiumUser: boolean;
  onUpgradePremium: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPremiumUser,
  onUpgradePremium,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [upgraded, setUpgraded] = useState(isPremiumUser);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setUpgraded(true);
    onUpgradePremium();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const benefits = [
    {
      title: 'Arrivages en avant-première 48h',
      desc: 'Réservez les meilleurs lots dès le chargement au port d’origine avant la rupture de stock.',
      icon: Zap,
    },
    {
      title: 'Frais de séquestre réduits à 0.8%',
      desc: 'Économisez plus de 200€ par mois sur toutes vos transactions sécurisées.',
      icon: Percent,
    },
    {
      title: 'Inspection Visio en direct des entrepôts',
      desc: 'Demandez une visite vidéo live du carton et des palettes avant de valider votre commande.',
      icon: Video,
    },
    {
      title: 'Hotline Douane & Courtage prioritaire 24/7',
      desc: 'Assistance dédiée pour vos bordereaux, taxes d’importation et conformité CE.',
      icon: Headphones,
    },
    {
      title: 'Badge Acheteur / Vendeur VIP Gold',
      desc: 'Augmente votre indice de confiance et priorise vos messages auprès des importateurs.',
      icon: Crown,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ImportDirect B2B Pro VIP</h3>
              <div className="text-[10px] text-slate-400">Abonnement exclusif Commerçants & Importateurs</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Switcher */}
        <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mensuel (39 € / mois)
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors relative ${
              billingCycle === 'yearly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annuel (350 € / an)
            <span className="ml-1 text-[9px] text-amber-400 font-bold">-25%</span>
          </button>
        </div>

        {/* Benefits List */}
        <div className="space-y-3 pt-1">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">{b.title}</div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    {b.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade Action */}
        <div className="pt-2">
          {upgraded ? (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Abonnement Pro Actif ! Toutes les fonctionnalités sont débloquées.</span>
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-950 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>Activer l'Abonnement Pro ({billingCycle === 'monthly' ? '39 € / mois' : '350 € / an'})</span>
            </button>
          )}
          <div className="text-[10px] text-slate-500 text-center mt-1.5">
            Sans engagement · Résiliable en 1 clic à tout moment
          </div>
        </div>
      </div>
    </div>
  );
};
