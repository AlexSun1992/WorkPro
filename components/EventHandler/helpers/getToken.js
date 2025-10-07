export const TOKEN_NAME = "auth._token.local";
export function getAuthToken(token) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${token}=`);

  if (parts.length === 2) {
    const encodedToken = parts.pop().split(";").shift();

    const decodedToken = decodeURIComponent(encodedToken);

    return decodedToken;
  }

  return null;
}
