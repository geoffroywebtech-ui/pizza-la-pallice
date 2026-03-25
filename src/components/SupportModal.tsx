
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Camera, Mic, MicOff, Paperclip, Trash2, Image,
  FileAudio, File, CheckCircle, Headphones, MessageSquare, Pizza,
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Attachment {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'audio' | 'file';
}

const DEVELOPER_EMAIL = 'geoffroy.webtech@gmail.com';
const DEVELOPER_WHATSAPP = '33695911384';

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sent, setSent] = useState(false);
  const [sendMode, setSendMode] = useState<'whatsapp' | 'email' | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setMessage('');
      setAttachments([]);
      setSent(false);
      setSendMode(null);
      setRecordingTime(0);
    }
  }, [isOpen]);

  // ── Photo / capture d'écran ──
  const captureScreen = () => {
    // Ouvre directement le sélecteur photo/fichier (fonctionne sur tous les appareils)
    cameraInputRef.current?.click();
  };

  // ── Enregistrement audio ──
  const getSupportedMimeType = () => {
    const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', ''];
    for (const type of types) {
      if (type === '' || MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || 'audio/webm';
        const ext = type.includes('mp4') ? 'mp4' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : 'webm';
        const audioBlob = new Blob(audioChunksRef.current, { type });
        const file = new File([audioBlob], `audio-${Date.now()}.${ext}`, { type });
        addAttachment(file, 'audio');
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      alert('Impossible d\'accéder au micro. Vérifiez les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  // ── Gestion des pièces jointes ──
  const addAttachment = (file: File, type: Attachment['type']) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const preview = type === 'image' ? URL.createObjectURL(file) : undefined;
    setAttachments((prev) => [...prev, { id, file, preview, type }]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att?.preview) URL.revokeObjectURL(att.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'file';
      addAttachment(file, type);
    });
    e.target.value = '';
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => addAttachment(f, 'image'));
    e.target.value = '';
  };

  // ── Envoi ──
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const hasContent = message.trim().length > 0 || attachments.length > 0;

  const sendViaWhatsApp = () => {
    const text = `[Support Pizza La Pallice]\n\n${message}\n\n${
      attachments.length > 0 ? `📎 ${attachments.length} pièce(s) jointe(s) — envoyez-les dans la conversation après ce message.` : ''
    }`;
    window.open(`https://wa.me/${DEVELOPER_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');

    // Si fichiers attachés, les télécharger pour que l'utilisateur puisse les envoyer
    if (attachments.length > 0) {
      attachments.forEach((att) => {
        const url = URL.createObjectURL(att.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = att.file.name;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
    setSent(true);
  };

  const sendViaEmail = () => {
    // Télécharger les fichiers d'abord pour que l'utilisateur puisse les joindre
    if (attachments.length > 0) {
      attachments.forEach((att) => {
        const url = URL.createObjectURL(att.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = att.file.name;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const subject = encodeURIComponent('[Support] Pizza La Pallice — Demande de modification');
    const body = encodeURIComponent(
      `${message}\n\n---\n${
        attachments.length > 0
          ? `${attachments.length} fichier(s) téléchargé(s) sur votre appareil — joignez-les à cet email.`
          : ''
      }\nEnvoyé depuis le Dashboard Admin — Pizza La Pallice`
    );
    // location.href évite le blocage popup (contrairement à window.open)
    window.location.href = `mailto:${DEVELOPER_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const sendViaShare = async () => {
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: 'Support Pizza La Pallice',
          text: message,
        };
        if (attachments.length > 0 && navigator.canShare?.({ files: attachments.map((a) => a.file) })) {
          shareData.files = attachments.map((a) => a.file);
        }
        await navigator.share(shareData);
        setSent(true);
      } catch {
        // User cancelled share
      }
    }
  };

  const AttachmentIcon = ({ type }: { type: Attachment['type'] }) =>
    type === 'image' ? <Image size={14} /> : type === 'audio' ? <FileAudio size={14} /> : <File size={14} />;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-lg max-h-[92dvh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-zinc-900 p-6 pb-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Headphones size={20} className="text-brand-yellow" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Support Technique</span>
                  </div>
                  <h2 className="text-xl font-serif font-black">Demande de modification</h2>
                  <p className="text-sm text-zinc-400 mt-1">Envoyez texte, capture d'écran ou audio</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              {sent ? (
                /* ── Confirmation ── */
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-brand-green" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-800 mb-2">Message envoyé !</h3>
                  <p className="text-sm text-zinc-500 max-w-xs">
                    Votre demande a été transmise. Vous recevrez une réponse dans les plus brefs délais.
                  </p>
                  {attachments.length > 0 && (
                    <p className="text-xs text-zinc-400 mt-3">
                      Les fichiers joints ont été téléchargés — pensez à les joindre à votre message.
                    </p>
                  )}
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-3 bg-brand-green text-white rounded-2xl font-bold text-sm"
                  >
                    Fermer
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* ── Zone de texte ── */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
                      Décrivez votre demande
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ex : Ajouter un bouton pour imprimer les tickets, changer la couleur du menu, corriger un bug sur..."
                      rows={4}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-brand-green resize-none transition-colors"
                    />
                  </div>

                  {/* ── Boutons d'action ── */}
                  <div className="flex flex-wrap gap-2">
                    {/* Photo / capture */}
                    <button
                      onClick={captureScreen}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <Camera size={16} />
                      Photo / Screenshot
                    </button>

                    {/* Enregistrement audio */}
                    {isRecording ? (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors animate-pulse"
                      >
                        <MicOff size={16} />
                        Arrêter ({formatRecTime(recordingTime)})
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors"
                      >
                        <Mic size={16} />
                        Enregistrer audio
                      </button>
                    )}

                    {/* Pièce jointe */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-50 text-zinc-600 text-xs font-bold border border-zinc-200 hover:bg-zinc-100 transition-colors"
                    >
                      <Paperclip size={16} />
                      Fichier
                    </button>
                  </div>

                  {/* Inputs cachés */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,audio/*,video/*,.pdf,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCameraChange}
                    className="hidden"
                  />

                  {/* ── Pièces jointes ── */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                        Pièces jointes ({attachments.length})
                      </span>
                      <div className="space-y-2">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100"
                          >
                            {att.preview ? (
                              <img
                                src={att.preview}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-zinc-200 flex items-center justify-center flex-shrink-0">
                                <AttachmentIcon type={att.type} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-700 truncate">{att.file.name}</p>
                              <p className="text-xs text-zinc-400">{formatSize(att.file.size)}</p>
                            </div>
                            <button
                              onClick={() => removeAttachment(att.id)}
                              className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Boutons d'envoi ── */}
                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                      Envoyer via
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={sendViaWhatsApp}
                        disabled={!hasContent}
                        className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-[#25D366] text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-lg shadow-[#25D366]/20"
                      >
                        <MessageSquare size={18} />
                        WhatsApp
                      </button>
                      <button
                        onClick={sendViaEmail}
                        disabled={!hasContent}
                        className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-brand-green text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-lg shadow-brand-green/20"
                      >
                        <Send size={18} />
                        Email
                      </button>
                    </div>
                    {typeof navigator !== 'undefined' && navigator.share && (
                      <button
                        onClick={sendViaShare}
                        disabled={!hasContent}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-zinc-100 text-zinc-700 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition-all"
                      >
                        <Paperclip size={16} />
                        Partager via une autre app...
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;
