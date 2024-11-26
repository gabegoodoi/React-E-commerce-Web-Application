import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || {}, // id: quanitity
    totalItems: 0
};

const calculateTotalItems = (items) => {
    return Object.values(items).reduce((total, quantity) => total + quantity, 0);
};

export const setCartFromLocalStorage = () => (dispatch) => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    dispatch(setCart({ items: storedItems }));
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            const items = action.payload.items;
            state.items = items;
            state.totalItems = calculateTotalItems(items);
        },
        addItem: (state, action) => {
            const { id } = action.payload;
            if (state.items[id]) {
                state.items[id] += 1;
            } else {
                state.items[id] = 1;
            }
            state.totalItems = calculateTotalItems(state.items);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeItem: (state, action) => {
            const { id } = action.payload;
            if (state.items[id]) {
                state.items[id] -= 1;
                if (state.items[id] === 0) {
                    delete state.items[id];
                }
                state.totalItems = calculateTotalItems(state.items);
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            }
        },
        clearCart(state) {
            state.items = {};
            state.totalItems = 0;
            localStorage.removeItem('cartItems'); // Ensure localStorage is cleared
        },        
        checkout: (state) => {
            state.items = {};
            state.totalItems = 0;
            localStorage.removeItem('cartItems');
        },
    },
});

export const { addItem, removeItem, checkout, setCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;