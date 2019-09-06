import React, { Component } from "react";

export default class Paginate extends Component {
  constructor() {
    super();
    this.state = {
      next: 12
    };
  }

  next = () => {
    console.log("Will load next");

    this.props.loadNext();
  };

  previous = () => {
    this.props.loadPrevious();
  };

  render() {
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a
              className="page-link"
              tabIndex="-1"
              onClick={this.previous.bind(this)}
            >
              Previous
            </a>
          </li>

          <li className="page-item">
            <a
              className="page-link"
              tabIndex="-1"
              onClick={this.next.bind(this)}
            >
              Show More
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
