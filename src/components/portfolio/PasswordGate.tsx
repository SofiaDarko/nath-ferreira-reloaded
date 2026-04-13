import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordGateProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Credenciais inválidas.');
    } else {
      onSuccess();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] bg-bg flex items-center justify-center">
      <form onSubmit={handleSubmit} className="text-center max-w-[320px] w-full px-5">
        <h3 className="font-display text-[11px] tracking-[0.2em] uppercase text-accent mb-7">— Acesso Restrito —</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-[#111] border border-border rounded-lg text-fg font-body text-sm p-3 outline-none focus:border-accent transition-colors mb-4 text-center"
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full bg-[#111] border border-border rounded-lg text-fg font-body text-sm p-3 outline-none focus:border-accent transition-colors mb-4 text-center"
        />
        <button type="submit" disabled={loading} className="w-full bg-fg text-bg py-3.5 rounded-lg font-display text-[11px] uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50">
          {loading ? '...' : 'Entrar'}
        </button>
        <div className="mt-4 text-accent2 text-xs h-4 font-body">{error}</div>
        <button type="button" onClick={onClose} className="mt-4 text-[10px] text-muted-foreground hover:text-fg uppercase tracking-widest">
          Cancelar
        </button>
      </form>
    </motion.div>
  );
};

export default PasswordGate;
