import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Heart } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className={`transition-all duration-500 delay-600 transform ${
            animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        className="h-10 pl-10 pr-4 bg-gray-50/50 border border-gray-200 focus:border-emerald-400 focus:bg-white rounded-lg focus:ring-2 focus:ring-emerald-100 placeholder:text-gray-400 text-sm transition-all"
                        autoComplete="email"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs mt-1 ml-1" />
                </FormItem>
              )}
            />
          </div>
          
          <div className={`transition-all duration-500 delay-700 transform ${
            animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="password"
                        className="h-10 pl-10 pr-4 bg-gray-50/50 border border-gray-200 focus:border-emerald-400 focus:bg-white rounded-lg focus:ring-2 focus:ring-emerald-100 placeholder:text-gray-400 text-sm transition-all"
                        autoComplete="current-password"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs mt-1 ml-1" />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className={`flex flex-col space-y-3 pt-4 transition-all duration-500 delay-800 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          <Button 
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg h-10 text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-3 w-3 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Sign In</span>
                <Heart className="ml-2 h-3 w-3" />
              </div>
            )}
          </Button>
          
          <div className="text-center space-y-3">
            <p className="text-gray-500 text-xs">
              Don't have an account? <span className="text-emerald-600 font-medium cursor-pointer hover:underline">Sign Up</span>
            </p>
            
            <p className="text-gray-400 text-xs cursor-pointer hover:text-emerald-600 transition-colors">
              Forgot password?
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
};
