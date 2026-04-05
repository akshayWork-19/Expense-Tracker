import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import api from '@/services/api';
import AddTransactionDialog from "../components/AddTransactionDialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { buttonVariants } from '@/components/ui/button';
import { toast } from 'sonner';
import TransactionDetailsDialog from '@/components/TransactionDetailsDialog';
import { Input } from '@/components/ui/input';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: '', category: '', from: '', to: '', search: ''
    });
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [detailTransaction, setDetailTransaction] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleRowClick = (transaction) => {
        setDetailTransaction(transaction);
        setIsDetailOpen(true);
    };

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            let url = '/expense/allExpenses?limit=500';
            if (filters.type) url += `&type=${filters.type}`;
            if (filters.category) url += `&category=${filters.category}`;
            if (filters.from) url += `&from=${filters.from}`;
            if (filters.to) url += `&to=${filters.to}`;

            const res = await api.get(url);
            let data = res.data.data;

            if (filters.search) {
                data = data.filter(t =>
                    t.description.toLowerCase().includes(filters.search.toLowerCase())
                );
            }

            setTransactions(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) return;
        try {
            await api.post('/expense/bulk-delete', { ids: selectedIds });
            toast.success(`${selectedIds.length} transactions deleted!`);
            setSelectedIds([]);
            fetchTransactions();
        } catch (error) {
            toast.error("Failed to delete transactions");
        }
    }

    const handleExportCSV = async () => {
        try {
            let url = '/expense/export/csv?';
            if (filters.type) url += `type=${filters.type}&`;
            if (filters.category) url += `category=${filters.category}&`;
            if (filters.from) url += `from=${filters.from}&`;
            if (filters.to) url += `to=${filters.to}&`;
            const response = await api.get(url, { responseType: 'blob' });
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
            toast.error("Failed to export data");
        }
    }

    return (
        <div className='space-y-6 animate-in fade-in duration-500'>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-sm text-black dark:text-muted-foreground mx-auto mt-1 font-medium">Manage and track all your financial activities here.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleExportCSV} className="gap-2 border-black ">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Transaction
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between py-4">
                <div className="flex flex-wrap gap-4 items-center flex-1">
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter transactions..."
                            className="pl-9 bg-background"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                    <Select value={filters.type} onValueChange={(v) => setFilters(prev => ({ ...prev, type: v === 'all' ? '' : v }))}>
                        <SelectTrigger className="w-[140px] bg-background">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.category} onValueChange={(v) => setFilters(prev => ({ ...prev, category: v === 'all' ? '' : v }))}>
                        <SelectTrigger className="w-[160px] bg-background">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent anchor="bottom">
                            <SelectItem value="all">All Categories</SelectItem>
                            {["food", "transport", "housing", "utilities", "entertainment", "health", "education", "salary", "freelance", "investment", "other"].map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                        <Popover open={openFrom} onOpenChange={setOpenFrom}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal bg-background", !filters.from && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.from ? format(new Date(filters.from), "MMM dd, yyyy") : <span>From</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={filters.from ? new Date(filters.from) : undefined} onSelect={(date) => { setFilters(p => ({ ...p, from: date ? date.toISOString() : '' })); setOpenFrom(false); }} />
                            </PopoverContent>
                        </Popover>
                        <Popover open={openTo} onOpenChange={setOpenTo}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal bg-background", !filters.to && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.to ? format(new Date(filters.to), "MMM dd, yyyy") : <span>To</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={filters.to ? new Date(filters.to) : undefined} onSelect={(date) => { setFilters(p => ({ ...p, to: date ? date.toISOString() : '' })); setOpenTo(false); }} />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {(filters.type || filters.category || filters.from || filters.to || filters.search) && (
                        <Button variant="ghost" onClick={() => setFilters({ type: '', category: '', from: '', to: '', search: '' })} className="text-sm">
                            Clear Filters
                        </Button>
                    )}
                </div>

                {selectedIds.length > 0 && (
                    <Button variant='destructive' onClick={handleBulkDelete}>
                        Delete ({selectedIds.length})
                    </Button>
                )}
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[50px] px-4">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={selectedIds.length === transactions.length && transactions.length > 0}
                                    onChange={(e) => {
                                        setSelectedIds(e.target.checked ? transactions.map(t => t._id) : []);
                                    }}
                                />
                            </TableHead>
                            <TableHead className="font-semibold px-4 text-left">Description</TableHead>
                            <TableHead className="font-semibold px-4 text-left">Type</TableHead>
                            <TableHead className="font-semibold px-4 text-left">Category</TableHead>
                            <TableHead className="font-semibold px-4 text-left whitespace-nowrap">Recurrence</TableHead>
                            <TableHead className="font-semibold px-4 text-left">Tags</TableHead>
                            <TableHead className="font-semibold px-4 text-left">Note</TableHead>
                            <TableHead className="font-semibold px-4 text-left">Date</TableHead>
                            <TableHead className="font-semibold text-right px-6">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={9} className="h-32 text-center text-muted-foreground">Loading...</TableCell></TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow><TableCell colSpan={9} className="h-32 text-center text-muted-foreground">No transactions found</TableCell></TableRow>
                        ) : (
                            transactions.map((t) => (
                                <TableRow key={t._id} className="hover:bg-muted/30 cursor-pointer group" onClick={() => handleRowClick(t)}>
                                    <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300"
                                            checked={selectedIds.includes(t._id)}
                                            onChange={(e) => {
                                                setSelectedIds(prev =>
                                                    e.target.checked ? [...prev, t._id] : prev.filter(id => id !== t._id)
                                                );
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium px-4 text-left">{t.description}</TableCell>
                                    <TableCell className="px-4 text-left">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                            t.type === 'income'
                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                                : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                                        )}>
                                            {t.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 text-left">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border/50 capitalize">
                                            {t.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 text-left">
                                        {t.isRecurring ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] text-primary font-medium">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                {t.recurringInterval}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-black dark:text-muted-foreground/50 font-medium">One-time</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 text-left">
                                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                                            {t.tags && t.tags.length > 0 ? t.tags.map(tag => (
                                                <span key={tag} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-black dark:text-muted-foreground border border-border/70 font-medium">
                                                    #{tag}
                                                </span>
                                            )) : <span className="text-[10px] text-black dark:text-muted-foreground/50">—</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 text-left">
                                        <span className="text-xs text-black dark:text-muted-foreground font-medium truncate max-w-[100px] block">
                                            {t.note || <span className="text-black/30 dark:text-muted-foreground/30">—</span>}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 text-left text-black dark:text-muted-foreground font-medium whitespace-nowrap">
                                        {format(new Date(t.date), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell className={cn("font-bold text-right px-6", t.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500')}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <AddTransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={fetchTransactions} />
            <TransactionDetailsDialog transaction={detailTransaction} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
        </div>
    );
};

export default Transactions;
