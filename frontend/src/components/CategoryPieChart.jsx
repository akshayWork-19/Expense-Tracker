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
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
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
                                    backgroundColor: 'var(--card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'var(--foreground)',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: 'var(--foreground)' }}
                                formatter={(value) => `$${value.toFixed(2)}`}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--foreground)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card >
    )
}

export default CategoryPieChart;