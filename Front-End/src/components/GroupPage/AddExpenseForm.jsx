/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import '../../App.css';
import './AddExpenseForm.css';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  Button, Form,
} from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import { createExpenseMutation } from '../../graphql/mutations/group';
import apolloClient from '../../graphql/apolloclient/client';
import { getGroupDataQuery } from '../../graphql/queries/groupPage';

class AddExpenseForm extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    const { groupId, getGroupDetails, groupName } = props;
    this.state = {
      userId: userIdRedux,
      groupId,
      groupName,
      getGroupDetails,
      expenseDescription: '',
      expenseAmount: 0,
      membersNotAcceptedFlag: false,
    };
    this.handleChangeExpenseDescription = this.handleChangeExpenseDescription.bind(this);
    this.handleChangeExpenseAmount = this.handleChangeExpenseAmount.bind(this);
    this.submitExpense = this.submitExpense.bind(this);
  }

  handleChangeExpenseDescription = (e) => {
    this.setState({
      expenseDescription: e.target.value,
    });
  }

  handleChangeExpenseAmount = (e) => {
    this.setState({
      expenseAmount: e.target.value,
    });
  }

  submitExpense = (e) => {
    e.preventDefault();
    const {
      userId,
    } = this.state;
    const {
      groupId, groupName, expenseDescription, expenseAmount, getGroupDetails,
    } = this.state;
    // userId = Number(userId);
    axios.defaults.withCredentials = true;
    apolloClient.mutate({
      operationName: 'createexpense',
      mutation: createExpenseMutation,
      variables: {
        userId, groupId, expenseDescription, expenseAmount,
      },
    }).then((response) => {
      if (response.data.createexpense === '200') {
        getGroupDetails();
      } else {
        this.setState({
          membersNotAcceptedFlag: true,
        });
      }
    });
  }

  render() {
    const { membersNotAcceptedFlag } = this.state;
    return (
      <div>
        {membersNotAcceptedFlag ? (
          <SweetAlert
            warning
            title="Members invite status pending"
            onConfirm={() => {
              this.setState({
                membersNotAcceptedFlag: false,
              });
            }}
          />
        ) : null}
        <div className="expenseForm">
          <Form method="post" onSubmit={this.submitExpense}>
            <Form.Group controlId="formExpenseDescription">
              <Form.Control onChange={this.handleChangeExpenseDescription} type="text" placeholder="Enter a description" />
            </Form.Group>

            <Form.Group controlId="formExpenseAmount">
              <Form.Control onChange={this.handleChangeExpenseAmount} type="number" placeholder="$ 0.0" />
            </Form.Group>
            <Button id="submitExpenseButton" type="submit">Save</Button>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userIdRedux: state.id,
});

export default connect(mapStateToProps)(AddExpenseForm);
