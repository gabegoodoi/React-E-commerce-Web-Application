import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productsReducer from './features/products/productsSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer,
    },
});

// store - central hub of our application state
// reducer - similar to our "set" hooks. They define how our state changes
// Slices - breaks our state into more manageable pieces