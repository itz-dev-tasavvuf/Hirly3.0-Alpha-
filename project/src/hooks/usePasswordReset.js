import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Request a password reset email
   * @param {string} email - User's email address
   * @param {string} redirectTo - URL to redirect to after password reset
   */
  const requestPasswordReset = async (email, redirectTo = `${window.location.origin}/update-password`) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (resetError) throw resetError;
      
      setSuccess(true);
      return { success: true };
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email');
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user's password
   * @param {string} newPassword - The new password
   */
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      return { success: true };
    } catch (err) {
      console.error('Update password error:', err);
      setError(err.message || 'Failed to update password');
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    requestPasswordReset,
    updatePassword,
    loading,
    error,
    success,
    resetState: () => {
      setError(null);
      setSuccess(false);
    },
  };
}

export default usePasswordReset;
