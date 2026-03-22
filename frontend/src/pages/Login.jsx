import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login = ({ onLogin, onSwitchToRegister }) => {
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
            toast.success('Welcome back!')
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-65 from-blue-700 to-indigo-200 px-4">
            <Card className="max-w-md w-full">
                <CardHeader className='text-center'>
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4 bg-slate-800">
                        E
                    </div>

                    <CardTitle className="text-2xl font-bold text-slate-800">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-slate-800">
                        Enter your email to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {
                        error && (
                            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>
                        )
                    }
                    <form onSubmit={handleSubmit} className='space-y-6 text-slate-800'>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" required placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} >
                            </Input>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required placeholder="********" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} >
                            </Input>
                        </div>

                        <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" size='lg' disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className='text-slate-800 text-sm'>
                            Don't have an account?{' '}
                            <button onClick={onSwitchToRegister} className="text-slate-800 font-bold hover:underline">
                                Sign Up
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>

        </div >
    )
}

export default Login;