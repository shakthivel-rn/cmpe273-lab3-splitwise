/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import '../../App.css';
import './MyGroups.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, ListGroup, Fade, Button,
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from '../Dashboard/DashboardSideBar';

class MyGroups extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      inviteList: [],
      fadeFlag: false,
      inviteFlag: false,
      groupList: [],
      leaveGroupFlag: false,
      errorLeaveGroupFlag: false,
      authenticationToken: localStorage.getItem('token'),
    };
    this.handleAcceptInvite = this.handleAcceptInvite.bind(this);
    this.handleLeaveGroup = this.handleLeaveGroup.bind(this);
    this.getMyGroupDetails = this.getMyGroupDetails.bind(this);
  }

  async componentDidMount() {
    this.getMyGroupDetails();
  }

  handleAcceptInvite(groupId) {
    const { userId } = this.state;
    const data = {
      userId,
      groupId,
    };
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/myGroups/acceptGroupInvite', data)
      .then(() => {
        this.setState({
          inviteFlag: true,
        });
      });
  }

  handleLeaveGroup(groupName) {
    const { userId } = this.state;
    const data = {
      userId,
      groupName,
    };
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/myGroups/leaveGroup', data)
      .then(() => {
        this.setState({
          leaveGroupFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          errorLeaveGroupFlag: true,
        });
      });
  }

  async getMyGroupDetails() {
    const { userId } = this.state;
    const { onGetJoinedGroups, onGetInvitedGroups } = this.props;
    const resGroupNames = await axios.get('http://localhost:3001/dashboard/getGroupNames', { params: { userId } });
    this.setState({
      groupList: [...resGroupNames.data],
    });
    onGetJoinedGroups(resGroupNames.data);
    const resGroupInvites = await axios.get('http://localhost:3001/myGroups', { params: { userId } });
    this.setState({
      inviteList: [...resGroupInvites.data],
      fadeFlag: true,
    });
    onGetInvitedGroups(resGroupInvites.data);
  }

  render() {
    const {
      inviteList, fadeFlag, inviteFlag,
      groupList, leaveGroupFlag, errorLeaveGroupFlag, authenticationToken,
    } = this.state;
    const groupListDetails = [];
    const inviteListDetails = [];
    groupList.forEach((groupListItem) => {
      groupListDetails.push(
        <ListGroup.Item>
          <Row>
            <Col lg={8}>{groupListItem.name}</Col>
            <Col>
              <Button className="acceptinvitebutton" onClick={() => this.handleLeaveGroup(groupListItem.name)}>
                Leave
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>,
      );
    });
    inviteList.forEach((inviteListItem) => {
      inviteListDetails.push(
        <ListGroup.Item>
          <Row>
            <Col lg={8}>{`${inviteListItem.creatorUser} invited you to join ${inviteListItem.groupName} group`}</Col>
            <Col>
              <Button className="acceptinvitebutton" onClick={() => this.handleAcceptInvite(inviteListItem.groupId)}>
                Join
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>,
      );
    });
    return (
      <div>
        {inviteFlag ? (
          <SweetAlert
            success
            title="Joined group successfully"
            onConfirm={() => {
              this.setState({
                inviteFlag: false,
              });
              this.getMyGroupDetails();
              const {
                refreshBitLocal, onMyGroupsChange,
              } = this.props;
              const modifiedRefreshBitLocal = !refreshBitLocal;
              const modifiedRefreshBitLocalObject = {
                modifiedRefreshBitLocal,
              };
              onMyGroupsChange(modifiedRefreshBitLocalObject);
            }}
          />
        ) : null}
        {leaveGroupFlag ? (
          <SweetAlert
            success
            title="Left group successfully"
            onConfirm={() => {
              this.setState({
                leaveGroupFlag: false,
              });
              this.getMyGroupDetails();
              const {
                refreshBitLocal, onMyGroupsChange,
              } = this.props;
              const modifiedRefreshBitLocal = !refreshBitLocal;
              const modifiedRefreshBitLocalObject = {
                modifiedRefreshBitLocal,
              };
              onMyGroupsChange(modifiedRefreshBitLocalObject);
            }}
          />
        ) : null}
        {errorLeaveGroupFlag ? (
          <SweetAlert
            warning
            title="Clear your pending bills to leave the group"
            onConfirm={() => {
              this.setState({
                errorLeaveGroupFlag: false,
              });
            }}
          />
        ) : null}
        {!authenticationToken ? <Redirect to="/" /> : null}
        <Navigationbar />
        <div className="container">
          <div className="mygroups">
            <Container>
              <Row>
                <Col lg={2}>
                  <DashboardSideBar />
                </Col>
                <Col>
                  <Fade in={fadeFlag}>
                    <div id="invitecontainer">
                      <Row>
                        <Container>
                          <h3 className="groupinvitetitle">My Groups</h3>
                          {groupListDetails.length === 0 ? <p>You are not part of any group</p>
                            : (
                              <ListGroup variant="flush">
                                {groupListDetails}
                              </ListGroup>
                            )}
                        </Container>
                      </Row>
                      <Row>
                        <Container>
                          <h3 className="groupinvitetitle">Group Invites</h3>
                          {inviteListDetails.length === 0 ? <p>No group invites</p> : (
                            <ListGroup variant="flush">
                              {inviteListDetails}
                            </ListGroup>
                          )}
                        </Container>
                      </Row>
                    </div>
                  </Fade>
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
  refreshBitLocal: state.refreshBit,
});

const mapDispatchToProps = (dispatch) => ({
  onMyGroupsChange: (userData) => dispatch({ type: 'RENDER', value: userData }),
  onGetJoinedGroups: (userData) => dispatch({ type: 'GET_JOINED_GROUPS', value: userData }),
  onGetInvitedGroups: (userData) => dispatch({ type: 'GET_INVITED_GROUPS', value: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyGroups);
