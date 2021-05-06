/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import '../../App.css';
import './YouAreOwed.css';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  ListGroup, Fade,
} from 'react-bootstrap';

class YouAreOwed extends Component {
  constructor(props) {
    super(props);
    const { userIdRedux } = props;
    this.state = {
      userId: userIdRedux,
      owed: [],
      fadeFlag: false,
    };
  }

  async componentDidMount() {
    const { userId } = this.state;
    const res = await axios.get('http://localhost:3001/dashboard/getIndividualPaidAmount', { params: { userId } });
    const { owed } = this.state;
    this.setState({
      owed: owed.concat(res.data),
      fadeFlag: true,
    });
  }

  render() {
    const { owed, fadeFlag } = this.state;
    const owedlist = owed.map((individualowed) => <ListGroup.Item>{`${individualowed.owedUserName} owes you ${individualowed.individualPaidAmount}$ in ${individualowed.groupName}` }</ListGroup.Item>);
    return (
      <div>
        <div className="youareowedcontainer">
          <h4 id="youareowedtitle">You Are Owed</h4>
          <Fade in={fadeFlag}>
            <div>
              {owedlist.length === 0 ? <p>You are not owed anything</p> : (
                <ListGroup variant="flush">
                  {owedlist}
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
});

export default connect(mapStateToProps)(YouAreOwed);
