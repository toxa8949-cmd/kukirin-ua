'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const ORANGE = '#FF6B00';
const ORANGE_LIGHT = '#FF8A33';
const CYAN = '#00D9FF';

const STATUS_COLORS: Record<string, string> = {
  new: '#3B82F6',
  confirmed: '#F59E0B',
  shipped: '#A855F7',
  completed: '#10B981',
  canceled: '#EF4444',
};

const STATUS_LABEL: Record<string, string> = {
  new: 'нові',
  confirmed: 'підтверджені',
  shipped: 'відправлені',
  completed: 'завершені',
  canceled: 'скасовані',
};

const tooltipStyle = {
  backgroundColor: '#0F0F0F',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 2,
  fontSize: 12,
  color: 'white',
};

function fmtMoney(n: number) {
  return `${n.toLocaleString('uk-UA')} ₴`;
}

// -------------------------------------------------------------------------

export function OrdersByDayChart({
  data,
}: {
  data: Array<{ date: string; label: string; orders: number; revenue: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="label"
            stroke="rgba(255,255,255,0.45)"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="left"
            stroke={ORANGE}
            tick={{ fontSize: 11 }}
            allowDecimals={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={CYAN}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: number, name: string) =>
              name === 'Виручка' ? fmtMoney(value) : value
            }
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="orders"
            name="Замовлень"
            stroke={ORANGE}
            strokeWidth={2}
            dot={{ r: 3, fill: ORANGE }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            name="Виручка"
            stroke={CYAN}
            strokeWidth={2}
            dot={{ r: 3, fill: CYAN }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// -------------------------------------------------------------------------

export function StatusPie({
  data,
}: {
  data: Array<{ status: string; count: number }>;
}) {
  const rows = data.map((d) => ({
    name: STATUS_LABEL[d.status] ?? d.status,
    key: d.status,
    value: d.count,
  }));

  if (rows.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-[#6C6A65] dark:text-white/45">
        Поки немає замовлень
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={88}
            paddingAngle={2}
            stroke="#0F0F0F"
            strokeWidth={2}
          >
            {rows.map((r) => (
              <Cell key={r.key} fill={STATUS_COLORS[r.key] ?? ORANGE_LIGHT} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// -------------------------------------------------------------------------

export function TopProductsBar({
  data,
}: {
  data: Array<{ name: string; quantity: number; revenue: number }>;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-[#6C6A65] dark:text-white/45">
        Топ-продукти зʼявляться після перших замовлень.
      </div>
    );
  }

  // Truncate long product names for the y-axis.
  const rows = data.map((d) => ({
    ...d,
    short: d.name.length > 20 ? d.name.slice(0, 18) + '…' : d.name,
  }));

  return (
    <div style={{ height: Math.max(180, rows.length * 56) }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            type="number"
            stroke="rgba(255,255,255,0.45)"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
          />
          <YAxis
            type="category"
            dataKey="short"
            stroke="rgba(255,255,255,0.65)"
            tick={{ fontSize: 11 }}
            width={140}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: number, name: string) =>
              name === 'Виручка' ? fmtMoney(value) : value
            }
          />
          <Bar dataKey="revenue" name="Виручка" fill={ORANGE} radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
