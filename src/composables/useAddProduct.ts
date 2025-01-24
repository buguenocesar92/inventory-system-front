import { ref, onMounted } from 'vue';
import { addProduct } from '@/services/ProductService';
import { fetchCategories } from '@/services/CategoryService';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { ProductPayload } from '@/types/ProductTypes';
import type { CategoryPayload } from '@/types/CategoryTypes';

export function useAddProduct() {
  const form = ref<ProductPayload>({
    // OJO: Cambiamos "category" a "category_id"
    name: '',
    category_id: 0,
    brand: '',
    barcode: '',
    description: '',
    image_url: '',
    unit_price: 0,
  });

  // Array de categorías
  const categories = ref<CategoryPayload[]>([]);
  const isLoading = ref(false);

  // Validaciones y notificaciones
  const { errors, errorMessage, handleValidationError } = useFormValidation();
  const { showSuccessNotification } = useNotification();

  onMounted(async () => {
    try {
      categories.value = await fetchCategories();
      // Ejemplo: [{ id: 1, name: "Bebidas y Snacks" }, { id: 2, name: "Otra" }]
    } catch (error) {
      console.error(error);
    }
  });

  async function handleAddProduct() {
    isLoading.value = true;
    try {
      // Llamamos a addProduct
      await addProduct(form.value);
      await showSuccessNotification(
        'Success!',
        'Product added successfully.',
        '/list-product'
      );
    } catch (error) {
      handleValidationError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    form,
    categories,
    isLoading,
    errors,
    errorMessage,
    handleAddProduct,
  };
}
