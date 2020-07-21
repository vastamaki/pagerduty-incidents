import React, { PureComponent } from "react";
import { markHour, toggleNotification } from "../../Context/actions";
import { Context } from "../../Context";
import "./index.css";

class ContextMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  showIncident = () => {};

  copySummary = () => {
    const { dispatch } = this.context;
    navigator.clipboard.writeText(this.props.incident.summary);
    toggleNotification({
      hidden: false,
      success: true,
      message: "Summary copied to clipboard!",
    })(dispatch);
    setTimeout(() => {
      toggleNotification({
        hidden: true,
        message: "",
        success: "true",
      })(dispatch);
    }, 3000);
    markHour(this.props.incident)(dispatch);
    this.props.closeContextMenu();
  };

  opneIncidentInPagerduty = () => {
    window.open(this.props.incident.html_url, "_blank");
    this.props.closeContextMenu();
  };

  onMouseLeave = () => {
    this.setState({
      visibleTimeout: setTimeout(() => {
        this.props.closeContextMenu();
      }, 700),
    });
  };

  onMouseEnter = () => {
    this.setState({
      visibleTimeout: clearTimeout(this.state.visibleTimeout),
    });
  };

  render() {
    return (
      <div
        onMouseLeave={() => this.onMouseLeave()}
        onMouseEnter={() => this.onMouseEnter()}
        style={{
          top: this.props.cursorPosition.y - 3,
          left: this.props.cursorPosition.x - 3,
        }}
        className="context-menu"
      >
        <ul>
          <li onClick={() => this.showIncident()}>Show incident</li>
          <li onClick={() => this.copySummary()}>Copy summary</li>
          <li onClick={() => this.opneIncidentInPagerduty()}>
            Show in pagerduty
          </li>
        </ul>
      </div>
    );
  }
}

ContextMenu.contextType = Context;
export default ContextMenu;