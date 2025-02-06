import { ref } from "vue";
import { fetchSalesHistory } from "@/services/SaleService";
import { debounce } from "@/utils/debounce";
import { useFormValidation } from "@/composables/useFormValidation";
import type { Sale } from "@/types/SalesTypes";

interface DataTableParams {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: string }[];
}

export function useSalesHistory() {
  const itemsPerPage = ref(10);
  const isLoading = ref(false);
  const serverItems = ref<Sale[]>([]); // Asegura que sea un array del tipo correcto
  const totalItems = ref(0);
  const search = ref("");
  const { errorMessage, handleValidationError } = useFormValidation();

  // Columnas de la tabla
  const headers = ref([
    { title: "Fecha", value: "created_at", sortable: true },
    { title: "Producto", value: "product.name", sortable: true },
    { title: "Cantidad", value: "quantity", sortable: true },
    { title: "Precio Unitario", value: "unit_price", sortable: true },
    { title: "Total", value: "total_price", sortable: true },
    { title: "Cajero", value: "user.name", sortable: true },
    { title: "Acciones", value: "actions", sortable: false },
  ]);

  // Cargar ventas desde el servidor
  async function loadItems(params: DataTableParams) {
    isLoading.value = true;
    try {
      const { items, total } = await fetchSalesHistory({
        page: params.page,
        itemsPerPage: params.itemsPerPage,
        sortBy: params.sortBy,
        search: search.value,
      });
      serverItems.value = items;
      totalItems.value = total;
    } catch (error) {
      handleValidationError(error);
      serverItems.value = []; // En caso de error, asegurar que serverItems sea un array vacío
    } finally {
      isLoading.value = false;
    }
  }

  // Debounce para búsqueda
  const debouncedLoadItems = debounce((params: DataTableParams) => {
    loadItems(params);
  }, 300);

  // Manejar búsqueda
  function onSearchInput() {
    debouncedLoadItems({
      page: 1,
      itemsPerPage: itemsPerPage.value,
      sortBy: [],
    });
  }

  return {
    itemsPerPage,
    isLoading,
    serverItems,
    totalItems,
    search,
    headers,
    errorMessage,
    loadItems,
    onSearchInput,
  };
}
