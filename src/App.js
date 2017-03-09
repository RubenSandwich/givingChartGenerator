
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
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: "2017",
      month: "January",
      giving: 10000,
      budget: 20000,
      errorMessage: "",
    };

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

  changedGiving(event) {
    this.setState({giving: event.target.value});
  }

  changedBudget(event) {
    this.setState({budget: event.target.value});
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
      errorMessage,
    } = this.state;

    let errorBox;
    let graph;
    let saveButton;
    if (errorMessage) {
      errorBox = (
        <pre style={styles.leftRightPadding}>
          <code>
            {errorMessage}
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
              value={giving}
              onChange={this.changedGiving}
            />
          </div>
          <div style={styles.leftRightPadding}>
            <label>Budget</label>
            <input
              ref="budget"
              type="number"
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
