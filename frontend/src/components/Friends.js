import React, { Component } from "react";
import { Button, Dimmer, Form, Input, Message, Menu, Loader } from "semantic-ui-react";
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios';

const GET_FRIENDS = gql`
query {
	getFriends{
    username
  }
}`;

const ADD_FRIEND = gql`
mutation addFriend($username: String!){
  addFriend(username:$username){
    username
  }
}`;

class Friends extends Component {
  state = {
    msg: '',
    loadingData: false,
    errorMessage: '',
    friends: [],
    username: '',
    token: ''
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Fluz | Friends";

    const token = localStorage.getItem('token');
    if (token) {
      const res = await axios.post(
        `http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
          query: print(GET_FRIENDS),
        }, {
          headers: { 'x-token': token }
        })

      if (res.data.errors) {
        this.setState({ errorMessage: res.data.errors[0].message });
      }
      if (res.data.data.getFriends) {
        this.setState({ friends: res.data.data.getFriends });
      }
    } else {
      this.setState({ errorMessage: 'Not Logged in!' });
    }

    this.setState({ loadingData: false, token });
  }

  onSubmit = async (event) => {
    const res = await axios.post(`http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
      query: print(ADD_FRIEND),
      variables: { username: this.state.username },
    }, {
        headers: { 'x-token': this.state.token }
      })

    if (res.data.errors) {
      this.setState({ errorMessage: res.data.errors[0].message });
    }
    if (res.data.data.addFriend) {
      this.setState({ msg: 'Friend added successfully!', errorMessage: '' });
    }
  }

  renderFriends = () => {
    let items = this.state.friends.map((frnd, id) => {
      return (
        <Menu.Item
          key={id}
          name={frnd.username}
        >
        </Menu.Item>
      );
    });

    return <Menu vertical style={{
      maxHeight: '10em',
      overflowY: 'scroll',
    }}>{items}</Menu>;
  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    let msg = null;
    if (this.state.msg) {
      msg = <Message positive header={this.state.msg} />
    }

    return (
      <div>
        <br />
        <h1>Friend List</h1>
        {this.state.friends && this.renderFriends()}

        <br /><br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Group>
            <Form.Field width={12}>
              <label>Add Friend</label>
              <Input value={this.state.username} onChange={event => this.setState({ username: event.target.value })} />
            </Form.Field>
            <Button type='submit' size='small' floated='right' primary basic loading={this.state.loadingData} disabled={this.state.loadingData}>
              ADD
          </Button>
          </Form.Group>
          <Message error header="Oops!" content={this.state.errorMessage} />
          {msg}
        </Form>
        <br /><br />
      </div>
    );
  }
}

export default Friends;
