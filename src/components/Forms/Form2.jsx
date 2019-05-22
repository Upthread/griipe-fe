import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { Spinner, Fade } from 'reactstrap';

import AudioAnalyser from "./Recording/AudioAnalyser";
import axios from "axios";

const audioType = "audio/wav";

class Form2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // isRecordingLoading: false,
      // fadeIn: true,
      // nullifyRecordButton: false
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({isLoading: false}), 1000);
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  getMicrophone = async () => {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });

    this.props.audioState(audio);
    // this.setState({ audio });

    let mediaRecorder = new MediaRecorder(audio);
    // init data storage for video chunks
    this.chunks = [];
    // listen for data from media recorder
    mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
    console.log("right console log?", this.chunks);
    mediaRecorder.start(10);

    this.props.recordingState(true);
    // this.setState({ recording: true });
  };

  stopMicrophone = () => {
    this.props.audio.getTracks().forEach(track => track.stop());

    this.props.audioState(null);
    // this.setState({ audio: null });

    // this.mediaRecorder.stop();
    this.props.recordingState(false);
    // this.setState({ recording: false });
    // save audio is working
    this.saveAudio();
  };

  saveAudio = async () => {
    const blob = await new Blob(this.chunks, { type: audioType });
    // generate video url from blob
    const audioURL = window.URL.createObjectURL(blob);
    // const file = blobToFile(blob, "my-recording.wav")
    // append videoURL to list of saved videos for rendering
    const audios = this.props.audios.concat([audioURL]);
    this.props.setAudiosProp(audios);

    // console.log(this.props.audios);
    // console.log(blob);
    let data = blob;
    let contentType = "audio/wav";
    let authHeaders = "Basic Y2FsbGFuZGNvbXBsYWluQGdtYWlsLmNvbTpjYWxsY29tcGxhaW4xMjM0NTY3ODk=";
    let dgheaders = {
      "Content-Type": contentType,
      Authorization: authHeaders
    };
    
    axios
      .post(`https://brain.deepgram.com/v2/listen`, data, {
        headers: dgheaders
      })
      .then(res => {
        console.log("response:", res);
        this.props.setTranscriptionProps(
          res.data.results.channels[0].alternatives[0].transcript
        );
      })
      .catch(err => console.log(err));
  };

  deleteAudio(audioURL) {
    // filter out current videoURL from the list of saved videos
    const audios = this.props.audios.filter(a => a !== audioURL);
    this.props.setAudiosProp(audios);
  }

  toggleMicrophone = () => {
    if (this.props.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  };

  transcribe = e => {
    e.preventDefault();
    // let data = this.state.audios
    // let contentType = 'audio/wav';
    // let authHeaders = 'Basic Y2FsbGFuZGNvbXBsYWluQGdtYWlsLmNvbTpjYWxsY29tcGxhaW4xMjM0NTY3ODk='
    // let dgheaders = {
    //     "Content-Type": contentType,
    //     "Authorization": authHeaders
    // }
    // console.log(data, dgheaders)
    // axios
    //     .post(`https://brain.deepgram.com/v2/listen`, data, {headers: dgheaders})
    //     .then(res => {
    //         console.log("response:", res)
    //         })
    //     .catch(err => console.log(err));
    
  };

  render() {
    const { values, handleChange } = this.props;
    if(this.state.isLoading===true) {
      return (
      <div className="recording-loader loader">
        <h1>CALL COMPLAIN</h1>
        <br />
        <Spinner style={{ width: '3rem', height: '3rem' }} />
      </div>)
    };
    return (
      <MuiThemeProvider>
        <Fade in={this.state.fadeIn} tag="h5" className="mt-3" className="form-container">
          <h1>Record Complaint</h1>

          <br />

          <div className="App">
            <div className="controls">
              <button onClick={this.toggleMicrophone}>
                {this.props.audio ? "Stop Recording" : "Start Recording"}
              </button>
            </div>
            {this.props.audio ? <AudioAnalyser audio={this.props.audio} /> : ""}
            <br />
            
            <div>
              <h3>Recordings</h3>
              {this.props.audios.map((audioURL, i) => (
                <div key={i}>
                  <audio controls style={{ width: 200 }} src={audioURL} />
                  <div>
                    <button onClick={() => this.deleteAudio(audioURL)}>
                      Delete Recording
                    </button>
                  </div>
                  <button onClick={this.transcribe}>Send to Deepgram</button>
                </div>
              ))}
            </div>
          </div>

          <RaisedButton
            label="Back"
            primary={false}
            style={styles.button}
            onClick={this.back}
          />

          <RaisedButton
            label="Continue"
            primary={true}
            style={styles.button}
            onClick={this.continue}
          />
        </Fade>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  button: {
    margin: 15
  }
};

export default Form2;
