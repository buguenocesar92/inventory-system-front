<template>
  <div>
    <Sidebar />
    <div class="relative md:ml-64 bg-blueGray-100 min-h-screen">
      <AdminNavbar />
      <div class="px-4 md:px-10 mx-auto w-full py-4">
        <slot />
      </div>
      <footer-admin />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import AdminNavbar from '@/components/Navbars/AdminNavbar.vue';
import FooterAdmin from "@/components/Footers/FooterAdmin.vue";
export default {
  components: { Sidebar, AdminNavbar, FooterAdmin },
};
</script>
