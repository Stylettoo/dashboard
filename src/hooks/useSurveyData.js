import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSurveyData, syncSurveyData } from '../services/api';
import { createEmptySurveyResponse } from '../types/survey';

export function useSurveyData(period) {
  const [data, setData] = useState(createEmptySurveyResponse());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const hasLoadedOnceRef = useRef(false);

  const reload = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  const sync = useCallback(
    async (password) => {
      setIsSyncing(true);

      try {
        await syncSurveyData({ password, period });
        setReloadToken((current) => current + 1);
      } finally {
        setIsSyncing(false);
      }
    },
    [period],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadSurveyData() {
      const shouldShowSkeleton = !hasLoadedOnceRef.current;

      setIsLoading(shouldShowSkeleton);
      setIsRefreshing(!shouldShowSkeleton);

      try {
        setError('');

        const nextData = await fetchSurveyData({
          period,
          signal: controller.signal,
        });

        setData(nextData);
      } catch (loadError) {
        if (loadError.name === 'AbortError') {
          return;
        }

        setError(loadError.message || 'Nao foi possivel carregar os dados.');
        setData((current) => current ?? createEmptySurveyResponse());
      } finally {
        hasLoadedOnceRef.current = true;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }

    loadSurveyData();

    return () => {
      controller.abort();
    };
  }, [period, reloadToken]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    isSyncing,
    reload,
    sync,
  };
}
