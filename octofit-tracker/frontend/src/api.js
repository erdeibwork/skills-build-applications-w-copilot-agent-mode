function deriveCodespaceNameFromHostname() {
  const hostname = window?.location?.hostname;
  if (!hostname) return null;

  // GitHub Codespaces port forwarding hostnames look like:
  //   <codespaceName>-<port>.app.github.dev
  //   <codespaceName>-<port>.preview.app.github.dev
  //   <codespaceName>-<port>.githubpreview.dev
  // The frontend might be served on port 3000 (dev server) or 8000 (served by Django).
  const match = hostname.match(
    /^(.*)-\d+\.(app\.github\.dev|preview\.app\.github\.dev|githubpreview\.dev)$/
  );

  return match?.[1] || null;
}

export function getCodespaceName() {
  return process.env.REACT_APP_CODESPACE_NAME || deriveCodespaceNameFromHostname();
}

export function getApiOrigin() {
  const explicitOrigin = process.env.REACT_APP_API_ORIGIN;
  if (explicitOrigin) {
    return String(explicitOrigin).replace(/\/+$/g, '');
  }

  const hostname = window?.location?.hostname;
  const protocol = window?.location?.protocol || 'http:';

  if (hostname) {
    const match = hostname.match(
      /^(.*)-(\d+)\.(app\.github\.dev|preview\.app\.github\.dev|githubpreview\.dev)$/
    );

    // If we're on a Codespaces forwarded-port hostname, always talk to the backend on port 8000
    // using the same domain suffix and protocol.
    if (match?.[1] && match?.[3]) {
      const codespaceName = match[1];
      const domainSuffix = match[3];
      return `${protocol}//${codespaceName}-8000.${domainSuffix}`;
    }

    // If we're on a GitHub forwarded domain but can't parse the port segment for some reason,
    // prefer same-origin over falling back to localhost (which often fails due to mixed content).
    if (
      hostname.endsWith('.app.github.dev') ||
      hostname.endsWith('.preview.app.github.dev') ||
      hostname.endsWith('.githubpreview.dev')
    ) {
      return window.location.origin;
    }
  }

  return 'http://localhost:8000';
}

export function buildApiEndpoint(resource) {
  const origin = getApiOrigin();
  const normalized = String(resource || '').replace(/^\/+|\/+$/g, '');
  return `${origin}/api/${normalized}/`;
}
