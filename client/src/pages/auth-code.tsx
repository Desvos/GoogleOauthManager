import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, Alert, Button, Skeleton, Typography, Space, Divider } from "antd";
import { CopyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
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
      try {
        // Call the function directly without going through the backend
        return await exchangeAuthCodeForToken(code, clientId, clientSecret);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }
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

  const { Title, Paragraph, Text } = Typography;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={2}>Google OAuth2 Tool</Title>
        <Paragraph type="secondary">Retrieve OAuth refresh tokens for AdWords API integration</Paragraph>
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
      
      <Card
        title={exchangeTokenMutation.data ? "Refresh Token Retrieved" : "Authorization Code Received"}
        style={{ marginBottom: '20px' }}
      >
        <Paragraph>
          {exchangeTokenMutation.data 
            ? "Successfully exchanged the authorization code for tokens. Here's the response from Google's token endpoint:" 
            : "Google has returned an authorization code. Click the button below to exchange it for a refresh token."}
        </Paragraph>
        
        {!exchangeTokenMutation.data && code && (
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px', 
            margin: '16px 0', 
            overflow: 'auto' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ 
                fontSize: '14px', 
                fontFamily: 'monospace', 
                wordBreak: 'break-all' 
              }}>
                {code.length > 40 ? `${code.substring(0, 40)}...` : code}
              </code>
              <Button 
                type="text"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(code)}
              />
            </div>
          </div>
        )}
        
        {exchangeTokenMutation.isPending && (
          <div>
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        )}
        
        {exchangeTokenMutation.data && (
          <>
            <JsonView data={exchangeTokenMutation.data} />
            
            {exchangeTokenMutation.data.refresh_token && (
              <div style={{ marginTop: '20px' }}>
                <Alert
                  message={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Refresh Token</span>
                      <Button 
                        type="text"
                        icon={<CopyOutlined />}
                        size="small"
                        style={{ marginLeft: '8px' }}
                        onClick={() => copyToClipboard(exchangeTokenMutation.data.refresh_token)}
                      />
                    </div>
                  }
                  description={
                    <Text code style={{ wordBreak: 'break-all' }}>
                      {exchangeTokenMutation.data.refresh_token}
                    </Text>
                  }
                  type="success"
                  showIcon
                />
              </div>
            )}
          </>
        )}
        
        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          {exchangeTokenMutation.data ? (
            <Button 
              onClick={handleRestart}
              icon={<ArrowLeftOutlined />}
            >
              Restart Process
            </Button>
          ) : (
            <Button 
              type="primary"
              onClick={handleGetRefreshToken} 
              disabled={!code || exchangeTokenMutation.isPending}
              loading={exchangeTokenMutation.isPending}
            >
              {exchangeTokenMutation.isPending ? "Processing..." : "Get Refresh Token"}
            </Button>
          )}
        </div>
      </Card>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Paragraph type="secondary" style={{ fontSize: '12px' }}>
          This tool helps you obtain refresh tokens for Google API integration.
          No data is stored on our servers.
        </Paragraph>
      </div>
    </div>
  );
}
