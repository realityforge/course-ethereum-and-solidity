import React from 'react';
import {Container, Head} from 'semantic-ui-react';
import Header from './Header';

export default props => {
  return (
    <Container>
      <Header/>
      {props.children}
    </Container>
  );
};
