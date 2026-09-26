import React, { useState } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { MobileBottomNav, TabKey } from './components/Navigation/MobileBottomNav';
import { ProductExplorer } from './components/Catalog/ProductExplorer';
import { SupplierLocator } from './components/Map/SupplierLocator';
import { ChatSystem } from './components/Messaging/ChatSystem';
import { OrderTrackingView } from './components/Orders/OrderTrackingView';
import { SellerAnalytics } from './components/Dashboard/SellerAnalytics';
import { KycVerificationModal } from './components/KYC/KycVerificationModal';
import { MobilePaymentModal } from './components/Payment/MobilePaymentModal';
import { PremiumModal } from './components/Subscription/PremiumModal';

import { 
  PRODUCT_LOTS, 
  SUPPLIERS_LIST, 
  INITIAL_ORDERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES,
  INITIAL_KYC
} from './data/mockData';

import { 
  UserRole, 
  ProductLot, 
  Order, 
  Conversation, 
  ChatMessage, 
  KYCProfile 
} from './types';

export default function App() {
  // Global App State
  const [userRole, setUserRole] = useState<UserRole>('retailer');
  const [activeTab, setActiveTab] = useState<TabKey>('explorer');

  // Business Data State
  const [lots] = useState<ProductLot[]>(PRODUCT_LOTS);
  const [suppliers] = useState(SUPPLIERS_LIST);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedSupplierForMap, setSelectedSupplierForMap] = useState<string | null>(null);

  // KYC & Subscription State
  const [kyc, setKyc] = useState<KYCProfile>(INITIAL_KYC);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLotForPayment, setSelectedLotForPayment] = useState<ProductLot | null>(null);
  const [selectedOfferForPayment, setSelectedOfferForPayment] = useState<any | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Helper: Open Chat with a specific supplier
  const handleOpenChatWithSupplier = (supplierId: string, lotTitle?: string) => {
    let existingConv = conversations.find((c) => c.importer.id === supplierId);

    if (!existingConv) {
      const targetSupplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];
      const newConvId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: newConvId,
        importer: targetSupplier,
        retailerName: 'Votre Boutique Connectée',
        lastMessage: lotTitle ? `Demande de devis pour : ${lotTitle}` : 'Bonjour, je souhaite des informations sur vos lots.',
        lastMessageTimestamp: 'À l’instant',
        unreadCount: 0,
        relatedLotTitle: lotTitle,
      };

      setConversations([newConv, ...conversations]);
      setMessages({
        ...messages,
        [newConvId]: [
          {
            id: `msg_${Date.now()}`,
            conversationId: newConvId,
            senderId: 'ret_1',
            senderName: 'Vous',
            senderRole: 'retailer',
            text: `Bonjour, je suis intéressé par votre lot ${lotTitle || 'en stock'}. Quel est votre délai pour un enlèvement rapide ?`,
            timestamp: 'À l’instant',
            read: true,
          }
        ]
      });
      existingConv = newConv;
    }

    setActiveConversationId(existingConv.id);
    setActiveTab('messages');
  };

  // Helper: Open Map focusing on a specific supplier
  const handleOpenMapToSupplier = (supplierId: string) => {
    setSelectedSupplierForMap(supplierId);
    setActiveTab('locator');
  };

  // Helper: Send Chat Message
  const handleSendMessage = (convId: string, text: string, offer?: any) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: userRole === 'retailer' ? 'ret_1' : 'sup_1',
      senderName: userRole === 'retailer' ? 'Vous' : 'Karim Benali',
      senderRole: userRole,
      text,
      timestamp: 'À l’instant',
      read: true,
      offer,
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    // Update conversation snippet
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, lastMessage: text, lastMessageTimestamp: 'À l’instant' } : c))
    );

    // Auto-reply simulation if sent by retailer
    if (userRole === 'retailer' && !offer) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          conversationId: convId,
          senderId: 'sup_1',
          senderName: 'Karim Benali (Atlas Cargo)',
          senderRole: 'importer',
          text: 'Bien reçu ! Le lot est disponible à notre hub logistique. Vous pouvez initier le séquestre ou passer au quai d’enlèvement.',
          timestamp: 'À l’instant',
          read: true,
        };

        setMessages((prev) => ({
          ...prev,
          [convId]: [...(prev[convId] || []), replyMsg],
        }));
      }, 1400);
    }
  };

  // Helper: Initiate Order / Payment
  const handleInitiateOrder = (lot: ProductLot) => {
    setSelectedLotForPayment(lot);
    setSelectedOfferForPayment(null);
    setIsPaymentModalOpen(true);
  };

  // Helper: Accept Offer in Chat & Pay
  const handleAcceptOfferAndPay = (offer: any, conv: Conversation) => {
    setSelectedOfferForPayment({
      ...offer,
      importer: conv.importer,
    });
    setSelectedLotForPayment(null);
    setIsPaymentModalOpen(true);
  };

  // Helper: Complete Payment Callback
  const handlePaymentSuccess = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setActiveTab('orders');
  };

  // Helper: Contact us for Cash payment
  const handleContactForCash = (details: {
    lotTitle: string;
    units: number;
    amount: number;
    supplierId?: string;
  }) => {
    setIsPaymentModalOpen(false);

    const contactConvId = 'conv_contact';
    const dzdEquiv = Math.round(details.amount * 240);
    const messageText = `Bonjour l'équipe ImportDirect ! Je souhaite passer commande pour le lot "${details.lotTitle}" (${details.units} pièces, montant : ${details.amount.toFixed(2)} € ≈ ${dzdEquiv.toLocaleString('fr-FR')} DZD). N'ayant pas de carte bancaire CIB ou Edahabia, je souhaite régler en ESPÈCES (Cash) lors du retrait au dépôt ou à la livraison. Pouvez-vous me valider la commande manuellement et me communiquer le point de retrait ?`;

    handleSendMessage(contactConvId, messageText);
    setActiveConversationId(contactConvId);
    setActiveTab('messages');
  };

  // Helper: Advance Order Tracking Step (Demo feature)
  const handleAdvanceOrderStep = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const currentIdx = ord.timeline.findIndex((t) => t.current);
        if (currentIdx === -1 || currentIdx >= ord.timeline.length - 1) {
          // Reset to first step for infinite demo testing
          const resetTimeline = ord.timeline.map((step, idx) => ({
            ...step,
            completed: idx === 0,
            current: idx === 1,
          }));
          return {
            ...ord,
            orderStatus: 'customs_processing',
            timeline: resetTimeline,
          };
        }

        const newTimeline = ord.timeline.map((step, idx) => {
          if (idx < currentIdx + 1) return { ...step, completed: true, current: false };
          if (idx === currentIdx + 1) return { ...step, completed: false, current: true };
          return { ...step, completed: false, current: false };
        });

        return {
          ...ord,
          timeline: newTimeline,
        };
      })
    );
  };

  // Helper: Release Escrow Funds to Importer
  const handleReleaseEscrowFunds = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const completedTimeline = ord.timeline.map((t) => ({
          ...t,
          completed: true,
          current: false,
        }));

        return {
          ...ord,
          paymentStatus: 'released_to_seller',
          orderStatus: 'delivered',
          timeline: completedTimeline,
        };
      })
    );
  };

  return (
    <DeviceFrame
      userRole={userRole}
      onToggleRole={(role) => setUserRole(role)}
      onOpenPremium={() => setIsPremiumModalOpen(true)}
    >
      {/* Active Tab Screen */}
      <div className="flex-1 w-full flex flex-col overflow-hidden relative">
        {activeTab === 'explorer' && (
          <ProductExplorer
            lots={lots}
            onSelectLot={(lot) => handleInitiateOrder(lot)}
            onInitiateOrder={(lot) => handleInitiateOrder(lot)}
            onOpenChatWithSupplier={handleOpenChatWithSupplier}
            onOpenMapToSupplier={handleOpenMapToSupplier}
          />
        )}

        {activeTab === 'locator' && (
          <SupplierLocator
            suppliers={suppliers}
            lots={lots}
            selectedSupplierId={selectedSupplierForMap}
            onOpenChatWithSupplier={handleOpenChatWithSupplier}
            onSelectLot={(lot) => handleInitiateOrder(lot)}
          />
        )}

        {activeTab === 'messages' && (
          <ChatSystem
            conversations={conversations}
            messages={messages}
            currentUserId={userRole === 'retailer' ? 'ret_1' : 'sup_1'}
            userRole={userRole}
            activeConversationId={activeConversationId}
            onSelectConversation={(convId) => setActiveConversationId(convId || null)}
            onSendMessage={handleSendMessage}
            onAcceptOfferAndPay={handleAcceptOfferAndPay}
          />
        )}

        {activeTab === 'orders' && (
          <OrderTrackingView
            orders={orders}
            userRole={userRole}
            onAdvanceOrderStep={handleAdvanceOrderStep}
            onReleaseEscrowFunds={handleReleaseEscrowFunds}
          />
        )}

        {activeTab === 'dashboard' && (
          <SellerAnalytics
            userRole={userRole}
            kyc={kyc}
            onOpenKycModal={() => setIsKycModalOpen(true)}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'messages') {
            // Keep state clean
          }
        }}
        userRole={userRole}
        unreadCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
        activeOrdersCount={orders.filter((o) => o.paymentStatus === 'held_in_escrow').length}
      />

      {/* Modals */}
      <KycVerificationModal
        kyc={kyc}
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        onSaveKYC={(updatedKyc) => setKyc(updatedKyc)}
      />

      <MobilePaymentModal
        lot={selectedLotForPayment}
        offer={selectedOfferForPayment}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedLotForPayment(null);
          setSelectedOfferForPayment(null);
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onContactForCash={handleContactForCash}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        isPremiumUser={isPremiumUser}
        onUpgradePremium={() => setIsPremiumUser(true)}
      />
    </DeviceFrame>
  );
}
