import React, { PureComponent } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import fi from "date-fns/locale/fi";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import "./GetView.css";
registerLocale("fi", fi);

export default class GetView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      incidents: [],
      teamID: "",
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
      showIncidents: false,
      collapsedTables: [],
    };
  }

  handleChange = (date, option) => {
    this.setState({
      [option]: option === "startDate" ? startOfDay(date) : endOfDay(date),
    });
  };

  changeTeamID = (e) => {
    this.setState({
      teamID: e.target.value,
    });
  };

  getIncidents = async () => {
    if (!this.state.teamID) return;
    this.setState({
      loading: true,
    });
    localStorage.setItem("teamID", this.state.teamID);
    const params = {
      method: "GET",
      headers: {
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: "Token token=" + localStorage.getItem("token"),
      },
    };

    const response = await fetch(
      encodeURI(
        `https://api.pagerduty.com/incidents?since=${this.state.startDate}&until=${this.state.endDate}&team_ids[]=${this.state.teamID}&time_zone=UTC&total=true&limit=250`
      ),
      params
    );

    const incidents = await response.json();

    this.setState({
      incidents: incidents.incidents,
    });
    this.getWeekDays();
    const sorted_incidents = this.mapIncidentToDay();
    this.setState({
      sorted_incidents,
      showIncidents: true,
      loading: false,
    });
  };

  componentDidMount = () => {
    const teamID = localStorage.getItem("teamID");
    const token = localStorage.getItem("token");
    if (teamID) {
      this.setState({
        teamID,
      });
    }
    if (!token) {
      this.props.history.push("/");
    }
  };

  timeSelect = () => {
    return (
      <React.Fragment>
        {this.state.loading ? null : (
          <div className="timeSelect">
            <h2>Start time</h2>
            <DatePicker
              locale="fi"
              selected={this.state.startDate}
              onChange={(e) => this.handleChange(e, "startDate")}
            />
            <h2>End time</h2>
            <DatePicker
              locale="fi"
              selected={this.state.endDate}
              onChange={(e) => this.handleChange(e, "endDate")}
            />
            <h2>Team ID</h2>
            <input
              onChange={(e) => this.changeTeamID(e)}
              className="input"
              value={this.state.teamID}
            />
            <input
              onClick={() => this.getIncidents()}
              className="submit"
              type="submit"
              value="Get Incidents"
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  getWeekDays = () => {
    const weekdays = [];
    this.state.incidents.forEach((incident) => {
      const createdAt = new Date(incident.created_at).toISOString();
      if (!weekdays.includes(createdAt.substr(0, 10))) {
        weekdays.push(createdAt.substr(0, 10));
      }
    });
    this.setState({
      weekdays,
    });
  };

  mapIncidentToDay = () => {
    return this.state.weekdays.map((day) => {
      return this.state.incidents
        .filter((incident) => {
          const date = new Date(incident.created_at).toISOString();
          if (date.substr(0, 10) === day) {
            return true;
          }
          return null;
        })
        .map((incident) => {
          const {
            incident_number,
            created_at,
            service,
            summary,
            html_url,
          } = incident;
          return {
            incident_number,
            created_at,
            service,
            summary,
            html_url,
          };
        });
    });
  };

  renderIncidents = () => {
    return (
      <div className="columns">
        {this.state.sorted_incidents.map((day, index) => {
          return (
            <React.Fragment>
              <h1
                onClick={() => {
                  const collapsedTables = [...this.state.collapsedTables];
                  collapsedTables[index] = !collapsedTables[index];
                  this.setState({
                    collapsedTables,
                  });
                }}
              >
                {this.state.weekdays[index]} ({day.length})
              </h1>
              {!this.state.collapsedTables[index] && (
                <ul id={index} key={index}>
                  {day.map(function (incident, index) {
                    return (
                      <li key={index}>
                        <h2>{incident.service.summary}</h2>
                        <h3>{incident.created_at}</h3>
                        <a href={incident.html_url}>{incident.summary}</a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.state.showIncidents
            ? this.renderIncidents()
            : this.timeSelect()}
          {this.state.loading ? <div className="loading-spinner" /> : null}
        </div>
      </div>
    );
  }
}
