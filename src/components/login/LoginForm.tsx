
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRound, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CardContent, CardFooter } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  animationActive: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ animationActive }) => {
  const [isLoading, setIsLoading] = useState(false);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-2 px-6 pb-4">
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
        
        <CardFooter className={`flex flex-col space-y-3 pt-0 pb-6 px-6 transition-all duration-700 delay-1300 transform ${
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
  );
};
