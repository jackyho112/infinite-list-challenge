import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AsyncRoute from './AsyncRoute';

const FourOhFour = () => <h1>404</h1>;

const App = () => (
  <div className="app">
    <Switch>
      <Route
        exact
        path="/"
        component={props => (
          <AsyncRoute
            props={props}
            loadingPromise={import('./containers/InfiniteListContainer')}
          />
        )}
      />
      <Route component={FourOhFour} />
    </Switch>
  </div>
);

export default App;
