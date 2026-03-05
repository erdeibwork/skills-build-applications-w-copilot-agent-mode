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

const endpoint = `${apiOrigin}/api/teams/`;

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Teams] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        console.log('[Teams] Fetched data:', data);

        const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

        if (!cancelled) {
          setTeams(results);
        }
      } catch (err) {
        console.error('[Teams] Fetch failed for endpoint:', endpoint, err);
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
      <h2>Teams</h2>
      <p className="text-muted mb-3">
        Endpoint: <code>{endpoint}</code>
      </p>

      {error ? <div className="alert alert-danger">Failed to load teams.</div> : null}

      {teams.length === 0 ? (
        <div className="alert alert-secondary">No teams found.</div>
      ) : (
        <ul className="list-group">
          {teams.map((team, idx) => (
            <li key={team?.id ?? idx} className="list-group-item">
              <pre className="mb-0">{JSON.stringify(team, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
