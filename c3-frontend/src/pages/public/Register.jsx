import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Lock, Mail, User, BookOpen, Hash, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const SECTION_OPTIONS = [
  { value: 'CSE A', label: 'CSE - Section A' },
  { value: 'CSE B', label: 'CSE - Section B' },
  { value: 'Other', label: 'Other Department / Section' },
];

const YEAR_OPTIONS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
];

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [section, setSection] = useState('CSE A');
  const [year, setYear] = useState('2');
  const [registerNumber, setRegisterNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        section,
        year,
        registerNumber,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 sm:p-6 bg-black">
      <div className="w-full max-w-lg">
        <Card className="bg-zinc-950/90 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl p-6 sm:p-8 rounded-3xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center mb-3">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold font-heading text-white">
              C3 Member Sign Up
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Create your account for the internal Campus to Corporate platform
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Disclaimer for junior hiring applicants */}
            <div className="p-3.5 mb-5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Note for Junior Applicants:</strong>
                If you are a junior student looking to get hired/recruited into C3, please submit the{' '}
                <Link to="/apply" className="text-white underline font-semibold">
                  Junior Recruitment Form
                </Link>{' '}
                instead. This sign up is reserved for confirmed C3 members.
              </div>
            </div>

            {isSuccess ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Registration Submitted!</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. Your account has been created and is currently
                  <strong className="text-amber-400"> awaiting admin approval</strong>.
                </p>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 text-left space-y-1">
                  <div>📧 A confirmation email has been dispatched to <strong>{email}</strong>.</div>
                  <div>⏳ Once an admin approves your profile, you will receive an approval email and be able to log in.</div>
                </div>
                <div className="pt-2">
                  <Link to="/login">
                    <Button variant="primary" size="lg" className="w-full bg-white text-black hover:bg-zinc-200">
                      Return to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Input
                  label="Full Name"
                  type="text"
                  placeholder="e.g. Ahamed Nabeel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="College Email Address"
                  type="email"
                  placeholder="yourname@cahcet.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    options={SECTION_OPTIONS}
                    required
                  />

                  <Select
                    label="Academic Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    options={YEAR_OPTIONS}
                    required
                  />
                </div>

                <Input
                  label="Register / Roll Number"
                  type="text"
                  placeholder="e.g. 510422104001"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  leftIcon={<Hash className="w-4 h-4" />}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2 bg-white text-black hover:bg-zinc-200 transition-colors font-semibold"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Submit Registration for Approval
                </Button>
              </form>
            )}

            {!isSuccess && (
              <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-zinc-400">
                Already registered or approved?{' '}
                <Link to="/login" className="text-white hover:underline font-semibold">
                  Sign In here
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
