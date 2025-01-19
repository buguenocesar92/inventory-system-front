import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router'; // Importar router para la redirección
import type { ValidationErrorResponse } from '@/types/ValidationErrorResponse';

export function useFormValidation() {
  const errors = ref<{ [key: string]: string[] }>({});
  const errorMessage = ref<string | null>(null);
  const router = useRouter(); // Inicializar el router

  const handleValidationError = (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      errorMessage.value = 'An unexpected error occurred.';
      return;
    }

    const { response } = error as AxiosError<ValidationErrorResponse>;

    if (response?.status === 422) {
      errors.value = response.data.errors as { [key: string]: string[] };
      errorMessage.value = response.data.message || 'Validation error occurred.';
    } else if (response?.status === 403) {
      errorMessage.value = 'You do not have permission to perform this action.';

      // Mostrar mensaje opcional y redirigir a 403
      router.push('/403');
    } else {
      errorMessage.value = 'Unexpected error occurred. Please try again later.';
    }
  };

  return {
    errors,
    errorMessage,
    handleValidationError,
  };
}
