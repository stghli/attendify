import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle user profile creation/updates after auth events
        if (event === 'SIGNED_IN' && session?.user) {
          // Create or update profile in background
          setTimeout(async () => {
            try {
              const userData = session.user.user_metadata;
              
              // First, create/update the profile
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                  user_id: session.user.id,
                  name: userData.name || session.user.email?.split('@')[0] || 'User',
                  email: session.user.email || '',
                  role: userData.role || 'student'
                }, {
                  onConflict: 'user_id'
                });

              if (profileError) {
                console.error('Profile creation error:', profileError);
                return;
              }

              // Generate QR code
              const qrCode = `${userData.role || 'student'}-${session.user.id}-qr`;

              // Create role-specific record
              if (userData.role === 'student') {
                const { error: studentError } = await supabase
                  .from('students')
                  .upsert({
                    user_id: session.user.id,
                    name: userData.name || session.user.email?.split('@')[0] || 'Student',
                    gender: userData.gender || null,
                    age: userData.age || null,
                    address: userData.address || null,
                    parent_phone: userData.parent_phone || null,
                    class: userData.class || null,
                    qr_code: qrCode
                  }, {
                    onConflict: 'user_id'
                  });

                if (studentError) {
                  console.error('Student record creation error:', studentError);
                }
              } else if (userData.role === 'teacher') {
                const { error: teacherError } = await supabase
                  .from('teachers')
                  .upsert({
                    user_id: session.user.id,
                    name: userData.name || session.user.email?.split('@')[0] || 'Teacher',
                    email: session.user.email || '',
                    gender: userData.gender || null,
                    contact: userData.contact || null,
                    assigned_class: userData.assigned_class || null,
                    qr_code: qrCode
                  }, {
                    onConflict: 'user_id'
                  });

                if (teacherError) {
                  console.error('Teacher record creation error:', teacherError);
                }
              }
            } catch (error) {
              console.error('Error setting up user profile:', error);
            }
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
        console.error('Sign out error:', error);
      } else {
        toast.success('Signed out successfully');
        navigate('/auth');
      }
    } catch (error) {
      toast.error('Error signing out');
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
