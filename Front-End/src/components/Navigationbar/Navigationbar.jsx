/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import '../../App.css';
import './Navigationbar.css';
import { Link } from 'react-router-dom';
import {
  Navbar, Nav, Button, Dropdown, Image,
} from 'react-bootstrap';

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      authenticationToken: localStorage.getItem('token'),
      imagePreview: null,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.getUserProfileImage = this.getUserProfileImage.bind(this);
  }

  async componentDidMount() {
    this.getUserProfileImage();
  }

  getUserProfileImage = async () => {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/profilePage/getImage', { params: { userId } });
    this.setState({
      imagePreview: res.data.userImage,
    });
  }

  handleLogout = () => {
    localStorage.removeItem('token');
  }

  render() {
    let navLogin = null;
    let profileImage = null;
    const { authenticationToken, imagePreview } = this.state;
    const {
      refreshBitLocal, onProfileImageUploadAction,
    } = this.props;
    if (refreshBitLocal) {
      this.getUserProfileImage();
      const modifiedRefreshBitLocal = !refreshBitLocal;
      const modifiedRefreshBitLocalObject = { modifiedRefreshBitLocal };
      onProfileImageUploadAction(modifiedRefreshBitLocalObject);
    }
    if (authenticationToken) {
      profileImage = <Image src={imagePreview} width={70} roundedCircle />;
    }
    if (authenticationToken) {
      navLogin = (
        <Nav className="ml-auto">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <Link to={{
                  pathname: '/profilepage',
                }}
                >
                  Profile Page
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to={{
                  pathname: '/creategroup',
                }}
                >
                  Create Group
                </Link>
              </Dropdown.Item>
              <Dropdown.Item onClick={this.handleLogout} href="/">Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      );
    } else {
      navLogin = (
        <Nav className="ml-auto">
          <Button id="navbarlogin" className="mr-sm-2 navbarbuttons" href="/login">Login</Button>
          <Button className="navbarbuttons" href="/register">Sign Up</Button>
        </Nav>
      );
    }
    return (
      <div>
        <Navbar id="nav-bar">
          <div className="container">
            <Navbar.Brand id="nav-brand">
              <img
                alt=""
                src={`${window.location.origin}/splitwise-logo.png`}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {' '}
              <Link
                id="dashboardLink"
                to={{
                  pathname: '/dashboard',
                }}
              >
                Splitwise
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {navLogin}
            {profileImage}
          </div>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  refreshBitLocal: state.refreshBitProfileImage,
});

const mapDispatchToProps = (dispatch) => ({
  onProfileImageUploadAction: (userData) => dispatch({ type: 'RENDER_PROFILE_IMAGE', value: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigationbar);
