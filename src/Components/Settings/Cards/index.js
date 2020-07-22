import React, { PureComponent } from "react";
import { changeModalState, updateCardContent } from "../../../Context/actions";
import { Context } from "../../../Context";
import "./index.css";

class Cards extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cardContent: {
        summary: false,
        createdAt: false,
        latestChange: false,
        changedBy: false,
      },
    };
  }

  handleCheckboxChange = (e, name) => {
    this.setState({
      cardContent: {
        ...this.state.cardContent,
        [name]: e.target.checked,
      },
    });
  };

  handleSave = () => {
    const { dispatch } = this.context;
    localStorage.setItem("cardContent", JSON.stringify(this.state.cardContent));
    updateCardContent(this.state.cardContent)(dispatch);
    changeModalState({
      modal: "cardSettings",
      state: false,
    })(dispatch);
  };

  componentDidMount = () => {
    const cardContent = JSON.parse(localStorage.getItem("cardContent"));
    
    cardContent && this.setState({
      cardContent: cardContent,
    });
  };

  render() {
    const { openModals } = this.context;

    return openModals.cardSettings ? (
      <div className="card-settings-wrapper">
        <div className="card-settings">
          <h2>Card content</h2>
          <ul>
            <li>
              <p>
                <input
                  type="checkbox"
                  id="switch1"
                  onChange={(e) => this.handleCheckboxChange(e, "summary")}
                  checked={this.state.cardContent.summary}
                />
                <label for="switch1" />
                Show incident summary
              </p>
            </li>
            <li>
              <p>
                <input
                  type="checkbox"
                  id="switch2"
                  onChange={(e) => this.handleCheckboxChange(e, "createdAt")}
                  checked={this.state.cardContent.createdAt}
                />
                <label for="switch2" />
                Show incident created at
              </p>
            </li>
            <li>
              <p>
                <input
                  type="checkbox"
                  id="switch3"
                  onChange={(e) => this.handleCheckboxChange(e, "latestChange")}
                  checked={this.state.cardContent.latestChange}
                />
                <label for="switch3" />
                Show incident latest change
              </p>
            </li>
            <li>
              <p>
                <input
                  type="checkbox"
                  id="switch4"
                  onChange={(e) => this.handleCheckboxChange(e, "changedBy")}
                  checked={this.state.cardContent.changedBy}
                />
                <label for="switch4" />
                Show incident latest change by
              </p>
            </li>
          </ul>
          <input
            onClick={() => this.handleSave()}
            className="submit"
            type="submit"
            value="Save"
          />
        </div>
      </div>
    ) : null;
  }
}
Cards.contextType = Context;
export default Cards;
