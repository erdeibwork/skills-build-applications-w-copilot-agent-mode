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
    <div>
      <h2>Workouts</h2>
      <p className="text-muted mb-3">
        Endpoint: <code>{endpoint}</code>
      </p>

      {error ? (
        <div className="alert alert-danger">
          Failed to load workouts: <code>{String(error?.message ?? error)}</code>
        </div>
      ) : null}

      {workouts.length === 0 ? (
        <div className="alert alert-secondary">No workouts found.</div>
      ) : (
        <ul className="list-group">
          {workouts.map((workout, idx) => (
            <li key={workout?.id ?? idx} className="list-group-item">
              <pre className="mb-0">{JSON.stringify(workout, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
