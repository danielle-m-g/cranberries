import React, { Component } from "react";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
  }

  fileInput = (event) => {
    event.preventDefault();
    const { input } = this.state;
  
    if (input) {
      const rfile = new FileReader();
      rfile.onload = (e) => {
        const t = e.target.result;
        const line = t.split("\n").map((line) => line.trim());
        const result = [];
        const head = line[0].split(",").map(h => h.trim());
        
  
        for (let col = 1; col < line.length; col++) {
          const curr = line[col].split(",");
          const a = {};
  
          head.forEach((h, i) => {
            a[h] = curr[i]?.trim() || "";
          });
  
          if (Object.keys(a).length && line[col].trim()) {
            const cols = {
              Date: new Date(a.Date),
              GPT4: parseFloat(a["GPT-4"]) ,  
              Gemini: parseFloat(a["Gemini"]) ,
              PaLM2: parseFloat(a["PaLM-2"]) ,
              Claude: parseFloat(a["Claude"]) ,
              LLaMA: parseFloat(a["LLaMA-3.1"]) ,
            };
            result.push(cols);
          }
        }
  
        this.props.setData(result);
      };
      rfile.readAsText(input);
    }
  };
  

  render() {
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: 15 }}>
        <h2>Upload a CSV File</h2>
        <form onSubmit={this.fileInput}>
          <input
            type="file"
            accept=".csv"
            onChange={(event) => this.setState({ input: event.target.files[0] })}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;
