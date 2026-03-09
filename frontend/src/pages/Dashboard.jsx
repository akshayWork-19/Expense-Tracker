import react from 'react';

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
                    <p className='text-slate-500 mt-2'>
                        Manage your income and expenses based on your DB schema.
                    </p>
                </div>
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                    Generate Report
                </button>
            </header>

            {/* stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Total Balance
                    </p>
                    <p className={`text-3xl font-black mt-2 ${balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                        ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Income
                    </p>
                    <p className="text-3xl font-black mt-2 text-slate-900">
                        ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Expenses
                    </p>

                    <p className="text-3xl font-black mt-2 text-slate-900">
                        ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Transactions table */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
                    <h2 className="font-bold text-slate-900 text-lg">
                        Recent Transactions
                    </h2>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md">
                        + New Transaction
                    </button>
                </div>

                <div className='overflow-x-auto'>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((t) => (
                                <tr key={t._id} className="hover:bg-slate-50/80 transition-all group">
                                    {/* 1. Description column (Was missing!) */}
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {t.description}
                                        </div>
                                    </td>
                                    {/* 2. Category column */}
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                                            {t.category}
                                        </span>
                                    </td>
                                    {/* 3. Date column */}
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(t.date).toLocaleDateString()}
                                    </td>
                                    {/* 4. Amount column */}
                                    <td className={`px-6 py-4 font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>
        </div>
    )
}

export default Dashboard;