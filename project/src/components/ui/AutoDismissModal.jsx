import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mail } from "lucide-react";

export default function AutoDismissModal({ open, onClose, title, message, duration = 2500 }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <Dialog open={open}>
      <DialogContent className="glass-effect border-white/20 text-white max-w-sm flex flex-col items-center py-8">
        <div className="mb-4">
          <Mail className="w-14 h-14 text-purple-400 mx-auto" />
        </div>
        <div className="text-2xl font-bold mb-2 text-center gradient-text">{title}</div>
        <div className="text-center text-white/80 text-base mb-2">{message}</div>
      </DialogContent>
    </Dialog>
  );
}
