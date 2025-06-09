// components/DrillDownChart.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { seriesConfig } from '../lib/fred';

export default function DrillDownChart() {
  const [selected, setSelected] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!selected) return;

    async function fetchData() {
      // 1) FRED series
      const fredRes = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
        params: {
          api_key: process.env.NEXT_PUBLIC_FRED_API_KEY,
          file_type: 'json',
          series_id: selected,
          limit: 365
        }
      });
      const fredObs = (fredRes.data.observations || [])
        .filter(o => o.value !== '.')
        .map(o => ({ date: o.date, seriesValue: +o.value }));

      // 2) BTC price via CoinGecko
      const btcRes = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
        params: { vs_currency: 'usd', days: 365 }
      });
      const btcData = btcRes.data.prices.map(([ts, price]) => ({
        date: new Date(ts).toISOString().slice(0, 10),
        btcPrice: price
      }));

      // 3) Merge on date
      const merged = fredObs.map(o => {
        const match = btcData.find(b => b.date === o.date);
        return {
          date: o.date,
          seriesValue: o.seriesValue,
          btcPrice: match?.btcPrice ?? null
        };
      });

      setData(merged);
    }

    fetchData();
  }, [selected]);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-2">Drill-down & Correlation</h2>
      <select
        className="border rounded p-2 mb-4"
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        <option value="">Select a metric</option>
        {seriesConfig.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>

      {data.length > 0 && (
        <LineChart width={800} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="seriesValue"
            stroke="#8884d8"
            dot={false}
            name="Metric"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="btcPrice"
            stroke="#82ca9d"
            dot={false}
            name="BTC Price"
          />
        </LineChart>
      )}
    </div>
  );
}
