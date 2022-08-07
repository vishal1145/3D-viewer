import React, { useState, useRef } from "react";
import "./App.css";
import { AiOutlineUpload } from "react-icons/ai";
import Spinner from "./Components/Loaders/Spinner";
import D3panel from "./Components/D3Panel";
import { useAlert } from "react-alert";
import { exportTypes, exportFile } from "./utils/exporters";
import DropDownButton from "./Components/CustomComponents/DropDownButton";
const App = () => {
  const [text, setText] = useState("Pace");
  const [showDropPreview, setShowDropPreview] = useState(false);
  const [fontSize, setFontSize] = useState(10);
  const [files, setFiles] = useState([]);
  const model = useRef();
  const alert = useAlert();
  const [exportLoading, setExportLoading] = useState(false);

  const getDropedFiles = (e) => {
    e.preventDefault();
    setShowDropPreview(false);
    console.log(e);
    const Files = [];
    for (let item of e.dataTransfer?.items) {
      let file = item.getAsFile();
      if (!file.name.endsWith(".stl")) {
        alert.error(
          // "Please Upload a 3d file (stl, obj, gltf/glb, or fbx)!"
          `${file.name} is not a 3D file!`
        );
      } else {
        Files.push(file);
      }
    }
    setFiles((prevFiles) => [...prevFiles, ...Files]);
  };

  const getSelectedIndex = async (index) => {
    setExportLoading(true);
    await exportFile(index, model, alert, text);
    setExportLoading(false);
  };

  return (
    <>
      <div
        onDrop={getDropedFiles}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setShowDropPreview(true)}
        onDragLeave={() => setShowDropPreview(false)}
        style={{ height: "100vh" }}
      >
        <div className="menu">
          <input
            title="Type something here"
            style={{ width: "40%" }}
            id="insertText"
            autoComplete="off"
            placeholder="Type your text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            title="Change Font Size"
            id="fontInput"
            type="number"
            onChange={(e) => setFontSize(e.target.value)}
            value={fontSize}
          />
          <label title="Import a file from your system." htmlFor="importSTL">
            {" "}
            <AiOutlineUpload /> Import File
          </label>
          <input
            id="importSTL"
            hidden
            type="file"
            multiple
            accept=".stl"
            onChange={(e) => {
              setFiles((prevFiles) => [...prevFiles, ...e.target.files]);
            }}
          />
          <DropDownButton
            options={exportTypes}
            loading={exportLoading}
            loader={
              <Spinner
                style={{
                  width: "1rem",
                  height: "1rem",
                  marginRight: ".5rem",
                }}
              />
            }
            getSelectedIndex={getSelectedIndex}
          />
        </div>
        <p className="tip">Click to control objects in 3D space.</p>
        <D3panel textProps={{ text, fontSize }} files={files} model={model} />
        {showDropPreview && (
          <div className="drag-n-drop-preview">
            <span>Upload Your Model</span>
          </div>
        )}
      </div>
    </>
  );
};

export default App;

//////////////////////-------------------------STL exporter------------------------////////////////////////////////////////////
