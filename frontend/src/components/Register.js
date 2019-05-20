import React, { Component } from "react";
import { Button, Dimmer, Form, Input, Message, Loader } from "semantic-ui-react";
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios';

const REGISTER = gql`
mutation register($username:String!, $password: String!){
  register(username: $username, password: $password){
    id,
    username,
    token
  }
}`;

class Register extends Component {
  state = {
    msg: '',
    username: '',
    password: '',
    loadingData: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Fluz | Register";
    this.setState({ loadingData: false });
  }

  onSubmit = async () => {
    this.setState({ loadingData: true });

    const token = localStorage.getItem('token');
    if (!token) {
      const res = await axios.post(`http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
        query: print(REGISTER),
        variables: { username: this.state.username, password: this.state.password },
      })

      if (res.data.errors) {
        this.setState({ errorMessage: res.data.errors[0].message });
      }
      if (res.data.data.register) {
        this.setState({ msg: 'Registered Successfully! ', errorMessage: '' });
        //localStorage.setItem('token', res.data.data.register.token);
      }
    } else {
      this.setState({ errorMessage: 'Already Loggedin/Registered!', msg: '' });
    }
    this.setState({ loadingData: false });
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
        <h1>Register</h1>
        <br /><br />
        <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
          <Form.Field width={12}>
            <label>Username</label>
            <Input value={this.state.username} onChange={event => this.setState({ username: event.target.value })} />
          </Form.Field>
          <Form.Group>
            <Form.Field width={12}>
              <label>Password</label>
              <Input value={this.state.password} onChange={event => this.setState({ password: event.target.value })} />
            </Form.Field>
            <Button type='submit' size='small' floated='right' primary basic loading={this.state.loadingData}
              disabled={this.state.loadingData}>
              Register
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

export default Register;
