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
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-3">
          <h2 className="h4 mb-0">Leaderboard</h2>
          <small className="text-muted">
            Endpoint:{' '}
            <a className="link-secondary" href={endpoint} target="_blank" rel="noreferrer">
              {endpoint}
            </a>
          </small>
        </div>

        {error ? (
          <div className="alert alert-danger mb-3">
            Failed to load leaderboard: <code>{String(error?.message ?? error)}</code>
          </div>
        ) : null}

        {entries.length === 0 ? (
          <div className="alert alert-secondary mb-0">No leaderboard entries found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '6rem' }}>
                    ID
                  </th>
                  <th scope="col">Team</th>
                  <th scope="col" className="text-end">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry?.id ?? idx}>
                    <td>{entry?.id ?? '—'}</td>
                    <td>{entry?.team?.name ?? '—'}</td>
                    <td className="text-end">{entry?.points ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
