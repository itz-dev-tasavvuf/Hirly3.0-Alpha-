import React, { useState } from 'react';
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
        <h2 className="text-2xl font-bold mb-4 text-white">Verify Your Identity On-Chain</h2>
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
      {result && (
        <div className="mt-6 p-4 rounded-lg bg-green-900/70 text-white flex flex-col items-center">
          <CheckCircle className="text-green-400 mb-2" size={40} />
          <div className="font-semibold text-lg">Verified on Algorand!</div>
          <div className="mt-2 text-sm break-all">TxID: {result.txId}</div>
          <a
            href={`https://testnet.peraexplorer.com/tx/${result.txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 underline text-green-300 hover:text-green-200"
          >
            View on Pera Explorer
          </a>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 rounded bg-red-900/70 text-red-200">{error}</div>
      )}
    </div>
  );
}
