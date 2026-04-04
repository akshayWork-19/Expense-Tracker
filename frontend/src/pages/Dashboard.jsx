import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import api from '@/services/api';
import AddTransactionDialog from "../components/AddTransactionDialog";
import CategoryPieChart from '@/components/CategoryPieChart';
import TrendsChart from '@/components/TrendsChart';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { buttonVariants } from '@/components/ui/button';
import { toast } from 'sonner';
import TransactionDetailsDialog from '@/components/TransactionDetailsDialog';


const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: '', category: '', from: '',
        to: ''
    });
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [globalSummary, setGlobalSummary] = useState(null);
    const [categorySummary, setCategorySummary] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [budgetOverview, setBudgetOverview] = useState(null);
    const [detailTransaction, setDetailTransaction] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);



    const handleRowClick = (transaction) => {
        setDetailTransaction(transaction);
        setIsDetailOpen(true);
    };

    const refreshData = useCallback(async () => {
        await Promise.all([
            fetchGlobalData(),
            fetchFilteredTransactions(),
        ])
    })

    const fetchGlobalData = async () => {
        try {
            setLoading(true);
            const [sumRes, catRes, budgetRes] = await Promise.all([api.get('/expense/getSummary'), api.get('/expense/getCategoryBreakdown?type=expense'), api.get('/expense/getBudgetOverview')]);
            setGlobalSummary(sumRes.data.summary);
            setCategorySummary(catRes.data.data);
            setBudgetOverview(budgetRes.data.data);
            setError('')
        } catch (error) {
            console.error("Failed to load global stats", error);
        } finally {
            setLoading(false);
        }
    }


    const handleBulkDelete = async () => {
        if (!window.confirm(`Are your sure you want to delete ${selectedIds.length} transactions?`)) return;
        try {
            await api.post('/expense/bulk-delete', { ids: selectedIds });
            toast.success(`${selectedIds.length} transactions deleted!`);
            setSelectedIds([]);
            refreshData();
        } catch (error) {
            toast.error("Failed to delete transactions :", error.message);
        }
    }



    const fetchFilteredTransactions = useCallback(async () => {
        try {
            let url = '/expense/allExpenses?limit=100';
            if (filters.type) url += `&type=${filters.type}`;
            if (filters.category) url += `&category=${filters.category}`;
            if (filters.from) url += `&from=${filters.from}`;
            if (filters.to) url += `&to=${filters.to}`;

            const res = await api.get(url);
            setTransactions(res.data.data);

        } catch (error) {
            setError(error.response?.data?.message || 'failed to load transactions')
        }
    }, [filters]);

    useEffect(() => {
        fetchGlobalData();
    }, []);

    useEffect(() => {
        fetchFilteredTransactions();
    }, [fetchFilteredTransactions]);


    const handleExportCSV = async () => {
        try {
            let url = '/expense/export/csv?';
            if (filters.type) url += `type=${filters.type}&`;
            if (filters.category) url += `category=${filters.category}&`;
            if (filters.from) url += `from=${filters.from}&`;
            if (filters.to) url += `to=${filters.to}&`;
            const response = await api.get(url, {
                responseType: 'blob'
            })
            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `expenses_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success('Exporting your data...');
        } catch (error) {
            toast.error("Failed to export data")
        }
    }


    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);


    const balance = totalIncome - totalExpense;

    if (loading) return <p className="text-center text-muted-foreground py-12">Loading transactions...</p>;
    if (error) return <p className="text-center text-destructive py-12">{error}</p>;

    return (
        <div className='space-y-8 animate-in fade-in duration-500'>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">
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
                            <p className={`text-3xl font-semibold ${globalSummary?.net || 0 ? 'text-primary' : 'text-destructive'}`}>
                                ${globalSummary?.net?.toFixed(2) || "0.00"}
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
                        <p className="text-3xl font-semibold text-foreground">
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
                        <p className="text-3xl font-semibold text-foreground">
                            ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <TrendsChart transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 min-w-0">
                    <CategoryPieChart categoryData={categorySummary} />
                </div>


                {/* Transactions table */}

                <div className='lg:col-span-2' >
                    <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center bg-muted/30 dark:bg-muted/10 rounded-t-xl">
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
                        <div className="flex items-center gap-2">
                            <Popover open={openFrom} onOpenChange={setOpenFrom}>
                                <PopoverTrigger className={cn(buttonVariants({ variant: "outline" }),
                                    "w-[160px] justify-start text-left font-normal",
                                    !filters.from && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {
                                        filters.from ? format(new Date(filters.from), "PPP") : <span>
                                            From date
                                        </span>
                                    }
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">

                                    <Calendar
                                        mode="single"
                                        selected={filters.from ? new Date(filters.from) : undefined}
                                        onSelect={(date) => {
                                            setFilters(p => ({ ...p, from: date ? date.toISOString() : '' }));
                                            setOpenFrom(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>


                            <span className="text-muted-foreground">-</span>

                            <Popover open={openTo} onOpenChange={setOpenTo}>
                                <PopoverTrigger className={cn(buttonVariants({ variant: "outline" }),
                                    "w-[160px] justify-start text-left font-normal",
                                    !filters.to && "text-muted-foreground"
                                )}>
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {filters.to ? format(new Date(filters.to), "PPP") : <span>To date</span>}
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0" align="start">

                                    <Calendar
                                        mode="single"
                                        selected={filters.to ? new Date(filters.to) : undefined}
                                        onSelect={(date) => {
                                            setFilters(p => ({ ...p, to: date ? date.toISOString() : '' }));
                                            setOpenTo(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                        </div>
                        {(filters.type || filters.category || filters.from || filters.to) && (
                            <Button variant="ghost" onClick={() => setFilters({ type: '', category: '', from: '', to: '' })} className="text-xs">
                                Clear Filters
                            </Button>
                        )}



                    </div>


                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">
                                Recent Transactions
                            </CardTitle>
                            {(filters.type || filters.category || filters.from || filters.to) && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Total for <span className="font-bold text-foreground capitalize">
                                        {filters.type || filters.category || 'Filtered Results'}
                                    </span>:
                                    <span className="ml-1 font-bold text-foreground">
                                        ${transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                                    </span>
                                </p>
                            )}

                            <CardAction>
                                {selectedIds.length > 0 && (
                                    <Button variant='destructive' size='lg' className="mr-4 animate-in fade-in zoom-in duration-200" onClick={handleBulkDelete}>
                                        Delete Selected ({selectedIds.length})
                                    </Button>
                                )}
                                <Button variant="outline" size="lg" className='mr-4' onClick={handleExportCSV}>
                                    Export CSV
                                </Button>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    + New Transaction
                                </Button>
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300"
                                                checked={selectedIds.length === transactions.length && transactions.length > 0}
                                                onChange={(e) => {
                                                    setSelectedIds(e.target.checked ? transactions.map(t => t._id) : []);
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {transactions.map((t) => (
                                        <TableRow key={t._id} className={`${selectedIds.includes(t._id) ? "bg-muted/50" : "hover:bg-muted/20"} cursor-pointer transition-colors`}
                                            onClick={() => handleRowClick(t)}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    checked={selectedIds.includes(t._id)}
                                                    onChange={(e) => {
                                                        setSelectedIds(prev =>
                                                            e.target.checked
                                                                ? [...prev, t._id]
                                                                : prev.filter(id => id !== t._id)
                                                        );
                                                    }}
                                                />
                                            </TableCell>
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

            <AddTransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={refreshData} />
            <TransactionDetailsDialog
                transaction={detailTransaction}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />

        </div >
    )
}

export default Dashboard;