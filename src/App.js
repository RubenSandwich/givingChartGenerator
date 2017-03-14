
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
  rightAlignedText: {
    textAlign: 'right',
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: "2017",
      month: "January",
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

  checkForErrors(error, value) {
    const { errorMessages } = this.state;

    if (value <= 0) {
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
    const value = parseInt(event.target.value, 10);
    this.checkForErrors('Giving cannot be 0 or negative', value);
    this.setState({giving: value});
  }

  changedBudget(event) {
    const value = parseInt(event.target.value, 10);
    this.checkForErrors('Budget cannot be 0 or negative', value);
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
          Save Chart
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
          Save Chart
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
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div style={styles.leftRightPadding}>
            <label>Year</label>
            <select
              value={year}
              onChange={this.changedYear}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
            </select>
          </div>
        </div>
        <div style={styles.rowContainer}>
          <div style={styles.leftRightPadding}>
            <label>Giving</label>
            <input
              ref="giving"
              type="number"
              style={styles.rightAlignedText}
              value={giving}
              onChange={this.changedGiving}
            />
          </div>
          <div style={styles.leftRightPadding}>
            <label>Budget</label>
            <input
              ref="budget"
              type="number"
              style={styles.rightAlignedText}
              value={budget}
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
