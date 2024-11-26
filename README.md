# Advanced React E-commerce Web Application

## Project Overview
This project is an advanced React-based e-commerce application that utilizes **FakeStoreAPI** for simulating product data, user management, and shopping cart functionalities. The application demonstrates advanced React concepts, including state management with **Redux Toolkit**, data fetching with **React Query**, and user authentication. It also incorporates **React-i18next** for internationalization and accessibility features.

## Key Features
- **User CRUD**: Create, read, update, and delete user profiles.
- **Product Catalog**: Browse, filter, and search for products.
- **Shopping Cart**: Add, update, and remove products, with real-time calculations for total price and quantity.
- **Checkout and Order History**: Simulate the checkout process and view past orders.
- **Performance Optimization**: Use of `useMemo` and `useCallback` to optimize the application.
- **Internationalization**: Multi-language support with **React-i18next**.
- **Testing**: Unit and integration tests for some components.

## Installation - Prerequisites
- Ensure that **Node.js** is installed on your machine.

## Steps to Install
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies.
4. Start the development server and run the application locally.

## Project Structure
- **/src**
  - **/components**
    - **/Product**: Contains `ProductCatalog` & `ShoppingCart` JSX components
    - **/User**: Contains `CartHistory`, `CreateUser`, `DeleteUser`, `Login`, `Logout`, & `UpdateUser` components
    - **AccessDenied**: JSX component for context-forbidden endpoints
    - **NotFound**: JSX component for non-existent endpoints
    - **Homepage**: JSX component directory and product catalog display
  - **/context**: Contains `UserContext` JSX file which stores the logged-in user
  - **/features**: Contains Redux slices and actions
  - **/internationalization**: Contains i18n file with key:value language dictionary
  - **SemanticAppLayout**: JSX file pulling everything together and keeping it current
  - **store**: Central hub of the application's states


## Technologies Used
- **React**: For building the user interface.
- **Redux Toolkit**: For managing global state.
- **React Query**: For data fetching from the FakeStoreAPI.
- **React-i18next**: For internationalization (i18n).
- **Jest**: For testing (unit and integration).
- **React Testing Library**: For simulating user interactions in tests.
- **Session Storage**: For persisting token and cart data.

## Conclusion
This project demonstrates the usage of advanced React concepts, including **Redux** for state management, **React Query** for data fetching, and **React-i18next** for internationalization. It simulates a real-world e-commerce platform with user authentication, a product catalog, a shopping cart, and a checkout process, providing a solid foundation for a scalable application.
