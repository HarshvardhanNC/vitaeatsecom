import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/cart', config);
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart', error);
      if (error.response?.status === 401 && logout) {
        alert("Your session has expired. Please log in again.");
        logout();
      }
    }
  };

  const addToCart = async (mealId, quantity = 1) => {
    if (!user) return alert('Please login to add to cart');
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/cart', { mealId, quantity }, config);
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart', error);
      if (error.response?.status === 401 && logout) {
        alert("Your session has expired. Please log in again.");
        logout();
      } else {
        alert('Failed to add to cart');
      }
    }
  };

  const removeFromCart = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/cart/${id}`, config);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
