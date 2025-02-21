
export const INITIAL_STAMINA = 5;
export const STAMINA_KEY = 'user_stamina';

export const getStamina = (): number => {
  const stamina = localStorage.getItem(STAMINA_KEY);
  return stamina ? parseInt(stamina, 10) : INITIAL_STAMINA;
};

export const decreaseStamina = (): number => {
  const currentStamina = getStamina();
  if (currentStamina > 0) {
    localStorage.setItem(STAMINA_KEY, (currentStamina - 1).toString());
  }
  return currentStamina - 1;
};

export const purchaseStamina = (amount: number): void => {
  const currentStamina = getStamina();
  localStorage.setItem(STAMINA_KEY, (currentStamina + amount).toString());
};
