import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);


// Provider makes the store available to every component in the tree., and they can acccess it via useAppSelector and useAppDispatch hooks we created in hook.ts. 

// store/index.ts          ← creates and exports the store
//     ↓
// src/index.tsx           ← imports store, passes it to <Provider>
//     ↓
// <Provider store={store}>← makes store available to all components
//     ↓
// Any component           ← reads/writes store via useAppSelector/useAppDispatch
