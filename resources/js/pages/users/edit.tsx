import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface Props {
    user: User;
    roles: Role[];
}

const roleLabels: Record<string, string> = {
    admin: 'Admin',
    portfolio_manager: 'Portfolio Manager',
    salesperson: 'Salesperson',
};

export default function UserEdit({ user, roles }: Props) {
    const userRoleNames = user.roles?.map((role) => role.name) || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-muted-foreground">
                        Update user information and roles
                    </p>
                </div>

                <Form action={`/users/${user.id}`} method="put">
                    {({ errors, processing }) => (
                        <div className="flex flex-col gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Information</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            defaultValue={user.name}
                                            placeholder="John Doe"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={user.email}
                                            placeholder="john@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Leave blank to keep current password"
                                        />
                                        <InputError message={errors.password} />
                                        <p className="text-xs text-muted-foreground">
                                            Leave blank if you don't want to change the password
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            placeholder="Confirm new password"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Roles</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    {roles.map((role) => (
                                        <div key={role.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                name="roles[]"
                                                value={role.name}
                                                defaultChecked={userRoleNames.includes(role.name)}
                                            />
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className="cursor-pointer font-normal"
                                            >
                                                {roleLabels[role.name] || role.name}
                                            </Label>
                                        </div>
                                    ))}
                                    <InputError message={errors.roles} />
                                </CardContent>
                            </Card>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update User'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
