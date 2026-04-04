import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import api from '@/services/api';

import { toast } from 'sonner';
import { Textarea } from './ui/textarea';


const AddTransactionDialog = ({ open, onOpenChange, onSuccess }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: 'other',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
        recurringInterval: 'monthly',
        note: '',
        tags: '',
        currency: 'INR'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        "food", "transport", "housing", "utilities",
        "entertainment", "health", "education",
        "salary", "freelance", "investment", "other",
    ]

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };
            await api.post('/expense/create', payload);
            onSuccess();
            onOpenChange(false);
            toast.success("Transaction added successfully!")
            setFormData({
                description: '',
                amount: '',
                type: 'expense',
                category: 'other',
                date: new Date().toISOString().split('T')[0],
                isRecurring: false,
                recurringInterval: 'monthly'
            })

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add Transaction!';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogHeader>
                        <DialogTitle>
                            Add New Transaction
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='space-y-4 py-4'>
                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                                {error}
                            </div>
                        )}

                        <div className='space-y-2'>
                            <Label htmlFor="description">
                                Description
                            </Label>
                            <Input
                                id="description"
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Rent, Groceries, etc."
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor="amount">
                                    Amount
                                </Label>
                                <Input id="amount" required type='number' step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className='space-y-2'>
                                <Label htmlFor="category">
                                    Category
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger id="category" className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="capitalize">
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">
                                    Date
                                </Label>
                                <Input id="date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="space-y-0.5">
                                <Label className="text-base">Recurring Transaction</Label>
                                <p className="text-xs text-muted-foreground">Automatically add this transaction periodically</p>
                            </div>
                            <Switch
                                checked={formData.isRecurring}
                                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">Notes</Label>
                            <Textarea id="note" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="bg-slate-100" placeholder="Additional notes" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="travel, food, work" />
                        </div>

                        {formData.isRecurring && (
                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                <Label htmlFor="interval">Interval</Label>
                                <Select
                                    value={formData.recurringInterval}
                                    onValueChange={(value) => setFormData({ ...formData, recurringInterval: value })}
                                >
                                    <SelectTrigger id="interval">
                                        <SelectValue placeholder="Select interval" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Adding...' : 'Add Transaction'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}


export default AddTransactionDialog;