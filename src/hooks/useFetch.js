import { useState } from 'react';

const useFetch = (
  url,
  { method = 'GET', headers = { 'Content-Type': 'application/json' } }
) => {
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);

  const fetchData = async (body) => {
    setFetching(true);
    if (error) setError('');

    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const newData = await res.json();
      return newData;
    } catch (e) {
      setError(e.message);
    }
    setFetching(false);
  };

  return { fetchData, fetching, error };
};

export default useFetch;
