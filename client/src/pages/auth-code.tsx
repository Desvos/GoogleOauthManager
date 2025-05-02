import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clipboard, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { exchangeAuthCodeForToken } from "@/lib/api";
import JsonView from "@/components/ui/json-view";
import AuthSteps from "@/components/auth-steps";

export default function AuthCode() {
  const [, navigate] = useLocation();
  const [code, setCode] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(2);

  // Exchange code for token mutation
  const exchangeTokenMutation = useMutation({
    mutationFn: async () => {
      if (!code || !clientId || !clientSecret) {
        throw new Error("Missing required credentials");
      }
      return exchangeAuthCodeForToken(code, clientId, clientSecret);
    },
    onSuccess: () => {
      setCurrentStep(3);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    // Get code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    
    if (codeParam) {
      setCode(codeParam);
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setError("No authorization code found in the URL");
    }
    
    // Get stored credentials
    const storedClientId = localStorage.getItem("clientId");
    const storedClientSecret = localStorage.getItem("clientSecret");
    
    if (!storedClientId || !storedClientSecret) {
      setError("Client credentials not found. Please start the process again.");
    } else {
      setClientId(storedClientId);
      setClientSecret(storedClientSecret);
    }
  }, []);

  const handleGetRefreshToken = () => {
    exchangeTokenMutation.mutate();
  };

  const handleRestart = () => {
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientSecret");
    navigate("/");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <CardTitle>
            {exchangeTokenMutation.data ? "Refresh Token Retrieved" : "Authorization Code Received"}
          </CardTitle>
          <CardDescription>
            {exchangeTokenMutation.data 
              ? "Successfully exchanged the authorization code for tokens. Here's the response from Google's token endpoint:" 
              : "Google has returned an authorization code. Click the button below to exchange it for a refresh token."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!exchangeTokenMutation.data && code && (
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded my-4 overflow-x-auto">
              <div className="flex justify-between items-center">
                <code className="text-sm font-mono break-all">
                  {code.length > 40 ? `${code.substring(0, 40)}...` : code}
                </code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(code)}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {exchangeTokenMutation.isPending && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          
          {exchangeTokenMutation.data && (
            <>
              <JsonView data={exchangeTokenMutation.data} />
              
              {exchangeTokenMutation.data.refresh_token && (
                <Alert className="mt-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                  <AlertTitle className="flex items-center">
                    Refresh Token
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2" 
                      onClick={() => copyToClipboard(exchangeTokenMutation.data.refresh_token)}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </AlertTitle>
                  <AlertDescription className="font-mono text-sm break-all">
                    {exchangeTokenMutation.data.refresh_token}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {exchangeTokenMutation.data ? (
            <Button onClick={handleRestart}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Restart Process
            </Button>
          ) : (
            <Button 
              onClick={handleGetRefreshToken} 
              disabled={!code || exchangeTokenMutation.isPending}
            >
              {exchangeTokenMutation.isPending ? "Processing..." : "Get Refresh Token"}
            </Button>
          )}
        </CardFooter>
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
