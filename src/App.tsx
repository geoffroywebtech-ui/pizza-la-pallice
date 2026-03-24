
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ShoppingBag } from 'lucide-react';
import { MenuItem, CartItem, Order } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import IngredientsSection from './components/IngredientsSection';
import DistributorSection from './components/DistributorSection';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import RestaurantDashboard from './components/RestaurantDashboard';
import CustomerHistoryModal from './components/CustomerHistoryModal';
import DeliveryTrackerModal from './components/DeliveryTrackerModal';
import GuideModal from './components/GuideModal';
import SupportModal from './components/SupportModal';
import { Promotion } from './types';
import { supabase } from './lib/supabase';
import { MENU_ITEMS } from './data/menu';

export default function App() {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const [promotions, setPromotions] = useState<Promotion[]>([
    { id: '1', code: 'PALLICE10', description: '10% sur votre première commande', discount: 0.1, active: true, type: 'percentage' },
    { id: '2', code: 'PIZZA20', description: '5€ de réduction sur les pizzas larges', discount: 5, active: true, type: 'fixed' }
  ]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);


  // Charger les commandes initiales depuis Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        const formattedOrders: Order[] = data.map(d => ({
          id: d.id,
          customer: d.customer,
          items: d.items,
          total: d.total,
          status: d.status,
          timestamp: new Date(d.created_at).getTime(),
          deliverer_location: d.deliverer_location ?? null
        }));
        setOrders(formattedOrders);
      }
    };
    
    fetchOrders();

    // Écouter les changements en temps réel 
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrderRow = payload.new;
          const newOrder: Order = {
            id: newOrderRow.id,
            customer: newOrderRow.customer,
            items: newOrderRow.items,
            total: newOrderRow.total,
            status: newOrderRow.status,
            timestamp: new Date(newOrderRow.created_at).getTime(),
            deliverer_location: null
          };
          
          setOrders((prev) => {
            // Éviter les doublons si l'event arrive en même temps que notre state local
            if (prev.find(o => o.id === newOrder.id)) return prev;
            return [newOrder, ...prev];
          });
          
          // Notification système
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
             new Notification('Nouvelle commande !', {
               body: `${newOrder.customer.name} vient de commander (${newOrder.total.toFixed(2)}€)`,
               icon: '/pizza-icon.png'
             });
          }

          // Petit bruit si on est sur la vue admin
          if (document.hidden === false) {
             try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play();
             } catch (e) { console.log("Audio play blocked"); }
          }

        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          setOrders((prev) => prev.map(o =>
            o.id === payload.new.id
              ? { ...o, status: payload.new.status, deliverer_location: payload.new.deliverer_location ?? null }
              : o
          ));
        }
      )
      .subscribe();

    const fetchStock = async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('*');
      
      if (data && !error) {
        setMenuItems(prev => prev.map(item => {
          const remote = data.find(d => d.id === item.id);
          return remote ? { ...item, isAvailable: remote.is_available } : { ...item, isAvailable: true };
        }));
      }
    };
    
    fetchStock();

    // Écouter les changements de stock
    const stockChannel = supabase
      .channel('stock-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stock' },
        (payload) => {
          const updated = payload.new as any;
          setMenuItems(prev => prev.map(item => 
            item.id === updated.id ? { ...item, isAvailable: updated.is_available } : item
          ));
        }
      )
      .subscribe();

    // Demander la permission pour les notifications (non disponible sur iOS Safari hors PWA)
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Auth state — magic link
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setCurrentUserEmail(session.user.email);
        setIsHistoryOpen(true);
      }
    });

    // ?track= URL param — ouvrir le tracker directement
    const trackId = new URLSearchParams(window.location.search).get('track');
    if (trackId) setTrackingOrderId(trackId);

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(stockChannel);
      authSub.unsubscribe();
    };


  }, []);

  useEffect(() => {
    (window as any).toggleAdmin = () => setIsAdminAuthOpen(true);
  }, []);

  const addToCart = (item: MenuItem, size: string, customName?: string) => {
    const price = item.prices[size as keyof typeof item.prices] || item.prices.t1 || 0;
    // L'ID unique inclut maintenant le nom personnalisé pour différencier les articles
    const cartItemId = `${item.id}-${size}-${customName || ''}`;
    
    setCart(prev => {
      const existing = prev.find(i => `${i.id}-${i.size}-${i.customName || ''}` === cartItemId);
      if (existing) {
        return prev.map(i => `${i.id}-${i.size}-${i.customName || ''}` === cartItemId 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...prev, { 
        id: item.id, 
        name: item.name, 
        price, 
        size: size as any, 
        quantity: 1,
        customName 
      }];
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    // cartId est maintenant au format id-size-customName
    setCart(prev => prev.map(i => {
      const currentId = `${i.id}-${i.size}-${i.customName || ''}`;
      return currentId === cartId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async (formData: any) => {
    // On ferme l'interface client immédiatement
    setCart([]);
    setIsCheckoutOpen(false);

    // On insère dans Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer: formData,
          items: cart,
          total: cartTotal,
          status: 'new'
        }
      ])
      .select();

    if (error) {
      console.error("Erreur lors de l'insertion de la commande:", error);
      alert("Une erreur est survenue lors de l'envoi de la commande. Veuillez réessayer ou nous appeler.");
      return;
    }

    if (data && data[0]) {
      const newOrderRow = data[0];
      const newOrder: Order = {
        id: newOrderRow.id,
        customer: newOrderRow.customer,
        items: newOrderRow.items,
        total: newOrderRow.total,
        status: newOrderRow.status,
        timestamp: new Date(newOrderRow.created_at).getTime()
      };
      // Mise à jour optimiste locale seulement si l'event real-time est lent
      setOrders(prev => {
        if (prev.find(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
    }

    // Magic link si email fourni
    if (formData.email) {
      await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { emailRedirectTo: window.location.origin + '/pizza-la-pallice/' }
      });
    }

    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    } catch (e) { console.log("Audio play blocked"); }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // Maj optimiste
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    // Maj distante
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
      
    if (error) {
       console.error("Erreur de MAJ de statut:", error);
    }
  };

  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    // Maj locale optimiste
    setMenuItems(prev => prev.map(item => item.id === itemId ? { ...item, isAvailable } : item));
    
    // Maj distante (upsert dans une table 'stock' car MENU_ITEMS est statique en code)
    const { error } = await supabase
      .from('stock')
      .upsert({ id: itemId, is_available: isAvailable });
      
    if (error) console.error("Erreur MAJ Stock:", error);
  };

  if (isAdminView) return (
    <>
      <RestaurantDashboard
        orders={orders}
        promotions={promotions}
        menuItems={menuItems}
        onUpdateStatus={updateOrderStatus}
        onUpdatePromotions={setPromotions}
        onToggleAvailability={toggleItemAvailability}
        onExit={() => setIsAdminView(false)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  );

  const handleAdminAuth = () => {
    if (adminCode.toLowerCase() === 'pizzza') {
      setIsAdminView(true);
      setIsAdminAuthOpen(false);
      setAdminCode('');
    } else {
      alert("Code incorrect");
      setAdminCode('');
    }
  };


  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-yellow selection:text-brand-green">
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLogoClick={() => setIsAdminAuthOpen(true)}
      />

      
      {cart.length > 0 && !isCartOpen && (
        <motion.button 
          key={cart.length + cartTotal} // Trigger animation on changes
          initial={{ scale: 0.8, y: 20 }} 
          animate={{ scale: [1, 1.4, 1], y: 0 }} 
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 15,
            duration: 0.4
          }}
          onClick={() => setIsCartOpen(true)} 
          className="fixed z-[150] bg-brand-green text-white p-5 rounded-full shadow-[0_20px_60px_rgba(34,197,94,0.4)] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all border-4 border-white lg:bottom-12 lg:right-12"
          style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))', right: 'max(1.5rem, env(safe-area-inset-right))' }}
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <motion.span 
              key={cart.length}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-brand-yellow text-brand-green text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-green"
            >
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </motion.span>
          </div>
          <span className="font-serif font-bold text-xl ml-2">{cartTotal.toFixed(2)}€</span>
        </motion.button>
      )}

      <Hero promotions={promotions} />
      <MenuSection 
        onAddToCart={addToCart} 
        onUpdateQuantity={updateQuantity} 
        cart={cart} 
        menuItems={menuItems}
      />

      <IngredientsSection />
      <DistributorSection />
      <InfoSection />
      <Footer />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onUpdateQuantity={updateQuantity} 
        onFinalize={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} 
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        total={cartTotal} 
        cart={cart}
        promotions={promotions}
        onOrderPlaced={placeOrder} 
      />

      <CustomerHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
        promotions={promotions}
        currentUserEmail={currentUserEmail}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {trackingOrderId && (() => {
        const order = orders.find(o => o.id === trackingOrderId);
        return order ? (
          <DeliveryTrackerModal order={order} onClose={() => setTrackingOrderId(null)} />
        ) : null;
      })()}

      {/* Modal Authentification Admin */}
      <AnimatePresence>
        {isAdminAuthOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminAuthOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
             <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm p-8 rounded-[2.5rem] border border-zinc-200 shadow-2xl"
            >
              <h3 className="text-2xl font-serif font-black text-brand-green mb-6 text-center">Accès <span className="text-brand-yellow drop-shadow-sm">Cuisine</span></h3>
              <div className="space-y-4">
                <input 
                  autoFocus
                  type="password"
                  placeholder="Code d'accès"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-brand-green transition-all shadow-inner"
                />
                <button 
                  onClick={handleAdminAuth}
                  className="w-full bg-brand-green text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-lg shadow-brand-green/20"
                >
                  Entrer
                </button>
                <button 
                  onClick={() => setIsAdminAuthOpen(false)}
                  className="w-full text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] pt-2 hover:text-zinc-600 transition-colors"
                >
                  Annuler l'accès
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
