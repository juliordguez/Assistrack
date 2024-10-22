<template>
  <div class="dashboard">
    <Sidebar />
    <router-view class="content" />
  </div>
</template>

<script>
import Sidebar from './components/AssisSideBar.vue';
export default {
  name: 'AssisApp',
  components: {
    Sidebar,
  },
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
  overflow: hidden;
}
.dashboard {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.content {
  flex: 1;
  overflow-y: auto;
}
</style>