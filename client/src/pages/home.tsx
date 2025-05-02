import { useState } from "react";
import { useLocation } from "wouter";
import { Card, Steps, Alert, Typography } from "antd";
import CredentialsForm from "../components/credentials-form";
import AuthSteps from "../components/auth-steps";

const { Title, Paragraph } = Typography;

export default function Home() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleOAuthStart = (clientId: string, clientSecret: string) => {
    // Store credentials in localStorage to retrieve after redirect
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("clientSecret", clientSecret);
    
    // Redirect to Google OAuth
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${window.location.origin}&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent`;
    setCurrentStep(1);
    
    // Wait a short time before redirecting to let the user see the state change
    setTimeout(() => {
      window.location.href = authUrl;
    }, 500);
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={2}>Google OAuth2 Tool</Title>
        <Paragraph>Retrieve OAuth refresh tokens for AdWords API integration</Paragraph>
      </div>
      
      <AuthSteps currentStep={currentStep} className="mb-8" />
      
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      
      <Card title="Google OAuth Integration" style={{ marginBottom: '20px' }}>
        <Paragraph style={{ marginBottom: '20px' }}>
          Enter your Google API credentials to start the OAuth flow and retrieve a refresh token.
        </Paragraph>
        <CredentialsForm onSubmit={handleOAuthStart} />
      </Card>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Paragraph type="secondary">
          This tool helps you obtain refresh tokens for Google API integration.
          No data is stored on our servers.
        </Paragraph>
      </div>
    </div>
  );
}
