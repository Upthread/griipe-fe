import React from 'react';
import {Link} from 'react-router-dom';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <Link to="home">
  <button type="button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
  </Link>
);

export default withFirebase(SignOutButton);