
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, UserRound, Lock, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { BackgroundAnimations } from "@/components/BackgroundAnimations";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Trigger animation after component mount
    setTimeout(() => setAnimationActive(true), 100);
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    if (!data.email || !data.password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Animation Layer */}
      <BackgroundAnimations />
      
      <div 
        className={`max-w-md w-full transition-all duration-700 ease-out transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        } z-10`}
      >
        <div 
          className={`flex justify-center mb-6 transition-all duration-1000 delay-300 transform ${
            animationActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-full p-5 shadow-xl backdrop-blur-sm bg-opacity-90 animate-pulse">
            <QrCode className="h-14 w-14 text-white" />
          </div>
        </div>
        
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600"></div>
          <CardHeader className="space-y-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className={`text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-1000 delay-500 transform ${
                animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}>
                QR Attendance
              </CardTitle>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <CardDescription className={`text-center text-base transition-all duration-1000 delay-700 transform ${
              animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 pt-1">
                <div className={`transition-all duration-700 delay-900 transform ${
                  animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-primary">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Email"
                              className="bg-white/90 backdrop-blur-sm focus:bg-white pl-10 transition-all duration-300 h-12 rounded-xl border-gray-200 focus:border-primary shadow-sm"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 ml-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className={`transition-all duration-700 delay-1100 transform ${
                  animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-primary">
                      <Lock className="h-5 w-5" />
                    </div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Password"
                              className="bg-white/90 backdrop-blur-sm focus:bg-white pl-10 transition-all duration-300 h-12 rounded-xl border-gray-200 focus:border-primary shadow-sm"
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 ml-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <a className="text-xs text-primary font-medium hover:text-primary/80 transition-colors" href="#">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                {showOtp && (
                  <div className={`transition-all duration-700 transform ${
                    animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500">Enter verification code</p>
                      <InputOTP maxLength={6} className="justify-center gap-2">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="rounded-xl h-12 w-12 border-gray-200 bg-white/90 shadow-sm" />
                          <InputOTPSlot index={1} className="rounded-xl h-12 w-12 border-gray-200 bg-white/90 shadow-sm" />
                          <InputOTPSlot index={2} className="rounded-xl h-12 w-12 border-gray-200 bg-white/90 shadow-sm" />
                          <InputOTPSlot index={3} className="rounded-xl h-12 w-12 border-gray-200 bg-white/90 shadow-sm" />
                          <InputOTPSlot index={4} className="rounded-xl h-12 w-12 border-gray-200 bg-white/90 shadow-sm" />
                          <InputOTPSlot index={5} className="rounded-xl h-12 w-12 border-gray-200 bg-white/90 shadow-sm" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className={`flex flex-col space-y-3 pt-1 transition-all duration-700 delay-1300 transform ${
                animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}>
                <Button 
                  className="w-full font-medium text-base group h-12 rounded-xl shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 bg-gradient-to-r from-primary to-blue-600" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <div className={`mt-5 text-center text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md transition-all duration-500 delay-1500 transform ${
          animationActive ? "opacity-100" : "opacity-0"
        }`}>
          <p className="font-medium">
            For demo: admin@school.edu / admin123 or jsmith@school.edu / teacher123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
