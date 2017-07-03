import React from 'react';
import { Segment, Container, Header, Button, Checkbox, Form, Input, Select, Image, Card, Icon, Embed, Grid } from 'semantic-ui-react';
import axios from 'axios';
import Search from '../Search/Search.jsx';
import AuthenticationHelper from '../../../../lib/AuhenticationHelper.js';
import {Redirect} from 'react-router-dom';
import formatTime from '../utils/formatTime.js';

class Trip extends React.Component {
  constructor(props) {
    super(props);
    this.match = props.match;
    this.currentUser = props.currentUser;
    this.state = {
      redirectTo: null,
      trips: {
        driver: {},
        rider: {}
      }
    }
    this.handleRequestTrip.bind(this);
  }

  componentDidMount() {
    this.fetch(this.match.params.tripId);
  }

  handleRequestTrip(e) {
    e.preventDefault();
    this.postTripRequest(this.state.trips.id, this.currentUser.id)
  }

  fetch(tripId) {
    axios.get(`/api/trips/${tripId}`)
    .then((response) => {
      console.log('Successfully fetching from db in Trip Component', response);
      this.setState({
        redirectTo: this.state.redirectTo,
        trips: response.data
      });
    })
    .catch((error) => {
      console.log('GET unsuccessful from the DB in Trip Component', error);
    });
  }

  postTripRequest(tripId, userId) {
    axios.post(`/api/trips/${tripId}/join/${userId}`, {tripId: tripId, userId: userId})
    .then((response) => {
      console.log('Successfully posting to the DB in the Trip Component', response);
      this.setState({
        redirectTo: `/trips/${this.props.currentUser.username}`
      });
    })
    .catch((error) => {
      console.log('POST unsuccessful in Trip Component', error.response)
      if (error.response.status === 409) { 
        alert('You have already been signed up for this trip! Redirecting you back to the homepage...');
        this.setState({ redirectTo: '/' });
      }
    })
  }

  render() {
    const { trips, redirectTo, currentUser } = this.state;
    const { location, match } = this.props;

    return (
      <Container>

        <Header as='h1' id='main-header'>Trip Details</Header>
        <Header as='h2' id='main-header2'>Please review the details of your trip!</Header>

        <Grid>
          <Grid.Column computer={4} mobile={8}>
            <Card>
              <Card.Content>
                <Header color='green'>Price: ${trips.price}</Header>
              </Card.Content>
              <Card.Content>
                <Card.Header>Departure:</Card.Header>
                <Card.Meta>Details</Card.Meta>
                <Card.Description>              
                  {(trips.departure_time) ? `Departing at ${formatTime(trips.departure_time)}` : ''} <br/>
                  Pickup Point: <br/>
                  {trips.departure_address_line1} <br/>
                  {trips.departure_city}, {trips.departure_state}, {trips.departure_zip}
                </Card.Description>
              </Card.Content>
              
              <Card.Content>
                <Card.Header>Arrival:</Card.Header>
                <Card.Meta>Details</Card.Meta>
                <Card.Description>              
                  {(trips.arrival_time) ? `Arriving at ${formatTime(trips.arrival_time)}` : ''}<br/>
                  Dropoff Point: <br/>
                  {trips.arrival_address_line1}<br/>
                  {trips.arrival_city}, {trips.arrival_state}, {trips.arrival_zip}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column computer={4} mobile={8}>
            <Card>
              <Card.Content>
                <Header>Your Driver for this Tryp:</Header>
              </Card.Content>
              <Image src={trips.driver.img_url} shape='circular' size='medium'/>
              <Card.Content>
                <Card.Header>
                  {trips.driver.first_name} {trips.driver.last_name}
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Joined in 2017
                  </span>
                </Card.Meta>
                <Card.Description>
                  <Icon name='mail outline' /> {trips.driver.email} <br/>
                  <Icon name='phone'/> {trips.driver.phone_number}<br/>
                  <Icon name='car'/> {trips.driver.year} {trips.driver.make} {trips.driver.model}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>
                  <Icon name='road' />
                  22 Total Tryps
                </a>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column computer={8} mobile={16}>
            <Card fluid>
                <Embed
                  active
                  url={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAzpCRwGXkQfN7tC9musbuaAqfoyGL_M6E&origin=${trips.departure_address_line1},${trips.departure_city},${trips.departure_state}&destination=${trips.arrival_address_line1},${trips.arrival_city},${trips.arrival_state}`}>
                </Embed>
              <Card.Content>
                <Card.Header>
                  <Icon name='map outline' /> Google Maps
                </Card.Header>
                <Card.Description>
                  {trips.departure_city}, {trips.departure_state} to {trips.arrival_city}, {trips.arrival_state}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
        <Container textAlign='center'>
          <br/>
          <Button color='green' onClick={this.handleRequestTrip.bind(this)} >Request to Book</Button><br/>
          <span id='disclaimer'>You won't be charged until your Driver accepts your reservation.</span>
        </Container>

        {redirectTo && <Redirect push to={{
          pathname: redirectTo,
          state: {location, match, currentUser}
        }} />}
      </Container>
    )
  }
}

export default Trip;