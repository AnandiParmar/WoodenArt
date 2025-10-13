// Simplified config object used by Users page

export const userTableConfig = {
  title: 'User Management',
  description: 'Manage user accounts and permissions',
  columns: [
    {
      key: 'id',
      label: 'ID',
      type: 'number',
      sortable: true,
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      sortable: true,
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'USER', label: 'User' },
        { value: 'ADMIN', label: 'Admin' },
      ],
      sortable: true,
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'boolean',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      type: 'datetime',
      sortable: true,
    },
  ],
  actions: [
    {
      type: 'edit',
      label: 'Edit User',
      endpoint: '/api/graphql',
    },
    {
      type: 'delete',
      label: 'Delete User',
      endpoint: '/api/graphql',
      confirmMessage: 'Are you sure you want to delete this user?',
    },
  ],
  searchFields: ['firstName', 'lastName', 'email'],
  defaultSort: { field: 'createdAt', direction: 'desc' },
};

