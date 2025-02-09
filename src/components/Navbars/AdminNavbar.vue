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

      <!-- 📌 Contenedor de Selects y User -->
      <div class="flex items-center space-x-4">
        <!-- 🔹 Select de Locales -->
        <div class="w-52">
          <FormSelect
            v-model="selectedLocation"
            id="location_id"
            label="Seleccionar Local"
            :options="locations"
            placeholder="Seleccione un local"
            placeholderValue="0"
            required
            @change="handleLocationChange"
          />
        </div>

        <!-- 🔹 Select de Bodegas -->
        <div class="w-72">
          <FormSelect
            v-model="selectedWarehouse"
            id="warehouse_id"
            label="Seleccionar Bodega"
            :options="warehouses"
            placeholder="Seleccione una bodega"
            placeholderValue="0"
            required
            @change="handleWarehouseChange"
          />
        </div>

        <!-- 👤 User Dropdown -->
        <user-dropdown />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useLocationWarehouseSelect } from "@/composables/useLocationWarehouseSelect";
import FormSelect from '@/components/FormSelect.vue';
import UserDropdown from "@/components/Dropdowns/UserDropdown.vue";

// Usamos el composable para manejar los selects de locales y bodegas
const { locations, selectedLocation, handleLocationChange, warehouses, selectedWarehouse, handleWarehouseChange } = useLocationWarehouseSelect();
</script>
