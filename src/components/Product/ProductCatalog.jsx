import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';
import { Button, Card, Row, Col, Spinner, Alert, Nav, Navbar, Dropdown, Form, InputGroup, Container } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import '../../internationalization/i18n';
import { useTranslation } from 'react-i18next';

const fetchProducts = async (category, sortOrder) => {
    const endpoint = category 
        ? `https://fakestoreapi.com/products/category/${category}?sort=${sortOrder}`
        : `https://fakestoreapi.com/products?sort=${sortOrder}`;

    const response = await fetch(endpoint, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return await response.json();
};

const ProductCatalog = () => {
    const dispatch = useDispatch();
    const [category, setCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceQuery, setPriceQuery] = useState('');
    const { t } = useTranslation();

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products', category, sortOrder],
        queryFn: () => fetchProducts(category, sortOrder),
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(100 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 100,
        cacheTime: 15 * 60 * 1000,
    });

    // Memoize the filtered products for optimized computation
    const filteredProducts = useMemo(() => {
        return products?.filter(product => {
            const matchesTitle = product.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = priceQuery === '' || product.price <= parseFloat(priceQuery);
            return matchesTitle && matchesPrice;
        });
    }, [products, searchQuery, priceQuery]);

    // Memoize event handlers for consistent references
    const handleAddToCart = useCallback((id) => {
        dispatch(addItem({ id }));
    }, [dispatch]);

    const handleCategoryClick = useCallback((selectedCategory) => () => {
        setCategory(selectedCategory);
    }, []);

    const handleSortChange = useCallback((order) => {
        setSortOrder(order);
    }, []);

    const handleSearchChange = useCallback((event) => {
        setSearchQuery(event.target.value);
    }, []);

    const handlePriceChange = useCallback((event) => {
        setPriceQuery(event.target.value);
    }, []);

    if (isLoading) {
        return <Spinner animation="border" role="status">
                    <span className="visually-hidden">...{t('loading')}</span>
                </Spinner>;
    }
    if (error) {
        return <Alert variant="danger" role="alert">{error.message}</Alert>;
    }

    return (
        <Container className="mt-5 d-flex flex-column align-items-center justify-content-center">            
            <h2>{t('productCatalog')}</h2>
            <p>{sortOrder === 'asc' ? t('ascendingOrder') : t('descendingOrder')}</p>
            <Navbar bg="light" expand="lg" className="w-100 px-5" as="header" role="navigation">
                <Navbar.Brand href="/">{t('allProducts')}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" as="nav" role="menubar">
                        <Nav.Item 
                            role="menuitem" 
                            onClick={handleCategoryClick('electronics')} 
                            className={category === 'electronics' ? 'active' : ''}
                        >
                            <Button className="nav-link" style={{ cursor: 'pointer' }}>{t('electronics')}</Button>
                        </Nav.Item>
                        <Nav.Item 
                            role="menuitem" 
                            onClick={handleCategoryClick('jewelery')} 
                            className={category === 'jewelery' ? 'active' : ''}
                        >
                            <Button className="nav-link" style={{ cursor: 'pointer' }}>{t('jewelery')}</Button>
                        </Nav.Item>
                        <Nav.Item 
                            role="menuitem" 
                            onClick={handleCategoryClick("men's clothing")} 
                            className={category === "men's clothing" ? 'active' : ''}
                        >
                            <Button className="nav-link" style={{ cursor: 'pointer' }}>{t('mens')}</Button>
                        </Nav.Item>
                        <Nav.Item 
                            role="menuitem" 
                            onClick={handleCategoryClick("women's clothing")} 
                            className={category === "women's clothing" ? 'active' : ''}
                        >
                            <Button className="nav-link" style={{ cursor: 'pointer' }}>{t('womens')}</Button>
                        </Nav.Item>
                    </Nav>
                    <Dropdown className="ml-auto">
                        <Dropdown.Toggle variant="primary-subtle" id="dropdown-sort">
                        {t('sortBy')}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item role="menuitem" onClick={() => handleSortChange('asc')}>{t('ascending')}</Dropdown.Item>
                            <Dropdown.Item role="menuitem" onClick={() => handleSortChange('desc')}>{t('descending')}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form className="d-flex">
                        <Form.Control 
                            type="search" 
                            placeholder={t('placeholderSearchByTitle')}
                            className="me-2" 
                            aria-label="Search by title" 
                            value={searchQuery} 
                            onChange={handleSearchChange} 
                        />
                    </Form>
                    <Form className="d-flex">
                        <Form.Group className="d-flex align-items-center">
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    placeholder={t('placeholderMaxPrice')}
                                    aria-label="Search by price"
                                    value={priceQuery}
                                    onChange={handlePriceChange}
                                />
                            </InputGroup>
                        </Form.Group>                    
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredProducts?.map(product => (
                    <Col key={product.id} className="d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                            <div style={{ padding: '8px' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={product.image} 
                                    style={{ height: '250px', objectFit: 'contain' }}
                                    alt={`Image of ${product.title}`} 
                                />
                            </div>
                            <Card.Body>
                                <Card.Title><strong>{product.title}</strong></Card.Title>
                                <Card.Text><strong>{t('category')}:</strong> {product.category}</Card.Text>
                                <Card.Text className="small-font-size"><small><strong>{t('description')}:</strong> {product.description}</small></Card.Text>
                                <Card.Text><strong>{t('price')}:</strong> ${product.price}</Card.Text>
                                <Button 
                                    variant="primary" 
                                    onClick={() => handleAddToCart(product.id)}
                                    aria-label={`add ${product.title} to cart`}
                                >
                                    {t('addToCart')}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ProductCatalog;