
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { X, Navigation, MapPin, Clock } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Order } from '../types';
import { supabase } from '../lib/supabase';

// Fix Leaflet default marker icons (broken with Vite/webpack)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const delivererIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const clientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Recenter map when deliverer moves
function MapUpdater({ delivererPos }: { delivererPos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (delivererPos) map.setView(delivererPos, map.getZoom(), { animate: true });
  }, [delivererPos]);
  return null;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface Props {
  order: Order;
  onClose: () => void;
}

const DeliveryTrackerModal: React.FC<Props> = ({ order, onClose }) => {
  const [delivererPos, setDelivererPos] = useState<[number, number] | null>(
    order.deliverer_location
      ? [order.deliverer_location.lat, order.deliverer_location.lng]
      : null
  );
  const [clientPos, setClientPos] = useState<[number, number] | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(
    order.deliverer_location?.updated_at ?? null
  );
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Geocode client address once
  useEffect(() => {
    const geocode = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(order.customer.address)}&format=json&limit=1`
        );
        const data = await res.json();
        if (data[0]) setClientPos([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } catch (e) {
        console.error('Geocoding error:', e);
      }
    };
    geocode();
  }, [order.customer.address]);

  // Supabase realtime subscription for deliverer position
  useEffect(() => {
    const channel = supabase
      .channel(`delivery-track-${order.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` },
        (payload) => {
          const loc = payload.new.deliverer_location;
          if (loc?.lat && loc?.lng) {
            setDelivererPos([loc.lat, loc.lng]);
            setLastUpdate(loc.updated_at);
          }
        }
      )
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [order.id]);

  const distance =
    delivererPos && clientPos
      ? haversineKm(delivererPos[0], delivererPos[1], clientPos[0], clientPos[1])
      : null;

  const center: [number, number] = delivererPos ?? clientPos ?? [46.1591, -1.1524]; // La Rochelle fallback

  const timeSinceUpdate = lastUpdate ? Math.round((Date.now() - lastUpdate) / 1000) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex flex-col">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative mt-auto w-full h-[92dvh] bg-white rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Navigation size={20} className="text-brand-green" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <p className="font-black text-zinc-900 text-sm">Suivi en direct</p>
                <p className="text-[10px] text-zinc-400 font-medium">
                  Commande #{order.id.slice(0, 8)} · {order.customer.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Info bar */}
          <div className="flex items-center gap-4 px-6 py-3 bg-brand-green/5 border-b border-brand-green/10 shrink-0">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-brand-yellow" />
              <span className="text-xs font-bold text-zinc-700 truncate max-w-[180px]">{order.customer.address}</span>
            </div>
            {distance !== null && (
              <div className="ml-auto flex items-center gap-2 bg-brand-green text-white px-3 py-1 rounded-full">
                <span className="text-[10px] font-black">~{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}</span>
              </div>
            )}
            {timeSinceUpdate !== null && (
              <div className="flex items-center gap-1 text-zinc-400">
                <Clock size={10} />
                <span className="text-[9px] font-bold">MAJ il y a {timeSinceUpdate}s</span>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            {!delivererPos && !clientPos ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-zinc-500">Localisation en cours...</p>
                </div>
              </div>
            ) : (
              <MapContainer
                center={center}
                zoom={14}
                className="h-full w-full"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {delivererPos && (
                  <Marker position={delivererPos} icon={delivererIcon}>
                    <Popup>🛵 Votre livreur</Popup>
                  </Marker>
                )}
                {clientPos && (
                  <Marker position={clientPos} icon={clientIcon}>
                    <Popup>📍 {order.customer.address}</Popup>
                  </Marker>
                )}
                {delivererPos && clientPos && (
                  <Polyline
                    positions={[delivererPos, clientPos]}
                    pathOptions={{ color: '#16a34a', weight: 3, dashArray: '8, 8', opacity: 0.7 }}
                  />
                )}
                {delivererPos && <MapUpdater delivererPos={delivererPos} />}
              </MapContainer>
            )}

            {/* Legend */}
            <div className="absolute left-4 bg-white rounded-xl shadow-lg p-3 space-y-2 z-[400]" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-green" />
                <span className="text-[10px] font-black text-zinc-600">Livreur</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-yellow" />
                <span className="text-[10px] font-black text-zinc-600">Destination</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeliveryTrackerModal;
