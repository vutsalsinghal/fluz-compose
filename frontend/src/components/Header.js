import React from 'react';
import { Dropdown, Menu, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';

export default props => {
  const token = localStorage.getItem('token');

  return (
    <Menu style={{ marginTop: '0px', }} size={'large'}>
      <Menu.Item><Link to='/'>Fluz</Link></Menu.Item>
      <Menu.Menu position="right">
        {(!token &&
          <Modal trigger={<Menu.Item>Login</Menu.Item>}>
            <Modal.Header>Login</Modal.Header>
            <Modal.Content>
              <Login />
            </Modal.Content>
          </Modal>) ||
          (<Menu>
            <Dropdown text='Menu' pointing item>
              <Dropdown.Menu>
                <Dropdown.Item><Link to='/intake'>Update Calorie Intake</Link></Dropdown.Item>
                <Dropdown.Item><Link to='/spent'>Update Calorie Spent</Link></Dropdown.Item>
                <Dropdown.Item><Link to='/friends'>Friends</Link></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Modal trigger={<Menu.Item>Logout</Menu.Item>}>
              <Modal.Header>Logout</Modal.Header>
              <Modal.Content>
                <Logout />
              </Modal.Content>
            </Modal>
          </Menu>)
        }
      </Menu.Menu>
    </Menu>
  );
};