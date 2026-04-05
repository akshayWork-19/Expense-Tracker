import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';

const Budgets = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-foreground">Budgets</h1>
          <p className="text-black dark:text-muted-foreground font-medium">Set and manage your monthly spending limits.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center py-12 border-dashed bg-muted/20">
          <CardContent className="text-center pt-6">
            <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-6 w-6 text-black dark:text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-black dark:text-foreground">No active budgets</h3>
            <p className="text-sm text-black dark:text-muted-foreground max-w-[200px] mx-auto mt-1 font-medium">
              Start tracking your spending by creating your first budget category.
            </p>
            <Button variant="outline" className="mt-6">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Budgets;
