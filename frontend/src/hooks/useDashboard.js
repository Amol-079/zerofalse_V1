import { useState, useEffect } from 'react';
import client from '../api/client';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [threatBreakdown, setThreatBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await client.get('/api/v1/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const fetchRecentEvents = async (params = {}) => {
    try {
      const response = await client.get('/api/v1/dashboard/recent-events', { params });
      setRecentEvents(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const fetchThreatBreakdown = async () => {
    try {
      const response = await client.get('/api/v1/dashboard/threat-breakdown');
      setThreatBreakdown(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchRecentEvents(),
      fetchThreatBreakdown(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return {
    stats,
    recentEvents,
    threatBreakdown,
    loading,
    error,
    refreshAll,
    fetchStats,
    fetchRecentEvents,
    fetchThreatBreakdown,
  };
};
