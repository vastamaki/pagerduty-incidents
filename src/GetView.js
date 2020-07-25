import React, { PureComponent } from "react";
import TimeSelect from "./Components/TimeSelect";
import Incidents from "./Components/Incidents";
import Header from "./Components/Header";
import { getWeekDays, mapIncidentToDay } from "./helpers";
import { getIncidents } from "./Context/actions";
import { Context } from "./Context";
import "react-datepicker/dist/react-datepicker.css";
import "./GetView.css";

export default class GetView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      loading: false,
    };
  }

  getIncidents = async (startDate, endDate, clicked) => {
    if (clicked) {
      await this.setState({
        offset: 0,
      });
    }
    if (startDate && endDate) {
      this.setState({
        startDate: startDate,
        endDate: endDate,
      });
    }
    this.setState({
      loading: true,
    });
    const params = {
      method: "GET",
      headers: {
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };

    const response = await fetch(
      encodeURI(
        `https://api.pagerduty.com/incidents?since=${
          startDate || this.state.startDate
        }&until=${
          endDate || this.state.endDate
        }&team_ids[]=${localStorage.getItem(
          "teamID"
        )}&time_zone=UTC&total=true&limit=100&offset=${this.state.offset}`
      ),
      params
    );
    const incidents = await response.json();

    if (!incidents.incidents || incidents.error) {
      this.setState({
        loading: false,
        notification: {
          success: false,
          message: incidents.error.errors[0],
          hidden: false,
        },
      });
      return;
    }

    this.setState({
      offset:
        incidents.offset === 0
          ? 99
          : 100 + (incidents.total - incidents.offset),
    });
    this.saveIncidents(incidents.more, incidents.incidents);
  };

  saveIncidents = (isMore, incidents) => {
    const { dispatch } = this.context;
    if (isMore) {
      this.getIncidents();
    }
    const weekdays = getWeekDays(incidents);
    const sorted_incidents = mapIncidentToDay(weekdays, incidents);
    getIncidents(sorted_incidents, weekdays)(dispatch);
    this.setState({
      loading: false,
    });
  };

  render() {
    const { showIncidents } = this.context;
    return (
      <React.Fragment>
        <Header />
        <div className="App">
          <div className="App-header">
            {this.state.loading ? (
              <div className="loading-spinner" />
            ) : showIncidents ? (
              <Incidents />
            ) : (
              <TimeSelect getIncidents={this.getIncidents} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

GetView.contextType = Context;
