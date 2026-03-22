import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import api from '@/services/api';
import AddTransactionDialog from "../components/AddTransactionDialog";
import CategoryPieChart from '@/components/CategoryPieChart';
import TrendsChart from '@/components/TrendsChart';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from '@/components/ui/select';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({ type: '', category: '' });


    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            let url = '/expense/allExpenses?limit=100';
            if (filters.type) url += `&type=${filters.type}`;
            if (filters.category) url += `&category=${filters.category}`;
            const res = await api.get(url);
            setTransactions(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions])


    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);


    const balance = totalIncome - totalExpense;

    if (loading) return <p className="text-center text-muted-foreground py-12">Loading transactions...</p>;
    if (error) return <p className="text-center text-destructive py-12">{error}</p>;

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

            <TrendsChart transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 min-w-0">
                    <CategoryPieChart transactions={transactions} />
                </div>


                {/* Transactions table */}

                <div className='lg:col-span-2' >
                    <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <Select value={filters.type} onValueChange={(v) => setFilters(prev => ({ ...prev, type: v === 'all' ? '' : v }))}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Types">

                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="income">Income Only</SelectItem>
                                <SelectItem value="expense">Expense Only</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.category}
                            onValueChange={(v) => setFilters(prev => ({ ...prev, category: v === 'all' ? '' : v }))}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {/* You can reuse your categories array here */}
                                {["food", "transport", "housing", "utilities", "entertainment", "health", "education", "salary", "freelance", "investment", "other"].map(cat => (
                                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(filters.type || filters.category) && (
                            <Button variant="ghost" onClick={() => setFilters({ type: '', category: '' })} className="text-xs">
                                Clear Filters
                            </Button>
                        )}

                    </div>


                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">
                                Recent Transactions
                            </CardTitle>
                            <CardAction>
                                <Button size='lg' onClick={() => setIsDialogOpen(true)}>
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
            </div>

            <AddTransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={fetchTransactions} />
        </div>
    )
}

export default Dashboard;