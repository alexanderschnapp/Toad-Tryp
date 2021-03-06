import React from 'react';
import { Segment, Container, Header, Button, Checkbox, Form, Input, Select } from 'semantic-ui-react';
import range from 'lodash/range';
import axios from 'axios';
import SearchResults from './SearchResults.jsx';
import {Redirect} from 'react-router-dom';
import query from 'query-string';

// Requirements for AirBnB's React-Calendar 
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import moment from 'moment';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      depart: '',
      arrive: '',
      date: moment(),
      seats: '',
      redirectTo: null,
      trips: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.fetch();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  fetch() {
    const { depart, arrive, date, seats } = this.state;
    const departdate = moment(date._d).format('YYYY-MM-DD');
    axios.get('/api/trips', { 
      params: { depart, arrive, departdate, seats } 
    })
    .then((response) => {
      this.setState({
        redirectTo: '/searchresults',
        trips: response.data
      });
      console.log('Successfully fetched trips in the Search Component');
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let s = range(1, 6);
    const { redirectTo, trips, date, depart, arrive } = this.state;
    const currentUser = this.props.currentUser;
    
    return (
      <Form size="large" onSubmit={this.handleSubmit} className="container">
        <Form.Group inline>
          <Form.Input width={6} type="text" name="depart" placeholder="Depart City" value={this.state.depart} onChange={this.handleChange}/>
          <Form.Input width={6} type="text" name="arrive" placeholder="Arrive City" value={this.state.arrive} onChange={this.handleChange}/>

          <Form.Field width={3}>
            <SingleDatePicker date={this.state.date} onDateChange={date => this.setState({ date })} focused={this.state.focused} onFocusChange={({ focused }) => this.setState({ focused })} />
          </Form.Field>
          
          <Form.Field width={2}>
            <select className="ui dropdown" color="grey" name="seats" value={this.state.seats} onChange={this.handleChange}>
              <option key="Seats" value="#" >Seats</option>
              {s.map( (n, i) => {
                return <option key={i} value={n}>{n}</option>;
              })}
            </select>
          </Form.Field>

          <Button width={1} color="green" type="submit">Search</Button>
        </Form.Group>

        {redirectTo && (
          <Redirect from={'/'} push to={{
            pathname: redirectTo,
            state: { trips, depart, arrive, currentUser }
          }}/>
        )}
      </Form>
    );
  }
}


export default Search;