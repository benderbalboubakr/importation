import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  Camera, 
  CheckCircle2, 
  X, 
  Building2, 
  FileText, 
  UserCheck, 
  Sparkles,
  Lock
} from 'lucide-react';
import { KYCProfile } from '../../types';

interface KycVerificationModalProps {
  kyc: KYCProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveKYC: (newKyc: KYCProfile) => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({
  kyc,
  isOpen,
  onClose,
  onSaveKYC,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState(kyc.businessName);
  const [rccm, setRccm] = useState(kyc.rccm);
  const [contactName, setContactName] = useState(kyc.contactName);
  const [idDocType, setIdDocType] = useState(kyc.idDocumentType);
  const [idDocNumber, setIdDocNumber] = useState(kyc.idDocumentNumber);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(kyc.verificationBadgeUnlocked);

  if (!isOpen) return null;

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setStep(3);
      onSaveKYC({
        businessName,
        rccm,
        taxNumber: 'FR 89 410 928 114',
        contactName,
        idDocumentType: idDocType,
        idDocumentNumber: idDocNumber,
        status: 'verified',
        submittedAt: 'Aujourd’hui',
        verificationBadgeUnlocked: true,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Vérification d’Identité Sécurisée (KYC)</h3>
              <div className="text-[10px] text-slate-400">Accréditation officielle B2B en moins de 2 minutes</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-medium">
          <div className={`p-1.5 rounded-lg border ${step >= 1 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            1. Informations
          </div>
          <div className={`p-1.5 rounded-lg border ${step >= 2 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            2. Documents
          </div>
          <div className={`p-1.5 rounded-lg border ${step >= 3 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            3. Badge Gold
          </div>
        </div>

        {/* Step 1: Legal / Business Details */}
        {step === 1 && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium">Raison sociale / Nom commercial</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Atlas Global Cargo SARL"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">N° Registre de Commerce (RCCM / SIREN)</label>
              <input
                type="text"
                value={rccm}
                onChange={(e) => setRccm(e.target.value)}
                placeholder="Ex: RC/MAR-2021-B-89410"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium">Nom du gérant / représentant légal</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Karim Benali"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
            >
              Étape suivante : Justificatifs
            </button>
          </div>
        )}

        {/* Step 2: Instant Doc Scan & Liveness Check */}
        {step === 2 && (
          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Type de pièce d'identité</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIdDocType('passport')}
                  className={`p-2 rounded-xl border text-center font-medium ${idDocType === 'passport' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Passeport biométrique
                </button>
                <button
                  type="button"
                  onClick={() => setIdDocType('id_card')}
                  className={`p-2 rounded-xl border text-center font-medium ${idDocType === 'id_card' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Carte Nationale d'Identité
                </button>
              </div>
            </div>

            {/* Document Upload Simulation Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-white">Scanner votre document ou registre légal</div>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Capture instantanée avec détection automatique anti-fraude. Fichier sécurisé par chiffrement AES-256.
              </p>
              <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
                Document vérifié : CNI_Gérant_Valide.pdf
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleSimulateVerification}
                disabled={isVerifying}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Vérification IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Lancer la vérification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Identité et Entreprise Validées !</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Votre profil bénéficie désormais du <strong>Badge Gold Certifié</strong> visible par tous les commerçants du réseau.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Statut légal :</span>
                <span className="text-emerald-400 font-semibold">Conforme & Actif</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Paiements séquestres :</span>
                <span className="text-emerald-400 font-semibold">Autorisés sans restriction</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Visibilité des annonces :</span>
                <span className="text-emerald-400 font-semibold">Prioritaire dans les recherches</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
            >
              Terminer & Retourner à l'application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
