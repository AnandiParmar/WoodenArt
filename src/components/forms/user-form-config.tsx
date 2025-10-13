import { FormField } from '../form-types';

export interface UserFormValues extends Record<string, unknown> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}

const fields = [
  {
    name: 'firstName' as const,
    label: 'First Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter first name',
  },
  {
    name: 'lastName' as const,
    label: 'Last Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter last name',
  },
  {
    name: 'email' as const,
    label: 'Email',
    type: 'email' as const,
    required: true,
    placeholder: 'Enter email address',
  },
  {
    name: 'password' as const,
    label: 'Password',
    type: 'password' as const,
    required: true,
    placeholder: 'Enter password (min 6 characters)',
    minLength: 6,
  },
  {
    name: 'role' as const,
    label: 'Role',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'USER', label: 'User' },
      { value: 'ADMIN', label: 'Admin' },
    ],
  },
  {
    name: 'isActive' as const,
    label: 'Active Status',
    type: 'checkbox' as const,
    defaultValue: true,
  },
] satisfies FormField<UserFormValues>[];

export const userFormConfig: { title: string; description: string; fields: FormField<UserFormValues>[]; submitText: string; cancelText: string } = {
  title: 'User Form',
  description: 'Create or edit user account',
  fields,
  submitText: 'Save User',
  cancelText: 'Cancel',
};

