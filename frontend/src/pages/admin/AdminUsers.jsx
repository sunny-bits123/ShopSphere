import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    getAllUsers()
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="container admin-page">
      <h1>Users</h1>
      {loading ? (
        <div className="spinner" />
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>{u.role}</span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u._id, u.name)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
