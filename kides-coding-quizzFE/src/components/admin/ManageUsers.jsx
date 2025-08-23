// src/components/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../utils/api';

const ManageUsers = ({ setLoading }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'kid',
    name: '',
    age: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (error) {
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await usersAPI.create(newUser);
      alert('User added successfully!');
      setNewUser({
        username: '',
        password: '',
        role: 'kid',
        name: '',
        age: ''
      });
      loadUsers(); // Reload users
    } catch (error) {
      alert('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      await usersAPI.delete(id);
      alert('User deleted successfully!');
      loadUsers(); // Reload users
    } catch (error) {
      alert('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-users">
      <div className="add-user-form">
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={newUser.age}
              onChange={handleChange}
              min="7"
              max="14"
            />
          </div>
          
          <div className="form-group">
            <label>Role:</label>
            <select name="role" value={newUser.role} onChange={handleChange}>
              <option value="kid">Kid</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary">Add User</button>
        </form>
      </div>
      
      <div className="users-table">
        <h3>Existing Users ({users.length})</h3>
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>USERNAME</th>
              <th>ROLE</th>
              <th>AGE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.age || 'N/A'}</td>
                <td>
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;