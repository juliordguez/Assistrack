<template>
  <div class="vacation-permissions">
    <div class="header">
      <h2>Vacation Permissions</h2>
      <button @click="showCreatePermissionModal" class="create-button">Create Vacation Permission</button>
    </div>
    <div class="pagination-controls">
      <input type="text" v-model="searchQuery" placeholder="Search by user ID..." class="search-bar" />
    </div>
    <table class="permissions-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="permission in paginatedPermissions" :key="permission.id">
          <td>{{ permission.id }}</td>
          <td>{{ permission.user_id }}</td>
          <td>{{ permission.start_date }}</td>
          <td>{{ permission.end_date }}</td>
          <td>{{ permission.status }}</td>
          <td>
            <button @click="editPermission(permission)" class="edit-button">Edit</button>
            <button @click="deletePermission(permission)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-info">
      <div class="pagination-details">
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
        <p>Total permissions: {{ filteredPermissions.length }}, Showing: {{ paginatedPermissions.length }}</p>
      </div>
      <div class="pagination-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <!-- Modal for Creating or Editing Vacation Permission -->
    <div v-if="showPermissionModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Vacation Permission' : 'Create Vacation Permission' }}</h3>
        <form @submit.prevent="isEditing ? updatePermission() : createPermission()">
          <div class="form-group">
            <label for="user_id">User ID:</label>
            <input v-model="currentPermission.user_id" id="user_id" type="number" required />
          </div>
          <div class="form-group">
            <label for="start_date">Start Date:</label>
            <input v-model="currentPermission.start_date" id="start_date" type="date" required />
          </div>
          <div class="form-group">
            <label for="end_date">End Date:</label>
            <input v-model="currentPermission.end_date" id="end_date" type="date" required />
          </div>
          <div class="form-group">
            <label for="status">Status:</label>
            <input v-model="currentPermission.status" id="status" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="create-button">{{ isEditing ? 'Update' : 'Create' }}</button>
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
  name: 'VacationPermissionManagement',
  data() {
    return {
      permissions: [],
      showPermissionModal: false,
      isEditing: false,
      currentPage: 1,
      rowsPerPage: 5,
      rowsOptions: [5, 10, 15, 20],
      searchQuery: '',
      currentPermission: {
        id: null,
        user_id: null,
        start_date: '',
        end_date: '',
        status: null
      },
      errors: {
        user_id: '',
        start_date: '',
        end_date: '',
        status: ''
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredPermissions.length / this.rowsPerPage);
    },
    filteredPermissions() {
      if (!this.searchQuery) {
        return this.permissions;
      }
      const query = this.searchQuery.toLowerCase();
      return this.permissions.filter(permission => permission.user_id.toString().includes(query));
    },
    paginatedPermissions() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredPermissions.slice(start, end);
    },
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '');
    }
  },
  async created() {
    await this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
      try {
        const response = await apiClient.get('/vacation_permissions');
        this.permissions = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load vacation permissions.');
      }
    },
    onRowsPerPageChange() {
      this.currentPage = 1;
    },
    showCreatePermissionModal() {
      this.currentPermission = {
        id: null,
        user_id: null,
        start_date: '',
        end_date: '',
        status: null
      };
      this.isEditing = false;
      this.showPermissionModal = true;
    },
    editPermission(permission) {
      this.currentPermission = { ...permission };
      this.isEditing = true;
      this.showPermissionModal = true;
    },
    closeModal() {
      this.showPermissionModal = false;
    },
    async createPermission() {
      if (this.hasErrors) return;

      try {
        const response = await apiClient.post('/vacation_permissions', this.currentPermission);
        this.permissions.push(response.data);
        alert(`Vacation permission created successfully for User ID ${this.currentPermission.user_id}!`);
        this.closeModal();
        await this.fetchPermissions();
      } catch (error) {
        console.error('Error creating vacation permission:', error);
        alert(`Failed to create vacation permission: ${error.message}`);
      }
    },
    async updatePermission() {
      if (this.hasErrors) return;

      try {
        const response = await apiClient.put(`/vacation_permissions/${this.currentPermission.id}`, this.currentPermission);
        const updatedPermission = response.data;
        const index = this.permissions.findIndex(p => p.id === updatedPermission.id);
        if (index !== -1) {
          this.permissions[index] = updatedPermission;
        }
        alert(`Vacation permission updated successfully for User ID ${updatedPermission.user_id}!`);
        this.closeModal();
        await this.fetchPermissions();
      } catch (error) {
        console.error('Error updating vacation permission:', error);
        alert(`Failed to update vacation permission for User ID ${this.currentPermission.user_id}`);
      }
    },
    async deletePermission(permission) {
      try {
        const confirmed = confirm(`Are you sure you want to delete the vacation permission for User ID ${permission.user_id}?`);
        if (confirmed) {
          await apiClient.delete(`/vacation_permissions/${permission.id}`);
          this.permissions = this.permissions.filter(p => p.id !== permission.id);
          alert(`Vacation permission for User ID ${permission.user_id} deleted successfully!`);
        }
      } catch (error) {
        console.error('Error deleting vacation permission:', error);
        alert(`Failed to delete vacation permission for User ID ${permission.user_id}`);
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
    }
  }
};
</script>

<style scoped>
.vacation-permissions {
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
.permissions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}
.permissions-table th, .permissions-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  word-wrap: break-word;
}
.permissions-table th {
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
.form-group input {
  width: calc(100% - 16px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
