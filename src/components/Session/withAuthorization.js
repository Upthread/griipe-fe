import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context.js';
import { withFirebase } from '../Firebase/index.js';
import * as ROUTES from '../constants/routes.js';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
      componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
          authUser => {
            if (!condition(authUser)) {
              this.props.history.push(ROUTES.LANDING);
            }
          },
        );
      }
  
      componentWillUnmount() {
        this.listener();
      }
  
      render() {
        return (
            <AuthUserContext.Consumer>
            {authUser =>
              condition(authUser) ? <Component {...this.props} /> : null
            }
          </AuthUserContext.Consumer>
        );
      }
    }
  
    return compose(
      withRouter,
      withFirebase,
    )(WithAuthorization);
  };
  
  export default withAuthorization;