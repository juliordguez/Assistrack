<template>
  <div class="meal-logs">
    <div class="header">
      <h2>Meal Logs</h2>
      <button @click="showCreateLogModal" class="create-button">Create Meal Log</button>
    </div>
    <div class="pagination-controls">
      <input type="text" v-model="searchQuery" placeholder="Search by user ID..." class="search-bar" />
    </div>
    <table class="logs-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Meal Start</th>
          <th>Meal End</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in paginatedLogs" :key="log.id">
          <td>{{ log.id }}</td>
          <td>{{ log.user_id }}</td>
          <td>{{ log.meal_start }}</td>
          <td>{{ log.meal_end }}</td>
          <td>
            <button @click="editLog(log)" class="edit-button">Edit</button>
            <button @click="deleteLog(log)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-info">
      <div class="pagination-details">
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
        <p>Total logs: {{ filteredLogs.length }}, Showing: {{ paginatedLogs.length }}</p>
      </div>
      <div class="pagination-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <!-- Modal for Creating or Editing Meal Log -->
    <div v-if="showLogModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Meal Log' : 'Create Meal Log' }}</h3>
        <form @submit.prevent="isEditing ? updateLog() : createLog()">
          <div class="form-group">
            <label for="user_id">User ID:</label>
            <input v-model="currentLog.user_id" id="user_id" type="number" required />
          </div>
          <div class="form-group">
            <label for="meal_start">Meal Start:</label>
            <input v-model="currentLog.meal_start" id="meal_start" type="datetime-local" required />
          </div>
          <div class="form-group">
            <label for="meal_end">Meal End:</label>
            <input v-model="currentLog.meal_end" id="meal_end" type="datetime-local" required />
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
  name: 'MealLogManagement',
  data() {
    return {
      logs: [],
      showLogModal: false,
      isEditing: false,
      currentPage: 1,
      rowsPerPage: 5,
      rowsOptions: [5, 10, 15, 20],
      searchQuery: '',
      currentLog: {
        id: null,
        user_id: null,
        meal_start: '',
        meal_end: ''
      },
      errors: {
        user_id: '',
        meal_start: '',
        meal_end: ''
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredLogs.length / this.rowsPerPage);
    },
    filteredLogs() {
      if (!this.searchQuery) {
        return this.logs;
      }
      const query = this.searchQuery.toLowerCase();
      return this.logs.filter(log => log.user_id.toString().includes(query));
    },
    paginatedLogs() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredLogs.slice(start, end);
    },
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '');
    }
  },
  async created() {
    await this.fetchLogs();
  },
  methods: {
    async fetchLogs() {
      try {
        const response = await apiClient.get('/meal_logs');
        this.logs = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load meal logs.');
      }
    },
    onRowsPerPageChange() {
      this.currentPage = 1;
    },
    showCreateLogModal() {
      this.currentLog = {
        id: null,
        user_id: null,
        meal_start: '',
        meal_end: ''
      };
      this.isEditing = false;
      this.showLogModal = true;
    },
    editLog(log) {
      this.currentLog = { ...log };
      this.isEditing = true;
      this.showLogModal = true;
    },
    closeModal() {
      this.showLogModal = false;
    },
    async createLog() {
      if (this.hasErrors) return;

      try {
        const response = await apiClient.post('/meal_logs', this.currentLog);
        this.logs.push(response.data);
        alert(`Meal log created successfully for User ID ${this.currentLog.user_id}!`);
        this.closeModal();
        await this.fetchLogs();
      } catch (error) {
        console.error('Error creating meal log:', error);
        alert(`Failed to create meal log: ${error.message}`);
      }
    },
    async updateLog() {
      if (this.hasErrors) return;

      try {
        const response = await apiClient.put(`/meal_logs/${this.currentLog.id}`, this.currentLog);
        const updatedLog = response.data;
        const index = this.logs.findIndex(l => l.id === updatedLog.id);
        if (index !== -1) {
          this.logs[index] = updatedLog;
        }
        alert(`Meal log updated successfully for User ID ${updatedLog.user_id}!`);
        this.closeModal();
        await this.fetchLogs();
      } catch (error) {
        console.error('Error updating meal log:', error);
        alert(`Failed to update meal log for User ID ${this.currentLog.user_id}`);
      }
    },
    async deleteLog(log) {
      try {
        const confirmed = confirm(`Are you sure you want to delete the meal log for User ID ${log.user_id}?`);
        if (confirmed) {
          await apiClient.delete(`/meal_logs/${log.id}`);
          this.logs = this.logs.filter(l => l.id !== log.id);
          alert(`Meal log for User ID ${log.user_id} deleted successfully!`);
        }
      } catch (error) {
        console.error('Error deleting meal log:', error);
        alert(`Failed to delete meal log for User ID ${log.user_id}`);
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
.meal-logs {
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
.logs-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}
.logs-table th, .logs-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  word-wrap: break-word;
}
.logs-table th {
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
