import { FormConfig } from '../form-types';

export const userFormConfig: FormConfig = {
  title: 'User Form',
  description: 'Create or edit user account',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter first name',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter last name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password (min 6 characters)',
      minLength: 6,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'USER', label: 'User' },
        { value: 'ADMIN', label: 'Admin' },
      ],
    },
    {
      name: 'isActive',
      label: 'Active Status',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  submitText: 'Save User',
  cancelText: 'Cancel',
};

