import { RadialBarChart, RadialBar, Legend } from 'recharts';

export default function ScoreGauge({ score }) {
  const data = [
    { name: 'Liquidity Score', value: score || 0, fill: '#8884d8' }
  ];

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-2">Liquidity Score</h2>
      <RadialBarChart
        width={200}
        height={200}
        cx={100}
        cy={100}
        barSize={15}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          minAngle={15}
          background
          clockWise
          dataKey="value"
        />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          align="right"
        />
      </RadialBarChart>
      <p className="mt-2 text-center text-lg">{score}/100</p>
    </div>
  );
}
