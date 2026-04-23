export const fetchProducts = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(item => ({
      ...item,
      oldPrice: item.old_price,
      isPreOrder: true,
      buttonText: 'add to cart'
    }));
  } catch (error) {
    console.error("Failed to fetch products from backend:", error);
    return [];
  }
};
