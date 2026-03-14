import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


const Register = ({ onRegister, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logging in with:', formData);
        onRegister();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 bg-linear-65 from-blue-700 to-indigo-200">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4 bg-slate-800">
                        E
                    </div>

                    <CardTitle className="text-2xl font-bold text-slate-800">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-slate-800">
                        Start Managing Your Expenses Effectively
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-6 text-slate-800'>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" type="text" required placeholder="akshaykumar" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} >
                            </Input>
                        </div>
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
                        <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" size='lg'>
                            Register
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className='text-slate-800 text-sm'>
                            Already have an account?{' '}
                            <button onClick={onSwitchToLogin} className="text-slate-800 font-bold hover:underline">
                                Sign In
                            </button>
                        </p>
                    </div>
                </CardContent>

            </Card>
        </div>
    )
}

export default Register;