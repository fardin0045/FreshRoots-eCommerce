// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import axios from 'axios';
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';

// const Signup = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   //Value newar jonne form theke
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const API_URL = import.meta.env.VITE_API_URL;
//     try { 
//         setLoading(true)
//         const res = await axios.post(`${API_URL}/api/users/register`,formData,{
//             headers:{
//                 "Content-Type":"application/json"
//             }
//         })
//         if(res.data.success){
//             navigate('/verify')
//             toast.success(res.data.message)
//         }
//     }catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message)
//     }finally{
//         setLoading(false)
//     }
//   }; 

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-green-50">
//       <Card className="w-full max-w-sm rounded-xl shadow-2xl">
//         <CardHeader>
//           <CardTitle>Create your account</CardTitle>
//           <CardDescription>
//             Enter details below to create your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-3">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="firstName">First Name</Label>
//                 <Input
//                   id="firstName"
//                   name="firstName"
//                   type="text"
//                   placeholder="John"
//                   required
//                   // data newar jonne
//                   value={formData.firstName}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="lastName">last Name</Label>
//                 <Input
//                   id="lastName"
//                   name="lastName"
//                   type="text"
//                   placeholder="Doe"
//                   required
//                   // data newar jonne
//                   value={formData.lastName}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 required
//                 // data newar jonne
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Password</Label>
//               </div>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   name="password"
//                   placeholder="Create a password"
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   // data newar jonne
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex-col gap-2">
//           <Button
//             onClick={submitHandler}
//             type="submit"
//             className="w-full hover:bg-green-600 rounded"
//           >
//            {loading?<><Loader2 className='h-4 w-4 animate-spin mr-2'/>Please wait</>:'Sign up'}
//           </Button>
//           <p className="text-gray-600">
//             Already Have an Account?{' '}
//             <Link
//               to={'/login'}
//               className="hover:underline cursor-pointer text-green-500"
//             >
//               Sign in
//             </Link>{' '}
//           </p>
//           {/* <Button variant="outline" className="w-full">
//             Login with Google
//           </Button> will add this letter */}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default Signup;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Leaf, Check, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// ─── Password strength checker ───────────────────────────────────────────────
const getStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { checks, passed };
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const { checks, passed } = getStrength(password);

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= passed ? strengthColor[passed] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Strength:{' '}
        <span
          className={`font-medium ${
            passed <= 1 ? 'text-red-500' : passed <= 2 ? 'text-orange-500' : passed <= 3 ? 'text-yellow-600' : 'text-green-600'
          }`}
        >
          {strengthLabel[passed]}
        </span>
      </p>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {[
          [checks.length, '8+ characters'],
          [checks.uppercase, 'Uppercase letter'],
          [checks.lowercase, 'Lowercase letter'],
          [checks.number, 'Number'],
          [checks.special, 'Special character'],
        ].map(([ok, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            {ok ? (
              <Check size={11} className="text-green-500 shrink-0" />
            ) : (
              <X size={11} className="text-gray-300 shrink-0" />
            )}
            <span className={`text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Field component ─────────────────────────────────────────────────────────
const Field = ({ label, id, type = 'text', placeholder, value, onChange, required = true, children }) => (
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
        required={required}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
      {children}
    </div>
  </div>
);

// ─── Success screen ──────────────────────────────────────────────────────────
const SuccessScreen = ({ email }) => (
  <div className="flex w-full max-w-sm flex-col items-center text-center">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
      We sent a verification link to{' '}
      <span className="font-semibold text-green-600">{email}</span>.<br />
      Click the link to activate your account.
    </p>
    <div className="mt-6 w-full rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
      <p className="text-xs text-gray-400">
        Didn't receive it? Check your spam folder or{' '}
        <Link to="/login" className="text-green-600 hover:underline">
          go back to sign in
        </Link>{' '}
        to resend.
      </p>
    </div>
    <Link
      to="/login"
      className="mt-6 flex w-full items-center justify-center rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
    >
      Back to Sign In
    </Link>
  </div>
);

// ─── Main Signup Page ─────────────────────────────────────────────────────────
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { passed } = getStrength(formData.password);
    if (passed < 2) {
      return toast.error('Please choose a stronger password');
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/users/register`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setSubmitted(true); // show success screen instead of navigating away
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-12 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">FreshRoots</span>
        </div>

        {/* Steps */}
        <div>
          <p className="mb-8 text-sm font-medium uppercase tracking-widest text-green-200">
            How it works
          </p>
          <div className="flex flex-col gap-7">
            {[
              ['01', 'Create your account', 'Sign up in under a minute — no card needed.'],
              ['02', 'Browse fresh produce', 'Explore hundreds of local, seasonal items.'],
              ['03', 'Get it delivered', 'Same-day delivery to your door across Dhaka.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="flex gap-4">
                <span className="mt-0.5 text-xs font-bold text-green-300 w-5 shrink-0">{num}</span>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="mt-0.5 text-xs text-green-200/80">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-3">
            {['🔒 Secure checkout', '🌿 100% organic', '🚚 Fast delivery'].map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-green-100 backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
          <p className="text-sm text-green-50 leading-relaxed">
            "Signing up took less than a minute. Now I get fresh vegetables every morning — straight from farms I trust."
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              SK
            </div>
            <div>
              <p className="text-xs font-semibold">Sadman Khan</p>
              <p className="text-xs text-green-300">Dhanmondi, Dhaka</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-gray-50 px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="text-base font-bold text-green-700">FreshRoots</span>
        </div>

        {submitted ? (
          <SuccessScreen email={formData.email} />
        ) : (
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Join thousands of happy customers across Bangladesh.
              </p>
            </div>

            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First name"
                  id="firstName"
                  placeholder="Rahim"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Field
                  label="Last name"
                  id="lastName"
                  placeholder="Uddin"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

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
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
              </div>

              {/* Terms note */}
              <p className="text-xs text-gray-400 leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="#" className="text-green-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Creating account…</>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;