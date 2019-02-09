import React, { Component } from "react";

export default class FeedbackCell extends Component {
  render() {
    const { username } = this.props;
    return (
      <div>
        <blockquote className="blockquote mb-0">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante.
          </p>
          <footer className="blockquote-footer">
            {username}{" "}
            <cite title="Source Title">
              Hedge City
              <a
                href="#"
                className="btn btn-primary"
                style={{ float: "right" }}
              >
                Retire
              </a>
            </cite>
          </footer>
        </blockquote>
      </div>
    );
  }
}
