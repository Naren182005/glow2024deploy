import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const Auth = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState<number>(0);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lockedUntil = localStorage.getItem('loginLockedUntil');
    if (lockedUntil && Number(lockedUntil) > Date.now()) {
      setIsLocked(true);
      setLockTimer(Math.ceil((Number(lockedUntil) - Date.now()) / 1000));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('loginLockedUntil');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleLoginAttempt = () => {
    setAttempts((prev) => {
      const newAttempts = prev + 1;
      if (newAttempts >= 5) {
        const lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
        localStorage.setItem('loginLockedUntil', lockUntil.toString());
        setIsLocked(true);
        setLockTimer(5 * 60); // 5 minutes in seconds
      }
      return newAttempts;
    });
  };

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const validateEmail = async (email: string) => {
    setIsValidating(true);
    setValidationStatus(null);
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationStatus('error');
      setIsValidating(false);
      return false;
    }

    try {
      // Simulate API call to check if email exists
      await new Promise(resolve => setTimeout(resolve, 600));
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', email)
        .single();

      setValidationStatus(data ? 'success' : 'error');
      setIsValidating(false);
      return !!data;
    } catch (error) {
      setValidationStatus('error');
      setIsValidating(false);
      return false;
    }
  };

  const onSignInSubmit = async (values: SignInFormValues) => {
    if (isLocked) {
      setFormError(`Account is locked. Please try again in ${lockTimer} seconds.`);
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      handleLoginAttempt();
      const { error } = await signIn(values.email, values.password);
      if (error) {
        setFormError(error.message || 'Failed to sign in. Please try again.');
      } else {
        setAttempts(0); // Reset attempts on successful login
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    setFormError(null);

    try {
      if (!validatePassword(values.password)) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.');
      }
      const { error } = await signUp(values.email, values.password, values.fullName);
      if (error) {
        setFormError(error.message || 'Failed to sign up. Please try again.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFormType = () => {
    setIsSignUp(!isSignUp);
    setFormError(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </button>
        
        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <motion.h1 
              className="text-2xl font-bold text-white text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isSignUp ? 'Create an Account' : 'Sign In to Your Account'}
            </motion.h1>
            
            {(formError || isLocked) && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mb-4 text-white text-sm">
                {isLocked ? `Account is locked. Please try again in ${lockTimer} seconds.` : formError}
              </div>
            )}
            {isSignUp && (
              <div className="text-white/60 text-sm space-y-1 mb-4">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character (!@#$%^&*)</li>
                </ul>
              </div>
            )}
            
            {isSignUp ? (
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your full name"
                            className="bg-black border-white/20 text-white"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="bg-black border-white/20 text-white"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="bg-black border-white/20 text-white"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading || isLocked}
                    className="w-full py-3 bg-[#F2A83B] text-black rounded-md font-medium hover:bg-[#F2A83B]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </form>
              </Form>
            ) : (
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="email"
                              placeholder="your@email.com"
                              className={`bg-black border-white/20 text-white pr-10 ${validationStatus === 'success' ? 'border-green-500' : validationStatus === 'error' ? 'border-red-500' : ''}`}
                              disabled={isLoading}
                              onChange={(e) => {
                                field.onChange(e);
                                validateEmail(e.target.value);
                              }}
                            />
                            <AnimatePresence>
                              {isValidating && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                                </motion.div>
                              )}
                              {validationStatus === 'success' && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </motion.div>
                              )}
                              {validationStatus === 'error' && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  <XCircle className="w-4 h-4 text-red-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="bg-black border-white/20 text-white"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading || isValidating || validationStatus === 'error'}
                      className="w-full py-3 bg-[#F2A83B] text-black rounded-md font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center hover:bg-[#F2A83B]/90"
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <Loader2 size={18} className="animate-spin mr-2" />
                            <span>Signing In...</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="signin"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Sign In
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                </form>
              </Form>
            )}
            
            <p className="text-white/60 text-center mt-6">
              {isSignUp 
                ? 'Already have an account?' 
                : 'Don\'t have an account?'}
              <button
                type="button"
                onClick={toggleFormType}
                className="text-[#F2A83B] ml-2 hover:underline"
                disabled={isLoading}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
