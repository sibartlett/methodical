import React from 'react';
import { StoreProvider } from 'easy-peasy';
import { Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { install, ThemeProvider } from '@material-ui/styles';

import Root from './components/Root'
import store from './store';
import history from './history';

install();

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  }
});

const App = () => (
  <StoreProvider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={history}>
        <Root />
      </Router>
    </ThemeProvider>
  </StoreProvider>
);

export default App;
