<template>
  <div class="users">
    <div class="header">
      <h2>Users</h2>
      <button @click="showCreateUserModal" class="create-button">Create User</button>
    </div>
    <div class="pagination-controls">
      <label for="rowsPerPage">Rows per page:</label>
      <select v-model="rowsPerPage" id="rowsPerPage" @change="onRowsPerPageChange">
        <option v-for="option in rowsOptions" :key="option" :value="option">{{ option }}</option>
      </select>
      <input type="text" v-model="searchQuery" placeholder="Search..." class="search-bar" />
    </div>
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ getRoleName(user.role_id) }}</td>
          <td>
            <button @click="editUser(user)" class="edit-button">Edit</button>
            <button @click="deleteUser(user)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-info">
      <div class="pagination-details">
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
        <p>Total users: {{ filteredUsers.length }}, Showing: {{ paginatedUsers.length }}</p>
      </div>
      <div class="pagination-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Create User</h3>
        <form @submit.prevent="createUser()">
          <div class="form-group">
            <label for="firstname">First Name:</label>
            <input v-model="currentUser.firstname" id="firstname" type="text" required @input="validateFirstName" />
            <span v-if="errors.firstname" class="error">{{ errors.firstname }}</span>
          </div>
          <div class="form-group">
            <label for="lastname">Last Name:</label>
            <input v-model="currentUser.lastname" id="lastname" type="text" required @input="validateLastName" />
            <span v-if="errors.lastname" class="error">{{ errors.lastname }}</span>
          </div>
          <div class="form-group">
            <label for="username">Username:</label>
            <input v-model="currentUser.username" id="username" type="text" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input v-model="currentUser.email" id="email" type="email" required @input="validateEmail" />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label for="role_id">Role:</label>
            <select v-model="currentUser.role_id" id="role_id" required>
              <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input v-model="currentUser.password" id="password" type="password" required @input="validatePassword" />
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </div>
          <div class="modal-actions">
            <button type="submit" class="create-button" :disabled="hasErrors">Create</button>
            <button type="button" @click="closeModal" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit User</h3>
        <form @submit.prevent="updateUser()">
          <div class="form-group">
            <label for="firstname">First Name:</label>
            <input v-model="currentUser.firstname" id="firstname" type="text" required @input="validateFirstName" />
            <span v-if="errors.firstname" class="error">{{ errors.firstname }}</span>
          </div>
          <div class="form-group">
            <label for="lastname">Last Name:</label>
            <input v-model="currentUser.lastname" id="lastname" type="text" required @input="validateLastName" />
            <span v-if="errors.lastname" class="error">{{ errors.lastname }}</span>
          </div>
          <div class="form-group">
            <label for="username">Username:</label>
            <input v-model="currentUser.username" id="username" type="text" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input v-model="currentUser.email" id="email" type="email" required @input="validateEmail" />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label for="role_id">Role:</label>
            <select v-model="currentUser.role_id" id="role_id" required>
              <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="create-button" :disabled="hasErrors">Update</button>
            <button type="button" @click="closeModal" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/ApiClient';

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      roles: [],
      showCreateModal: false,
      showEditModal: false,
      currentPage: 1,
      rowsPerPage: 5,
      rowsOptions: [5, 10, 15, 20],
      searchQuery: '',
      currentUser: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        role_id: null,
        password: ''
      },
      errors: {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.rowsPerPage);
    },
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users;
      }
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => {
        return (
          user.firstname.toLowerCase().includes(query) ||
          user.lastname.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          this.getRoleName(user.role_id).toLowerCase().includes(query)
        );
      });
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '');
    }
  },
  async created() {
    try {
      const responseUsers = await apiClient.get('/users');
      this.users = responseUsers.data;
      const responseRoles = await apiClient.get('/roles');
      this.roles = responseRoles.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load users or roles.');
    }
  },
  methods: {
    onRowsPerPageChange() {
      this.currentPage = 1;
    },
    showCreateUserModal() {
      this.currentUser = {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        role_id: null,
        password: ''
      };
      this.errors = {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      };
      this.showCreateModal = true;
    },
    editUser(user) {
      this.currentUser = { ...user };
      this.errors = {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      };
      this.showEditModal = true;
    },
    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
    },
    async createUser() {
      if (this.hasErrors) return;
      try {
        const response = await apiClient.post('/users', this.currentUser);
        this.users.push(response.data);
        alert(`User ${this.currentUser.firstname} created successfully!`);
        this.closeModal();
      } catch (error) {
        console.error('Error creating user:', error);
        alert(`Failed to create user: ${error.message}`);
      }
    },
    async updateUser() {
      if (this.hasErrors) return;
      try {
        const response = await apiClient.put(`/users/${this.currentUser.id}`, this.currentUser);
        const updatedUser = response.data;
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        alert(`User ${updatedUser.firstname} updated successfully!`);
        this.closeModal();
      } catch (error) {
        console.error('Error updating user:', error);
        alert(`Failed to update user: ${this.currentUser.firstname}`);
      }
    },
    async deleteUser(user) {
      try {
        const confirmed = confirm(`Are you sure you want to delete ${user.firstname} ${user.lastname}?`);
        if (confirmed) {
          await apiClient.delete(`/users/${user.id}`);
          this.users = this.users.filter(u => u.id !== user.id);
          alert(`User ${user.firstname} ${user.lastname} deleted successfully!`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Failed to delete user: ${user.firstname}`);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    validateFirstName() {
      const regex = /^[a-zA-Z\s]+$/;
      if (!regex.test(this.currentUser.firstname)) {
        this.errors.firstname = 'First name must contain only letters.';
      } else {
        this.errors.firstname = '';
      }
    },
    validateLastName() {
      const regex = /^[a-zA-Z\s]+$/;
      if (!regex.test(this.currentUser.lastname)) {
        this.errors.lastname = 'Last name must contain only letters.';
      } else {
        this.errors.lastname = '';
      }
    },
    validateEmail() {
      const regex = /^[\w.-]+@[\w-]+\.[a-z]{2,6}(\.[a-z]{2,6})?$/i;
      if (!regex.test(this.currentUser.email)) {
        this.errors.email = 'Please enter a valid email address.';
      } else {
        this.errors.email = '';
      }
    },
    validatePassword() {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>/?]).{8,}$/;
      if (!regex.test(this.currentUser.password)) {
        this.errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
      } else {
        this.errors.password = '';
      }
    },
    getRoleName(role_id) {
      const role = this.roles.find(r => r.id === role_id);
      return role ? role.name : 'Unknown';
    }
  }
};
</script>

<style scoped>
.users {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.create-button {
  padding: 12px 24px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.create-button:hover {
  background-color: #218838;
}
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.search-bar {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}
.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  word-wrap: break-word;
}
.user-table th {
  background-color: #f2f2f2;
}
.edit-button, .delete-button {
  min-width: 80px;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 4px;
  cursor: pointer;
}
.edit-button:hover {
  background-color: #0069d9;
}
.delete-button {
  background-color: #dc3545;
}
.delete-button:hover {
  background-color: #c82333;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input, .form-group select {
  width: calc(100% - 16px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: red;
  font-size: 12px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
.cancel-button {
  padding: 12px 24px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cancel-button:hover {
  background-color: #c82333;
}
.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: #333;
}
.pagination-info .pagination-details {
  flex: 1;
}
.pagination-buttons {
  display: flex;
  gap: 15px;
}
.pagination-info button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination-info button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
