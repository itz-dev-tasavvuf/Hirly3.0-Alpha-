import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import algorandLogo from '@/assets/algorand_full_logo_white.png';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/algorand/verify'; // Adjust if deployed

export default function VerifyCard() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: '',
    company: '',
    extra: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Verification failed');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-8 shadow-lg max-w-md mx-auto mt-8 h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto invisible-scrollbar" style={{ maxHeight: '60vh' }}>
        <div className="flex flex-col items-center mb-6">
          <span className="text-2xl font-bold text-white mb-2">Verify with</span>
          <img src={algorandLogo} alt="Algorand Logo" className="h-10 w-auto" style={{ filter: 'drop-shadow(0 0 2px #fff)' }} />
        </div>
        <form className="space-y-4" onSubmit={handleVerify}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role (e.g. Software Engineer)"
            className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company (optional)"
            className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <textarea
            name="extra"
            value={form.extra}
            onChange={handleChange}
            placeholder="Extra Info (optional)"
            className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Me On-Chain'}
          </Button>
        </form>
      </div>
      {result && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-lg w-full mx-4 rounded-2xl p-8 flex flex-col items-center shadow-2xl border border-white/10"
               style={{ background: 'rgba(30,32,45,0.55)', backdropFilter: 'blur(16px)' }}>
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold focus:outline-none"
              onClick={() => setResult(null)}
              aria-label="Close"
            >
              ×
            </button>
            <CheckCircle className="mb-4" size={56} color="#22c55e" />
            <div className="text-3xl font-bold text-white mb-2 text-center">Transaction Verified!</div>
            <div className="text-base text-gray-200 mb-4 text-center">Your verification has been recorded on Algorand TestNet.</div>
            <div className="bg-black/30 rounded px-4 py-2 text-xs text-gray-300 break-all mb-4 text-center">
              TxID: {result.txId}
            </div>
            <a
              href={`https://testnet.explorer.perawallet.app/tx/${result.txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline text-blue-200 hover:text-blue-100 mb-6 text-center"
            >
              View on Pera Explorer
            </a>
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:from-purple-400 hover:to-blue-400 transition-colors"
              onClick={() => setResult(null)}
            >
              Got it!
            </button>
          </div>
        </div>,
        document.body
      )}
      {error && (
        <div className="mt-4 p-3 rounded bg-red-900/70 text-red-200">{error}</div>
      )}
    </div>
  );
}
