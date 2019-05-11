import React, { Component } from "react";
import { Button, Dimmer, Form, Input, Message, Loader } from "semantic-ui-react";
import { print } from 'graphql';
import gql from 'graphql-tag';
import { Mutation } from "react-apollo";

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
    setError: false,
    setData: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Fluz | Login";
    this.setState({ loadingData: false });
  }

  onSubmit = async event => {

  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    const { username, password } = this.state;

    return (
      <Mutation mutation={LOGIN_QUERY} variables={{ username, password }}>
        {(login, { data, loading, error }) => {
          if (error && !this.state.setError) {
            this.setState({ errorMessage: error.message, setError: true });
          }

          if (data && !this.state.setData) {
            this.setState({ msg: data.login, setData: true });
          }

          return (
            <Form onSubmit={this.onSubmit} error={!!error}>
              <Form.Field width={12}>
                <label>Username</label>
                <Input value={this.state.username} onChange={event => this.setState({ username: event.target.value })} />
              </Form.Field>
              <Form.Group>
                <Form.Field width={12}>
                  <label>Password</label>
                  <Input value={this.state.password} onChange={event => this.setState({ password: event.target.value })} />
                </Form.Field>
                <Button onClick={login} size='small' floated='right' primary basic loading={loading} disabled={loading}>
                  Login
              </Button>
              </Form.Group>
              <Message error header="Oops!" content={this.state.errorMessage} />
              {data && <Message positive header={this.state.msg} />}
            </Form>)
        }}
      </Mutation>
    );
  }
}

export default Login;
