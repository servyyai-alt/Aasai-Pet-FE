import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('AasaiPet_cart')) || [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('AasaiPet_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        const updated = prev.map(i =>
          i._id === product._id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i
        );
        toast.success('Cart updated!');
        return updated;
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cartItems.reduce((acc, i) => acc + (i.discountPrice || i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
