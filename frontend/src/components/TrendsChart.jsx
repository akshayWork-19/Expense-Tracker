import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const TrendsChart = ({ transactions }) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedTransactions.reduce((acc, curr) => {
        const date = new Date(curr.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
        });
        const existing = acc.find(item => item.date === date);
        if (existing) {
            if (curr.type === 'income') existing.income += curr.amount;
            else existing.expense += curr.amount;
        } else {
            acc.push({
                date,
                income: curr.type === 'income' ? curr.amount : 0,
                expense: curr.type === 'expense' ? curr.amount : 0
            });
        }
        return acc;
    }, []);

    if (chartData.length === 0) return null;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Income vs Expense Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.5 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.5 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default TrendsChart;