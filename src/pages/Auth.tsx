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
  const navigate = useNavigate();

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
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


  return (
    <BackgroundContainer animationActive={animationActive}>
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl max-w-sm w-full">
        <div className="p-8">
          <LoginHeader animationActive={animationActive} />
          
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
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Contact your administrator for access
          </p>
        </div>
      </Card>
    </BackgroundContainer>
  );
};

export default Auth;