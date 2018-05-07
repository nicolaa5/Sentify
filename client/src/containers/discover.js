import React from 'react';
import Map from './map';
import Search from './search';
import SentimentContainer from './sentiment';
import { Steps } from 'intro.js-react';
import ButtonImportant from '../components/button-important';
import { modelInstance } from '../model/model';
import DrawingAnimation from '../components/intro-drawing-animation'


import 'intro.js/introjs.css';
import '../styles/discover.css';
import '../styles/search.css';


class DiscoverContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            status: 'INITIAL',

            //Intro.js
            initialStep: 0,
            introState: 'INITIAL',
            steps: [
              {
                element: '.sentiment-pie',
                intro: "This app shows people's sentiment towards subjects based on tweets.</br> <h5><ButtonImportant><a target='_blank' href='https://en.wikipedia.org/wiki/Sentiment_analysis'>What is Sentiment Analysis?</a></ButtonImportant></h5> ",
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
                intro: 'Type in place names or interact with the map to look for tweets in specific locations',
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

      else if (nextStepIndex === 3) {
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
                      <ButtonImportant size="small" text='Explain App' toggleSteps={this.toggleSteps.bind(this)}/>
                  </div>
                  <div className='container-search'>
                    <Search handleStatusChange={this.handleStatusChange}/>
                  </div>
              </div>
              <div className="container-discover-bottom">
                  <SentimentContainer status={this.state.status}/>
              </div>
            </div>

        );
    }
}

export default DiscoverContainer;
