'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setStep, setEmail, reset } from '@/redux/features/auth/authStepSlice';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  step <= currentStep
                    ? 'bg-amber-700 border-amber-600 text-white'
                    : 'bg-transparent border-white/40 text-white/60'
                }`}
              >
                {step < currentStep ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  step <= currentStep ? 'text-white' : 'text-white/60'
                }`}
              >
                {step === 1 ? 'Email' : step === 2 ? 'OTP' : 'Password'}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  step < currentStep ? 'bg-amber-700' : 'bg-white/20'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const { step: currentStep, email: storedEmail } = useAppSelector((state) => state.authStep);
  
  const [email, setEmailState] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storedEmail) {
      setEmailState(storedEmail);
    }
  }, [storedEmail]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/auth/forgot/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      dispatch(setEmail(email));
      dispatch(setStep(2));
      setMessage('OTP has been sent to your email address.');
      setIsError(false);
    } catch (error: any) {
      setMessage(error.message || 'Failed to send OTP. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/auth/forgot/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail || email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }
      dispatch(setStep(3));
      setMessage('OTP verified successfully.');
      setIsError(false);
    } catch (error: any) {
      setMessage(error.message || 'Invalid OTP. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsError(true);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail || email, code: otp, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      setMessage('Password reset successfully! Redirecting to login...');
      setIsError(false);
      setTimeout(() => {
        dispatch(reset());
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to reset password. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/authBg.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-900/70 to-stone-950/85" />
      <div className="relative max-w-md w-full">
        <div className="bg-white/10 px-10 py-12 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">Wooden Art</h1>
            </Link>
            <div className="text-white/90 mt-1 font-semibold">Forgot Password</div>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {message && (
            <div className={`px-4 py-3 rounded-xl mb-6 shadow-sm flex items-center space-x-2 border ${
              isError ? 'bg-red-600/20 border-red-500/40 text-red-200' : 'bg-green-600/20 border-green-500/40 text-green-200'
            }`}>
              <svg className={`w-5 h-5 ${
                isError ? 'text-red-300' : 'text-green-300'
              }`} fill="currentColor" viewBox="0 0 20 20">
                {!isError ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                )}
              </svg>
              <span className="font-medium">{message}</span>
            </div>
          )}

          {currentStep === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmailState(e.target.value)}
                    required
                    placeholder=" "
                    className="peer block w-full bg-transparent text-white placeholder-transparent border-0 border-b border-white/40 focus:border-amber-700 focus:outline-none focus:ring-0 pl-10 pr-3 py-3"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <label htmlFor="email" className="absolute left-10 top-1/2 -translate-y-1/2 text-stone-200 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:-webkit-autofill]:top-0 peer-[&:-webkit-autofill]:text-xs">
                    Email Address
                  </label>
                </div>
                <p className="text-xs text-white/80">
                  We&apos;ll send you an OTP to reset your password.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-amber-800 via-amber-900 to-orange-900 hover:from-amber-900 hover:via-stone-900 hover:to-orange-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send OTP
                  </span>
                )}
              </button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder=" "
                    maxLength={6}
                    className="peer block w-full bg-transparent text-white placeholder-transparent border-0 border-b border-white/40 focus:border-amber-700 focus:outline-none focus:ring-0 pl-10 pr-3 py-3 text-center text-2xl tracking-widest"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <label htmlFor="otp" className="absolute left-10 top-1/2 -translate-y-1/2 text-stone-200 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs">
                    Enter OTP
                  </label>
                </div>
                <p className="text-xs text-white/80">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-amber-800 via-amber-900 to-orange-900 hover:from-amber-900 hover:via-stone-900 hover:to-orange-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                onClick={() => dispatch(setStep(1))}
                className="w-full text-center text-sm text-amber-300 hover:text-amber-200 transition-colors"
              >
                Back to Email
              </button>
            </form>
          )}

          {currentStep === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder=" "
                    className="peer block w-full bg-transparent text-white placeholder-transparent border-0 border-b border-white/40 focus:border-amber-700 focus:outline-none focus:ring-0 pl-10 pr-3 py-3"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <label htmlFor="password" className="absolute left-10 top-1/2 -translate-y-1/2 text-stone-200 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs">
                    New Password
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder=" "
                    className="peer block w-full bg-transparent text-white placeholder-transparent border-0 border-b border-white/40 focus:border-amber-700 focus:outline-none focus:ring-0 pl-10 pr-3 py-3"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <label htmlFor="confirmPassword" className="absolute left-10 top-1/2 -translate-y-1/2 text-stone-200 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs">
                    Confirm Password
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-amber-800 via-amber-900 to-orange-900 hover:from-amber-900 hover:via-stone-900 hover:to-orange-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <button
                type="button"
                onClick={() => dispatch(setStep(2))}
                className="w-full text-center text-sm text-amber-300 hover:text-amber-200 transition-colors"
              >
                Back to OTP
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/80">Remember your password?</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-200">
              <Link
                href="/login"
                className="font-semibold text-amber-300 hover:text-amber-200 transition-colors duration-200 hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
