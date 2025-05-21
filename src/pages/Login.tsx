
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, UserRound, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after component mount
    setTimeout(() => setAnimationActive(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div 
        className={`max-w-md w-full transition-all duration-700 ease-out transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <div 
          className={`flex justify-center mb-8 transition-all duration-1000 delay-300 transform ${
            animationActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="bg-primary rounded-full p-5 shadow-lg animate-pulse">
            <QrCode className="h-14 w-14 text-white" />
          </div>
        </div>
        
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className={`text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-1000 delay-500 transform ${
              animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              QR Attendance System
            </CardTitle>
            <CardDescription className={`text-center text-base transition-all duration-1000 delay-700 transform ${
              animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-2">
              <div className={`space-y-2 transition-all duration-700 delay-900 transform ${
                animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}>
                <div className="flex items-center space-x-2">
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@school.edu or jsmith@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50 focus:bg-white transition-colors duration-300"
                  required
                />
              </div>
              <div className={`space-y-2 transition-all duration-700 delay-1100 transform ${
                animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <label className="text-sm font-medium" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <a className="text-xs text-primary font-medium hover:text-primary/80 transition-colors" href="#">
                    Forgot?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="admin123 or teacher123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 focus:bg-white transition-colors duration-300"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className={`transition-all duration-700 delay-1300 transform ${
              animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              <Button 
                className="w-full font-medium text-base group" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className={`mt-6 text-center text-sm text-muted-foreground transition-all duration-500 delay-1500 transform ${
          animationActive ? "opacity-100" : "opacity-0"
        }`}>
          <p>
            For demo: admin@school.edu / admin123 or jsmith@school.edu / teacher123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
