import React from 'react';
import Map from './map';
import Search from './search';
import SentimentContainer from './sentiment';
import { Steps } from 'intro.js-react';
import { modelInstance } from '../model/model';
import DrawingAnimation from '../components/intro-drawing-animation'
import {withRouter} from 'react-router';
import Login from '../login'

import 'intro.js/introjs.css';
import '../styles/discover.css';
import '../styles/search.css';

class DiscoverContainer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            status: 'NULL',

            //Intro.js
            initialStep: 0,
            introState: 'INITIAL',
            steps: [
              {
                element: '.sentiment-pie',
                intro: "This app shows sentiment towards subjects based on tweets. </br> <h5><ButtonImportant><a target='_blank' href='https://en.wikipedia.org/wiki/Sentiment_analysis'>What is Sentiment Analysis?</a></ButtonImportant></h5> <h6><i>*Tweets without sentiment are not included in the chart</i></h6>",
              },
              {
                element: '#searchInput',
                intro: 'You can search for subjects here',
              },
              {
                element: '.date',
                intro: 'You can look for tweets in the past 7 days',
              },
              {
                element: '.location',
                intro: 'You can filter your search to specific locations',
              },
              {
                element: '.container-discover-top',
                intro: 'Or interact with the map to look for locations in a certain radius',
              },
              {
                element: '.sentiment-tweet',
                intro: 'The tweets will be displayed here',
              },
              {
                element: '.createPDF',
                intro: 'Finally you can export the data in a PDF',
              },
            ],
        }
    }

    componentDidMount() {
      let query = this.props.match.params.query;
      console.log("query: "+query);
      if (query !== undefined){
        console.log("set search");
        modelInstance.setSearch(query, true);
      }
      console.log(this.props.match.params);
      if (this.hasNecessaryURLParams()){
        this.setState({
          status: "LOADED"
        });
      }
    }

    hasNecessaryURLParams = () => {
      if (
        this.props.match.params.pos !== undefined &&
        this.props.match.params.neg !== undefined &&
        this.props.match.params.tot !== undefined &&
        this.props.match.params.noOfNeu !== undefined
      ){
        return true;
      }
      return false;
    }

    handleStatusChange = newStatus => {
      this.setState({
          status: newStatus
      });
    }

    onExit = () => {
      this.setState(() => ({
        stepsEnabled: false,
        introState: 'INITIAL'
      }));
    };

    toggleSteps = () => {
      this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
      // this.onAfterChange(prevState);
    };

    onAfterChange = nextStepIndex => {
      if (nextStepIndex === 0 && this.state.status !=='LOADED') {
        this.setState({
          status: 'LOADED'
        })
        // this.step.updateStepElement(nextStepIndex);
      }

      else if (nextStepIndex === 4) {
        this.setState({
          introState: 'MAP'
        })
        // this.step.updateStepElement(nextStepIndex);
      }

      else{
        this.setState({
          introState: 'INITIAL'
        })
      }
      }



    render () {
      const { stepsEnabled, steps, initialStep} = this.state;

      let media = null;

      switch (this.state.introState) {
        case 'INITIAL':
            media = null
            break;

        case 'MAP':
            media = <DrawingAnimation />
          break;
      }

        return (
            <div className="container-discover">
              <Steps
                className='intro-steps'
                enabled={stepsEnabled}
                steps={steps}
                initialStep={initialStep}
                onExit={this.onExit}
                onAfterChange={this.onAfterChange}
              />
              <div className="container-discover-top">
                  <div className='map'>
                    <Map/>
                  </div>
                  <div className="intro">
                      {media}
                      <Login toggleSteps={this.toggleSteps.bind(this)}/>
                  </div>
                  <div className='container-search'>
                    <Search handleStatusChange={this.handleStatusChange}/>
                  </div>
              </div>
              <div className="container-discover-bottom">
                  <SentimentContainer query={this.state.searchInput}
                                      hasNecessaryURLParams={this.hasNecessaryURLParams}
                                      status={this.state.status}
                                      positive={this.props.match.params.pos}
                                      negative={this.props.match.params.neg}
                                      total={this.props.match.params.tot}
                                      noOfNeutral={this.props.match.params.noOfNeu}
                                      until={this.props.match.params.until}/>
              </div>
            </div>

        );
    }
}

export default withRouter(DiscoverContainer);
