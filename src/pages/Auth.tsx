import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BackgroundContainer } from '@/components/login/BackgroundContainer';
import { LoginHeader } from '@/components/login/LoginHeader';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as 'admin' | 'teacher' | 'student'
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/app/dashboard');
      }
    };
    checkUser();
    
    // Trigger animation
    setTimeout(() => setAnimationActive(true), 100);
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInForm.email,
        password: signInForm.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the verification link');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.session) {
        toast.success('Signed in successfully!');
        navigate('/app/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: signUpForm.name,
            role: signUpForm.role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success('Account created successfully!');
        setIsSignUp(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer animationActive={animationActive}>
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl max-w-sm w-full">
        <div className="p-8">
          <LoginHeader animationActive={animationActive} />
          
          <div className="mb-6 flex gap-2">
            <Button 
              variant={!isSignUp ? "default" : "outline"} 
              onClick={() => setIsSignUp(false)}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button 
              variant={isSignUp ? "default" : "outline"} 
              onClick={() => setIsSignUp(true)}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>
          
          {!isSignUp ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInForm.password}
                  onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signUpForm.name}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-role">Role</Label>
                <select
                  id="signup-role"
                  value={signUpForm.role}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'teacher' | 'student' }))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </BackgroundContainer>
  );
};

export default Auth;