import { useState } from 'react';

const useReadTextFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const readFile = (file, processLine = (line) => line, callback) => {
    setLoading(true);
    if (error) setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result.split(/\r\n|\n/).map((line) => processLine(line)));
    };

    try {
      reader.readAsText(file);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return [readFile, loading, error];
};

export default useReadTextFile;
