import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk( // Thunk is a fuunction used to perform a delayed computation
    'products/fetchProducts',
    //  () => <Promise>
    //  pending 'products/fetchProducts/pending'
    //  fulfilled 'products/fetchProducts/fulfilled'
    //  rejected 'products/fetchProducts/rejected'
    async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error("failed to fetch products");
        }
        const products = await response.json(); 
        return products;
    }
);

export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        status: 'idle', // idle | loding | succeeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => { // extraReducers, responds to actions not created within this slice
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // add fetched items to the state
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default productsSlice.reducer