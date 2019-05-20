import React, { Component } from "react";
import { Button, Dimmer, Form, Input, Message, Loader } from "semantic-ui-react";
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios';

const GET_CALORIE_SPENT = gql`
query {
	getCalorieSpent{
  	id,
    user_id,
    amount
  }
}`;

const ADD_CALORIE_SPENT = gql`
mutation addCalorieSpent($amount: Int!){
  addCalorieSpent(amount: $amount){
    id,
    user_id,
    amount
  }
}`;

const SUB_CALORIE_SPENT = gql`
mutation subCalorieSpent($amount: Int!){
  subCalorieSpent(amount: $amount){
    id,
    user_id,
    amount
  }
}`;

class CalorieSpent extends Component {
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
    if (token) {
      const res = await axios.post(
        `http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
          query: print(GET_CALORIE_SPENT),
        }, {
          headers: { 'x-token': token }
        })

      if (res.data.errors) {
        this.setState({ errorMessage: res.data.errors[0].message });
      }
      if (res.data.data.getCalorieSpent) {
        this.setState({ msg: 'Current Calorie intake: ' + res.data.data.getCalorieSpent.amount });
      }
    } else {
      this.setState({ errorMessage: 'Not Logged in!' });
    }

    this.setState({ loadingData: false, token });
  }

  onAddSubmit = async () => {
    this.setState({ loadingData: true });
    const res = await axios.post(`http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
      query: print(ADD_CALORIE_SPENT),
      variables: { amount: parseInt(this.state.calorie, 10) },
    }, {
        headers: { 'x-token': this.state.token }
      })

    if (res.data.errors) {
      this.setState({ errorMessage: res.data.errors[0].message });
    }
    if (res.data.data.addCalorieSpent) {
      this.setState({ msg: 'Current Calorie intake: ' + res.data.data.addCalorieSpent.amount, errorMessage: '' });
    }
    this.setState({ loadingData: false });
  }

  onSubSubmit = async () => {
    this.setState({ loadingData: true });
    const res = await axios.post(`http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
      query: print(SUB_CALORIE_SPENT),
      variables: { amount: parseInt(this.state.calorie, 10) },
    }, {
        headers: { 'x-token': this.state.token }
      })

    if (res.data.errors) {
      this.setState({ errorMessage: res.data.errors[0].message });
    }
    if (res.data.data.subCalorieSpent) {
      this.setState({ msg: 'Current Calorie intake: ' + res.data.data.subCalorieSpent.amount, errorMessage: '' });
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
        <h1>Update Calorie Spent</h1>
        <br /><br />
        <Form error={!!this.state.errorMessage}>
          {msg}
          <Form.Group>
            <Form.Field width={12}>
              <label>Update Calorie Spent</label>
              <Input value={this.state.calorie} onChange={event => this.setState({ calorie: event.target.value })} />
            </Form.Field>
            <Button type='submit'
              size='small'
              floated='right'
              primary basic
              loading={this.state.loadingData}
              disabled={this.state.loadingData}
              onClick={this.onAddSubmit}>
              ADD
            </Button>
            <Button type='submit'
              size='small'
              floated='right'
              primary basic
              loading={this.state.loadingData}
              disabled={this.state.loadingData}
              onClick={this.onSubSubmit}>
              SUB
            </Button>
          </Form.Group>
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Form>
        <br /><br />
      </div>
    );
  }
}

export default CalorieSpent;
