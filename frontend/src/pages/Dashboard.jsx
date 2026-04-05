import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import CategoryPieChart from '@/components/CategoryPieChart';
import TrendsChart from '@/components/TrendsChart';
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import TransactionDetailsDialog from '@/components/TransactionDetailsDialog';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [globalSummary, setGlobalSummary] = useState(null);
    const [categorySummary, setCategorySummary] = useState([]);
    const [detailTransaction, setDetailTransaction] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleRowClick = (transaction) => {
        setDetailTransaction(transaction);
        setIsDetailOpen(true);
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [sumRes, catRes, transRes] = await Promise.all([
                api.get('/expense/getSummary'),
                api.get('/expense/getCategoryBreakdown?type=expense'),
                api.get('/expense/allExpenses?limit=10')
            ]);
            setGlobalSummary(sumRes.data.summary);
            setCategorySummary(catRes.data.data);
            setTransactions(transRes.data.data);
            setError('')
        } catch (error) {
            console.error("Failed to load dashboard data", error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalIncome = globalSummary?.income || 0;
    const totalExpense = globalSummary?.expense || 0;

    if (loading) return <p className="text-center text-muted-foreground py-12">Loading stats...</p>;
    if (error) return <p className="text-center text-destructive py-12">{error}</p>;

    return (
        <div className='space-y-8 animate-in fade-in duration-500'>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black dark:text-foreground">Dashboard Overview</h1>
                    <p className="text-black dark:text-muted-foreground font-medium">Detailed summary of your financial status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild variant='outline'>
                        <Link to="/transactions">View All History</Link>
                    </Button>
                </div>
            </header>

            {/* stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-black dark:text-muted-foreground uppercase tracking-widest">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={cn("text-3xl font-bold tracking-tight", (globalSummary?.net || 0) >= 0 ? "text-primary dark:text-emerald-400" : "text-destructive")}>
                            ${(globalSummary?.net || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-black dark:text-muted-foreground uppercase tracking-widest">Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
                            +${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-black dark:text-muted-foreground uppercase tracking-widest">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-500">
                            -${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <TrendsChart transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="min-w-0">
                    <CategoryPieChart categoryData={categorySummary} />
                </div>

                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
                        <Button asChild variant="ghost" size="sm" className="whitespace-nowrap">
                            <Link to="/transactions" className="flex items-center gap-1.5">
                                View All <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="font-semibold h-10 px-4">Description</TableHead>
                                <TableHead className="font-semibold h-10 px-4 text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.slice(0, 10).map((t) => (
                                <TableRow key={t._id} className="hover:bg-muted/20 cursor-pointer h-12" onClick={() => handleRowClick(t)}>
                                    <TableCell className="font-medium px-4">{t.description}</TableCell>
                                    <TableCell className={cn("font-bold text-right px-4", t.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500')}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <TransactionDetailsDialog
                transaction={detailTransaction}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />
        </div>
    )
}

export default Dashboard;
