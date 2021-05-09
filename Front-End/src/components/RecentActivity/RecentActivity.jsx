/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import '../../App.css';
import './RecentActivity.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, ListGroup, Fade, Pagination, Form,
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import apolloClient from '../../graphql/apolloclient/client';
import getRecentActivityDataQuery from '../../graphql/queries/recentActivityPage';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from '../Dashboard/DashboardSideBar';

class RecentActivity extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      recentactivitylogs: [],
      fadeFlag: false,
      authenticationToken: localStorage.getItem('token'),
      paginationNumber: 0,
      pageSize: 2,
      active: 1,
      order: 'desc',
      groupList: [],
      selectedGroup: 'All',
    };
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.onGroupChange = this.onGroupChange.bind(this);
  }

  async componentDidMount() {
    const {
      userId, order, selectedGroup,
    } = this.state;
    let { pageSize } = this.state;
    const { onGetRecentActivity } = this.props;
    const pageNumber = '1';
    pageSize = pageSize.toString();
    const recentActivityData = await apolloClient.query({
      operationName: 'getrecentactivity',
      query: getRecentActivityDataQuery,
      variables: {
        userId, pageNumber, pageSize, order, selectedGroup,
      },
      fetchPolicy: 'no-cache',
    });
    const { recentactivitylogs } = this.state;
    this.setState({
      recentactivitylogs: recentactivitylogs.concat(recentActivityData.data.recentactivitydata),
      fadeFlag: true,
    });
    onGetRecentActivity(recentActivityData.data.recentactivitydata);
    const response = await axios.get('http://localhost:3001/recentActivity/getPaginationNumbers', { params: { userId, pageSize, selectedGroup } });
    this.setState({
      paginationNumber: response.data.paginationNumber,
    });
    const groupNames = await axios.get('http://localhost:3001/dashboard/getGroupNames', { params: { userId } });
    this.setState({
      groupList: [...groupNames.data],
    });
  }

  onPageSizeChange = async (e) => {
    await this.setState({
      pageSize: e.target.value,
      fadeFlag: false,
    });
    const {
      userId, order, selectedGroup,
    } = this.state;
    let { pageSize } = this.state;
    const { onGetRecentActivity } = this.props;
    const res = await axios.get('http://localhost:3001/recentActivity/getPaginationNumbers', { params: { userId, pageSize, selectedGroup } });
    this.setState({
      paginationNumber: res.data.paginationNumber,
    });
    const pageNumber = '1';
    pageSize = pageSize.toString();
    const recentActivityData = await apolloClient.query({
      operationName: 'getrecentactivity',
      query: getRecentActivityDataQuery,
      variables: {
        userId, pageNumber, pageSize, order, selectedGroup,
      },
      fetchPolicy: 'no-cache',
    });
    this.setState({
      recentactivitylogs: [...recentActivityData.data.recentactivitydata],
      fadeFlag: true,
      active: pageNumber,
    });
    onGetRecentActivity(recentActivityData.data.recentactivitydata);
  }

  onPageChange = async (pagenumber) => {
    await this.setState({
      fadeFlag: false,
    });
    const {
      userId, order, selectedGroup,
    } = this.state;
    let { pageSize } = this.state;
    const { onGetRecentActivity } = this.props;
    const pageNumber = pagenumber.toString();
    pageSize = pageSize.toString();
    const recentActivityData = await apolloClient.query({
      operationName: 'getrecentactivity',
      query: getRecentActivityDataQuery,
      variables: {
        userId, pageNumber, pageSize, order, selectedGroup,
      },
      fetchPolicy: 'no-cache',
    });
    this.setState({
      recentactivitylogs: [...recentActivityData.data.recentactivitydata],
      fadeFlag: true,
      active: pagenumber,
    });
    onGetRecentActivity(recentActivityData.data.recentactivitydata);
  }

  onOrderChange = async (e) => {
    await this.setState({
      order: e.target.value,
      fadeFlag: false,
    });
    const {
      userId, order, selectedGroup,
    } = this.state;
    let { pageSize } = this.state;
    const { onGetRecentActivity } = this.props;
    const pageNumber = '1';
    pageSize = pageSize.toString();
    const recentActivityData = await apolloClient.query({
      operationName: 'getrecentactivity',
      query: getRecentActivityDataQuery,
      variables: {
        userId, pageNumber, pageSize, order, selectedGroup,
      },
      fetchPolicy: 'no-cache',
    });
    this.setState({
      recentactivitylogs: [...recentActivityData.data.recentactivitydata],
      fadeFlag: true,
      active: pageNumber,
    });
    onGetRecentActivity(recentActivityData.data.recentactivitydata);
  }

  onGroupChange = async (e) => {
    await this.setState({
      selectedGroup: e.target.value,
      fadeFlag: false,
    });
    const {
      userId, order, selectedGroup,
    } = this.state;
    let { pageSize } = this.state;
    const { onGetRecentActivity } = this.props;
    const res = await axios.get('http://localhost:3001/recentActivity/getPaginationNumbers', { params: { userId, pageSize, selectedGroup } });
    this.setState({
      paginationNumber: res.data.paginationNumber,
    });
    const pageNumber = '1';
    pageSize = pageSize.toString();
    const recentActivityData = await apolloClient.query({
      operationName: 'getrecentactivity',
      query: getRecentActivityDataQuery,
      variables: {
        userId, pageNumber, pageSize, order, selectedGroup,
      },
      fetchPolicy: 'no-cache',
    });
    this.setState({
      recentactivitylogs: [...recentActivityData.data.recentactivitydata],
      fadeFlag: true,
      active: pageNumber,
    });
    onGetRecentActivity(recentActivityData.data.recentactivitydata);
  }

  render() {
    const {
      recentactivitylogs, fadeFlag, authenticationToken, paginationNumber, groupList,
    } = this.state;
    const groupListDetails = [];
    groupListDetails.push(<option value="All">All</option>);
    groupList.forEach((groupItem) => {
      groupListDetails.push(
        <option value={groupItem.name}>{groupItem.name}</option>,
      );
    });
    const recentactivityloglist = [];
    recentactivitylogs.forEach((recentactivitylog) => {
      if (recentactivitylog.status === 'added') {
        recentactivityloglist.push(
          <ListGroup.Item>{`${recentactivitylog.paidUserName} ${recentactivitylog.status} ${recentactivitylog.expenseName} expense of ${recentactivitylog.expenseAmount}$ in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
        );
      }
      if (recentactivitylog.status === 'owes') {
        if (recentactivitylog.owedUserName === 'You') {
          recentactivityloglist.push(
            <ListGroup.Item>{`${recentactivitylog.owedUserName} owe ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
          );
        } else {
          recentactivityloglist.push(
            <ListGroup.Item>{`${recentactivitylog.owedUserName} ${recentactivitylog.status} ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
          );
        }
      }
      if (recentactivitylog.status === 'paid') {
        recentactivityloglist.push(
          <ListGroup.Item>{`${recentactivitylog.owedUserName} ${recentactivitylog.status} ${recentactivitylog.paidUserName} ${recentactivitylog.splitAmount}$ in ${recentactivitylog.expenseName} expense in ${recentactivitylog.groupName} group` }</ListGroup.Item>,
        );
      }
    });

    const { active } = this.state;
    const items = [];
    for (let number = 1; number <= paginationNumber; number += 1) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => {
            this.onPageChange(number);
          }}
        >
          {number}
        </Pagination.Item>,
      );
    }
    return (
      <div>
        {!authenticationToken ? <Redirect to="/" /> : null }
        <Navigationbar />
        <div className="container">
          <div className="recentactivity">
            <Container>
              <Row>
                <Col lg={2}>
                  <DashboardSideBar />
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <h3 id="recentactivitytitle">Recent Activity</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>
                      <Form.Label>Page Size</Form.Label>
                      <Form.Control as="select" defaultValue={2} onChange={this.onPageSizeChange}>
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                      </Form.Control>
                    </Col>
                    <Col xs={4}>
                      <Form.Label>Order</Form.Label>
                      <Form.Control as="select" defaultValue="desc" onChange={this.onOrderChange}>
                        <option value="desc">Most Recent First</option>
                        <option value="asc">Most Recent Last</option>
                      </Form.Control>
                    </Col>
                    <Col xs={4}>
                      <Form.Label>Groups</Form.Label>
                      <Form.Control as="select" defaultValue="All" onChange={this.onGroupChange}>
                        {groupListDetails}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Fade in={fadeFlag}>
                    <div id="recentactivitycontent">
                      {recentactivityloglist.length === 0 ? <p>No recent activity</p> : (
                        <ListGroup variant="flush">
                          {recentactivityloglist}
                        </ListGroup>
                      )}
                    </div>
                  </Fade>
                  <Pagination>{items}</Pagination>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userIdRedux: state.id,
});

const mapDispatchToProps = (dispatch) => ({
  onGetRecentActivity: (userData) => dispatch({ type: 'GET_RECENT_ACTIVITY', value: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentActivity);
