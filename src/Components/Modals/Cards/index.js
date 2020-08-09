import React, { PureComponent } from 'react';
import { changeModalState, updateCardContent } from '../../../Context/actions';
import { Context } from '../../../Context';

class Cards extends PureComponent {
  state = {
    cardContent: {
      summary: false,
      createdAt: false,
      latestChange: false,
      changedBy: false,
    },
  };

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

    localStorage.setItem('cardContent', JSON.stringify(this.state.cardContent));

    updateCardContent(this.state.cardContent)(dispatch);

    changeModalState({
      modal: 'cardSettings',
      state: false,
    })(dispatch);
  };

  componentDidMount = () => {
    const { cardContent } = this.context;

    this.setState({
      cardContent,
    });
  };

  render() {
    const { cardContent } = this.state;
    return (
      <React.Fragment>
        <h2>Card content</h2>
        <ul>
          <li>
            <p>
              <input
                type="checkbox"
                id="switch1"
                onChange={(e) => this.handleCheckboxChange(e, 'summary')}
                checked={cardContent.summary}
              />
              <label className="checkbox-label" htmlFor="switch1" />
              Show incident summary
            </p>
          </li>
          <li>
            <p>
              <input
                type="checkbox"
                id="switch2"
                onChange={(e) => this.handleCheckboxChange(e, 'createdAt')}
                checked={cardContent.createdAt}
              />
              <label className="checkbox-label" htmlFor="switch2" />
              Show incident created at
            </p>
          </li>
          <li>
            <p>
              <input
                type="checkbox"
                id="switch3"
                onChange={(e) => this.handleCheckboxChange(e, 'latestChange')}
                checked={cardContent.latestChange}
              />
              <label className="checkbox-label" htmlFor="switch3" />
              Show incident latest change
            </p>
          </li>
          <li>
            <p>
              <input
                type="checkbox"
                id="switch4"
                onChange={(e) => this.handleCheckboxChange(e, 'changedBy')}
                checked={cardContent.changedBy}
              />
              <label className="checkbox-label" htmlFor="switch4" />
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
      </React.Fragment>
    );
  }
}

Cards.contextType = Context;
export default Cards;
