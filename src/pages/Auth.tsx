import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BackgroundContainer } from '@/components/login/BackgroundContainer';
import { LoginHeader } from '@/components/login/LoginHeader';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const navigate = useNavigate();

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: '',
    gender: '',
    contact: '',
    age: '',
    address: '',
    parentPhone: '',
    class: '',
    assignedClass: ''
  });

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!signUpForm.role) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/app/dashboard`,
          data: {
            name: signUpForm.name,
            role: signUpForm.role,
            gender: signUpForm.gender,
            contact: signUpForm.contact,
            age: signUpForm.age ? parseInt(signUpForm.age) : null,
            address: signUpForm.address,
            parent_phone: signUpForm.parentPhone,
            class: signUpForm.class,
            assigned_class: signUpForm.assignedClass
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user && !data.session) {
        toast.success('Please check your email for verification link');
      } else if (data.session) {
        toast.success('Account created successfully!');
        navigate('/app/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl max-w-md w-full">
        <div className="p-8">
          <LoginHeader animationActive={animationActive} />
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
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
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={signUpForm.name}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={signUpForm.role} onValueChange={(value) => setSignUpForm(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="scanner">Scanner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                {/* Conditional fields based on role */}
                {signUpForm.role === 'student' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={signUpForm.age}
                          onChange={(e) => setSignUpForm(prev => ({ ...prev, age: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Input
                          id="class"
                          value={signUpForm.class}
                          onChange={(e) => setSignUpForm(prev => ({ ...prev, class: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={signUpForm.address}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Parent Phone</Label>
                      <Input
                        id="parentPhone"
                        value={signUpForm.parentPhone}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                
                {signUpForm.role === 'teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="assignedClass">Assigned Class</Label>
                    <Input
                      id="assignedClass"
                      value={signUpForm.assignedClass}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, assignedClass: e.target.value }))}
                    />
                  </div>
                )}
                
                {(signUpForm.role === 'teacher' || signUpForm.role === 'student') && (
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={signUpForm.gender} onValueChange={(value) => setSignUpForm(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {signUpForm.role === 'teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Input
                      id="contact"
                      value={signUpForm.contact}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, contact: e.target.value }))}
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </BackgroundContainer>
  );
};

export default Auth;