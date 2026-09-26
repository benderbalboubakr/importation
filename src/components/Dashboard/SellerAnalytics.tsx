import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Clock, 
  ShieldCheck, 
  Crown, 
  UserCheck, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  ArrowUpRight, 
  Boxes,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserRole, KYCProfile, Supplier } from '../../types';

interface SellerAnalyticsProps {
  userRole: UserRole;
  kyc: KYCProfile;
  onOpenKycModal: () => void;
  onOpenPremiumModal: () => void;
}

export const SellerAnalytics: React.FC<SellerAnalyticsProps> = ({
  userRole,
  kyc,
  onOpenKycModal,
  onOpenPremiumModal,
}) => {
  const isImporter = userRole === 'importer';

  const metrics = [
    {
      label: 'Volume d’affaires (30j)',
      value: '34 850 €',
      trend: '+24.5%',
      isPositive: true,
      subtext: 'vs mois précédent',
    },
    {
      label: 'Lots acheminés & dédouanés',
      value: '18 conteneurs',
      trend: '+4 lots',
      isPositive: true,
      subtext: 'Délai moyen douane: 1.8j',
    },
    {
      label: 'Taux de rotation stock',
      value: '94.2%',
      trend: '+6.1%',
      isPositive: true,
      subtext: 'Écoulement sous 12 jours',
    },
    {
      label: 'Commerçants réguliers',
      value: '68 boutiques',
      trend: '+12 inscrits',
      isPositive: true,
      subtext: 'Indice de confiance: 4.95/5',
    },
  ];

  const topProducts = [
    {
      name: 'Écouteurs Pro TWS ANC 5.4',
      volume: '1,200 unités vendues',
      revenue: '15,360 €',
      margin: '68%',
      origin: 'Chine (Shenzhen)',
    },
    {
      name: 'Sacs à Main Cuir Grainé Istanbul',
      volume: '340 unités vendues',
      revenue: '8,330 €',
      margin: '69%',
      origin: 'Turquie (Istanbul)',
    },
    {
      name: 'Sérums Acide Hyaluronique 50ml',
      volume: '850 flacons vendus',
      revenue: '4,165 €',
      margin: '74%',
      origin: 'Dubaï (JAFZA)',
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col overflow-y-auto no-scrollbar bg-slate-950 text-slate-100">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>{isImporter ? 'Tableau de Bord Vendeur & Importateur' : 'Espace Gestion Commerçant'}</span>
          </h2>
          <div className="text-[11px] text-slate-400">
            Analyses des arrivages, volumes d'affaires et conformité
          </div>
        </div>

        <button
          onClick={onOpenPremiumModal}
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm"
        >
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span>Pro VIP</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* KYC Verification Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kyc.verificationBadgeUnlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Vérification d’Identité & Registre (KYC)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${kyc.verificationBadgeUnlocked ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    {kyc.verificationBadgeUnlocked ? 'Vérifié Gold' : 'En attente'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {kyc.businessName} · N° RCCM : {kyc.rccm}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenKycModal}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              <span>Gérer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span>Badge de confiance débloqué sur vos annonces</span>
            <span className="text-emerald-400 font-semibold">Taux de closing +38%</span>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1"
            >
              <div className="text-[11px] text-slate-400">{m.label}</div>
              <div className="text-base font-bold text-white tracking-tight">
                {m.value}
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-emerald-400 font-semibold flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {m.trend}
                </span>
                <span className="text-slate-500 truncate">{m.subtext}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Container Pipeline Status */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-emerald-400" />
              <span>Arrivages Douane & Conteneurs Actifs</span>
            </span>
            <span className="text-[10px] text-slate-400">Temps réel</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Conteneur CN-SZ-7882-FR (Shenzhen)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Électronique & TWS · 200 cartons</div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                En stock local
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Cargo DXB-PORT-4412 (Dubaï)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Cosmétique & Soins CPNP · 80 cartons</div>
              </div>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Dédouanement J+1
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Fret Aérien TR-IST-9102-FR (Istanbul)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Maroquinerie cuir grainé · 50 cartons</div>
              </div>
              <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                Transit aérien
              </span>
            </div>
          </div>
        </div>

        {/* Top Performing Imported Products */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Palmarès des Lots les Plus Rentables</span>
            </span>
            <span className="text-[10px] text-slate-400">Ce trimestre</span>
          </div>

          <div className="space-y-2">
            {topProducts.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {p.volume} · Origine {p.origin}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white">{p.revenue}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">{p.margin} marge</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>Abonnement ImportDirect Pro</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Débloquez l'accès prioritaire conteneurs et les frais de séquestre réduits à 0.8%.
            </p>
          </div>

          <button
            onClick={onOpenPremiumModal}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
          >
            Découvrir
          </button>
        </div>
      </div>
    </div>
  );
};
