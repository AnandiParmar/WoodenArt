'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DynamicTable } from '@/components/dynamic-table';
import { DynamicForm } from '@/components/dynamic-form';
import { userTableConfig } from '@/components/tables/user-table-config';
import { userFormConfig } from '@/components/forms/user-form-config';

// Define proper types for user data
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} & Record<string, unknown>;

interface UserFormData extends Record<string, unknown> {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}
import Modal from '@/components/modal';
import { useUsers } from '@/hooks/useUsers';

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { users, loading: usersLoading, error, refetch, deleteUser } = useUsers();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleDelete = async (userData: User) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userData.id);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const handleEdit = (userData: User) => {
    setEditingUser(userData);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      const mutation = editingUser ? 'updateUser' : 'createUser';
      const variables = editingUser 
        ? { input: { id: editingUser.id, ...formData } }
        : { input: formData };

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ${mutation}($input: ${editingUser ? 'UpdateUserInput' : 'CreateUserInput'}!) {
              ${mutation}(input: $input) {
                id
                email
                firstName
                lastName
                role
                isActive
                createdAt
                updatedAt
              }
            }
          `,
          variables,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message || 'Failed to save user');
      }

      // Refresh the table
      await refetch();
      handleFormClose();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error instanceof Error ? error.message : 'Failed to save user');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">

          <DynamicTable
            data={users as unknown as Record<string, unknown>[]}
            columns={userTableConfig.columns}
            actions={[
              {
                label: 'Edit User',
                onClick: (item: Record<string, unknown>) => handleEdit(item as User),
                variant: 'primary' as const,
              },
              {
                label: 'Delete User',
                onClick: (item: Record<string, unknown>) => handleDelete(item as User),
                variant: 'danger' as const,
              },
            ]}
            loading={usersLoading}
            title="Users"
            onAdd={handleAdd}
            addButtonText="Add New User"
          />
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <DynamicForm<UserFormData>
          fields={userFormConfig.fields}
          initialValues={editingUser ? {
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            email: editingUser.email,
            role: editingUser.role,
            isActive: editingUser.isActive
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  );
}
