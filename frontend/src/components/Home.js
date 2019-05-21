import React, { Component } from "react";
import { Loader, Dimmer, Table } from "semantic-ui-react";
import { print } from 'graphql';
import gql from 'graphql-tag';
import axios from 'axios';

const GET_RANK = gql`
{
  calcRank {
    username,
    intake,
    spent,
    variance,
    separation
  }
}
`;

class Home extends Component {
  state = {
    msg: '',
    rank: [],
    token: '',
    loadingData: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Calorie";
    await axios.get(`http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/`)

    const token = localStorage.getItem('token');
    if (token) {
      const res = await axios.post(
        `http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`, {
          query: print(GET_RANK),
        }, {
          headers: { 'x-token': token }
        })

      if (res.data.errors) {
        this.setState({ errorMessage: res.data.errors[0].message });
      }
      if (res.data.data.calcRank) {
        this.setState({ rank: res.data.data.calcRank });
      }
    } else {
      this.setState({ errorMessage: 'Not Logged in!' });
    }

    this.setState({ loadingData: false, token });
  }

  renderRank = () => {
    const items = this.state.rank.map((row, id) => {
      return (
        <Table.Row key={id}>
          <Table.Cell>{id + 1}</Table.Cell>
          <Table.Cell>{row.username}</Table.Cell>
          <Table.Cell>{row.intake}</Table.Cell>
          <Table.Cell>{row.spent}</Table.Cell>
          <Table.Cell>{row.variance}</Table.Cell>
          <Table.Cell>{row.separation}</Table.Cell>
        </Table.Row>
      )
    })

    return (
      <Table celled padded unstackable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Rank</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Intake</Table.HeaderCell>
            <Table.HeaderCell>Spent</Table.HeaderCell>
            <Table.HeaderCell>Variance</Table.HeaderCell>
            <Table.HeaderCell>Separation</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items}
        </Table.Body>
      </Table>
    )
  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    return (
      <div>
        <br />
        <h1 style={{ "textAlign": "center" }}>Welcome!</h1>
        <br /><br />

        <h2>Statistics</h2><br />
        {this.state.token && this.renderRank()}
        {/*{this.state.errorMessage && <div style={{ color: '#cc0000' }}><br />Not Loggedin!</div>}*/}

        <br /><br />
      </div>
    );
  }
}

export default Home;
