import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ContactSalesModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    // For now, just open mailto with prefilled info
    const mailto = `mailto:hrirlyhr@gmail.com?subject=Sales Inquiry from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message + '\n\nContact: ' + form.email)}`;
    window.location.href = mailto;
    setSubmitted(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-white/10 border border-purple-500/30 rounded-2xl shadow-2xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Contact Sales</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="bg-white/10 border-white/20 text-white placeholder-white/80"
          />
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="bg-white/10 border-white/20 text-white placeholder-white/80"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            rows={4}
            required
            className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/80 text-sm resize-none"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              required
            />
            <label htmlFor="agree" className="text-sm text-gray-200 select-none cursor-pointer">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-purple-300">terms and conditions</a>, consent to receive communications from Hirly, and understand that my information will never be sold.
            </label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!agreed} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-60">Send</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
