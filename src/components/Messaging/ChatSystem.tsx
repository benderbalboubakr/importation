import React, { useState } from 'react';
import { 
  Send, 
  ShieldCheck, 
  Paperclip, 
  CheckCheck, 
  ChevronLeft, 
  CreditCard, 
  Sparkles, 
  DollarSign, 
  Image, 
  FileText,
  Phone,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { Conversation, ChatMessage, UserRole, ProductLot } from '../../types';

interface ChatSystemProps {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  currentUserId: string;
  userRole: UserRole;
  activeConversationId: string | null;
  onSelectConversation: (convId: string) => void;
  onSendMessage: (convId: string, text: string, offer?: any) => void;
  onAcceptOfferAndPay: (offer: any, conv: Conversation) => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({
  conversations,
  messages,
  currentUserId,
  userRole,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onAcceptOfferAndPay,
}) => {
  const [inputText, setInputText] = useState('');
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [offerUnits, setOfferUnits] = useState(50);
  const [offerPrice, setOfferPrice] = useState(11.90);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeChatMessages = activeConversationId ? (messages[activeConversationId] || []) : [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    onSendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleSendOffer = () => {
    if (!activeConversationId) return;
    const offer = {
      id: `off_${Date.now()}`,
      lotId: 'lot_tech_01',
      lotTitle: activeConversation?.relatedLotTitle || 'Lot négocié',
      units: offerUnits,
      offeredUnitPrice: offerPrice,
      totalAmount: offerUnits * offerPrice,
      status: 'pending',
    };

    onSendMessage(
      activeConversationId, 
      `Nouvelle proposition de lot négocié : ${offerUnits} pièces à ${offerPrice.toFixed(2)}€/u.`, 
      offer
    );
    setShowMakeOfferModal(false);
  };

  const quickReplies = [
    'Le stock est-il disponible au dépôt pour retrait immédiat ?',
    'Avez-vous les fiches de conformité CE / CPNP ?',
    'Pouvez-vous m\'envoyer une photo du conditionnement scellé ?',
    'Je confirme mon passage au quai cet après-midi.',
  ];

  return (
    <div className="flex-1 w-full flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* If no conversation is open on mobile: Conversation List View */}
      {!activeConversationId ? (
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Messagerie Sécurisée B2B</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h2>
              <div className="text-[11px] text-slate-400">
                Échanges chiffrés & protection séquestre intégrée
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
              Vérifié KYC
            </div>
          </div>

          {/* Conversation List */}
          <div className="p-3 space-y-2">
            {/* Quick Contact Banner */}
            <div 
              onClick={() => onSelectConversation('conv_contact')}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                  📞
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Page Nous Contacter (Support & Commandes Cash)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 font-semibold border border-amber-500/40">
                      En direct
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Vous souhaitez payer en espèces ? Contactez notre équipe ici
                  </div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-amber-400 rotate-180 shrink-0" />
            </div>

            {conversations.map((conv) => {
              const isContact = conv.id === 'conv_contact';
              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99] ${
                    isContact
                      ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.importer.avatar}
                      alt={conv.importer.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    {conv.importer.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white truncate">
                        {conv.importer.companyName}
                      </h3>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {conv.lastMessageTimestamp}
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-400 font-medium truncate mt-0.5">
                      {conv.relatedLotTitle || 'Négociation de lot'}
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-2">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Conversation Detail View */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Active Chat Top Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-3 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => onSelectConversation('')}
                className="p-1 -ml-1 text-slate-400 hover:text-white rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <img
                src={activeConversation?.importer.avatar}
                alt={activeConversation?.importer.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
              />

              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                  <span>{activeConversation?.importer.companyName}</span>
                  {activeConversation?.importer.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{activeConversation?.importer.name} · En ligne</span>
                </div>
              </div>
            </div>

            {/* Quick Action: Propose an offer */}
            <button
              onClick={() => setShowMakeOfferModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Faire une offre</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
            {/* Security Notice */}
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Paiements séquestrés garantis par ImportDirect B2B. Ne payez jamais hors plateforme.</span>
            </div>

            {activeChatMessages.map((msg) => {
              const isMe = msg.senderRole === userRole;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-xs'
                    }`}
                  >
                    <div>{msg.text}</div>

                    {/* Embedded Negotiated Offer Card */}
                    {msg.offer && (
                      <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-slate-100 space-y-2 mt-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                          <span>Offre de lot négociée</span>
                          <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Séquestre actif
                          </span>
                        </div>

                        <div className="text-xs font-bold text-white">
                          {msg.offer.lotTitle}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2 rounded-lg">
                          <div>
                            <span className="text-slate-400">Quantité :</span>
                            <div className="font-semibold text-white">{msg.offer.units} unités</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Prix unitaire :</span>
                            <div className="font-semibold text-emerald-400">{msg.offer.offeredUnitPrice.toFixed(2)} €/u</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                          <span className="text-slate-300">Total à bloquer :</span>
                          <span className="font-bold text-white text-sm">{msg.offer.totalAmount.toFixed(2)} €</span>
                        </div>

                        {/* If user is Retailer, show Accept & Pay button */}
                        {userRole === 'retailer' && (
                          <button
                            onClick={() => onAcceptOfferAndPay(msg.offer, activeConversation!)}
                            className="w-full mt-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Accepter & Payer sous Séquestre</span>
                          </button>
                        )}
                      </div>
                    )}

                    <div
                      className={`text-[9px] flex items-center justify-end gap-1 mt-1 ${
                        isMe ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Suggestions */}
          <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(reply)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                className="p-2 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Joindre un document ou photo"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez votre message sécurisé..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="min-h-[40px] px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Make Offer Modal */}
      {showMakeOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">Négocier une proposition de lot</h4>
              </div>
              <button
                onClick={() => setShowMakeOfferModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Quantité d'unités souhaitée</label>
                <input
                  type="number"
                  min="5"
                  value={offerUnits}
                  onChange={(e) => setOfferUnits(Math.max(1, Number(e.target.value)))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Prix unitaire proposé (€/pièce)</label>
                <input
                  type="number"
                  step="0.10"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Math.max(0.1, Number(e.target.value)))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Total de l'offre séquestrée :</span>
                <span className="text-base font-bold text-emerald-400">
                  {(offerUnits * offerPrice).toFixed(2)} €
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowMakeOfferModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSendOffer}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
              >
                Envoyer l'offre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
