import React from 'react';
import {Menu} from 'semantic-ui-react';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <a className="item">CrowdCoin</a>

      <Menu.Menu position="right">
        <a className="item">Campaigns</a>

        <a className="item">+</a>
      </Menu.Menu>
    </Menu>
  );
};
