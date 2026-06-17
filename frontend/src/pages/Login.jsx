
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Leaf, ArrowLeft, X } from 'lucide-react';
import { setUser } from '@/redux/userSlice';

const API_URL = import.meta.env.VITE_API_URL;

// ─── Small reusable input ────────────────────────────────────────────────────
const Field = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  children,
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
      {children}
    </div>
  </div>
);

// ─── Backdrop modal wrapper ──────────────────────────────────────────────────
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label="Close"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  </div>
);

// ─── Forgot Password Modal ───────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState('email'); // email → otp → password → done
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!email) return toast.error('Enter your email');
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/users/forgot-password`, {
        email,
      });
      if (res.data.success) {
        toast.success('OTP sent to your email');
        setStep('otp');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) return toast.error('Enter the OTP');
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/users/verify-otp/${email}`, {
        otp,
      });
      if (res.data.success) {
        toast.success('OTP verified');
        setStep('password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!newPassword || !confirmPassword) return toast.error('Fill all fields');
    if (newPassword !== confirmPassword)
      return toast.error('Passwords do not match');
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/users/change-password/${email}`,
        {
          newPassword,
          confirmPassword,
        },
      );
      if (res.data.success) {
        toast.success('Password changed successfully');
        setStep('done');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      {/* Step: email */}
      {step === 'email' && (
        <>
          <div className="mb-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Leaf size={20} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Forgot password?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              We'll send a 6-digit OTP to your email.
            </p>
          </div>
          <Field
            label="Email address"
            id="fp-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendOTP}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending…
              </>
            ) : (
              'Send OTP'
            )}
          </button>
        </>
      )}

      {/* Step: otp */}
      {step === 'otp' && (
        <>
          <button
            onClick={() => setStep('email')}
            className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Enter OTP</h2>
            <p className="mt-1 text-sm text-gray-500">
              We sent a code to{' '}
              <span className="font-medium text-green-600">{email}</span>
            </p>
          </div>
          <Field
            label="6-digit OTP"
            id="fp-otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={verifyOTP}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying…
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
          <button
            onClick={sendOTP}
            disabled={loading}
            className="mt-3 w-full text-center text-sm text-green-600 hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        </>
      )}

      {/* Step: new password */}
      {step === 'password' && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              New password
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a strong password.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Field
              label="New password"
              id="fp-new"
              type={showNew ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            >
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>
            <Field
              label="Confirm password"
              id="fp-confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            >
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>
          </div>
          <button
            onClick={changePassword}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving…
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </>
      )}

      {/* Step: done */}
      {step === 'done' && (
        <div className="py-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Password changed!
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            You can now sign in with your new password.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </Modal>
  );
};

// ─── Re-Verify Modal ─────────────────────────────────────────────────────────
const ReVerifyModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    if (!email) return toast.error('Enter your email');
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/users/re-verify`, { email });
      if (res.data.success) {
        setSent(true);
        toast.success('Verification email sent!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      {!sent ? (
        <>
          <div className="mb-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <svg
                className="h-5 w-5 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Resend verification
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email and we'll send a new verification link.
            </p>
          </div>
          <Field
            label="Email address"
            id="rv-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleResend}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending…
              </>
            ) : (
              'Resend Email'
            )}
          </button>
        </>
      ) : (
        <div className="py-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Email sent!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Check your inbox at{' '}
            <span className="font-medium text-green-600">{email}</span>
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
};

// ─── Main Login Page ─────────────────────────────────────────────────────────
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | 'forgot' | 'reverify'
  const [formData, setFormData] = useState({ email: '', password: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/users/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        localStorage.setItem('accessToken', res.data.accessToken);
        toast.success(res.data.message);
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      // Prompt re-verify if account not verified
      if (msg.toLowerCase().includes('verify')) {
        setTimeout(() => setModal('reverify'), 800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Modals ── */}
      {modal === 'forgot' && (
        <ForgotPasswordModal onClose={() => setModal(null)} />
      )}
      {modal === 'reverify' && <ReVerifyModal onClose={() => setModal(null)} />}

      {/* ── Page layout ── */}
      <div className="flex min-h-screen">
        {/* Left decorative panel — hidden on mobile */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FreshRoots</span>
          </div>

          {/* Hero text */}
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Farm fresh food,
              <br />
              <span className="text-green-200">delivered to you.</span>
            </h1>
            <p className="mt-4 max-w-xs text-green-100/80 text-sm leading-relaxed">
              Fresh Groceries Delivered to Your Doorstep in Under 2 Hours
            </p>

            {/* Stats row */}
            <div className="mt-10 flex gap-8">
              {[
                ['500+', 'Local Farms'],
                ['50k+', 'Happy Customers'],
                ['99%', 'Fresh Guarantee'],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold">{num}</p>
                  <p className="text-xs text-green-200 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
            <p className="text-sm text-green-50 leading-relaxed">
              "FreshRoots changed how our family eats. Everything arrives so
              fresh — it's like having a farm at your doorstep."
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                RM
              </div>
              <div>
                <p className="text-xs font-semibold">Fardin Onik</p>
                <p className="text-xs text-green-300">Uttara, Dhaka</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: login form */}
        <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-gray-50 px-6 py-12">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-green-700">
              FreshRoots
            </span>
          </div>

          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Sign in to your account to continue
              </p>
             
              
            </div>

            <form onSubmit={submitHandler} className="flex flex-col gap-5">
              {/* Email */}
              <Field
                label="Email address"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setModal('forgot')}
                    className="text-xs text-green-600 hover:text-green-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Re-verify nudge */}
            <button
              onClick={() => setModal('reverify')}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-600 transition hover:border-green-300 hover:text-green-600"
            >
              Didn't receive a verification email?
            </button>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              New to FreshRoots?{' '}
              <Link
                to="/signup"
                className="font-medium text-green-600 hover:text-green-700 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
