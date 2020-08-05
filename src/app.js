import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      srcs: [],
      show: false
    }
  }

  componentDidMount() {
    const [ index, ...srcs ] = window.location.hash.split("#").filter(o => !!o);

    this.setState({
      index,
      srcs,
      show: true
    });
  }

  onCloseRequest() {
    chrome.tabs.query({active:true,windowType:"normal", currentWindow: true}, tabs => {
      const id = tabs[0].id;

      chrome.tabs.executeScript(id, {
        code: `
          document.querySelector("#limasa-dialog").remove();
          document.body.style.overflowY = "unset";
          document.body.style.overflowX = "unset";
        `
      })
    })
    this.setState({ show: false });
  }

  render() {
    const { show, srcs: images = [], index } = this.state;

    return (
      <div>
        {
          show && images.length > 0 && (
            <Lightbox
              prevSrc={ images[(index + images.length - 1) % images.length] }
              mainSrc={ images[index] }
              nextSrc={ images[(index + 1) % images.length] }
              onCloseRequest={this.onCloseRequest.bind(this)}
              onMovePrevRequest={() =>
                this.setState({
                  index: (index + images.length - 1) % images.length
                })
              }
              onMoveNextRequest={() =>
                this.setState({
                  index: (index + 1) % images.length
                })
              }
            />
          )
        }
      </div>
    )
  }
}
