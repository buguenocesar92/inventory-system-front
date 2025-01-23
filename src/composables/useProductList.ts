import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchProducts, deleteProduct as deleteProductService } from '@/services/ProductService';
import { debounce } from '@/utils/debounce';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { FetchProductsResponse, Product } from '@/types/ProductTypes';

interface DataTableParams {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: string }[];
}

export function useProductList() {
  const router = useRouter();

  const itemsPerPage = ref(5);
  const isLoading = ref(false);
  const serverItems = ref<Product[]>([]);
  const totalItems = ref(0);
  const search = ref('');
  const deletingProductId = ref<number | null>(null);

  const { showSuccessNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // Columnas de la tabla
  const headers = ref([
    { title: 'Name', value: 'name', sortable: true },
    { title: 'Category', value: 'category.name', sortable: true },
    { title: 'Unit Price', value: 'unit_price', sortable: true },
    { title: 'Current Stock', value: 'current_stock', sortable: true },
    { title: 'Actions', value: 'actions', sortable: false },
  ]);

  // Carga productos del servidor
  async function loadItems(params: DataTableParams) {
    isLoading.value = true;
    try {
      const { items, total }: FetchProductsResponse = await fetchProducts({
        page: params.page,
        itemsPerPage: params.itemsPerPage,
        sortBy: params.sortBy,
        search: search.value,
      });
      serverItems.value = items;
      totalItems.value = total;
    } catch (error) {
      handleValidationError(error);
    } finally {
      isLoading.value = false;
    }
  }

  // Eliminar producto
  async function deleteProductHandler(id: number) {
    deletingProductId.value = id;
    try {
      await deleteProductService(id);
      await showSuccessNotification('Success!', 'Product updated successfully.', '/list-product');
      serverItems.value = serverItems.value.filter((p) => p.id !== id);
    } catch (error) {
      handleValidationError(error);
      // Si hay error de permisos:
      if (errorMessage.value === 'You do not have permission to perform this action.') {
        router.push('/403');
      }
    } finally {
      deletingProductId.value = null;
    }
  }

  // Debounce para el campo de búsqueda
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
