import React, { PureComponent } from "react";
import Notification from "./Notification";
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
      incidents: [],
      offset: 0,
      loading: false,
      collapsedTables: [],
      weekdays: [],
      notification: {
        hidden: true,
        message: "",
        success: true,
      },
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
        Authorization: "Token token=" + localStorage.getItem("token"),
      },
    };

    try {
      var response = await fetch(
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
    } catch (err) {
      this.setState({
        loading: false,
        notification: {
          success: false,
          message: "Failed to fetch data! Check that your token is valid!",
          hidden: false,
        },
      });
      return;
    }

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
      incidents: [...this.state.incidents, ...incidents.incidents],
    });
    this.saveIncidents(incidents.more);
  };

  saveIncidents = (isMore) => {
    const { dispatch } = this.context;
    if (isMore) {
      this.getIncidents();
    }
    const weekdays = getWeekDays(this.state.incidents);
    const sorted_incidents = mapIncidentToDay(weekdays, this.state.incidents);
    getIncidents(sorted_incidents, weekdays)(dispatch);
    this.setState({
      loading: false,
    });
  };

  copyToClipboard = (summary) => {
    navigator.clipboard.writeText(summary);
    this.setState({
      notification: {
        hidden: false,
        success: true,
        message: "Summary copied to clipboard!",
      },
    });
    setTimeout(() => {
      this.setState({
        notification: {
          hidden: true,
        },
      });
    }, 5000);
  };

  toggleDay = (index) => {
    const collapsedTables = [...this.state.collapsedTables];
    collapsedTables[index] = !collapsedTables[index];
    this.setState({
      collapsedTables,
    });
  };

  closeNotification = () => {
    this.setState({
      notification: { hidden: true },
    });
  };

  render() {
    const { showIncidents } = this.context;
    return (
      <React.Fragment>
        <Header />
        <div className="App">
          <div className="App-header">
            <Notification
              closeNotification={this.closeNotification}
              success={this.state.notification.success}
              hidden={this.state.notification.hidden}
              message={this.state.notification.message}
            />
            {this.state.loading ? (
              <div className="loading-spinner" />
            ) : showIncidents ? (
              <Incidents
                collapsedTables={this.state.collapsedTables}
                weekdays={this.state.weekdays}
                sorted_incidents={this.state.sorted_incidents}
                toggleDay={this.toggleDay}
                copyToClipboard={this.copyToClipboard}
              />
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
