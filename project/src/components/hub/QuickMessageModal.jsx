import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const candidateMessages = [
  "I am interested!",
  "Tell me more about this opportunity.",
  "Is this position remote or onsite?",
  "What are the next steps?",
  "Can we schedule a call?",
];

const employerMessages = [
  "Your qualifications are impressive, I would love to set up a meet.",
  "We are looking for someone like you for this role.",
  "Would you be available for a quick chat?",
  "Let's connect to discuss further.",
  "Are you open to new opportunities?",
];

export default function QuickMessageModal({ isOpen, onClose, userType, onSend }) {
  const messages = userType === 'candidate' ? candidateMessages : employerMessages;
  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="glass-effect border-white/20 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text mb-1">Quick Message</DialogTitle>
          <DialogDescription className="text-gray-300 mb-2">
            Choose a message to send to your match
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          {messages.map((msg, idx) => (
            <Button
              key={idx}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-4 py-2 shadow-md hover:from-purple-400 hover:to-blue-400 transition-colors text-base"
              onClick={() => onSend(msg)}
            >
              {msg}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 mt-2">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
