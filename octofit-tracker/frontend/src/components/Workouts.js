import React, { useEffect, useState } from 'react';

import { buildApiEndpoint, getApiOrigin, getCodespaceName } from '../api';

const endpoint = buildApiEndpoint('workouts');

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Workouts] Codespace name:', getCodespaceName());
      console.log('[Workouts] API origin:', getApiOrigin());
      console.log('[Workouts] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        console.log('[Workouts] Response:', { status: response.status, statusText: response.statusText, ok: response.ok });

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

        console.log('[Workouts] Fetched data:', data);

        const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

        if (!cancelled) {
          setWorkouts(results);
        }
      } catch (err) {
        console.error('[Workouts] Fetch failed for endpoint:', endpoint, err);
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
          <h2 className="h4 mb-0">Workouts</h2>
          <small className="text-muted">
            Endpoint:{' '}
            <a className="link-secondary" href={endpoint} target="_blank" rel="noreferrer">
              {endpoint}
            </a>
          </small>
        </div>

        {error ? (
          <div className="alert alert-danger mb-3">
            Failed to load workouts: <code>{String(error?.message ?? error)}</code>
          </div>
        ) : null}

        {workouts.length === 0 ? (
          <div className="alert alert-secondary mb-0">No workouts found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '6rem' }}>
                    ID
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, idx) => (
                  <tr key={workout?.id ?? idx}>
                    <td>{workout?.id ?? '—'}</td>
                    <td>{workout?.name ?? '—'}</td>
                    <td className="text-muted">{workout?.description ?? '—'}</td>
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
