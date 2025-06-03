
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className={`transition-all duration-500 delay-600 transform ${
            animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="audrey_weimann@anissa.org"
                        className="h-14 pl-12 pr-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-emerald-500 rounded-none focus:ring-0 placeholder:text-gray-400 text-base"
                        autoComplete="email"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs mt-2 ml-1" />
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
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="password"
                        className="h-14 pl-12 pr-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-emerald-500 rounded-none focus:ring-0 placeholder:text-gray-400 text-base"
                        autoComplete="current-password"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs mt-2 ml-1" />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className={`flex flex-col space-y-6 pt-8 transition-all duration-500 delay-800 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl h-14 text-base shadow-lg transition-all"
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <span>Login</span>
            )}
          </Button>
          
          <div className="text-center space-y-6">
            <p className="text-gray-500 text-base">
              or <span className="text-emerald-600 font-medium cursor-pointer hover:underline">Sign Up</span>
            </p>
            
            <p className="text-gray-400 text-sm cursor-pointer hover:text-gray-600">
              forgot password?
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
};
