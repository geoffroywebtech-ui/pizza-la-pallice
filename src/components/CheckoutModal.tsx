
import React, { useEffect, useState } from 'react';
import { X, MapPin, CheckCircle2, Tag, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { CartItem, Promotion } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cart: CartItem[];
  promotions: Promotion[];
  onOrderPlaced: (data: any) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  total, 
  cart,
  promotions,
  onOrderPlaced 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '', notes: '' });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1`);
        const data = await res.json();
        if (data.address) {
          const a = data.address;
          const formattedAddress = [
            a.house_number && a.road ? `${a.house_number}, ${a.road}` : a.road || a.house_number,
            a.city || a.town || a.village || '',
            a.postcode || ''
          ].filter(Boolean).join(', ');
          setFormData(p => ({ ...p, address: formattedAddress || data.display_name }));
        }
      } catch (error) {
        console.error("Erreur de géolocalisation:", error);
      } finally { setIsLocating(false); }
    }, () => setIsLocating(false));
  };

  const applyPromo = () => {
    const promo = promotions.find(p => p.code.toUpperCase() === promoCode.toUpperCase() && p.active);
    if (promo) {
      setAppliedPromo(promo);
    } else {
      alert("Code promo invalide ou expiré");
    }
  };

  const calculateFinalTotal = () => {
    if (!appliedPromo) return total;
    if (appliedPromo.type === 'percentage') {
      return total * (1 - appliedPromo.discount);
    }
    return Math.max(0, total - appliedPromo.discount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderPlaced({ ...formData, appliedPromo: appliedPromo?.code });
    setStep(2);
  };

  const finalTotal = calculateFinalTotal();

  // Délai pour activer la transition d'ouverture
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto transition-all duration-300 pointer-events-none ${isOpen && isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background flouté vert */}
      <div className="absolute inset-0 bg-brand-green/90 backdrop-blur-md pointer-events-auto" onClick={onClose} />
      
      {/* Modal Content */}
      <div 
        className={`bg-white w-full max-w-xl rounded-t-3xl sm:rounded-[3rem] shadow-2xl text-zinc-900 relative my-auto max-h-[90dvh] flex flex-col overflow-hidden pointer-events-auto transition-transform duration-400 ease-out transform ${isOpen && isAnimating ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}
      >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-8 flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border border-zinc-100 bg-white/90 backdrop-blur-md text-zinc-400 hover:bg-brand-yellow hover:text-brand-green hover:shadow-xl transition-all z-[100] active:scale-95"
            >
              <X size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Fermer</span>
            </button>

            <div className="overflow-y-auto p-8 sm:p-12 pt-16 sm:pt-20">
            
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-serif font-bold">Dernière étape</h3>
                  <p className="text-xs text-zinc-400 uppercase font-black tracking-widest">Confirmation de votre commande</p>
                </div>

                {/* Recapitulatif accordéon */}
                <div className="bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100">
                  <button 
                    type="button"
                    onClick={() => setShowSummary(!showSummary)}
                    className="w-full p-4 flex justify-between items-center text-sm font-bold text-zinc-600 hover:bg-zinc-100/50 transition-all"
                  >
                    <span className="flex items-center gap-2">🛒 Résumé ({cart.length} articles)</span>
                    {showSummary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {showSummary && (
                    <div className="p-4 pt-0 space-y-2 max-h-40 overflow-y-auto border-t border-zinc-100/50">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-medium py-1">
                          <div className="flex flex-col">
                            <span>{item.quantity}x {item.name} ({item.size})</span>
                            {item.customName && <span className="text-[9px] text-brand-green font-black uppercase tracking-widest">Pour: {item.customName}</span>}
                          </div>
                          <span>{(item.price * item.quantity).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <input required placeholder="Nom Prénom" className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-brand-green outline-none font-bold text-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <input required type="tel" placeholder="Téléphone (ex: 06...)" className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-brand-green outline-none font-bold text-sm" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                    <input type="email" placeholder="Email (optionnel — pour suivre votre commande)" className="w-full p-4 pl-12 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-brand-green outline-none font-bold text-sm" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="relative">
                    <input required placeholder="Adresse complète..." className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 pr-24 focus:border-brand-green outline-none font-bold text-sm" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    <button type="button" onClick={handleGeolocation} disabled={isLocating} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-green font-black text-[9px] uppercase tracking-widest flex items-center gap-1 border border-brand-green/20 px-2 py-1 rounded-lg hover:bg-brand-green hover:text-white transition-all">
                      <MapPin size={12} /> {isLocating ? "..." : "Ma position"}
                    </button>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                    <input 
                      placeholder="Code Promo" 
                      className="w-full p-4 pl-12 bg-zinc-50 rounded-xl border border-zinc-100 outline-none font-bold text-xs uppercase tracking-widest" 
                      value={promoCode} 
                      onChange={e => setPromoCode(e.target.value)} 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={applyPromo}
                    className="bg-zinc-900 text-white px-6 rounded-xl text-xs font-black uppercase hover:bg-brand-green transition-all"
                  >
                    Appliquer
                  </button>
                </div>

                <div className="p-6 bg-brand-green text-white rounded-3xl text-center space-y-1 relative overflow-hidden shadow-xl">
                  {appliedPromo && (
                    <div className="absolute top-2 right-4 text-[9px] font-black uppercase bg-brand-yellow text-brand-green px-2 py-1 rounded-full animate-bounce">
                      Promo {appliedPromo.code} !
                    </div>
                  )}
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total à payer</p>
                  <p className="text-4xl font-serif font-bold">{finalTotal.toFixed(2)}€</p>
                  {appliedPromo && <p className="text-[10px] line-through opacity-40 italic">{total.toFixed(2)}€ avant remise</p>}
                </div>
                
                <button type="submit" className="w-full bg-brand-green text-white py-6 rounded-2xl font-black text-xl hover:bg-brand-yellow hover:text-brand-green transition-all shadow-2xl scale-100 active:scale-95">
                  Valider ma Commande
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-8 py-10">
                <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center text-white shadow-2xl">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-4xl font-serif font-bold">C'est parti !</h3>
                  <p className="text-zinc-500 mt-2 font-medium">Merci {formData.name}, votre commande est en préparation.</p>
                </div>
                <div className="bg-zinc-50 p-6 rounded-3xl w-full border border-dashed border-zinc-200 space-y-3">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Petit rappel</p>
                  <p className="text-sm font-bold text-zinc-700">Le paiement se fait uniquement en espèces lors de la livraison.</p>
                  {formData.email && (
                    <div className="flex items-start gap-3 bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4 mt-2">
                      <Mail size={16} className="text-brand-green shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-brand-green uppercase tracking-widest mb-1">Lien de suivi envoyé !</p>
                        <p className="text-xs text-zinc-500 font-medium">Consultez <span className="font-black text-zinc-700">{formData.email}</span> pour suivre votre commande en temps réel.</p>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={onClose} className="bg-brand-green text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:bg-brand-yellow hover:text-brand-green">Retour à l'accueil</button>
              </div>
            )}
            </div>
        </div>
    </div>
  );
};

export default CheckoutModal;
