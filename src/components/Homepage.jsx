import { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { Container, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import ProductCatalog from './Product/ProductCatalog';
import { NavLink } from 'react-router-dom';
import { setCartFromLocalStorage } from '../features/cart/cartSlice';  // Action to update cart from localStorage
import '../internationalization/i18n';
import { useTranslation } from 'react-i18next';

function Homepage() {
    const { user } = useContext(UserContext);
    const cartCount = useSelector((state) => state.cart.totalItems);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setCartFromLocalStorage());
    }, [dispatch]);

    return (
        <Container className="mt-5 d-flex flex-column align-items-center justify-content-center">
            {!user.isLoggedIn ? (
                    <>
                        <h1>{t('pleaseLogIn')}</h1>
                        <NavLink to="/login"><Button>{t('login')}</Button></NavLink>
                        <ProductCatalog />
                    </>
                ) : (
                <>
                    <NavLink to="/cart">
                        <Button aria-label="view your shopping cart">{t('yourCart')}: {cartCount === 0 ? t('empty') : `${cartCount} ${t('item')}${cartCount !== 1 ? "s" : ""}`}</Button>
                    </NavLink>
                    <ProductCatalog />
                    </>
                )
            }
        </Container>
    );
}

export default Homepage;