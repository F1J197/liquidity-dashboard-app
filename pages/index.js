import { useEffect, useState } from 'react';
import ScoreGauge     from '../components/ScoreGauge';
import MetricTile     from '../components/MetricTile';
import ForecastPanel  from '../components/ForecastPanel';
import DrillDownChart from '../components/DrillDownChart';
import { fetchMetrics, fetchCompositeScore, fetchForecast } from '../lib/fred';

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [score,   setScore]   = useState(0);
  const [forecast,setForecast]= useState({ projection: [] });

  useEffect(() => {
    async function load() {
      const m = await fetchMetrics();
      setMetrics(m);
      setScore(fetchCompositeScore(m));
      setForecast(await fetchForecast(m));
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <ScoreGauge score={score} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => <MetricTile key={m.id} metric={m} />)}
      </div>
      <ForecastPanel forecast={forecast} />
      <DrillDownChart />
    </div>
  );
}
