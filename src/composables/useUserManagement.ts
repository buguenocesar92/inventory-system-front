import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsersWithLocations, deleteUser } from '@/services/UserService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { User } from '@/types/UserTypes';

export function useUserManagement() {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  const users = ref<User[]>([]);
  const isLoading = ref(false);

  const loadUsers = async () => {
    try {
      isLoading.value = true;
      users.value = await fetchAllUsersWithLocations();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  };

  const removeUser = async (id: number) => {
    try {
      await deleteUser(id);
      showSuccessNotification('Éxito', 'Usuario eliminado correctamente');
      await loadUsers();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    }
  };

  const goToCreate = () => {
    router.push({ name: 'UserCreate' });
  };

  const goToEdit = (id: number) => {
    router.push({ name: 'UserEdit', params: { id: id.toString() } });
  };

  onMounted(() => {
    loadUsers();
  });

  return { users, isLoading, loadUsers, removeUser, goToCreate, goToEdit };
}
