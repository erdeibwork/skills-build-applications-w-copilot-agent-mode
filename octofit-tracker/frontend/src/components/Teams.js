import React, { useEffect, useState } from 'react';

import { buildApiEndpoint, getApiOrigin, getCodespaceName } from '../api';

const endpoint = buildApiEndpoint('teams');

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Teams] Codespace name:', getCodespaceName());
      console.log('[Teams] API origin:', getApiOrigin());
      console.log('[Teams] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        console.log('[Teams] Response:', { status: response.status, statusText: response.statusText, ok: response.ok });

        if (!response.ok) {
          const bodyText = await response.text().catch(() => '');
          throw new Error(
            `HTTP ${response.status} ${response.statusText}${bodyText ? ` - ${bodyText.slice(0, 200)}` : ''}`
          );
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonErr) {
          const bodyText = await response.text().catch(() => '');
          throw new Error(
            `Failed to parse JSON response${bodyText ? ` - ${bodyText.slice(0, 200)}` : ''}`
          );
        }

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

      {error ? (
        <div className="alert alert-danger">
          Failed to load teams: <code>{String(error?.message ?? error)}</code>
        </div>
      ) : null}

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
