import React, { useEffect, useState } from 'react';

function deriveCodespaceNameFromHostname() {
  const hostname = window?.location?.hostname;
  const codespacesSuffix = '-3000.app.github.dev';

  if (hostname && hostname.endsWith(codespacesSuffix)) {
    return hostname.slice(0, -codespacesSuffix.length);
  }

  return null;
}

const codespaceName = process.env.REACT_APP_CODESPACE_NAME || deriveCodespaceNameFromHostname();
const apiOrigin = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';

const endpoint = `${apiOrigin}/api/leaderboard/`;

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Leaderboard] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        console.log('[Leaderboard] Fetched data:', data);

        const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

        if (!cancelled) {
          setEntries(results);
        }
      } catch (err) {
        console.error('[Leaderboard] Fetch failed for endpoint:', endpoint, err);
        if (!cancelled) {
          setError(err);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <p className="text-muted mb-3">
        Endpoint: <code>{endpoint}</code>
      </p>

      {error ? <div className="alert alert-danger">Failed to load leaderboard.</div> : null}

      {entries.length === 0 ? (
        <div className="alert alert-secondary">No leaderboard entries found.</div>
      ) : (
        <ul className="list-group">
          {entries.map((entry, idx) => (
            <li key={entry?.id ?? idx} className="list-group-item">
              <pre className="mb-0">{JSON.stringify(entry, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
