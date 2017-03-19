
import React, { Component } from 'react';

import GivingChart from './GivingChart.js';

const styles = {
  container: {
    marginTop: '2rem',
    flexDirection: 'columns',
  },
  rowContainer: {
    flexDirection: 'row',
    display: 'flex',
  },
  leftRightPadding: {
    margin: '0rem 2rem',
  },
  allPadding: {
    margin: '2rem',
  },
  numInput: {
    width: '158px',
    textAlign: 'right',
  }
}

function isEmpty(str) {
  return (!str || 0 === str.length);
}

function liberalParseInt(value) {
  return isEmpty(value) ? 0 : parseInt(value, 10);
}

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) {
      return index + start;
  });
}

class App extends Component {
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear().toString();
  currentMonth = this.months[this.currentDate.getMonth()];

  constructor(props) {
    super(props);

    this.state = {
      year: this.currentYear,
      month: this.currentMonth,
      giving: 13,
      budget: 20,
      errorMessages: [],
    };

    this.checkForErrors = this.checkForErrors.bind(this);

    this.changedYear = this.changedYear.bind(this);
    this.changedMonth = this.changedMonth.bind(this);
    this.changedGiving = this.changedGiving.bind(this);
    this.changedBudget = this.changedBudget.bind(this);
    this.saveGraph = this.saveGraph.bind(this);
  }

  changedYear(event) {
    this.setState({year: event.target.value});
  }

  changedMonth(event) {
    this.setState({month: event.target.value});
  }

  checkForErrors(error, value, max) {
    const { errorMessages } = this.state;

    if (value >= max) {
      if (!errorMessages.includes(error)) {
        this.setState({
          errorMessages: [...errorMessages, error],
        });
      }
    } else {
      this.setState({
        errorMessages: errorMessages.filter((item) => {
          return item !== error;
        })
      });
    }
  }

  changedGiving(event) {
    const value = liberalParseInt(event.target.value, 10);
    this.setState({giving: value});
  }

  changedBudget(event) {
    const value = liberalParseInt(event.target.value, 10);
    this.setState({budget: value});
  }

  saveGraph(event) {
    const imageData = this.refs.givingChart.getImageData();
    this.refs.downloadButton.href = imageData;
  }

  render() {
    const {
      year,
      month,
      giving,
      budget,
      errorMessages,
    } = this.state;

    let errorBox;
    let graph;
    let saveButton;
    if (errorMessages.length !== 0) {
      errorBox = (
        <pre style={styles.leftRightPadding}>
          <code>
            {errorMessages.join('\n')}
          </code>
        </pre>
      );

      saveButton = (
        <button
          style={styles.allPadding}
          disabled
          className="button-primary"
        >
          Download Chart
        </button>
      );
    } else {
      graph = (
        <div style={styles.leftRightPadding}>
          <GivingChart
            ref="givingChart"
            year={year}
            month={month}
            giving={giving}
            budget={budget}
          />
        </div>
      );

      const downloadTitle = `${month} ${year} Giving Chart`;
      saveButton = (
        <a
          ref="downloadButton"
          href="#"
          download={downloadTitle}
          style={styles.allPadding}
          onClick={this.saveGraph}
          className="button button-primary"
        >
          Download Chart
        </a>
      );
    }

    return (
      <div style={styles.container}>
        <h1>Giving Chart Generator</h1>
        <div style={styles.rowContainer}>
          <div style={styles.leftRightPadding}>
            <label>Month</label>
            <select
              value={month}
              onChange={this.changedMonth}
            >
              {this.months.map((month, index) => {
                return (
                  <option
                    value={`${month}`}
                    key={index}
                  >
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
          <div style={styles.leftRightPadding}>
            <label>Year</label>
            <select
              value={year}
              onChange={this.changedYear}
            >
              {range(0, 10).map((num, index) => {
                const dateValue = this.currentDate.getFullYear() + num;
                return (
                  <option
                    value={`${dateValue}`}
                    key={index}
                  >
                    {dateValue}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={styles.rowContainer}>
          <div style={styles.leftRightPadding}>
            <label>Giving</label>
            <input
              ref="giving"
              type="number"
              style={styles.numInput}
              value={giving}
              min={0}
              onChange={this.changedGiving}
            />
          </div>
          <div style={styles.leftRightPadding}>
            <label>Budget</label>
            <input
              ref="budget"
              type="number"
              style={styles.numInput}
              value={budget}
              min={0}
              onChange={this.changedBudget}
            />
          </div>
        </div>
        {errorBox}
        {graph}
        <div style={styles.rowContainer}>
          {saveButton}
        </div>
      </div>
    );
  }
}

export default App;
