import React, { Component } from 'react';
import Spinner from './Spinner';

class AsyncRoute extends Component {
  constructor() {
    super();
    this.state = { loaded: false };
    this.component = null;
  }

  componentDidMount() {
    this.props.loadingPromise.then(module => {
      this.component = module.default;
      this.setState({ loaded: true });
    });
  }

  render() {
    if (this.state.loaded) {
      return <this.component {...this.props.props} />;
    }
    return <Spinner />;
  }
}

export default AsyncRoute;
