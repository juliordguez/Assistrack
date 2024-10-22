<template>
    <div class="roles">
      <div class="header">
        <h2>Roles</h2>
        <button @click="showCreateRoleModal" class="create-button">Create Role</button>
      </div>
      <table class="role-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>
              <button @click="editRole(role)" class="edit-button">Edit</button>
              <button @click="deleteRole(role)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Create Role</h3>
          <form @submit.prevent="createRole">
            <div class="form-group">
              <label for="name">Name:</label>
              <input v-model="newRole.name" id="name" type="text" required />
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <input v-model="newRole.description" id="description" type="text" required />
            </div>
            <div class="modal-actions">
              <button type="submit" class="create-button">Create</button>
              <button type="button" @click="closeModal" class="cancel-button">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '@/ApiClient'; // Asegúrate de que la ruta esté bien configurada
  
  export default {
    name: 'RoleManagement',
    data() {
      return {
        roles: [],
        showModal: false,
        newRole: {
          name: '',
          description: ''
        }
      };
    },
    async created() {
      try {
        const response = await apiClient.get('/roles');
        this.roles = response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
        alert('Failed to load roles.');
      }
    },
    methods: {
      showCreateRoleModal() {
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async createRole() {
        try {
          const response = await apiClient.post('/roles', this.newRole);
          this.roles.push(response.data);
          alert(`Role ${this.newRole.name} created successfully!`);
          this.closeModal();
        } catch (error) {
          console.error('Error creating role:', error);
          alert(`Failed to create role: ${error.message}`);
        }
      },
      async editRole(role) {
        try {
          // Aquí podrías tener un formulario para editar los datos del rol
          role.name = 'Editado'; // Este es solo un ejemplo
          const response = await apiClient.put(`/roles/${role.id}`, role);
          const updatedRole = response.data;
          // Actualizar el rol en la lista
          const index = this.roles.findIndex(r => r.id === updatedRole.id);
          if (index !== -1) {
            this.roles[index] = updatedRole;
          }
          alert(`Role ${role.name} updated successfully!`);
        } catch (error) {
          console.error('Error updating role:', error);
          alert(`Failed to update role: ${role.name}`);
        }
      },
      async deleteRole(role) {
        try {
          const confirmed = confirm(`Are you sure you want to delete ${role.name}?`);
          if (confirmed) {
            await apiClient.delete(`/roles/${role.id}`);
            this.roles = this.roles.filter(r => r.id !== role.id);
            alert(`Role ${role.name} deleted successfully!`);
          }
        } catch (error) {
          console.error('Error deleting role:', error);
          alert(`Failed to delete role: ${role.name}`);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .roles {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .create-button {
    padding: 10px 20px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .create-button:hover {
    background-color: #218838;
  }
  .role-table {
    width: 100%;
    border-collapse: collapse;
  }
  .role-table th, .role-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  .role-table th {
    background-color: #f2f2f2;
  }
  .edit-button {
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
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
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
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
  .cancel-button {
    padding: 10px 20px;
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .cancel-button:hover {
    background-color: #c82333;
  }
  </style>