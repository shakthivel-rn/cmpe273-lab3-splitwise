/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import '../../App.css';
import './Profilepage.css';
import { Redirect } from 'react-router';
import {
  Container, Row, Col, Form, Button, Fade,
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';
import ProfileImage from './ProfileImage';

class Profilepage extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    // const userId = localStorage.getItem('userId');
    this.state = {
      userId: userIdRedux,
      name: 'Your Name',
      email: 'Your Email',
      phone: 'Your Phonenumber',
      defaultcurrency: 'Choose Currency',
      timezone: 'Choose Timezone',
      language: 'Choose Language',
      fadeFlag: false,
      errorMessage: '',
      authenticationToken: localStorage.getItem('token'),
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleChangeDefautCurrency = this.handleChangeDefautCurrency.bind(this);
    this.handleChangeTimezone = this.handleChangeTimezone.bind(this);
    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.editName = this.editName.bind(this);
    this.editEmail = this.editEmail.bind(this);
    this.editPhone = this.editPhone.bind(this);
    this.editDefaultCurrency = this.editDefaultCurrency.bind(this);
    this.editTimeZone = this.editTimeZone.bind(this);
    this.editLanguage = this.editLanguage.bind(this);
  }

  async componentDidMount() {
    const { userId } = this.state;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/profilePage/getUserDetails', { params: { userId } });
    this.setState({
      name: res.data.name,
      email: res.data.email,
      phone: res.data.phoneNumber ? res.data.phoneNumber : 'Your Phonenumber',
      defaultcurrency: res.data.defaultCurrency ? res.data.defaultCurrency : 'Choose Currency',
      timezone: res.data.timezone ? res.data.timezone : 'Choose Timezone',
      language: res.data.language ? res.data.language : 'Choose Language',
      fadeFlag: true,
      submitFlag: false,
      errorFlag: false,
    });
  }

  handleChangeName = (e) => {
    this.setState({
      name: e.target.value,
    });
  }

  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  handleChangePhone = (e) => {
    this.setState({
      phone: e.target.value,
    });
  }

  handleChangeDefautCurrency = (e) => {
    this.setState({
      defaultcurrency: e.target.value,
    });
  }

  handleChangeTimezone = (e) => {
    this.setState({
      timezone: e.target.value,
    });
  }

  handleChangeLanguage = (e) => {
    this.setState({
      language: e.target.value,
    });
  }

  editName = (e) => {
    e.preventDefault();
    const { name, userId } = this.state;
    const data = {
      name,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editName', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editEmail = (e) => {
    e.preventDefault();
    const { email, userId } = this.state;
    const data = {
      email,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editEmail', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          errorFlag: true,
          errorMessage: 'Email ID already exists',
        });
      });
  }

  editPhone = (e) => {
    e.preventDefault();
    const { phone, userId } = this.state;
    const data = {
      phone,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editPhoneNumber', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editDefaultCurrency = (e) => {
    e.preventDefault();
    const { defaultcurrency, userId } = this.state;
    const data = {
      defaultcurrency,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editDefaultCurrency', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editTimeZone = (e) => {
    e.preventDefault();
    const { timezone, userId } = this.state;
    const data = {
      timezone,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editTimeZone', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  editLanguage = (e) => {
    e.preventDefault();
    const { language, userId } = this.state;
    const data = {
      language,
      userId,
    };
    axios.defaults.withCredentials = true;
    axios.put('http://localhost:3001/profilePage/editLanguage', data)
      .then(() => {
        this.setState({
          submitFlag: true,
        });
      });
  }

  render() {
    const {
      name, email, phone, defaultcurrency, timezone, language,
      fadeFlag, submitFlag, errorFlag, errorMessage, authenticationToken,
    } = this.state;
    return (
      <div>
        {submitFlag ? (
          <SweetAlert
            success
            title="Edit successfully done"
            onConfirm={() => {
              this.setState({
                submitFlag: false,
              });
            }}
          />
        ) : null}
        {errorFlag ? (
          <SweetAlert
            warning
            title={errorMessage}
            onConfirm={() => {
              this.setState({
                errorFlag: false,
              });
            }}
          />
        ) : null}
        { !authenticationToken ? <Redirect to="/" /> : null }
        <Navigationbar />
        <div className="container">
          <div className="profilepage">
            <h1>Your Account</h1>
            <div className="userdetails">
              <Container>
                <Fade in={fadeFlag}>
                  <div>
                    <Row>
                      <Col lg={3}>
                        <ProfileImage />
                      </Col>
                      <Col>
                        <p>Your Name</p>
                        <Form method="post" onSubmit={this.editName} inline>
                          <Form.Group controlId="editUserName">
                            <Form.Control onChange={this.handleChangeName} className="mb-2 mr-sm-2" id="username" placeholder={name} required />
                          </Form.Group>
                          <Button type="submit" className="mb-2 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                        <br />
                        <p>Your email address</p>
                        <Form method="post" onSubmit={this.editEmail} inline>
                          <Form.Group controlId="editUserEmail">
                            <Form.Control onChange={this.handleChangeEmail} type="email" className="mb-2 mr-sm-2" id="useremail" placeholder={email} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
                          </Form.Group>
                          <Button type="submit" className="mb-2 editProfileButton">
                            Edit
                          </Button>
                          <small>Format: sample@sample.domain</small>
                        </Form>
                        <br />
                        <p>Your phone number</p>
                        <Form method="post" onSubmit={this.editPhone} inline>
                          <Form.Group controlId="editUserPhone">
                            <Form.Control onChange={this.handleChangePhone} className="mb-2 mr-sm-2" id="userphone" placeholder={phone} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
                          </Form.Group>
                          <Button type="submit" className="mb-2 editProfileButton">
                            Edit
                          </Button>
                          <small>Format: 123-456-7890</small>
                        </Form>
                      </Col>
                      <Col>
                        <p>Your default currency</p>
                        <Form method="post" onSubmit={this.editDefaultCurrency} inline>
                          <Form.Control onChange={this.handleChangeDefautCurrency} as="select" className="my-1 mr-sm-2" id="defaultcurrency" custom required>
                            <option value="Choose Currency">{defaultcurrency}</option>
                            <option value="USD">USD</option>
                            <option value="KWD">KWD</option>
                            <option value="BHD">BHD</option>
                            <option value="GBP">GBP</option>
                            <option value="EUR">EUR</option>
                            <option value="CAD">CAD</option>
                          </Form.Control>
                          <Button type="submit" className="my-1 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                        <br />
                        <p>Your time zone</p>
                        <Form method="post" onSubmit={this.editTimeZone} inline>
                          <Form.Control onChange={this.handleChangeTimezone} as="select" className="my-1 mr-sm-2" id="defaulttimezone" custom required>
                            <option value="Choose Timezone">{timezone}</option>
                            <option value="Atlantic Standard Time (AST)">Atlantic Standard Time (AST)</option>
                            <option value="Eastern Standard Time (EST)">Eastern Standard Time (EST)</option>
                            <option value="Central Standard Time (CST)">Central Standard Time (CST)</option>
                            <option value="Mountain Standard Time (MST)">Mountain Standard Time (MST)</option>
                            <option value="Pacific Standard Time (PST)">Pacific Standard Time (PST)</option>
                            <option value="Alaskan Standard Time (AKST)">Alaskan Standard Time (AKST)</option>
                            <option value="Hawaii-Aleutian Standard Time (HST)">Hawaii-Aleutian Standard Time (HST)</option>
                            <option value="Samoa standard time (UTC-11)">Samoa standard time (UTC-11)</option>
                            <option value="Chamorro Standard Time (UTC+10)">Chamorro Standard Time (UTC+10)</option>
                          </Form.Control>
                          <Button type="submit" className="my-1 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                        <br />
                        <p>Language</p>
                        <Form method="post" onSubmit={this.editLanguage} inline>
                          <Form.Control onChange={this.handleChangeLanguage} as="select" className="my-1 mr-sm-2" id="defaultlanguage" custom required>
                            <option value="Choose Language">{language}</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                            <option value="French">French</option>
                          </Form.Control>
                          <Button type="submit" className="my-1 editProfileButton">
                            Edit
                          </Button>
                        </Form>
                      </Col>
                    </Row>
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

export default connect(mapStateToProps)(Profilepage);
