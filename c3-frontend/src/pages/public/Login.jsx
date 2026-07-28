import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#10273D] border border-white/10 shadow-2xl p-8">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center mb-3">
            <Terminal className="w-6 h-6 text-[#38BDF8]" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-[#F8FAFC]">
            Member Login
          </CardTitle>
          <CardDescription className="text-xs text-[#94A3B8]">
            Sign in to access the Campus to Corporate (C3) Portal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-medium text-[#EF4444]">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
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
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#94A3B8]">
            Are you a junior student looking to join C3?{' '}
            <Link to="/apply" className="text-[#38BDF8] hover:underline font-semibold">
              Apply via Junior Recruitment
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
