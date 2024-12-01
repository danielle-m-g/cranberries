import React, { Component } from "react";
import FileUpload from "./FileUpload";
import Streamgraph from "./Graph";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  setData = (newData)=> {
    this.setState({ data: newData });
  };

  render() {
    const { data } =this.state;
    return (
      <div id="graphai">
        <FileUpload setData={this.setData} />
        {data.length > 0 && <Streamgraph data={data} />}
      </div>
    );
  }
}
 
export default App;
