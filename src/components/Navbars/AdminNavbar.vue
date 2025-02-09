<template>
  <!-- Navbar -->
  <nav
    class="relative top-0 left-0 w-full bg-black md:flex-row md:flex-nowrap md:justify-between flex items-center md:p-4 px-4"
  >
    <div class="w-full flex items-center justify-between">
      <!-- 📌 Brand -->
      <a
        class="text-white text-sm uppercase font-semibold"
        href="javascript:void(0)"
      >
        Dashboard
      </a>

      <!-- 📌 Contenedor de Select y User -->
      <div class="flex items-center gap-6">
        <!-- 🔹 Select de Locales alineado verticalmente -->
        <div class="flex flex-col items-center">
          <FormSelect
            v-model="selectedLocation"
            id="location_id"
            :options="locations"
            placeholder="Seleccione un local"
            placeholderValue="0"
            required
            @change="handleLocationChange"
            class="w-52"
          />
        </div>

        <!-- 👤 User Dropdown -->
        <user-dropdown />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useLocationSelect } from "@/composables/useLocationSelect";
import FormSelect from '@/components/FormSelect.vue';
import UserDropdown from "@/components/Dropdowns/UserDropdown.vue";

// Usamos el composable para manejar los locales
const { locations, selectedLocation, handleLocationChange } = useLocationSelect();
</script>

