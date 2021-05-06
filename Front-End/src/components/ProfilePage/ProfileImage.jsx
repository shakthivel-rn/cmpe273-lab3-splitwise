/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Form, Button, Figure } from 'react-bootstrap';
import '../../App.css';
import './ProfileImage.css';
import axios from 'axios';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';

class ProfileImage extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      selectedFile: null,
      imagePreview: undefined,
      imageUploadedFlag: false,
    };
    this.handleImage = this.handleImage.bind(this);
    this.singleFileUploadHandler = this.singleFileUploadHandler.bind(this);
  }

  async componentDidMount() {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/profilePage/getImage', { params: { userId } });
    this.setState({
      imagePreview: res.data.userImage,
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

  singleFileUploadHandler = (e) => {
    e.preventDefault();
    const data = new FormData();// If file selected
    const { userId, selectedFile } = this.state;
    if (selectedFile) {
      data.append('profileImage', selectedFile, selectedFile.name);
      axios.defaults.withCredentials = true;
      axios.post('http://localhost:3001/profilePage/profile-img-upload', data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
      })
        .then((response) => {
          // Success
          const fileLocation = response.data.location;
          this.setState({
            imagePreview: fileLocation,
          });
          const userData = {
            userId,
            fileLocation,
          };
          axios.defaults.withCredentials = true;
          axios.post('http://localhost:3001/profilePage/storeImage', userData)
            .then(() => {
              this.setState({
                imageUploadedFlag: true,
              });
              const {
                refreshBitLocal, onProfileImageUploadAction,
              } = this.props;
              const modifiedRefreshBitLocal = !refreshBitLocal;
              const modifiedRefreshBitLocalObject = {
                modifiedRefreshBitLocal,
              };
              onProfileImageUploadAction(modifiedRefreshBitLocalObject);
            });
        });
    }
  };

  render() {
    const {
      imagePreview, imageUploadedFlag,
    } = this.state;
    return (
      <div>
        {imageUploadedFlag ? (
          <SweetAlert
            success
            title="Image successfully uploaded"
            onConfirm={() => {
              this.setState({
                imageUploadedFlag: false,
              });
            }}
          />
        ) : null}
        <Figure>
          <Figure.Image
            width={200}
            height={180}
            alt="171x180"
            src={imagePreview === undefined ? `${window.location.origin}/dummy_user.png` : imagePreview}
            thumbnail
          />
        </Figure>
        <Form method="post" onSubmit={this.singleFileUploadHandler}>
          <Form.Group>
            <Form.File id="userimage" label="Change your avatar" onChange={this.handleImage} />
          </Form.Group>
          <Button id="imageUploadButton" type="submit" className="mb-2 editProfileImageButton">
            Upload
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userIdRedux: state.id,
  refreshBitLocal: state.refreshBitProfileImage,
});

const mapDispatchToProps = (dispatch) => ({
  onProfileImageUploadAction: (userData) => dispatch({ type: 'RENDER_PROFILE_IMAGE', value: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileImage);
