import React, { Component } from "react";
import { Button, Dimmer, Form, Message, Loader } from "semantic-ui-react";

class Logout extends Component {
  state = {
    msg: '',
    loadingData: false,
    errorMessage: '',
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Calorie | Logout";
    this.setState({ loadingData: false });
  }

  onSubmit = async (event) => {
    const token = localStorage.getItem('token');

    if (token) {
      localStorage.setItem('token', '');
      this.setState({ msg: 'Loggedout Successfully!', errorMessage: '' });
    } else {
      this.setState({ errorMessage: 'Not Logged in!' });
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
        <Form.Group>
          <Form.Field width={12}>
            <label>Are you sure?</label>
          </Form.Field>
          <Button type='submit' size='small' floated='right' primary basic loading={this.state.loadingData} disabled={this.state.loadingData}>
            Logout
          </Button>
        </Form.Group>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {msg}
      </Form>
    );
  }
}

export default Logout;
