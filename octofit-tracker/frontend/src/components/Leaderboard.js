import React, { useEffect, useState } from 'react';

import { buildApiEndpoint, getApiOrigin, getCodespaceName } from '../api';

const endpoint = buildApiEndpoint('leaderboard');

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Leaderboard] Codespace name:', getCodespaceName());
      console.log('[Leaderboard] API origin:', getApiOrigin());
      console.log('[Leaderboard] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        console.log('[Leaderboard] Response:', { status: response.status, statusText: response.statusText, ok: response.ok });

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

      {error ? (
        <div className="alert alert-danger">
          Failed to load leaderboard: <code>{String(error?.message ?? error)}</code>
        </div>
      ) : null}

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
