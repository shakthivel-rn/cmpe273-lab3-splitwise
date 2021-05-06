/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import '../../App.css';
import './CreateGroup.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Form, Figure, Button, Fade,
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      groupName: '',
      inputs: ['Enter Group Member Email'],
      memberEmails: [],
      fadeFlag: false,
      inputEmails: [],
      invalidGroupNameFlag: false,
      groupCreatedFlag: false,
      redirectPage: false,
      authenticationToken: localStorage.getItem('token'),
      selectedFile: null,
      imagePreview: undefined,
    };
    this.appendInput = this.appendInput.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeGroupName = this.handleChangeGroupName.bind(this);
    this.submitGroup = this.submitGroup.bind(this);
    this.handleImage = this.handleImage.bind(this);
  }

  async componentDidMount() {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/createGroup/getMemberEmails');
    this.setState({
      fadeFlag: true,
      inputEmails: [...res.data],
    });
  }

  handleImage = (e) => {
    this.setState({
      selectedFile: e.target.files[0],
    });
    this.setState({
      imagePreview: URL.createObjectURL(e.target.files[0]),
    });
  }

  handleChangeGroupName(e) {
    this.setState({
      groupName: e.target.value,
    });
  }

  handleChange(event, i) {
    const { memberEmails } = this.state;
    memberEmails[i] = event.target.value;
    this.setState({
      memberEmails,
    });
  }

  submitGroup = (e) => {
    e.preventDefault();
    const {
      memberEmails, groupName, userId,
    } = this.state;
    const data = {
      userId,
      memberEmails,
      groupName,
    };
    axios.post('http://localhost:3001/createGroup', data)
      .then(() => {
        this.setState({
          groupCreatedFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          invalidGroupNameFlag: true,
        });
      });

    const imageData = new FormData();// If file selected
    const { selectedFile } = this.state;
    if (selectedFile) {
      imageData.append('profileImage', selectedFile, selectedFile.name);
      axios.defaults.withCredentials = true;
      axios.post('http://localhost:3001/createGroup/profile-img-upload', imageData, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${imageData._boundary}`,
        },
      })
        .then((response) => {
          // Success
          const fileLocation = response.data.location;
          this.setState({
            imagePreview: fileLocation,
          });
          const groupData = {
            groupName,
            fileLocation,
          };
          axios.defaults.withCredentials = true;
          axios.post('http://localhost:3001/createGroup/storeImage', groupData);
        });
    }
  }

  appendInput() {
    const { inputs } = this.state;
    const newInput = 'Enter Group Member Email';
    this.setState({
      inputs: inputs.concat(newInput),
    });
  }

  removeInput() {
    const { inputs, memberEmails } = this.state;
    inputs.pop();
    memberEmails.pop();
    this.setState({
      inputs,
      memberEmails,
    });
  }

  render() {
    const {
      inputs, fadeFlag, inputEmails, invalidGroupNameFlag,
      groupCreatedFlag, redirectPage, authenticationToken, imagePreview,
    } = this.state;
    const inputEmailsList = inputEmails.map((inputEmail) => (
      <option value={inputEmail.email}>{inputEmail.email}</option>
    ));
    const formInputs = inputs.map((input, i) => (
      <Form.Control as="select" onChange={(e) => this.handleChange(e, i)} className="my-1 mr-sm-2" custom required>
        <option>Choose Member Email</option>
        {inputEmailsList}
      </Form.Control>

    ));
    return (
      <div>
        {groupCreatedFlag ? (
          <SweetAlert
            success
            title="Group created"
            onConfirm={() => {
              this.setState({
                redirectPage: <Redirect to="/dashboard" />,
              });
            }}
          />
        ) : null}
        {invalidGroupNameFlag ? (
          <SweetAlert
            warning
            title="Groupname already exist"
            onConfirm={() => {
              this.setState({
                invalidGroupNameFlag: false,
              });
            }}
          />
        ) : null}
        {!authenticationToken ? <Redirect to="/" /> : null}
        {redirectPage}
        <Navigationbar />
        <div className="container">
          <div className="creategroup">
            <h1>Create new group page:</h1>
            <div className="groupdetails">
              <Container>
                <Fade in={fadeFlag}>
                  <div>
                    <Form method="post" onSubmit={this.submitGroup}>
                      <Row>
                        <Col lg={3}>
                          <Figure>
                            <Figure.Image
                              width={171}
                              height={180}
                              alt="171x180"
                              src={imagePreview === undefined ? `${window.location.origin}/group.png` : imagePreview}
                            />
                          </Figure>
                          <Form.Group>
                            <Form.File id="userimage" label="Change your group image" onChange={this.handleImage} />
                          </Form.Group>
                        </Col>
                        <Col>
                          <p>START A NEW GROUP</p>
                          <p>My group shall be called...</p>
                          <Form.Group controlId="formGroupName">
                            <Form.Control type="text" onChange={this.handleChangeGroupName} name="groupname" placeholder="Enter Group Name" required />
                          </Form.Group>
                          <p>GROUP MEMBERS</p>
                          {formInputs}
                          <Button className="groupButtons" onClick={this.appendInput}>Add Member</Button>
                          <Button className="groupButtons" onClick={this.removeInput}>Remove Member</Button>
                          <Button className="groupButtons" type="submit">
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Fade>
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userIdRedux: state.id,
});

export default connect(mapStateToProps)(CreateGroup);
