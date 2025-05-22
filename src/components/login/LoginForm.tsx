
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  const [showPassword, setShowPassword] = useState(false);
  
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6 p-0">
          <div className={`transition-all duration-500 delay-600 transform ${
            animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <div className="relative">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className="h-10 pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white rounded-md"
                          autoComplete="email"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs mt-1 ml-1" />
                  </FormItem>
                )}
              />
            </div>
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
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="h-10 pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white rounded-md"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? 
                        <EyeOff className="h-5 w-5" /> : 
                        <Eye className="h-5 w-5" />
                      }
                    </button>
                  </div>
                  <FormMessage className="text-xs mt-1 ml-1" />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-1">
              <a className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors" href="#">
                Forgot password?
              </a>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className={`flex flex-col space-y-3 pt-6 p-0 transition-all duration-500 delay-800 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-md shadow transition-all"
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </span>
            )}
          </Button>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Demo accounts: admin@school.edu / admin123
          </p>
        </CardFooter>
      </form>
    </Form>
  );
};
