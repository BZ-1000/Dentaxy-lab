import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    User,
    Mail,
    Smartphone,
    Shield,
    Ban,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

// Mock Data
const MOCK_USERS = [
    { id: 'USR-001', name: 'Dr. Sarah Connor', email: 'sarah@skynet.dental', role: 'Clinic Admin', status: 'active', plan: 'Enterprise', lastActive: '2 mins ago' },
    { id: 'USR-002', name: 'Dr. Emmett Brown', email: 'doc@future.dental', role: 'Dentist', status: 'active', plan: 'Pro', lastActive: '1 hour ago' },
    { id: 'USR-003', name: 'Marty McFly', email: 'marty@future.dental', role: 'Assistant', status: 'offline', plan: 'Basic', lastActive: '2 days ago' },
    { id: 'USR-004', name: 'Biff Tannen', email: 'biff@tannen.co', role: 'Billing', status: 'suspended', plan: 'Basic', lastActive: '1 week ago' },
    { id: 'USR-005', name: 'Ellen Ripley', email: 'ripley@nostromo.health', role: 'Clinic Admin', status: 'active', plan: 'Enterprise', lastActive: 'Just now' },
];

const AdminUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Identity Nexus</h1>
                    <p className="mt-1 font-medium text-zinc-400">Manage all identities across the Dentaxy Network</p>
                </div>
                <Button className="rounded-full bg-zinc-900 px-6 font-medium text-white hover:bg-zinc-800">
                    <User className="mr-2 h-4 w-4" />
                    Create Identity
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-2 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        placeholder="Search by name, email, or ID..."
                        className="h-10 border-0 bg-transparent pl-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="h-6 w-px bg-zinc-100" />
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-zinc-900">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* Users Grid */}
            <div className="rounded-[2.5rem] border border-zinc-100 bg-white shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-50/50">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-zinc-400">
                            <th className="px-8 py-4">Identity</th>
                            <th className="px-6 py-4">Role & Plan</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filteredUsers.map((user) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group transition-colors hover:bg-zinc-50/50"
                            >
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-white shadow-sm ring-1 ring-zinc-100 font-bold text-zinc-700">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900">{user.name}</p>
                                            <p className="text-xs text-zinc-400 font-mono">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-zinc-700">{user.role}</span>
                                        <Badge variant="outline" className="w-fit border-zinc-200 text-xs font-normal text-zinc-500">
                                            {user.plan}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        className={`
                      border-0 px-2 py-1 font-medium
                      ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : ''}
                      ${user.status === 'offline' ? 'bg-zinc-50 text-zinc-500' : ''}
                      ${user.status === 'suspended' ? 'bg-red-50 text-red-600' : ''}
                    `}
                                    >
                                        {user.status === 'active' && <CheckCircle2 className="mr-1.5 h-3 w-3" />}
                                        {user.status === 'suspended' && <Ban className="mr-1.5 h-3 w-3" />}
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                        <Clock className="h-3.5 w-3.5" />
                                        {user.lastActive}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-zinc-100 shadow-lg">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2">
                                                <User className="h-4 w-4" /> View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Shield className="h-4 w-4" /> Change Role
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-700">
                                                <Ban className="h-4 w-4" /> Suspend Access
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
