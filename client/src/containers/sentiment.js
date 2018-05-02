import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden';
import { Row, Col } from 'react-flexbox-grid';
import SentimentPie from '../components/sentiment-pie';
import CircularIndeterminate from '../components/circular-indeterminate';
import SentimentPDF from '../components/sentiment-pdf';
import { modelInstance } from '../model/model';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';
import TweetEmbed from 'react-tweet-embed';
import Notification from '../components/notification';

class Sentiment extends Component {
  constructor(props){
    super(props);
    this.state = {
      positive: 50,
      negative: 40,
      neutral: 10,
      sentiment: modelInstance.getSentimentData(),
<<<<<<< HEAD
      searchInput: "All Tweets",
=======
      searchInput: modelInstance.getSearch(),
      placeName: modelInstance.getPlaceName(),
>>>>>>> 9f8e14936f5e5e2adc624a479b6b90c655be5c9b
      tweetAmount: modelInstance.getTweetAmount(),
      date: modelInstance.getDateString(),
      geoLocated: null,
      userId: '692527862369357824',
      placeName: modelInstance.getPlaceName()
    }
  }

  static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired
  }

  componentDidMount() {
    modelInstance.addObserver(this);
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }

  update(details){
    if(details === "searchInputSet"){
      this.setState({
        searchInput: modelInstance.getSearch()
      });
    }

    if(details==="emptySearchString"){
      // Show no sentiment pie chart
      this.setState({status: "EMPTY"});
    }

    if(details ==='tweetsSet'){

      this.sentimentAnalysis();
    }

    if (details==="sentimentSet") {
      this.calculateSentiment();
      this.setState({
        searchInput: modelInstance.getSearch(),
        tweetAmount: modelInstance.getTweetAmount(),
        mostPopularTweetId: modelInstance.getMostPopularTweet(),
      })
    }

    if(details==='userLocationsSet'){
      let userLocations = modelInstance.getUserLocations();
      let length;
      if(userLocations !== null){
        length = userLocations.locations.length;
      }else{
        length = ""
      }
      this.setState({
        geoLocated: length
      })
    }

    if(details==='userIdSet'){
      this.setState({
        userId: modelInstance.getUserId()
      })
    }

    if(details === "dateSet"){
      this.setState({
        date: modelInstance.getDateString()
      });
    }

    if(details==="placeNameSet"){
      this.setState({
        placeName: modelInstance.getPlaceName()
      });
    }

  }


  sentimentAnalysis = () => {
    if(this.state.searchInput === "") return;

    modelInstance.analyzeSentiment().then(result => {
      modelInstance.setSentimentData(result);
      this.setState({
        status: 'LOADED SENTIMENT'
      });
    }).catch(() => {
      this.setState({
        status: 'ERROR'
      });
    });
  }

  calculateSentiment = () => {
    let result = modelInstance.getSentimentData();
    let sentiment = {positive: undefined, negative: undefined, neutral: undefined};
    let pos = 0;
    let neg = 0;
    let neu = 0;

    result.data.map(data =>{
      switch(data.polarity){
        case 4:
          pos += 1
          break
        case 0:
          neg += 1
          break
        case 2:
          neu += 1
          break
      }
    })

    let total = pos + neg + neu;
    sentiment.positive = (pos/total)*100;
    sentiment.negative = (neg/total)*100;
    sentiment.neutral = (neu/total)*100;

    this.setState({
      positive: (result !== null) ? Math.round(sentiment.positive) : 50,
      negative:  (result !== null) ? Math.round(sentiment.negative) : 40,
      neutral: (result !== null) ? Math.round(sentiment.neutral) : 10,
    })
  }

  handleTweetLoadError = event => {
    console.log('Tweet loading failed');
  }

  handleTweetLoadSuccess = event => {
    console.log('Tweet loaded successfully');
  }

  handlePDFCreation = event => {
    alert("Creating PDF");
  }

  handleOpen = () => {
    this.setState({ open: true});
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render(){
    let width = this.props.containerWidth / 3;
    let height = this.props.containerHeight;
    let minViewportSize = Math.min(width, height);
    // This sets the radius of the pie chart to fit within
    // the current window size, with some additional padding
    let radius = (minViewportSize * .9) / 2;
    // Centers the pie chart
    let x = width / 2;
    let y = height / 2;
    let pieChart = null;
    let notification = null;

    switch (this.props.status) {
      case 'INITIAL':
        pieChart = <CircularIndeterminate/>
        break;
      case 'LOADED':
        pieChart =
            <svg width="100%" height="100%">
              <SentimentPie x={x}
                            y={y}
                            innerRadius={radius * .35}
                            outerRadius={radius}
                            cornerRadius={2}
                            padAngle={.02}
                            data={[this.state.positive, this.state.negative, this.state.neutral]}/>
            </svg>
        break;



      default:
        pieChart = <Notification text='There seems to be an error in your request'/> //  <div className="error">Failed to load data, please try again</div>
        break;
    }

    // Error Messages for App 'misuses'
    switch (this.props.notifications) {
      case 'INITIAL':
        notification = null;
      break;

      case 'EMPTY':
        console.log('EMPTY')
        notification = <Notification open={this.handleOpen.bind(this)} handleClose={this.handleClose.bind(this)} text="We couldn't find any tweets for that search"/>
      break;

      case 'RATE_LIMITED':
        console.log('LIMITED');
        notification = <Notification open={this.handleOpen.bind(this)} close={this.handleClose.bind(this)} text="The app is rate limited for making too many API calls"/>
      break;
    }

    return(
      <div>
        <Hidden only="xs">
          <Row id="title-steps">
            <Col sm={4} md={4}>Info</Col>
            <Col sm={4} md={4}>Sentiment</Col>
            <Col sm={4} md={4}>
              Tweets
              <div className="createPDF">
                <SentimentPDF handlePDFCreation={this.handlePDFCreation} page={0}/>
              </div>
            </Col>
          </Row>
        </Hidden>
        <Row id="content-steps">
          <Col sm={4} md={4} xs={12}>
            <Hidden smUp>
              <p>Info</p>
            </Hidden>
            <div className="tweets-info">
              <Row>
                <Col xs={6} className="tweets-info-title">Search:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.searchInput}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Amount of tweets:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.tweetAmount}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Geolocated Tweets:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.geoLocated}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Geography:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.placeName}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Until:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.date}</Col>
              </Row>
            </div>
          </Col>
          <Col sm={4} md={4} xs={12}
            style={{
              width: this.props.containerWidth,
              height: this.props.containerHeight
            }}
            className="sentiment-pie"
          >
            <Hidden smUp>
              <p>Sentiment</p>
            </Hidden>
            {pieChart}
            {notification}
          </Col>
          <Col sm={4} md={4} xs={12} className="tweet">
            <Hidden smUp>
              <p>Tweets</p>
              <div className="createPDF">
                <SentimentPDF handlePDFCreation={this.handlePDFCreation} page={0}/>
              </div>
            </Hidden>
            <TweetEmbed id={this.state.userId} options={{cards: 'hidden', width: '100%'}} onTweetLoadError={evt => this.handleTweetLoadError(evt)} onTweetLoadSuccess={evt => this.handleTweetLoadSuccess(evt)}/>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Dimensions()(Sentiment);
