import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface PasswordGateProps {
  onSuccess: () => void;
  onClose: () => void;
}

const ADMIN_PASSWORD = 'nath2025';

const PasswordGate: React.FC<PasswordGateProps> = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha de administrador"
          className="w-full bg-[#111] border border-border rounded-lg text-fg font-body text-sm p-3 outline-none focus:border-accent transition-colors mb-4 text-center"
          autoFocus
        />
        <button type="submit" className="w-full bg-fg text-bg py-3.5 rounded-lg font-display text-[11px] uppercase tracking-widest hover:bg-accent transition-all">
          Entrar
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
