import React, { Component } from "react";
import { Button, Dimmer, Form, Input, Message, Loader } from "semantic-ui-react";
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios';

const GET_CALORIE = gql`
query {
	getCalorieIntake{
  	id,
    user_id,
    amount
  }
}`;

const ADD_CALORIE = gql`
mutation addCalorieIntake($amount: Int!){
  addCalorieIntake(amount: $amount){
    id,
    user_id,
    amount
  }
}`;

class AddCalorieIntake extends Component {
  state = {
    msg: '',
    loadingData: false,
    errorMessage: '',
    calorie: '',
    token: ''
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Fluz";

    //localStorage.setItem('token', '');
    const token = localStorage.getItem('token');
    console.log('token in react: ', token);
    if (token) {
      const res = await axios.post(
        `http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
          query: print(GET_CALORIE),
        }, {
          headers: { 'x-token': token }
        })

      if (res.data.errors) {
        this.setState({ errorMessage: res.data.errors[0].message });
      }
      if (res.data.data.getCalorieIntake) {
        this.setState({ msg: 'Current Calorie intake: ' + res.data.data.getCalorieIntake.amount });
      }
    } else {
      this.setState({ errorMessage: 'Not Logged in!' });
    }

    this.setState({ loadingData: false, token });
  }

  onSubmit = async (event) => {
    const res = await axios.post(`http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
      query: print(ADD_CALORIE),
      variables: { amount: parseInt(this.state.calorie, 10) },
    }, {
        headers: { 'x-token': this.state.token }
      })

    if (res.data.errors) {
      this.setState({ errorMessage: res.data.errors[0].message });
    }
    if (res.data.data.addCalorieIntake) {
      this.setState({ msg: 'Current Calorie intake: ' + res.data.data.addCalorieIntake.amount });
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
      <div>
        <br />
        <h1>Add Calorie Intake</h1>
        <br /><br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          {msg}
          <Form.Group>
            <Form.Field width={12}>
              <label>Add Calorie</label>
              <Input value={this.state.calorie} onChange={event => this.setState({ calorie: event.target.value })} />
            </Form.Field>
            <Button type='submit' size='small' floated='right' primary basic loading={this.state.loadingData} disabled={this.state.loadingData}>
              ADD
          </Button>
          </Form.Group>
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Form>
        <br /><br />
      </div>
    );
  }
}

export default AddCalorieIntake;
