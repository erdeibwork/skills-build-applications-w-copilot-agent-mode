import React, { useEffect, useState } from 'react';

import { buildApiEndpoint, getApiOrigin, getCodespaceName } from '../api';

const endpoint = buildApiEndpoint('activities');

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Activities] Codespace name:', getCodespaceName());
      console.log('[Activities] API origin:', getApiOrigin());
      console.log('[Activities] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        console.log('[Activities] Response:', { status: response.status, statusText: response.statusText, ok: response.ok });

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

        console.log('[Activities] Fetched data:', data);

        const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

        if (!cancelled) {
          setActivities(results);
        }
      } catch (err) {
        console.error('[Activities] Fetch failed for endpoint:', endpoint, err);
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
          <h2 className="h4 mb-0">Activities</h2>
          <small className="text-muted">
            Endpoint:{' '}
            <a className="link-secondary" href={endpoint} target="_blank" rel="noreferrer">
              {endpoint}
            </a>
          </small>
        </div>

        {error ? (
          <div className="alert alert-danger mb-3">
            Failed to load activities: <code>{String(error?.message ?? error)}</code>
          </div>
        ) : null}

        {activities.length === 0 ? (
          <div className="alert alert-secondary mb-0">No activities found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '6rem' }}>
                    ID
                  </th>
                  <th scope="col">User</th>
                  <th scope="col">Team</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="text-end">
                    Duration (min)
                  </th>
                  <th scope="col" className="text-end">
                    Distance (km)
                  </th>
                  <th scope="col">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, idx) => {
                  const user = activity?.user;
                  const teamName = user?.team?.name ?? '—';
                  const timestamp = activity?.timestamp
                    ? new Date(activity.timestamp).toLocaleString()
                    : '—';

                  return (
                    <tr key={activity?.id ?? idx}>
                      <td>{activity?.id ?? '—'}</td>
                      <td>{user?.username ?? '—'}</td>
                      <td>{teamName}</td>
                      <td>{activity?.type ?? '—'}</td>
                      <td className="text-end">{activity?.duration ?? '—'}</td>
                      <td className="text-end">{activity?.distance ?? '—'}</td>
                      <td>{timestamp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
