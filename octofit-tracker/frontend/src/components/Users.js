import React, { useEffect, useState } from 'react';

import { buildApiEndpoint, getApiOrigin, getCodespaceName } from '../api';

const endpoint = buildApiEndpoint('users');

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Users] Codespace name:', getCodespaceName());
      console.log('[Users] API origin:', getApiOrigin());
      console.log('[Users] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        console.log('[Users] Response:', { status: response.status, statusText: response.statusText, ok: response.ok });

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

        console.log('[Users] Fetched data:', data);

        const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

        if (!cancelled) {
          setUsers(results);
        }
      } catch (err) {
        console.error('[Users] Fetch failed for endpoint:', endpoint, err);
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
      <h2>Users</h2>
      <p className="text-muted mb-3">
        Endpoint: <code>{endpoint}</code>
      </p>

      {error ? (
        <div className="alert alert-danger">
          Failed to load users: <code>{String(error?.message ?? error)}</code>
        </div>
      ) : null}

      {users.length === 0 ? (
        <div className="alert alert-secondary">No users found.</div>
      ) : (
        <ul className="list-group">
          {users.map((user, idx) => (
            <li key={user?.id ?? idx} className="list-group-item">
              <pre className="mb-0">{JSON.stringify(user, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
