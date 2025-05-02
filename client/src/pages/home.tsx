import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps } from "antd";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CredentialsForm from "@/components/credentials-form";
import AuthSteps from "@/components/auth-steps";

export default function Home() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleOAuthStart = (clientId: string, clientSecret: string) => {
    // Store credentials in localStorage to retrieve after redirect
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("clientSecret", clientSecret);
    
    // Redirect to Google OAuth
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=http://localhost&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent`;
    setCurrentStep(1);
    
    // Wait a short time before redirecting to let the user see the state change
    setTimeout(() => {
      window.location.href = authUrl;
    }, 500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Google OAuth2 Tool</h1>
        <p className="text-gray-500">Retrieve OAuth refresh tokens for AdWords API integration</p>
      </div>
      
      <AuthSteps currentStep={currentStep} className="mb-8" />
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Google OAuth Integration</CardTitle>
          <CardDescription>
            Enter your Google API credentials to start the OAuth flow and retrieve a refresh token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CredentialsForm onSubmit={handleOAuthStart} />
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          This tool helps you obtain refresh tokens for Google API integration.
          No data is stored on our servers.
        </p>
      </div>
    </div>
  );
}
