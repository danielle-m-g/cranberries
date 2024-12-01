import React, { useState } from "react";
import FileUpload from "./FileUpload";
import Streamgraph from "./Graph";
import "./App.css"; // Importing the updated CSS

function App() {
  const [data, setData] = useState([]);

  return (
    <div id="graphai">
      <FileUpload setData={setData} />
      {data.length > 0 && <Streamgraph data={data} />}
    </div>
  );
}

export default App;