export default function MetricTile({ metric }) {
  const { name, value, change, sparklineData } = metric;

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-medium">{name}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? `▲ ${change}` : `▼ ${Math.abs(change)}`}
      </p>
      {/* TODO: render sparkline chart here using sparklineData */}
    </div>
  );
}
