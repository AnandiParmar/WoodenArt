import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: {
    edges: Array<{
      node: User;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
    totalCount: number;
  };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchUsers = async (search?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query Users($first: Int, $filter: UsersFilter, $sort: UsersSort) {
              users(first: $first, filter: $filter, sort: $sort) {
                edges {
                  node {
                    id
                    email
                    firstName
                    lastName
                    role
                    isActive
                    createdAt
                    updatedAt
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                totalCount
              }
            }
          `,
          variables: {
            first: 100, // Get all users for now, can be paginated later
            filter: search ? { search } : {},
            sort: sortBy ? { field: sortBy, direction: sortOrder || 'DESC' } : { field: 'createdAt', direction: 'DESC' },
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const usersData = data.data.users;
      setUsers(usersData.edges.map((edge: any) => edge.node));
      setTotalCount(usersData.totalCount);
      setHasNextPage(usersData.pageInfo.hasNextPage);
      setHasPreviousPage(usersData.pageInfo.hasPreviousPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation DeleteUser($id: ID!) {
              deleteUser(id: $id)
            }
          `,
          variables: { id },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // Refresh the users list
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    refetch: fetchUsers,
    deleteUser,
  };
}
