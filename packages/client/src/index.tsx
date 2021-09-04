import ReactDOM from 'react-dom';

import { ModalProvider } from 'react-declarative';

import { SnackbarProvider } from 'notistack';
import { Provider } from 'mobx-react';

import ioc from './lib/ioc';

import App from './components/App';

const wrappedApp = (
  <SnackbarProvider
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
  >
    <ModalProvider>
      <Provider {...ioc}>
        <App />
      </Provider>
    </ModalProvider>
  </SnackbarProvider>
);

ReactDOM.render(wrappedApp, document.getElementById('root'));
