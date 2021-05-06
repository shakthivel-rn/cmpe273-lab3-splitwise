/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import '../../App.css';
import './GroupPage.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Button, Accordion, Modal, Fade, Card, ListGroup, Form, Image,
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { BsXCircleFill } from 'react-icons/bs';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getGroupDataQuery, getExpenseDataQuery } from '../../graphql/queries/groupPage';
import apolloClient from '../../graphql/apolloclient/client';
import Navigationbar from '../Navigationbar/Navigationbar';
import DashboardSideBar from '../Dashboard/DashboardSideBar';
import AddExpenseForm from './AddExpenseForm';

class GroupPage extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      groupId: 0,
      groupName: '',
      groupDatas: [],
      expenseDatas: [],
      isModalOpen: false,
      fadeFlag: false,
      expenseFadeFlag: false,
      authenticationToken: localStorage.getItem('token'),
      eventKey: 0,
      comment: '',
      comments: [],
      expenseId: undefined,
      commentIndex: undefined,
      deleteFlag: false,
      imagePreview: undefined,
    };
    this.getGroupDetails = this.getGroupDetails.bind(this);
    this.getExpenseDetails = this.getExpenseDetails.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.onSubmitComment = this.onSubmitComment.bind(this);
    this.onDeleteComment = this.onDeleteComment.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    // eslint-disable-next-line react/prop-types
    const { groupId, groupName } = nextProps.location.state;
    return ({
      groupId,
      groupName,
    });
  }

  async componentDidMount() {
    const { userId, groupName } = this.state;
    const groupData = await apolloClient.query({ operationName: 'getgroupdata', query: getGroupDataQuery, variables: { userId, groupName } });
    this.setState({
      groupDatas: [...groupData.data.groupdata],
      fadeFlag: true,
    });
    const { onGetGroupDetails } = this.props;
    onGetGroupDetails(groupData.data.groupdata);
    const response = await axios.get('http://localhost:3001/groupPage/getImage', { params: { groupName } });
    this.setState({
      imagePreview: response.data.image,
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    const { userId, groupName } = this.state;
    if (groupName !== prevState.groupName) {
      const groupData = await apolloClient.query({ operationName: 'getgroupdata', query: getGroupDataQuery, variables: { userId, groupName } });
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        groupDatas: [...groupData.data.groupdata],
        fadeFlag: true,
      });
      const { onGetGroupDetails } = this.props;
      onGetGroupDetails(groupData.data.groupdata);
      const response = await axios.get('http://localhost:3001/groupPage/getImage', { params: { groupName } });
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        imagePreview: response.data.image,
      });
    }
  }

  async getGroupDetails() {
    const { userId, groupName } = this.state;
    const groupData = await apolloClient.query({ operationName: 'getgroupdata', query: getGroupDataQuery, variables: { userId, groupName } });
    this.setState({
      groupDatas: [...groupData.data.groupdata],
      fadeFlag: true,
    });
    this.closeModal();
    const { onGetGroupDetails } = this.props;
    onGetGroupDetails(groupData.data.groupdata);
  }

  async getExpenseDetails(expenseId) {
    const { userId, groupName } = this.state;
    const { onGetExpenseDetails, onGetComments } = this.props;
    const expenseData = await apolloClient.query({ operationName: 'getexpensedata', query: getExpenseDataQuery, variables: { userId, groupName, expenseId } });
    const response = await axios.get('http://localhost:3001/groupPage/getComments', { params: { userId, expenseId } });
    this.setState({
      expenseDatas: [...expenseData.data.expensedata],
      expenseFadeFlag: true,
      comments: [...response.data],
    });
    onGetExpenseDetails(expenseData.data.expensedata);
    onGetComments(response.data);
  }

  handleChangeComment = (e) => {
    this.setState({
      comment: e.target.value,
    });
  }

  onSubmitComment = (expenseId) => {
    const { userId, comment } = this.state;
    const data = {
      expenseId,
      userId,
      comment,
    };
    axios.post('http://localhost:3001/groupPage/postComment', data)
      .then(() => {
        this.getExpenseDetails(expenseId);
      });
  }

  onDeleteComment = (expenseId, commentIndex) => {
    const data = {
      expenseId,
      commentIndex,
    };
    axios.post('http://localhost:3001/groupPage/deleteComment', data)
      .then(() => {
        this.getExpenseDetails(expenseId);
      });
  }

  openModal = () => this.setState({ isModalOpen: true });

  closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const {
      userId, groupId, groupName, groupDatas, isModalOpen, fadeFlag, authenticationToken,
      expenseDatas, expenseFadeFlag, comments, expenseId, commentIndex, deleteFlag, imagePreview,
    } = this.state;
    let { eventKey } = this.state;
    const groupDataList = [];
    const expenseDataList = [];
    const commentsDataList = [];
    comments.forEach((comment, i) => {
      if (comment.userName === 'You') {
        commentsDataList.push(
          <ListGroup.Item>
            <Form.Control
              placeholder={`${comment.userName} ${comment.commentDate.slice(0, 10)} 
${comment.commentDetails}  `}
              readOnly
              as="textarea"
              rows={3}
            />
            <BsXCircleFill
              id="deleteCommentButton"
              onClick={() => {
                this.setState({
                  expenseId: comment.expenseId,
                  commentIndex: i,
                  deleteFlag: true,
                });
              }}
            />
          </ListGroup.Item>,
        );
      } else {
        commentsDataList.push(
          <ListGroup.Item>
            <Form.Control
              placeholder={`${comment.userName} ${comment.commentDate.slice(0, 10)} 
${comment.commentDetails}  `}
              readOnly
              as="textarea"
              rows={3}
            />
          </ListGroup.Item>,
        );
      }
    });
    expenseDatas.forEach((expenseData) => {
      if (expenseData.status === 'added') {
        expenseDataList.unshift(
          <ListGroup.Item id="expensecreated">
            <Container>
              <Row>
                <Col xs={7}>{`Added By: ${expenseData.paidUserName}`}</Col>
                <Col>{`Amount: ${expenseData.expenseAmount}$`}</Col>
              </Row>
            </Container>
          </ListGroup.Item>,
        );
      }
      if (expenseData.status === 'owes') {
        if (expenseData.owedUserName === 'You') {
          expenseDataList.push(
            <ListGroup.Item>
              {`${expenseData.owedUserName}
            owe ${expenseData.paidUserName} ${expenseData.splitAmount}$` }
            </ListGroup.Item>,
          );
        } else {
          expenseDataList.push(
            <ListGroup.Item>
              {`${expenseData.owedUserName}
            ${expenseData.status} ${expenseData.paidUserName}
            ${expenseData.splitAmount}$` }
            </ListGroup.Item>,
          );
        }
      }
      if (expenseData.status === 'paid') {
        expenseDataList.push(
          <ListGroup.Item>
            {`${expenseData.owedUserName}
          ${expenseData.status} ${expenseData.paidUserName}
          ${expenseData.splitAmount}$` }
          </ListGroup.Item>,
        );
      }
    });
    groupDatas.forEach((groupData) => {
      groupDataList.push(
        <Card>
          <Card.Header>
            <Accordion.Toggle id="expense" as={Button} variant="link" eventKey={eventKey.toString()} onClick={() => { this.getExpenseDetails(groupData.expenseId); }}>
              {groupData.expenseDescription}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={eventKey.toString()}>
            <Card.Body>
              <Fade in={expenseFadeFlag}>
                <ListGroup variant="flush">
                  <div>
                    {expenseDataList}
                  </div>
                  <div>
                    <h5 id="commentsheading">Notes and Comments</h5>
                    <Container>
                      <Row>
                        <Col>
                          <ListGroup variant="flush">
                            {commentsDataList.length === 0 ? <p>No comments</p> : (
                              commentsDataList
                            )}
                          </ListGroup>
                        </Col>
                        <Col>
                          <Form inline>
                            <Form.Control onChange={this.handleChangeComment} as="textarea" placeholder="Add comment" rows={3} />
                            <Button id="commentbutton" onClick={() => { this.onSubmitComment(groupData.expenseId); }} className="mb-2">
                              Post
                            </Button>
                          </Form>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </ListGroup>
              </Fade>
            </Card.Body>
          </Accordion.Collapse>
        </Card>,
      );
      eventKey += 1;
    });
    return (
      <div>
        {!authenticationToken ? <Redirect to="/" /> : null}
        {deleteFlag ? (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={() => {
              this.onDeleteComment(expenseId, commentIndex);
              this.setState({
                deleteFlag: false,
              });
            }}
            onCancel={() => {
              this.setState({
                deleteFlag: false,
              });
            }}
            focusCancelBtn
          />
        ) : null}
        <Navigationbar />
        <div className="container">
          <div className="groupcontainer">
            <Container>
              <Row>
                <Col lg={2}>
                  <DashboardSideBar />
                </Col>
                <Col>
                  <div id="grouppagetop">
                    <Row>
                      <Col xs={1.7}>
                        <Fade in={fadeFlag}>
                          <Image src={imagePreview} width={80} roundedCircle />
                        </Fade>
                      </Col>
                      <Col>
                        <Fade in={fadeFlag}>
                          <h3 id="grouptitle">{groupName}</h3>
                        </Fade>
                      </Col>
                      <Col><Fade in={fadeFlag}><Button id="addanexpense" onClick={this.openModal}>Add an expense</Button></Fade></Col>
                      <Modal show={isModalOpen}>
                        <Modal.Header id="modaltop">
                          <Modal.Title>Add an expense</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <AddExpenseForm
                            groupId={groupId}
                            getGroupDetails={this.getGroupDetails}
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button onClick={this.closeModal} id="closemodal">Close</Button>
                        </Modal.Footer>
                      </Modal>
                    </Row>
                  </div>
                  <Row>
                    <Fade in={fadeFlag}>
                      <div id="groupcontent">
                        <Accordion id="accordian">
                          {groupDataList.length === 0 ? <p>No expense created</p> : (
                            groupDataList
                          )}
                        </Accordion>
                      </div>
                    </Fade>
                  </Row>
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
  onGetGroupDetails: (userData) => dispatch({ type: 'GET_GROUP_DATA', value: userData }),
  onGetExpenseDetails: (userData) => dispatch({ type: 'GET_EXPENSE_DETAILS', value: userData }),
  onGetComments: (userData) => dispatch({ type: 'GET_COMMENTS', value: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
