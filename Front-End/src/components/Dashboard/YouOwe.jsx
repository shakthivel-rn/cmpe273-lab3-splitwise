/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import '../../App.css';
import './YouOwe.css';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  ListGroup, Fade,
} from 'react-bootstrap';

class YouOwe extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      youowes: [],
      fadeFlag: false,
    };
    this.getYouAreOwedDetails = this.getYouAreOwedDetails.bind(this);
  }

  async componentDidMount() {
    this.getYouAreOwedDetails();
  }

  async getYouAreOwedDetails() {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/dashboard/getIndividualOwedAmount', { params: { userId } });
    this.setState({
      youowes: [...res.data],
      fadeFlag: true,
    });
  }

  render() {
    const { youowes, fadeFlag } = this.state;
    const youowelist = youowes.map((youowe) => <ListGroup.Item>{`You owe ${youowe.paidUserName} ${youowe.individualOwedAmount}$ in ${youowe.groupName}` }</ListGroup.Item>);
    const {
      refreshBitLocal, onSettleUpAction,
    } = this.props;
    if (refreshBitLocal) {
      this.getYouAreOwedDetails();
      const modifiedRefreshBitLocal = !refreshBitLocal;
      const modifiedRefreshBitLocalObject = { modifiedRefreshBitLocal };
      onSettleUpAction(modifiedRefreshBitLocalObject);
    }
    return (
      <div>
        <div id="youowecontainer">
          <h4 id="youowetitle">You Owe</h4>
          <Fade in={fadeFlag}>
            <div>
              {youowelist.length === 0 ? <p>You do not owe anything</p> : (
                <ListGroup variant="flush">
                  {youowelist}
                </ListGroup>
              )}
            </div>
          </Fade>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userIdRedux: state.id,
  refreshBitLocal: state.refreshBitYouOwe,
});

const mapDispatchToProps = (dispatch) => ({
  onSettleUpAction: (userData) => dispatch({ type: 'RENDER_YOU_OWE', value: userData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(YouOwe);
