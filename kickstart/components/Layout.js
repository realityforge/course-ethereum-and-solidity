import Head from 'next/head';
import React from 'react';
import {Container} from 'semantic-ui-react';
import Header from './Header';

export default props => {
  return (
    <Container>
      {/* Head is a special Next.js component that portals the contained content into head for page*/}
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      </Head>

      <Header/>
      {props.children}
    </Container>
  );
};
