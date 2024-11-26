import { useMemo, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, checkout } from '../../features/cart/cartSlice';
import { ListGroup, Button, Alert, Container } from 'react-bootstrap';
import { useQueries } from '@tanstack/react-query';
import { setCartFromLocalStorage } from '../../features/cart/cartSlice';
import '../../internationalization/i18n';
import { useTranslation } from 'react-i18next';


const ShoppingCart = () => {
    const cart = useSelector((state) => state.cart);
    const cartItemIds = Object.keys(cart.items);
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cartItems'));
        if (cartData) {
            dispatch(setCartFromLocalStorage(cartData));
        }
    }, [dispatch]);
    

    const handleAddItem = useCallback((id) => dispatch(addItem({ id })), [dispatch]);
    const handleRemoveItem = useCallback((id) => dispatch(removeItem({ id })), [dispatch]);

    const handleCheckout = useCallback(() => {
        dispatch(checkout()); 
        setSuccessMessage(true);
    }, [dispatch]);

    // Fetch product details for each item in cart
    const productQueries = useQueries({
        queries: cartItemIds.map(id => ({
            queryKey: ['product', id],
            queryFn: () => fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json())
        }))
    });

    const getProductName = useCallback((id) => {
        const index = cartItemIds.findIndex(itemId => itemId == id);
        const productQuery = productQueries[index];
        return productQuery?.data?.title || 'Unknown Product';
    }, [productQueries, cartItemIds]);

    // Memoizing product names
    const productNames = useMemo(() =>
        cartItemIds.reduce((acc, id) => ({
            ...acc,
            [id]: getProductName(id)
        }), {}),
    [cartItemIds, getProductName]);

    // Memoizing total price calculation
    const totalPrice = useMemo(() => {
        return cartItemIds.reduce((total, id) => {
            const index = cartItemIds.findIndex(itemId => itemId === id);
            const productQuery = productQueries[index];

            if (productQuery.isSuccess && productQuery.data) {
                const productPrice = productQuery.data.price;
                const quantity = cart.items[id];
                return total + (productPrice * quantity);
            }

            return total;
        }, 0);
    }, [cart.items, cartItemIds, productQueries]);

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">{t('shoppingCart')}</h2>
            {successMessage && (
                <Alert 
                    id="checkout-success" 
                    tabIndex="-1" 
                    aria-live="polite" 
                    variant="success"
                >
                    Checkout successful!
                </Alert>
            )}
            <ListGroup>
                {Object.entries(cart.items).map(([id, quantity]) => {
                    const index = cartItemIds.findIndex(itemId => itemId === id);
                    const productQuery = productQueries[index];
                    const productPrice = productQuery?.data?.price;
                    const productName = productQuery?.data?.title;

                    // Show a loading state while product data is fetching
                    if (productQuery.isLoading) {
                        return (
                            <ListGroup.Item key={id} className='d-flex justify-content-between align-items-center'>
                                <span role="status">{t('loading')}...</span>
                            </ListGroup.Item>
                        );
                    }

                    return (
                        <ListGroup.Item key={id} className='d-flex justify-content-between align-items-center'>
                            <span aria-label={`Product name, price & quantity for ${productName}`}>{productName} - {t('price')}: ${productPrice.toFixed(2)} - {t('quantity')}: {quantity}</span>
                            <div>
                                <Button aria-label={`add 1 more ${productName} to the cart`} variant='success' onClick={() => handleAddItem(id)}>+</Button>
                                <Button aria-label={`remove 1 ${productName} from the cart`} variant='danger' onClick={() => handleRemoveItem(id)}>-</Button>
                            </div>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
                <div className="text-center mb-4">
                <p aria-label="cart total items">{t('totalItems')}: {cart.totalItems}</p>
                <p aria-label="cart total price">{t('totalPrice')}: ${totalPrice.toFixed(2)}</p>
                <Button variant='primary' onClick={handleCheckout}>{t('checkout')}</Button>
                <Link to='/home' aria-label="Return to the homepage">
                    <Button variant="secondary" className="ms-2">{t('goBackHome')}</Button>
                </Link>
            </div>

        </Container>
    );
};

export default ShoppingCart;
