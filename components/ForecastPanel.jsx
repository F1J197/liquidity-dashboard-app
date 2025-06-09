// components/ForecastPanel.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ForecastPanel({ forecast }) {
  const { projection = [] } = forecast || {};

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-2">2-Month Forecast</h2>
      <LineChart width={600} height={300} data={projection}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#8884d8" dot={false} />
      </LineChart>
      <p className="mt-2 text-sm text-gray-600">
        Projection based on leading indicators’ 2–8 week lags.
      </p>
    </div>
  );
}
