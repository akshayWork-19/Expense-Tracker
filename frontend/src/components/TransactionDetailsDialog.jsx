import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from './ui/label';
import { Badge } from './ui/badge';

import { Calendar, Tag, FileText, IndianRupee } from "lucide-react";

const TransactionDetailsDialog = ({ transaction, open, onOpenChange }) => {
    if (!transaction) return null;

    const isIncome = transaction.type === 'income';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`w-3 h-3 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-muted-foreground">
                            {transaction.type} Details
                        </span>
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {transaction.description}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Main Amount Card */}
                    <div className={`p-6 rounded-2xl flex flex-col items-center justify-center ${isIncome ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        <span className={`text-4xl font-black ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                        <span className="text-sm font-bold mt-1 text-black dark:text-muted-foreground capitalize">
                            {transaction.category}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-xl flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-black dark:text-muted-foreground">Date</span>
                                <span className="text-sm font-bold text-black dark:text-foreground">{new Date(transaction.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-xl flex items-center gap-3">
                            <Tag className="w-4 h-4 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-black dark:text-muted-foreground">Recurrence</span>
                                <span className="text-sm font-bold text-black dark:text-foreground capitalize">{transaction.isRecurring ? transaction.recurringInterval : 'One-time'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    {transaction.tags && transaction.tags.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-black dark:text-muted-foreground uppercase flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Tags
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {transaction.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes Section */}
                    {transaction.note && (
                        <div className="space-y-2 p-4 bg-muted/30 rounded-xl">
                            <Label className="text-xs font-bold text-black dark:text-muted-foreground uppercase flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Note
                            </Label>
                            <p className="text-sm leading-relaxed text-black dark:text-foreground/80 italic font-medium">
                                "{transaction.note}"
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailsDialog;
