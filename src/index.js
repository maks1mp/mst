import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import RootStore from './store';

const store = RootStore.create({});

export const StoreContext = createContext(store);

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <CssBaseline/>
      <App/>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
