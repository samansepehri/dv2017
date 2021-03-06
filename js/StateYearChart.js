let pathColors = [
  "#456f98",
  "#73a84f",
  "#fab14d",
  "#f9f18c"
];

function numberToPathColor(i) {
  return pathColors[i % pathColors.length];
}

class StateYearChart {
  constructor(parent) {
    let width = 400;
    let height = 200;
    this.width = width;
    this.height = height;

    this.div = parent.append("div")
      .style("margin-right", "50px")
      .style("display", "inline-block")
      .style("height", "500px")
      .style("overflow", "visible");
    this.div.append("h2")
      .text("States through time")
      .style("overflow", "visible")
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("padding-left", "26px");
    
    this.gPaths = this.svg.append("g");
    this.gXAxis = this.svg.append("g");
  }

  update(data, criterion) {
    let years = data.metadata.years;
    let states = data.metadata.states;
    let stateCount = data.data.length;
    let yearCount = years.length;
    
    let paths = [];
    let maxY = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < stateCount; i++) {
      let stateData = data.data[i];
      for (let j = 0; j < yearCount; j++) {
        let value = stateData[criterion][j];
        if (value >= maxY) maxY = value;
      }
    }
    let xScale = (x) => { return x * this.width / (yearCount - 1); }
    let yScale = (y) => { return this.height - y / maxY * this.height; }

    if (yearCount > 1) {
      // make paths
      for (let i = 0; i < stateCount; i++) {
        // for each state, make a path
        let path = d3.path();
        let stateData = data.data[i];
        path.moveTo(
          xScale(0),
          yScale(stateData[criterion][0]));
        let yearCount = stateData[criterion].length;
        for (let j = 1; j < yearCount; j++) {
          let value = stateData[criterion][j];
          path.lineTo(
            xScale(j),
            yScale(value));
        }
        paths.push(path);
      }
    } else [
      // TODO what to do if we only have 1 selected year?
    ]

    let path = this.gPaths.selectAll("path.state-through-time").data(paths);
    let pathEnter = path.enter()
      .append("path")
      .classed("state-through-time", true);
    path.merge(pathEnter)
      .attr("d", (d) => {
        return d;
      })
      .attr("fill", "none")
      .style("stroke", "red")
      .style("stroke-width", "1px");
    path.exit().remove();

    // axis
    let xAxisScale = d3.scaleOrdinal()
      .domain(years)
      .range(years.map((d, i) => { return xScale(i); }));
    let xAxis = d3.axisBottom(xAxisScale);
    this.gXAxis
      .attr("transform", `translate(0, ${this.height})`)
      .call(xAxis);

    // state labels
    /*
    let stateLabel = this.svg.selectAll("text.state-label").data(states);
    let stateLabelEnter = stateLabel.enter()
      .append("text")
      .classed("state-label", true);
    stateLabel.merge(stateLabelEnter)
      .text((d) => {
        return d;
      })
      .attr("text-anchor", "end")
      .attr("dy", "0.5em")
      .attr("transform", (d, i) => {
        return `translate(-4, ${yScale(data.data[i][criterion])})`;
      })
    */
  }
}