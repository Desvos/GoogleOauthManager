import { apiRequest } from "./queryClient";

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
  const response = await apiRequest(
    "POST",
    "/api/token-exchange",
    { code, clientId, clientSecret }
  );
  
  return response.json();
}
