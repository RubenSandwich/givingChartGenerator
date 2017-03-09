
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
          class="button-primary"
        >
          Save Chart
        </button>
      );
    } else {
      graph = (
        <div style={styles.leftRightPadding}>
          <GivingChart
            ref="givingChart"
          />
        </div>
      );

      saveButton = (
        <button
          style={styles.allPadding}
          class="button-primary"
        >
          Save Chart
        </button>
      );
    }

    return (
      <div style={styles.container}>
        <h1>Giving Chart Generator</h1>
        <div style={styles.rowContainer}>
          <div style={styles.leftRightPadding}>
            <label>Month</label>
            <select ref="month" value={month}>
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
            <select ref="year" value={year}>
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
            <input type="number" ref="giving" value={giving}/>
          </div>
          <div style={styles.leftRightPadding}>
            <label>Budget</label>
            <input type="number" ref="budget" value={budget}/>
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
