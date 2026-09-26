import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Lock, 
  Sparkles, 
  AlertCircle,
  QrCode,
  Banknote,
  MessageSquare,
  Building2,
  Check
} from 'lucide-react';
import { ProductLot, Order, Supplier } from '../../types';

interface MobilePaymentModalProps {
  lot?: ProductLot | null;
  offer?: any | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (newOrder: Order) => void;
  onContactForCash?: (details: {
    lotTitle: string;
    units: number;
    amount: number;
    supplierId?: string;
  }) => void;
}

export const MobilePaymentModal: React.FC<MobilePaymentModalProps> = ({
  lot,
  offer,
  isOpen,
  onClose,
  onPaymentSuccess,
  onContactForCash,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<
    'edahabia' | 'cib' | 'cash' | 'orange_money' | 'wave' | 'apple_pay' | 'card'
  >('edahabia');

  // Input states
  const [phoneNumber, setPhoneNumber] = useState('+213 6 55 12 34 56');
  const [edahabiaCardNumber, setEdahabiaCardNumber] = useState('5054 2824 0000 8941');
  const [cibCardNumber, setCibCardNumber] = useState('6037 4100 2291 5530');
  const [cibBank, setCibBank] = useState('Banque Nationale d’Algérie (BNA)');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('312');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || (!lot && !offer)) return null;

  const lotTitle = offer ? offer.lotTitle : lot!.title;
  const units = offer ? offer.units : lot!.moq;
  const unitPrice = offer ? offer.offeredUnitPrice : lot!.unitPrice;
  const subtotal = units * unitPrice;
  const escrowFee = Number((subtotal * 0.02).toFixed(2));
  const totalAmount = subtotal + escrowFee;
  const dzdAmount = Math.round(totalAmount * 240);
  const lotImage = lot ? lot.image : '/src/assets/images/lot_accessories_tech_1790440227380.jpg';
  const supplier: Supplier = lot ? lot.importer : (offer.importer || {
    id: 'sup_1',
    name: 'Karim Benali',
    companyName: 'Atlas Global Cargo',
    verified: true,
  } as any);

  const algerianBanks = [
    'Banque Nationale d’Algérie (BNA)',
    'Banque Extérieure d’Algérie (BEA)',
    'Crédit Populaire d’Algérie (CPA)',
    'Banque de Développement Local (BDL)',
    'Banque de l’Agriculture et du Dév. Rural (BADR)',
    'Al Baraka Bank Algérie',
    'Société Générale Algérie',
    'BNP Paribas El Djazaïr',
    'Arab Banking Corporation (Bank ABC)',
    'Gulf Bank Algérie (AGB)',
    'Natixis Algérie',
  ];

  const handleContactForCash = () => {
    if (onContactForCash) {
      onContactForCash({
        lotTitle,
        units,
        amount: totalAmount,
        supplierId: supplier.id,
      });
    }
    onClose();
  };

  const handleInitiatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'apple_pay') {
        // Instant biometric success
        completeOrder();
      } else {
        // Send OTP for Edahabia / CIB / Mobile money
        setStep('otp');
      }
    }, 700);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      completeOrder();
    }, 900);
  };

  const completeOrder = () => {
    const newOrder: Order = {
      id: `cmd-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `IMP-TRK-2026-${Math.floor(1000 + Math.random() * 9000)}-DZ`,
      lotId: lot ? lot.id : offer.lotId,
      lotTitle,
      lotImage,
      importer: supplier,
      retailerName: 'Votre Boutique Connectée',
      units,
      unitPrice,
      subtotal,
      escrowFee,
      totalAmount,
      paymentMethod,
      paymentStatus: 'held_in_escrow',
      orderStatus: 'created',
      createdAt: 'Aujourd’hui',
      estimatedDeliveryDate: 'Sous 48h',
      inspectionCode: `SEC-${Math.floor(1000 + Math.random() * 9000)}-PASS`,
      timeline: [
        {
          step: paymentMethod === 'edahabia' 
            ? 'Paiement Séquestré Garanti (Carte Edahabia Algérie Poste)'
            : paymentMethod === 'cib'
            ? 'Paiement Séquestré Garanti (Carte CIB / SATIM)'
            : 'Paiement Séquestré Garanti',
          date: 'Aujourd’hui - Instantané',
          description: `Fonds de ${totalAmount.toFixed(2)} € (≈ ${dzdAmount.toLocaleString('fr-FR')} DZD) bloqués sur compte séquestre certifié.`,
          completed: true,
          current: true,
          location: 'Compte de cantonnement sécurisé'
        },
        {
          step: 'Préparation au Dépôt Logistique',
          date: 'En cours',
          description: 'Cartons étiquetés et réservés au nom de votre boutique.',
          completed: false,
          current: false,
          location: supplier.warehouse?.name || 'Entrepôt Central'
        },
        {
          step: 'Enlèvement au Quai ou Livraison Express',
          date: 'À venir',
          description: 'Présentez votre QR Code d’inspection pour charger les colis.',
          completed: false,
          current: false,
        },
        {
          step: 'Inspection & Déblocage des Fonds',
          date: 'À venir',
          description: 'Vous validez la conformité physique avant tout versement à l’importateur.',
          completed: false,
          current: false,
        }
      ]
    };

    setStep('success');
    setTimeout(() => {
      onPaymentSuccess(newOrder);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Paiement Sécurisé & Séquestre B2B</span>
              </h3>
              <div className="text-[10px] text-slate-400">Cartes Algériennes CIB, Edahabia & Règlements Espèces</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'details' && (
          <div className="space-y-4 text-xs">
            {/* Lot Summary with DZD Conversion */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white truncate max-w-[200px]">{lotTitle}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {units} pièces × {unitPrice.toFixed(2)} €/u
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white text-sm">{totalAmount.toFixed(2)} €</div>
                <div className="text-[10px] font-semibold text-emerald-400">≈ {dzdAmount.toLocaleString('fr-FR')} DZD</div>
                <div className="text-[9px] text-slate-500">+2% séquestre inclus</div>
              </div>
            </div>

            {/* Message Spécial : Paiement en Espèces (Cash) pour les commerçants sans carte */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/35 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Vous ne pouvez pas payer par carte ?</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      Option Cash
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Si vous n'avez pas de carte <strong>CIB</strong> ou <strong>Edahabia</strong> et souhaitez régler votre commande en <strong>espèces (Cash)</strong> lors du retrait au dépôt ou à la livraison, contactez-nous directement par message sur notre page <strong>Nous Contacter</strong>. Notre équipe validera votre commande manuellement avec reçu d'acompte.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContactForCash}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 transition-all active:scale-[0.98]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Nous contacter par message pour payer en Cash</span>
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span>Choisissez votre mode de paiement électronique</span>
                <span className="text-[10px] text-emerald-400 font-semibold">🇩🇿 Cartes Algérie & Mobile</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. Carte Edahabia */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('edahabia')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'edahabia'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Carte Edahabia</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Algérie Poste / BaridiMob</div>
                </button>

                {/* 2. Carte CIB */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cib')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cib'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Carte CIB</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Banques Algérie / SATIM</div>
                </button>

                {/* 3. Orange Money */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'orange_money'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Orange Money</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Mobile Money</div>
                </button>

                {/* 4. Apple Pay / Google Pay / Carte Pro */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    <span>Apple / Google Pay</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Biométrique instantané</div>
                </button>
              </div>
            </div>

            {/* Dynamic Card / Account Input Fields based on selection */}
            {paymentMethod === 'edahabia' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                  <span>Informations Carte Edahabia (Algérie Poste)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Paiement certifié BaridiMob</span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Numéro de carte Edahabia (16 chiffres)</label>
                  <input
                    type="text"
                    value={edahabiaCardNumber}
                    onChange={(e) => setEdahabiaCardNumber(e.target.value)}
                    placeholder="5054 2824 XXXX XXXX"
                    className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Date d'expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Code CVC2 (au dos)</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="3 chiffres"
                      maxLength={3}
                      className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Numéro de téléphone lié au compte BaridiMob (+213)</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+213 6 XX XX XX XX"
                    className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cib' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                  <span>Informations Carte CIB (Réseau SATIM Algérie)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Validation Interbancaire</span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Banque émettrice de la carte CIB</label>
                  <select
                    value={cibBank}
                    onChange={(e) => setCibBank(e.target.value)}
                    className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {algerianBanks.map((bank, idx) => (
                      <option key={idx} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Numéro de carte CIB (16 chiffres)</label>
                  <input
                    type="text"
                    value={cibCardNumber}
                    onChange={(e) => setCibCardNumber(e.target.value)}
                    placeholder="6037 XXXX XXXX XXXX"
                    className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Date d'expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Code CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="3 chiffres"
                      maxLength={3}
                      className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Numéro de mobile pour le code SMS SATIM (+213)</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+213 5/6/7 XX XX XX XX"
                    className="w-full mt-0.5 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'orange_money' && (
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Numéro de téléphone Orange Money</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Escrow Legal Protection Explanation */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Séquestre Sécurisé Garanti</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Les <strong className="text-white">{totalAmount.toFixed(2)} €</strong> (≈ <strong className="text-emerald-400">{dzdAmount.toLocaleString('fr-FR')} DZD</strong>) restent consignés sur un compte séquestre certifié. L'importateur n'est payé qu'une fois votre colis vérifié au quai ou à la livraison.
              </p>
            </div>

            <button
              onClick={handleInitiatePayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Sécurisation de la transaction...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Consigner {totalAmount.toFixed(2)} € (≈ {dzdAmount.toLocaleString('fr-FR')} DZD) sous Séquestre</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4 text-xs text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                {paymentMethod === 'edahabia' 
                  ? 'Validation Sécurisée Algérie Poste / BaridiMob'
                  : paymentMethod === 'cib'
                  ? 'Validation 3D-Secure SATIM Banques d’Algérie'
                  : 'Validation du débit mobile'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Un code de vérification SMS a été transmis au <strong>{phoneNumber}</strong> pour valider le montant de <strong>{dzdAmount.toLocaleString('fr-FR')} DZD</strong>.
              </p>
            </div>

            <div className="max-w-[200px] mx-auto">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="7 8 2 4 1 0"
                className="w-full text-center tracking-widest text-lg font-mono font-bold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setOtpCode('782410')}
              className="text-[11px] text-emerald-400 hover:underline"
            >
              Remplir automatiquement le code SMS test (782410)
            </button>

            <button
              onClick={handleVerifyOtp}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Validation du séquestre en cours...</span>
                </>
              ) : (
                <span>Confirmer le séquestre bancaire</span>
              )}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-3 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-sm font-bold text-white">
              {paymentMethod === 'edahabia' ? 'Paiement Edahabia Séquestré !' : paymentMethod === 'cib' ? 'Paiement CIB SATIM Séquestré !' : 'Paiement Séquestré avec Succès !'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Votre commande de {totalAmount.toFixed(2)} € (≈ {dzdAmount.toLocaleString('fr-FR')} DZD) est enregistrée. Les cartons sont réservés au dépôt. Redirection vers le suivi en temps réel...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
