<template>
  <nav class="sidebar">
    <div class="profile">
      <img src="/path/to/profile-pic.png" alt="Profile Picture" />
      <h3>John Don</h3>
      <p class="profile-email">johndon@company.com</p>
    </div>
    <ul class="nav-links">
      <li><router-link to="/"> <i class="fas fa-home"></i> Home</router-link></li>
      <li><router-link to="/file"> <i class="fas fa-file"></i> File</router-link></li>
      <li><router-link to="/messages"> <i class="fas fa-envelope"></i> Messages</router-link></li>
      <li><router-link to="/notification"> <i class="fas fa-bell"></i> Notification</router-link></li>
      <li><router-link to="/location"> <i class="fas fa-map-marker-alt"></i> Location</router-link></li>
      <li><router-link to="/graph"> <i class="fas fa-chart-bar"></i> Graph</router-link></li>
      <li>
        <div @click="toggleUserSubMenu" class="submenu-toggle">
          <i class="fas fa-users"></i> Users
          <span class="submenu-arrow">▼</span>
        </div>
        <ul v-if="showUserSubMenu" class="sub-menu">
          <li><router-link to="/users">Existing Users</router-link></li>
          <li><router-link to="/users/history">User History</router-link></li>
          <li><router-link to="/groups">Groups</router-link></li>
        </ul>
      </li>
      <li>
        <div @click="toggleActivitySubMenu" class="submenu-toggle">
          <i class="fas fa-users"></i> Activities and Permissions
          <span class="submenu-arrow">▼</span>
        </div>
        <ul v-if="showActivitySubMenu" class="sub-menu">
          <li><router-link to="/vacationPermissions">Vacation Permissions</router-link></li>
          <li><router-link to="/tardinessPermissions">Tardiness Permissions</router-link></li>
          <li><router-link to="/mealLogs">Meal Logs</router-link></li>
          <li><router-link to="/incapacityPermissions">Incapacity Permissions</router-link></li>
          <li><router-link to="/absenceHistories">Absence Histories</router-link></li>
        </ul>
      </li>
      <li><router-link to="/logout"><i class="fas fa-sign-out-alt"></i> Log out</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      showUserSubMenu: false,
      showActivitySubMenu: false
    };
  },
  methods: {
    toggleUserSubMenu() {
      this.showUserSubMenu = !this.showUserSubMenu;
    },
    toggleActivitySubMenu() {
      this.showActivitySubMenu = !this.showActivitySubMenu;
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  height: 100%;
  width: 100%;
}
.sidebar {
  width: 150px;
  background: #2c3e50;
  color: #ecf0f1;
  height: 100vh;
  padding: 0;
  padding-left: 10px;
  box-sizing: border-box;
}
.profile {
  text-align: center;
  margin: 10px;
}
.profile img {
  width: 60px;
  border-radius: 50%;
}
.profile-email {
  font-size: 14px;
  word-wrap: break-word;
  white-space: normal;
  margin-top: 5px;
}
.nav-links {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}
.nav-links li {
  margin: 15px 0;
  padding-left: 10px;
}
.nav-links a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 14px;
}
.nav-links a i {
  margin-right: 8px;
}
.submenu-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.submenu-arrow {
  margin-left: auto;
  font-size: 12px;
}
.sub-menu {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
}
.sub-menu li {
  margin: 10px 0;
}
.sub-menu a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 14px;
}
.sub-menu a:hover {
  text-decoration: underline;
}
</style>
