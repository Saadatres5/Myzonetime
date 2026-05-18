export function getCanonicalUrl(pathname) {
  const baseUrl = 'https://myzonetime.com';
  // Ensure pathname starts with a slash and remove trailing slashes
  const cleanPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const finalPathname = cleanPathname.endsWith('/') && cleanPathname.length > 1 
    ? cleanPathname.slice(0, -1) 
    : cleanPathname;
    
  return `${baseUrl}${finalPathname}`;
}