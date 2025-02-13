import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createUser, updateUser, fetchUserById } from '@/services/UserService';
import { fetchLocations } from '@/services/LocationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { User } from '@/types/UserTypes';
import type { LocationPayload } from '@/types/LocationTypes';

export function useUserForm() {
  const route = useRoute();
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errors, errorMessage, handleValidationError } = useFormValidation();

  const isEditing = ref(route.name === 'UserEdit');
  const isLoading = ref(false);
  const locations = ref<LocationPayload[]>([]);

  // Usuario con valores por defecto
  const user = ref<User>({
    id: 0,
    name: '',
    email: '',
    password: '',
    location_id: 0,
  });

  const formTitle = computed(() =>
    isEditing.value ? 'Editar Usuario' : 'Nuevo Usuario'
  );

  // Cargar usuario si es edición
  const loadUser = async () => {
    if (!isEditing.value) return;
    try {
      user.value = await fetchUserById(Number(route.params.id));
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value)
        showErrorNotification('Error', errorMessage.value);
    }
  };

  // Cargar las locaciones disponibles
  const loadLocations = async () => {
    try {
      locations.value = await fetchLocations();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value)
        showErrorNotification(
          'Error al cargar las locaciones',
          errorMessage.value
        );
    }
  };

  const handleSubmit = async () => {
    try {
      isLoading.value = true;
      if (isEditing.value) {
        await updateUser(Number(route.params.id), user.value);
        showSuccessNotification('Éxito', 'Usuario actualizado correctamente');
      } else {
        await createUser({ ...user.value, password: user.value.password || '' });
        showSuccessNotification('Éxito', 'Usuario creado correctamente');
      }
      router.push({ name: 'UsersManager' });
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value)
        showErrorNotification('Error', errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    loadLocations();
    loadUser();
  });

  return {
    user,
    isEditing,
    isLoading,
    errors,
    formTitle,
    handleSubmit,
    locations,
  };
}
