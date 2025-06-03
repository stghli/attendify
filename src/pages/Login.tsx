
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
      <Card className="border-none shadow-xl bg-white backdrop-blur-md overflow-hidden rounded-2xl max-w-sm w-full">
        <div className="p-8">
          <LoginHeader animationActive={animationActive} />
          <LoginForm animationActive={animationActive} />
        </div>
      </Card>
    </BackgroundContainer>
  );
};

export default Login;
