import { useState, useCallback } from 'react';
import { extractMetadata } from '../utils/metadata';
import { ImageMetadata } from '../types';

export const useExifExtraction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const extractExif = useCallback(async (file: File): Promise<ImageMetadata> => {
    setLoading(true);
    setError(null);

    try {
      const metadata = await extractMetadata(file);
      setLoading(false);
      return metadata;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to extract metadata');
      setError(error);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    extractExif,
    loading,
    error
  };
};
