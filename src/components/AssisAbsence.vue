<template>
  <div class="absence-history">
    <div class="header">
      <h2>Absence History</h2>
      <button @click="showCreateAbsenceModal" class="create-button">Create Absence Record</button>
    </div>
    <div class="pagination-controls">
      <input type="text" v-model="searchQuery" placeholder="Search by reason..." class="search-bar" />
    </div>
    <table class="absence-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Absence Date</th>
          <th>Reason</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="absence in paginatedAbsences" :key="absence.id">
          <td>{{ absence.id }}</td>
          <td>{{ absence.user_id }}</td>
          <td>{{ absence.absence_date }}</td>
          <td>{{ absence.reason }}</td>
          <td>
            <button @click="editAbsence(absence)" class="edit-button">Edit</button>
            <button @click="deleteAbsence(absence)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-info">
      <div class="pagination-details">
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
        <p>Total absences: {{ filteredAbsences.length }}, Showing: {{ paginatedAbsences.length }}</p>
      </div>
      <div class="pagination-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <!-- Modal for Creating or Editing Absence History -->
    <div v-if="showAbsenceModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Absence Record' : 'Create Absence Record' }}</h3>
        <form @submit.prevent="isEditing ? updateAbsence() : createAbsence()">
          <div class="form-group">
            <label for="user_id">User ID:</label>
            <input v-model="currentAbsence.user_id" id="user_id" type="number" required />
          </div>
          <div class="form-group">
            <label for="absence_date">Absence Date:</label>
            <input v-model="currentAbsence.absence_date" id="absence_date" type="date" required />
          </div>
          <div class="form-group">
            <label for="reason">Reason:</label>
            <input v-model="currentAbsence.reason" id="reason" type="text" required />
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
  name: 'AbsenceHistoryManagement',
  data() {
    return {
      absences: [],
      showAbsenceModal: false,
      isEditing: false,
      currentPage: 1,
      rowsPerPage: 5,
      rowsOptions: [5, 10, 15, 20],
      searchQuery: '',
      currentAbsence: {
        id: null,
        user_id: null,
        absence_date: '',
        reason: ''
      },
      errors: {
        user_id: '',
        absence_date: '',
        reason: ''
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredAbsences.length / this.rowsPerPage);
    },
    filteredAbsences() {
      if (!this.searchQuery) {
        return this.absences;
      }
      const query = this.searchQuery.toLowerCase();
      return this.absences.filter(absence => absence.reason.toLowerCase().includes(query));
    },
    paginatedAbsences() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredAbsences.slice(start, end);
    },
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '');
    }
  },
  async created() {
    await this.fetchAbsences();
  },
  methods: {
    async fetchAbsences() {
      try {
        const response = await apiClient.get('/absence_histories');
        this.absences = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load absence histories.');
      }
    },
    onRowsPerPageChange() {
      this.currentPage = 1;
    },
    showCreateAbsenceModal() {
      this.currentAbsence = {
        id: null,
        user_id: null,
        absence_date: '',
        reason: ''
      };
      this.isEditing = false;
      this.showAbsenceModal = true;
    },
    editAbsence(absence) {
      this.currentAbsence = { ...absence };
      this.isEditing = true;
      this.showAbsenceModal = true;
    },
    closeModal() {
      this.showAbsenceModal = false;
    },
    async createAbsence() {
      if (this.hasErrors) return;

      try {
        const response = await apiClient.post('/absence_histories', this.currentAbsence);
        this.absences.push(response.data);
        alert(`Absence record created successfully for User ID ${this.currentAbsence.user_id}!`);
        this.closeModal();
        await this.fetchAbsences();  // Refrescar los datos después de crear
      } catch (error) {
        console.error('Error creating absence record:', error);
        alert(`Failed to create absence record: ${error.message}`);
      }
    },
    async updateAbsence() {
      if (this.hasErrors) return;

      try {
        const response = await apiClient.put(`/absence_histories/${this.currentAbsence.id}`, this.currentAbsence);
        const updatedAbsence = response.data;
        const index = this.absences.findIndex(a => a.id === updatedAbsence.id);
        if (index !== -1) {
          this.absences[index] = updatedAbsence;
        }
        alert(`Absence record updated successfully for User ID ${updatedAbsence.user_id}!`);
        this.closeModal();
        await this.fetchAbsences();  // Refrescar los datos después de actualizar
      } catch (error) {
        console.error('Error updating absence record:', error);
        alert(`Failed to update absence record for User ID ${this.currentAbsence.user_id}`);
      }
    },
    async deleteAbsence(absence) {
      try {
        const confirmed = confirm(`Are you sure you want to delete the absence record for User ID ${absence.user_id}?`);
        if (confirmed) {
          await apiClient.delete(`/absence_histories/${absence.id}`);
          this.absences = this.absences.filter(a => a.id !== absence.id);
          alert(`Absence record for User ID ${absence.user_id} deleted successfully!`);
        }
      } catch (error) {
        console.error('Error deleting absence record:', error);
        alert(`Failed to delete absence record for User ID ${absence.user_id}`);
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
    validateUserId() {
      if (!this.currentAbsence.user_id) {
        this.errors.user_id = 'User ID is required.';
      } else {
        this.errors.user_id = '';
      }
    },
    validateAbsenceDate() {
      if (!this.currentAbsence.absence_date) {
        this.errors.absence_date = 'Absence date is required.';
      } else {
        this.errors.absence_date = '';
      }
    },
    validateReason() {
      if (!this.currentAbsence.reason) {
        this.errors.reason = 'Reason is required.';
      } else {
        this.errors.reason = '';
      }
    }
  }
};
</script>

<style scoped>
.absence-history {
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
.absence-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}
.absence-table th, .absence-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  word-wrap: break-word;
}
.absence-table th {
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
