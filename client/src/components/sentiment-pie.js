import React from 'react';
import SentimentSlice from '../components/sentiment-slice';
import d3 from 'd3';

//This is the Presentation component
class SentimentPie extends React.Component {
  constructor(props) {
    super(props);
    this.colorScale = ['#A5C05B', '#D24136'];
    this.renderSlice = this.renderSlice.bind(this);
  }

  render () {
    let {x, y, data, onChartClick} = this.props;
    let pie = d3.layout.pie();
    return (
      <g transform={`translate(${x}, ${y})`}>
        {pie(data).map(this.renderSlice)}
      </g>
    );
  }

  renderSlice(value, i) {
    let {innerRadius, outerRadius, cornerRadius, padAngle, onChartClick} = this.props;
    return (
      <SentimentSlice key={i}
                      onChartClick={onChartClick}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      cornerRadius={cornerRadius}
                      padAngle={padAngle}
                      value={value}
                      sentiment={i}
                      label={value.data +" %"}
                      fill={this.colorScale[i]} />
    );
  }
}

export default SentimentPie;
