
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
      <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
        <div className="px-4 py-8">
          <LoginHeader animationActive={animationActive} />
          <LoginForm animationActive={animationActive} />
        </div>
      </Card>
    </BackgroundContainer>
  );
};

export default Login;
