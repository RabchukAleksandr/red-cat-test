export const getReqRouteInstanceName = (originalUrl: string): string | null => {
  const regex = /^\/v1\/(articles|users)(?:\/\d+)?$/;
  const match = originalUrl.match(regex);
  return match ? match[1] : null;
};
