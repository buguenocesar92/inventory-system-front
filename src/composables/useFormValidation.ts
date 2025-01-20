import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router'; // Para redirecciones
import Swal from 'sweetalert2';
import type { ValidationErrorResponse } from '@/types/ValidationErrorResponse';

export function useFormValidation() {
  const errors = ref<{ [key: string]: string[] }>({});
  const errorMessage = ref<string | null>(null);
  const router = useRouter(); // Inicializar router para redirecciones

  const handleValidationError = (error: unknown) => {
    console.log('Raw error:', error); // <-- Depuración: imprime el error crudo

    if (!axios.isAxiosError(error)) {
      errorMessage.value = 'An unexpected error occurred.';
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: errorMessage.value,
        confirmButtonText: 'OK',
      });
      return;
    }

    const { response } = error as AxiosError<ValidationErrorResponse>;
    console.log('Axios error response:', response); // <-- Depuración: imprime la respuesta de Axios

    if (response?.status === 401) {
      console.log('401 Unauthorized error detected'); // <-- Depuración
      errorMessage.value = 'Credenciales incorrectas.';
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: errorMessage.value,
        confirmButtonText: 'OK',
      });
    } else if (response?.status === 422) {
      errors.value = response.data.errors as { [key: string]: string[] };
      errorMessage.value = response.data.message || 'Validation error occurred.';
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: errorMessage.value,
        confirmButtonText: 'OK',
      });
    } else if (response?.status === 403) {
      errorMessage.value = 'You do not have permission to perform this action.';
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: errorMessage.value,
        confirmButtonText: 'OK',
      }).then(() => {
        router.push('/403'); // Redirigir al 403 después de cerrar el Swal
      });
    } else if (response?.status === 409) {
      errorMessage.value = response.data.message || 'A conflict occurred.';
      Swal.fire({
        icon: 'error',
        title: 'Conflict',
        text: errorMessage.value,
        confirmButtonText: 'OK',
      });
    } else {
      errorMessage.value = 'Unexpected error occurred. Please try again later.';
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: errorMessage.value,
        confirmButtonText: 'OK',
      });
    }
  };

  return {
    errors,
    errorMessage,
    handleValidationError,
  };
}
