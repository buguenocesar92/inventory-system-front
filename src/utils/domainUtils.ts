// utils/domainUtils.ts
export const isSubdomain = (): boolean => {
  const host = window.location.host;
  return host.split('.').length > 2;
};
