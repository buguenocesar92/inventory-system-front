// src/composables/useProductList.ts

import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  fetchProducts,
  deleteProduct as deleteProductService,
} from "@/services/ProductService";
import { debounce } from "@/utils/debounce";
import { useFormValidation } from "@/composables/useFormValidation";
import { useNotification } from "@/composables/useNotification";
// 🔹 Importa tu store de ubicación/bodega seleccionadas
import { useLocationWarehouseStore } from "@/stores/locationWarehouseStore";
import type { FetchProductsResponse, Product } from "@/types/ProductTypes";

/**
 * Interfaz para las opciones que emite Vuetify (o tu DataTable)
 */
interface DataTableParams {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: string }[];
  // Otros si los necesitas, como groupBy, groupDesc, etc.
}

/**
 * Composable para la lista de productos,
 * que se recarga automáticamente al cambiar local/bodega.
 */
export function useProductList() {
  const router = useRouter();

  // 1) Estado local de la tabla
  const itemsPerPage = ref(5);
  const isLoading = ref(false);
  const serverItems = ref<Product[]>([]);
  const totalItems = ref(0);
  const search = ref("");
  const deletingProductId = ref<number | null>(null);

  // 2) Notificaciones y validación
  const { showSuccessNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // 3) Encabezados de la tabla
  const headers = ref([
    { title: "Nombre", value: "name", sortable: true },
    { title: "Categoría", value: "category.name", sortable: true },
    { title: "Precio", value: "unit_price", sortable: true },
    { title: "Inventario", value: "current_stock", sortable: true },
    { title: "Acciones", value: "actions", sortable: false },
  ]);

  // 4) Store que guarda el local/bodega seleccionados
  const locationWarehouseStore = useLocationWarehouseStore();

  // 5) Método para cargar productos (usado por la tabla)
  async function loadItems(params: DataTableParams) {
    isLoading.value = true;
    try {
      const { items, total }: FetchProductsResponse = await fetchProducts({
        page: params.page,
        itemsPerPage: params.itemsPerPage,
        sortBy: params.sortBy,
        search: search.value,
        // 🔹 Filtros por local/bodega
        locationId: locationWarehouseStore.selectedLocation,
        warehouseId: locationWarehouseStore.selectedWarehouse,
      });
      serverItems.value = items;
      totalItems.value = total;
    } catch (error) {
      handleValidationError(error);
    } finally {
      isLoading.value = false;
    }
  }

  // 6) Método para eliminar un producto de la lista y del servidor
  async function deleteProductHandler(id: number) {
    deletingProductId.value = id;
    try {
      await deleteProductService(id);
      await showSuccessNotification(
        "Success!",
        "Product updated successfully.",
        "/list-product"
      );
      serverItems.value = serverItems.value.filter((p) => p.id !== id);
    } catch (error) {
      handleValidationError(error);
      // Si hay error de permisos:
      if (
        errorMessage.value === "You do not have permission to perform this action."
      ) {
        router.push("/403");
      }
    } finally {
      deletingProductId.value = null;
    }
  }

  // 7) Debounce para el campo de búsqueda
  const debouncedLoadItems = debounce((params: DataTableParams) => {
    loadItems(params);
  }, 300);

  // 8) Manejar la búsqueda (resetea a la página 1, por ejemplo)
  function onSearchInput() {
    debouncedLoadItems({
      page: 1,
      itemsPerPage: itemsPerPage.value,
      sortBy: [],
    });
  }

  // 9) Vigilar los cambios de local/bodega en la store
  //    Cada vez que cambien, recargamos la lista en la página 1
  watch(
    () => [
      locationWarehouseStore.selectedLocation,
      locationWarehouseStore.selectedWarehouse,
    ],
    () => {
      debouncedLoadItems({
        page: 1,
        itemsPerPage: itemsPerPage.value,
        sortBy: [],
      });
    }
  );

  // 10) Retornar todo lo necesario
  return {
    // Estado
    itemsPerPage,
    isLoading,
    serverItems,
    totalItems,
    search,
    deletingProductId,
    headers,
    errorMessage,

    // Métodos
    loadItems,
    deleteProductHandler,
    onSearchInput,
  };
}
