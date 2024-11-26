// here's where it comes to life!

import { Provider } from 'react-redux';
import { store } from './store';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import SemanticAppLayout from './SemanticAppLayout.jsx';



// initialize a react app by creating a root element for it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( // render the app within the root element
  // enables routing in a React application without reloading the browser
    <Provider store={store}>
      <SemanticAppLayout />
    </Provider>
);