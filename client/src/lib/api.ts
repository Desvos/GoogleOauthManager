interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export async function exchangeAuthCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<TokenResponse> {
  // Directly call Google's token endpoint from the frontend
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: "http://localhost",
      grant_type: "authorization_code",
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || "Failed to exchange code for token");
  }
  
  return response.json();
}
