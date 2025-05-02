import { Steps } from "antd";

interface AuthStepsProps {
  currentStep: number;
  className?: string;
}

export default function AuthSteps({ currentStep, className }: AuthStepsProps) {
  return (
    <Steps
      current={currentStep}
      className={className}
      items={[
        {
          title: "Credentials",
          description: "Enter API keys"
        },
        {
          title: "Authentication",
          description: "Connect with Google"
        },
        {
          title: "Authorization",
          description: "Code received"
        },
        {
          title: "Token Exchange",
          description: "Get refresh token"
        }
      ]}
    />
  );
}
