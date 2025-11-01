'use client';

import React from 'react';

type Step = 'email' | 'otp' | 'reset';

export default function ForgotPassword() {
  const [step, setStep] = React.useState<Step>('email');
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setStep('otp');
      setSuccess('We sent a 6-digit code to your email (dev: code stored on server).');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      setStep('reset');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset');
      setSuccess('Password updated. You can now login.');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const steps: Array<{ key: Step; label: string }> = [
    { key: 'email', label: 'Email' },
    { key: 'otp', label: 'Verify' },
    { key: 'reset', label: 'Reset' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">Forgot Password</h2>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const isActive = step === s.key;
          const isCompleted =
            (step === 'otp' && (s.key === 'email')) ||
            (step === 'reset' && (s.key === 'email' || s.key === 'otp'));
          return (
            <div key={s.key} className="flex items-center flex-1">
              <div
                className={`flex items-center gap-2 ${idx !== steps.length - 1 ? 'pr-2 sm:pr-4' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border
                    ${isCompleted ? 'bg-amber-800 text-white border-amber-800' : isActive ? 'bg-amber-900 text-white border-amber-900' : 'bg-gray-100 text-gray-600 border-gray-300'}`}
                >
                  {idx + 1}
                </div>
                <span className={`text-sm ${isActive || isCompleted ? 'text-amber-900 font-semibold' : 'text-gray-500'}`}>{s.label}</span>
              </div>
              {idx !== steps.length - 1 && (
                <div className={`h-[2px] flex-1 ${isCompleted ? 'bg-amber-800' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      {step === 'email' && (
        <form onSubmit={submitEmail} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input className="w-full border-2 border-stone-400 focus:border-amber-800 focus:ring-2 focus:ring-amber-800 rounded-lg px-4 py-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button disabled={loading} className="w-full bg-amber-900 hover:bg-orange-900 text-white rounded-lg px-4 py-2 font-semibold">{loading ? 'Sending…' : 'Send Code'}</button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={submitOtp} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Enter 6-digit code</label>
          <input className="w-full border-2 border-stone-400 focus:border-amber-800 focus:ring-2 focus:ring-amber-800 rounded-lg px-4 py-2" type="text" required value={code} onChange={(e) => setCode(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep('email')} className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2">Back</button>
            <button disabled={loading} className="flex-1 bg-amber-900 hover:bg-orange-900 text-white rounded-lg px-4 py-2 font-semibold">{loading ? 'Verifying…' : 'Verify'}</button>
          </div>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={submitReset} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input className="w-full border-2 border-stone-400 focus:border-amber-800 focus:ring-2 focus:ring-amber-800 rounded-lg px-4 py-2" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep('otp')} className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2">Back</button>
            <button disabled={loading} className="flex-1 bg-amber-900 hover:bg-orange-900 text-white rounded-lg px-4 py-2 font-semibold">{loading ? 'Updating…' : 'Update Password'}</button>
          </div>
        </form>
      )}
    </div>
  );
}




