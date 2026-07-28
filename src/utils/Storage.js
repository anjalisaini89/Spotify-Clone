export const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadData = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);

  if (!data) return defaultValue;

  return JSON.parse(data);
};

export const removeData = (key) => {
  localStorage.removeItem(key);
};