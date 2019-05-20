import React, { Component } from "react";
import { Button, Dimmer, Form, Input, Message, Loader } from "semantic-ui-react";
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios';

const LOGIN_QUERY = gql`
mutation login($username: String!, $password: String!){
  login(username: $username, password:$password){
    token
  }
}`;

class Login extends Component {
  state = {
    msg: '',
    loadingData: false,
    errorMessage: '',
    username: '',
    password: '',
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Fluz | Login";
    this.setState({ loadingData: false });
  }

  onSubmit = async event => {
    const res = await axios.post(`http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
      query: print(LOGIN_QUERY),
      variables: { username: this.state.username, password: this.state.password }
    })
    if (res.data.errors) {
      this.setState({ errorMessage: res.data.errors[0].message });
    }
    if (res.data.data.login) {
      localStorage.setItem('token', res.data.data.login.token);
      this.setState({ msg: 'Loggedin Successfully!', errorMessage: '' });
    }
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
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field width={12}>
          <label>Username</label>
          <Input value={this.state.username} onChange={event => this.setState({ username: event.target.value })} />
        </Form.Field>
        <Form.Group>
          <Form.Field width={12}>
            <label>Password</label>
            <Input value={this.state.password} onChange={event => this.setState({ password: event.target.value })} />
          </Form.Field>
          <Button type='submit' size='small' floated='right' primary basic loading={this.state.loadingData} disabled={this.state.loadingData}>
            Login
          </Button>
        </Form.Group>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {msg}
      </Form>
    );
  }
}

export default Login;
