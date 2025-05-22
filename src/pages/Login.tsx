
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BackgroundContainer } from "@/components/login/BackgroundContainer";
import { LoginHeader } from "@/components/login/LoginHeader";
import { LoginForm } from "@/components/login/LoginForm";

const Login: React.FC = () => {
  const [animationActive, setAnimationActive] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setTimeout(() => setAnimationActive(true), 100);
  }, []);

  return (
    <BackgroundContainer animationActive={animationActive}>
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-md overflow-hidden rounded-xl max-w-md w-full">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-primary to-blue-400"></div>
        <div className="p-8">
          <LoginHeader animationActive={animationActive} />
          <LoginForm animationActive={animationActive} />
        </div>
      </Card>
    </BackgroundContainer>
  );
};

export default Login;
