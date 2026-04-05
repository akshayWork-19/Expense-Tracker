import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Wallet, User, Mail, Lock, Sparkles, PieChart, Zap, Users } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(formData);
            toast.success("Welcome to ExpenseTracker!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#7f1d1d] to-[#4c0519] relative overflow-hidden">
            {/* Ambient Background Gradients for Depth */}
            <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-white/5 blur-[130px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-rose-950/20 blur-[130px] rounded-full" />
            
            {/* Left Section - Form */}
            <div className="flex items-center justify-center p-6 lg:p-12 z-10 order-2 lg:order-1">
                <Card className="max-w-md w-full bg-black border-white/5 shadow-2xl p-2">
                    <CardHeader className="text-center pb-8">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 duration-300">
                            <Wallet className="h-5 w-5" />
                        </div>

                        <CardTitle className="text-2xl font-bold tracking-tight text-white mb-1">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Start managing your expenses effectively today
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-xl animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-zinc-300 text-xs font-bold uppercase tracking-wider ml-1">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                                    <Input 
                                        id="username" 
                                        type="text" 
                                        required 
                                        placeholder="yourname" 
                                        value={formData.username} 
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="!bg-white !text-black border-zinc-800 h-11 pl-10 focus:ring-0 focus:border-zinc-500 transition-all placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300 text-xs font-bold uppercase tracking-wider ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        required 
                                        placeholder="name@example.com" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="!bg-white !text-black border-zinc-800 h-11 pl-10 focus:ring-0 focus:border-zinc-500 transition-all placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300 text-xs font-bold uppercase tracking-wider ml-1">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                                    <Input 
                                        id="password" 
                                        type="password" 
                                        required 
                                        placeholder="••••••••" 
                                        value={formData.password} 
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="!bg-white !text-black border-zinc-800 h-11 pl-10 focus:ring-0 focus:border-zinc-500 transition-all placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 transition-all py-5 rounded-xl font-bold text-lg mt-4" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                                        Creating Account...
                                    </span>
                                ) : 'Register'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center pb-4">
                            <p className='text-zinc-500 text-sm'>
                                Already have an account?{' '}
                                <Link to="/login" className="text-white font-bold hover:underline underline-offset-4 decoration-zinc-500">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Section - Welcome Showcase */}
            <div className="hidden lg:flex flex-col justify-center p-12 lg:p-24 z-10 order-1 lg:order-2">
                <div className="max-w-xl space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-white leading-[1.1]">
                            Start Your Journey to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Financial Freedom.</span>
                        </h1>
                        <p className="text-lg text-zinc-300 leading-relaxed max-w-lg">
                            Join thousands of users who have transformed their spending habits with our intelligent tracking and analysis tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                        <SignupFeature 
                            icon={Sparkles}
                            title="Instant Set-up"
                            desc="Get started in seconds. No complex configurations, just pure financial tracking power."
                        />
                        <SignupFeature 
                            icon={PieChart}
                            title="Beautiful Insights"
                            desc="Turn raw numbers into actionable data with stunning visualizations and deep-dive reports."
                        />
                        <SignupFeature 
                            icon={Zap}
                            title="Real-time Updates"
                            desc="Watch your net worth and budget status update instantly with every transaction you log."
                        />
                         <SignupFeature 
                            icon={Users}
                            title="Built for Everyone"
                            desc="Whether for personal use or business, our flexible role system adapts to your needs."
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const SignupFeature = ({ icon: Icon, title, desc }) => (
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

export default Register;