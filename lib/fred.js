import axios from 'axios';

export const seriesConfig = [
  { id: 'BTFP',       name: 'Bank Term Funding Program (BTFP)',               weight: 1/15 },
  { id: 'GCFREPO',    name: 'GCF Repo Index Volatility',                      weight: 1/15 },
  { id: 'BAMLC0A0CM', name: 'Corporate Credit OAS (IG)',                      weight: 1/15 },
  { id: 'EURFRAOIS',  name: 'EUR/USD FRA–OIS Basis',                          weight: 1/15 },
  { id: 'FXSWAPLN',   name: 'FX Swap Line Utilization',                       weight: 1/15 },
  { id: 'TBIDCOVER',  name: 'Treasury Bid-to-Cover Deterioration',             weight: 1/15 },
  { id: 'DTCCGCF',    name: 'DTCC GCF Repo Volatility',                       weight: 1/15 },
  { id: 'SOFRDFF',    name: 'SOFR–Fed Funds Spread',                          weight: 1/15 },
  { id: 'FRBNYPD',    name: 'Primary Dealer Net Long Positions',               weight: 1/15 },
  { id: 'T5YIE',      name: 'TIPS 5Y Breakeven Volatility',                   weight: 1/15 },
  { id: 'RRPONTSYD',  name: 'Reverse Repo Facility',                          weight: 1/15 },
  { id: 'WALCL',      name: 'Fed Balance Sheet (WALCL)',                       weight: 1/15 },
  { id: 'WTREGEN',    name: 'Treasury General Account (TGA)',                  weight: 1/15 },
  { id: 'M2SL',       name: 'M2 Money Supply (YoY)',                           weight: 1/15 },
  { id: 'VIXCLS',     name: 'VIX Term Structure (CBOE VIX Futures)',          weight: 1/15 }
];

const FRED_BASE = 'https://api.stlouisfed.org/fred';
const API_KEY   = process.env.NEXT_PUBLIC_FRED_API_KEY;

export async function fetchMetrics() {
  return await Promise.all(
    seriesConfig.map(async ({ id, name, weight }) => {
      const res = await axios.get(`${FRED_BASE}/series/observations`, {
        params: { api_key: API_KEY, file_type: 'json', series_id: id, limit: 30 }
      });
      const obs = (res.data.observations || [])
        .filter(o => o.value !== '.')
        .map(o => ({ date: o.date, value: +o.value }));
      const vals    = obs.map(o=>o.value);
      const last    = vals.slice(-1)[0] ?? 0;
      const prev    = vals.slice(-2)[0] ?? last;
      const change  = +(last - prev).toFixed(2);
      const min     = Math.min(...vals);
      const max     = Math.max(...vals);
      const norm    = max>min ? (last-min)/(max-min) : 0;
      return { id, name, weight, value: last, change, normalized: norm, sparklineData: obs };
    })
  );
}

export function fetchCompositeScore(metrics) {
  const totalW = metrics.reduce((s,m)=>s+m.weight,0);
  const weighted = metrics.reduce((s,m)=>s+m.normalized*m.weight,0);
  return totalW>0 ? Math.round((weighted/totalW)*100) : 0;
}

export async function fetchForecast(metrics) {
  const today = new Date();
  const score = fetchCompositeScore(metrics);
  const projection = Array.from({ length: 8 }).map((_,i)=>{
    const d = new Date(today);
    d.setDate(d.getDate() + 7*(i+1));
    return { date: d.toISOString().slice(0,10), score };
  });
  return { projection };
}
