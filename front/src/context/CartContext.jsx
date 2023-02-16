import { createContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({children}){      

      const [cart, setCart] = useState(JSON.parse(localStorage.getItem("productosCarrito")) || []);

      useEffect(() => {             
             localStorage.setItem('productosCarrito', JSON.stringify(cart))            
      }, [cart])

      const addToCart = ( nombre, precio, urlfoto, categoria, id, descripcion, cantidad, cliente, quantity ) => {
        setCart((currItems) => {
          const isItemFound = currItems.find((item) => item.id === id);
          if (isItemFound) {
            return currItems.map((item) => {
              if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
              } else {
                return item;
              }
            });
          } else {
            return [...currItems, { nombre, precio, urlfoto, categoria, id, descripcion, cantidad, cliente, quantity: 1 }]
          }
        })
      }
    
      const removeItem = (id) => {
        setCart((currItems) => {
          if (currItems.find((item) => item.id === id)?.quantity === 1) {
            return currItems.filter((item) => item.id !== id);
          } else {
            return currItems.map((item) => {
              if (item.id === id) {
                return { ...item, quantity: item.quantity - 1 };
              } else {
                return item
              }
            })
          }
        })
      }

      const updateCantidad = (newCantidad, id) =>{
        setCart((prev) => ({...prev, [id]: newCantidad}))
      }

      return(
            // <CartContext.Provider value={{ productos, addToCart, eliminarProducto, total}}>
            <CartContext.Provider value={ [cart, setCart, addToCart, removeItem, updateCantidad] }>
                  {children}
            </CartContext.Provider>
      )
} 

export default CartContext;