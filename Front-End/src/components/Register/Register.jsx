import React, { Component } from 'react';
import '../../App.css';
import './Register.css';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Form, Button, Container, Col, Row, Figure, Fade,
} from 'react-bootstrap';
import { propTypes } from 'react-bootstrap/esm/Image';
import SweetAlert from 'react-bootstrap-sweetalert';
import Navigationbar from '../Navigationbar/Navigationbar';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      redirectFlag: false,
      invalidRegisterFlag: false,
      fadeFlag: false,
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
  }

  async componentDidMount() {
    this.setState({
      fadeFlag: true,
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

  handleChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  submitRegister = (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;
    const data = {
      name,
      email,
      password,
    };
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/register', data)
      .then((response) => {
        const { onSubmitUser } = this.props;
        localStorage.setItem('token', response.data);
        const decoded = jwtDecode(response.data.split(' ')[1]);
        const { _id } = decoded;
        localStorage.setItem('userId', _id);
        localStorage.setItem('userName', decoded.name);
        onSubmitUser(decoded);
        this.setState({
          redirectFlag: true,
        });
      })
      .catch(() => {
        this.setState({
          invalidRegisterFlag: true,
        });
      });
  }

  render() {
    const { redirectFlag, fadeFlag, invalidRegisterFlag } = this.state;
    return (
      <div>
        {invalidRegisterFlag ? (
          <SweetAlert
            warning
            title="Email Id already exists"
            onConfirm={() => {
              this.setState({
                invalidRegisterFlag: false,
              });
            }}
          />
        ) : null}
        {redirectFlag ? <Redirect to="/dashboard" /> : null}
        <Navigationbar />
        <div className="container">
          <Container>
            <Fade in={fadeFlag}>
              <div>
                <Row>
                  <Col>
                    <Form id="signup-form" method="post" onSubmit={this.submitRegister}>
                      <h1>Sign Up</h1>
                      <p>Enter your details to create an account</p>
                      <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control onChange={this.handleChangeName} type="text" name="name" placeholder="Enter Your Name" required />
                      </Form.Group>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={this.handleChangeEmail} type="email" name="email" placeholder="Enter Your Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
                      </Form.Group>
                      <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.handleChangePassword} type="password" name="password" placeholder="Enter Your Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required />
                      </Form.Group>
                      <small>
                        Must contain at least one  number and one uppercase and
                        lowercase letter, and at least 8 or more characters
                      </small>
                      <br />
                      <br />
                      <Button id="signupbutton" type="submit">
                        Submit
                      </Button>
                    </Form>
                  </Col>
                  <Col>
                    <Figure.Image
                      src={`${window.location.origin}/Add User-rafiki.svg`}
                    />
                  </Col>
                </Row>
              </div>
            </Fade>
          </Container>
        </div>
        <div className="custom-shape-divider-bottom-1615528068">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill" />
          </svg>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  userId: state.id,
  userName: state.name,
});
const mapDispatchToProps = (dispatch) => ({
  onSubmitUser: (userData) => dispatch({ type: 'REGISTER_USER', value: userData }),
});
Register.defaultProps = {
  onSubmitUser: () => {},
};

Register.propTypes = {
  onSubmitUser: propTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
