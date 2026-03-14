import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
    const transactions = [
        {
            _id: '1',
            description: 'Monthly Salary',
            amount: 5000,
            type: 'income',
            category: 'salary',
            date: '2024-03-01',
            currency: 'USD'
        },
        {
            _id: '2',
            description: 'Whole Foods Grocery',
            amount: 85.50,
            type: 'expense',
            category: 'food',
            date: '2024-03-05',
            currency: 'USD'
        },
        {
            _id: '3',
            description: 'Uber to Airport',
            amount: 45.00,
            type: 'expense',
            category: 'transport',
            date: '2024-03-07',
            currency: 'USD'
        },
        {
            _id: '4',
            description: 'Quarterly Dividends',
            amount: 120.00,
            type: 'income',
            category: 'investment',
            date: '2024-03-08',
            currency: 'USD'
        },
    ];


    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);


    const balance = totalIncome - totalExpense;

    return (
        <div className='space-y-8 animate-in fade-in duration-500'>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Financial Overview
                    </h1>
                </div>
                <Button variant='outline' size="lg">
                    Generate Report
                </Button>
            </header>

            {/* stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardContent>
                            <p className={`text-3xl font-black ${balance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </CardContent>
                    </CardContent>
                </Card>

                <Card >
                    <CardHeader>
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Income
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black text-foreground">
                            ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black text-foreground">
                            ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions table */}

            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold">
                        Recent Transactions
                    </CardTitle>
                    <CardAction>
                        <Button size='lg'>
                            + New Transaction
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {transactions.map((t) => (
                                <TableRow key={t._id}>
                                    <TableCell className="font-semibold">
                                        {t.description}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                                            {t.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(t.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className={`font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard;