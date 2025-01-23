import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchProduct, updateProduct } from '@/services/ProductService';
import { fetchCategories } from '@/services/CategoryService';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { ProductPayload } from '@/types/ProductTypes';
import type { CategoryPayload } from '@/types/CategoryTypes';

export function useEditProduct(productId: number) {
  // Router para redirecciones
  const router = useRouter();

  // Estado del formulario
  const form = ref<ProductPayload>({
    name: '',
    category_id: 0,
    brand: '',
    barcode: '',
    description: '',
    image_url: '',
    unit_price: 0,
  });

  // Estado para categorías
  const categories = ref<CategoryPayload[]>([]);

  // Loading y validaciones
  const isLoading = ref(false);
  const { errors, errorMessage, handleValidationError } = useFormValidation();
  const { showSuccessNotification } = useNotification();

  // Cargar datos del producto
  async function fetchProductData() {
    try {
      isLoading.value = true;
      const product = await fetchProduct(productId);
      if (product) {
        form.value = product;
      } else {
        router.push('/404'); // Redirige a 404 si no se encuentra el producto
      }
    } catch (error) {
      handleValidationError(error);
    } finally {
      isLoading.value = false;
    }
  }

  // Cargar categorías
  async function fetchCategoriesData() {
    try {
      categories.value = await fetchCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // Actualizar producto
  async function handleEditProduct() {
    isLoading.value = true;
    try {
      await updateProduct(productId, form.value);
      await showSuccessNotification(
        'Success!',
        'Product updated successfully.',
        '/list-product'
      );
    } catch (error) {
      handleValidationError(error);
    } finally {
      isLoading.value = false;
    }
  }

  // Al montar el composable, cargamos datos del producto y categorías
  onMounted(() => {
    fetchProductData();
    fetchCategoriesData();
  });

  return {
    form,
    categories,
    isLoading,
    errors,
    errorMessage,
    handleEditProduct,
  };
}
