<template>
  <div class="groups">
    <div class="header">
      <h2>Groups</h2>
      <button @click="showCreateGroupModal" class="create-button">Create Group</button>
    </div>
    <div class="pagination-controls">
      <label for="rowsPerPage">Rows per page:</label>
      <select v-model="rowsPerPage" id="rowsPerPage" @change="onRowsPerPageChange">
        <option v-for="option in rowsOptions" :key="option" :value="option">{{ option }}</option>
      </select>
      <input type="text" v-model="searchQuery" placeholder="Search..." class="search-bar" />
    </div>
    <table class="group-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Group Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in paginatedGroups" :key="group.id">
          <td>{{ group.id }}</td>
          <td>{{ group.name }}</td>
          <td>{{ group.description }}</td>
          <td>
            <button @click="editGroup(group)" class="edit-button">Edit</button>
            <button @click="deleteGroup(group)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-info">
      <div class="pagination-details">
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
        <p>Total groups: {{ filteredGroups.length }}, Showing: {{ paginatedGroups.length }}</p>
      </div>
      <div class="pagination-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Create Group</h3>
        <form @submit.prevent="createGroup()">
          <div class="form-group">
            <label for="name">Group Name:</label>
            <input v-model="currentGroup.name" id="name" type="text" required @input="validateGroupName" />
            <span v-if="errors.name" class="error">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <input v-model="currentGroup.description" id="description" type="text" required />
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
        <h3>Edit Group</h3>
        <form @submit.prevent="updateGroup()">
          <div class="form-group">
            <label for="name">Group Name:</label>
            <input v-model="currentGroup.name" id="name" type="text" required @input="validateGroupName" />
            <span v-if="errors.name" class="error">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <input v-model="currentGroup.description" id="description" type="text" required />
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
  name: 'GroupManagement',
  data() {
    return {
      groups: [],
      showCreateModal: false,
      showEditModal: false,
      currentPage: 1,
      rowsPerPage: 5,
      rowsOptions: [5, 10, 15, 20],
      searchQuery: '',
      currentGroup: {
        name: '',
        description: ''
      },
      errors: {
        name: ''
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredGroups.length / this.rowsPerPage);
    },
    filteredGroups() {
      if (!this.searchQuery) {
        return this.groups;
      }
      const query = this.searchQuery.toLowerCase();
      return this.groups.filter(group => {
        return (
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query)
        );
      });
    },
    paginatedGroups() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredGroups.slice(start, end);
    },
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '');
    }
  },
  async created() {
    try {
      const responseGroups = await apiClient.get('/groups');
      this.groups = responseGroups.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load groups.');
    }
  },
  methods: {
    onRowsPerPageChange() {
      this.currentPage = 1;
    },
    showCreateGroupModal() {
      this.currentGroup = {
        name: '',
        description: ''
      };
      this.errors = {
        name: ''
      };
      this.showCreateModal = true;
    },
    editGroup(group) {
      this.currentGroup = { ...group };
      this.errors = {
        name: ''
      };
      this.showEditModal = true;
    },
    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
    },
    async createGroup() {
      if (this.hasErrors) return;
      try {
        const response = await apiClient.post('/groups', this.currentGroup);
        this.groups.push(response.data);
        alert(`Group ${this.currentGroup.name} created successfully!`);
        this.closeModal();
      } catch (error) {
        console.error('Error creating group:', error);
        alert(`Failed to create group: ${error.message}`);
      }
    },
    async updateGroup() {
      if (this.hasErrors) return;
      try {
        const response = await apiClient.put(`/groups/${this.currentGroup.id}`, this.currentGroup);
        const updatedGroup = response.data;
        const index = this.groups.findIndex(g => g.id === updatedGroup.id);
        if (index !== -1) {
          this.groups[index] = updatedGroup;
        }
        alert(`Group ${updatedGroup.name} updated successfully!`);
        this.closeModal();
      } catch (error) {
        console.error('Error updating group:', error);
        alert(`Failed to update group: ${this.currentGroup.name}`);
      }
    },
    async deleteGroup(group) {
      try {
        const confirmed = confirm(`Are you sure you want to delete ${group.name}?`);
        if (confirmed) {
          await apiClient.delete(`/groups/${group.id}`);
          this.groups = this.groups.filter(g => g.id !== group.id);
          alert(`Group ${group.name} deleted successfully!`);
        }
      } catch (error) {
        console.error('Error deleting group:', error);
        alert(`Failed to delete group: ${group.name}`);
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
    validateGroupName() {
      if (this.currentGroup.name.trim() === '') {
        this.errors.name = 'Group name is required.';
      } else {
        this.errors.name = '';
      }
    }
  }
};
</script>

<style scoped>
.groups {
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
.group-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}
.group-table th, .group-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  word-wrap: break-word;
}
.group-table th {
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
