import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, Lock, Mail, ArrowRight, Clock, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsPending(false);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 403 || err.response?.data?.isPendingApproval) {
        setIsPending(true);
        setError(err.response?.data?.message || 'Your account is pending admin approval.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 sm:p-6 bg-black">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-950/90 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl p-6 sm:p-8 rounded-3xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center mb-3">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold font-heading text-white">
              C3 Member Login
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Sign in to access your internal Campus to Corporate dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isPending ? (
              <div className="p-4 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-200 mb-0.5">Account Pending Approval</div>
                  <div>Your registration has been received. A C3 Admin will verify your profile and you will be notified via email once approved.</div>
                </div>
              </div>
            ) : error ? (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="College Email Address"
                type="email"
                placeholder="member@c3club.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 bg-white text-black hover:bg-zinc-200 transition-colors font-semibold"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 space-y-3 text-center text-xs text-zinc-400">
              <div className="flex items-center justify-between gap-2">
                <span>Are you a C3 Club Member?</span>
                <Link to="/register" className="text-white hover:underline font-semibold flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  Sign Up
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-zinc-400 text-left flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Applying for Junior Recruitment?</strong>
                  Junior students applying for new hiring must submit the{' '}
                  <Link to="/apply" className="text-white underline font-semibold">
                    Junior Application Form
                  </Link>{' '}
                  instead of creating an account.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

