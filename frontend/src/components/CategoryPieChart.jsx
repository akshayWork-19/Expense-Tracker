import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = [
    '#0f172a', // slate-900
    '#334155', // slate-700
    '#64748b', // slate-500
    '#94a3b8', // slate-400
    '#cbd5e1', // slate-300
    '#1e293b', // slate-800
    '#475569', // slate-600
];

const CategoryPieChart = ({ categoryData }) => {
    // const expenseData = transactions.filter((t) => t.type === 'expense').reduce((acc, curr) => {
    //     const existing = acc.find((item) => item.name === curr.category);
    //     if (existing) {
    //         existing.value += curr.amount;
    //     } else {
    //         acc.push({ name: curr.category, value: curr.amount });
    //     }
    //     return acc;
    // }, []);

    const expenseData = categoryData ? categoryData.map(d => ({ name: d.category, value: d.total })) : [];
    if (expenseData.length === 0) return (
        <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle></CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
            </CardContent>
        </Card>
    );

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <div className="w-full h-full min-h-0">

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenseData}
                                isAnimationActive={false}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="80%"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => `$${value.toFixed(2)}`}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card >
    )
}

export default CategoryPieChart;