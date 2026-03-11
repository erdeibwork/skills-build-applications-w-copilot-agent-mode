function deriveCodespaceNameFromHostname() {
  const hostname = window?.location?.hostname;
  if (!hostname) return null;

  // GitHub Codespaces port forwarding hostnames look like:
  //   <codespaceName>-<port>.app.github.dev
  //   <codespaceName>-<port>.preview.app.github.dev
  //   <codespaceName>-<port>.githubpreview.dev
  // The frontend might be served on port 3000 (dev server) or 8000 (served by Django).
  const patterns = [
    /^(.*)-\d+\.app\.github\.dev$/,
    /^(.*)-\d+\.preview\.app\.github\.dev$/,
    /^(.*)-\d+\.githubpreview\.dev$/,
  ];

  for (const pattern of patterns) {
    const match = hostname.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function getCodespaceName() {
  return process.env.REACT_APP_CODESPACE_NAME || deriveCodespaceNameFromHostname();
}

export function getApiOrigin() {
  const codespaceName = getCodespaceName();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
}

export function buildApiEndpoint(resource) {
  const origin = getApiOrigin();
  const normalized = String(resource || '').replace(/^\/+|\/+$/g, '');
  return `${origin}/api/${normalized}/`;
}
