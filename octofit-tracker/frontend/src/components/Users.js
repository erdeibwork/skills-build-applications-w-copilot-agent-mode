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

const endpoint = `${apiOrigin}/api/users/`;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Users] Fetching from endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

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

      {error ? <div className="alert alert-danger">Failed to load users.</div> : null}

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
