import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Wallet, BarChart3, ShieldCheck, Layers, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#7f1d1d] to-[#4c0519] relative overflow-hidden">
            {/* Ambient Background Gradients for Depth */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-950/20 blur-[120px] rounded-full" />

            {/* Left Section - Form */}
            <div className="flex items-center justify-center p-6 lg:p-12 z-10 order-2 lg:order-1">
                <Card className="max-w-md w-full bg-black border-white/5 shadow-2xl p-2">
                    <CardHeader className='text-center pb-8'>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <Wallet className="h-5 w-5" />
                        </div>

                        <CardTitle className="text-2xl font-bold tracking-tight text-white mb-1">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Enter your credentials to manage your expenses
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-xl animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className='space-y-5'>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300 text-xs font-bold uppercase tracking-wider ml-1">Email Address</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    required 
                                    placeholder="name@example.com" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="!bg-white !text-black border-zinc-800 h-12 focus:ring-0 focus:border-zinc-500 transition-all placeholder:text-zinc-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Password</Label>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    required 
                                    placeholder="••••••••" 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="!bg-white !text-black border-zinc-800 h-12 focus:ring-0 focus:border-zinc-500 transition-all placeholder:text-zinc-400"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 transition-all py-5 rounded-xl font-bold text-lg mt-4" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                                        Authenticating...
                                    </span>
                                ) : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center pb-4">
                            <p className='text-zinc-500 text-sm'>
                                Don't have an account?{' '}
                                <Link to="/register" className="text-white font-bold hover:underline underline-offset-4 decoration-zinc-500">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Section - Feature Showcase */}
            <div className="hidden lg:flex flex-col justify-center p-12 lg:p-24 z-10 order-1 lg:order-2">
                <div className="max-w-xl space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-white leading-[1.1]">
                            Take Control of Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Financial Future.</span>
                        </h1>
                        <p className="text-lg text-zinc-300 leading-relaxed max-w-lg">
                            An all-in-one platform to track every penny, set smart budgets, and gain meaningful insights into your spending habits.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                        <FeatureItem 
                            icon={BarChart3}
                            title="Interactive Analytics"
                            desc="Visualize your spending patterns with real-time trend charts and category-wise breakdowns."
                        />
                        <FeatureItem 
                            icon={ShieldCheck}
                            title="Smart Budgets"
                            desc="Set and monitor custom budgets for different categories to ensure you stay within your limits."
                        />
                        <FeatureItem 
                            icon={Layers}
                            title="Multi-Role Access"
                            desc="Manage access with distinct permissions for Admins, Analysts, and Viewers in your organization."
                        />
                         <FeatureItem 
                            icon={CheckCircle2}
                            title="Effortless Logging"
                            desc="Quickly record transactions with detailed tags, notes, and recurrence for automated tracking."
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const FeatureItem = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-4 group">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
            <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
            <h3 className="text-lg font-bold text-white transition-colors">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed tracking-wide">{desc}</p>
        </div>
    </div>
)

export default Login;