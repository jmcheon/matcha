export type SocialInfo = {
  id: string;
  email: string;
  provider: string; // You can specify the exact string value
};

export function isSocialInfo(payload: any): payload is SocialInfo {
  return typeof payload === 'object' &&
    payload !== null &&
    'id' in payload &&
    'email' in payload &&
    'provider' in payload;
}
