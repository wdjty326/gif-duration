import { FunctionComponent } from "react";
import WebWorker from "./webWorker";
import logo from "./logo.svg";
import "./App.scss";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";

console.log(importScripts("gif.js"));
//console.log(new URL("./gif.js", window.location.origin));
const worker = new WebWorker(new URL("./gif.js", window.location.origin));
worker.connect();

interface FileData {
  fileName: string;
  blobURL: string;
  duration: number;
}

const App: FunctionComponent = () => {
  const [fileList, setFileList] = useState<FileData[]>([]);

  useEffect(() => {
    const updateCount = fileList.filter((file) => file.duration === -2).length;

    if (updateCount > 0) {
      const updateList = fileList.map((file) => {
        if (file.duration === -2) {
			worker.postMessage(file)
				.then((value) => {

				});
			file.duration = -1;
        }

		return file;
      });
    }
  }, [fileList]);

  const dropHandler = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files: FileData[] = [];

    const pushFile = (file: File | null) => {
      if (file) {
        files.push({
          blobURL: URL.createObjectURL(file),
          fileName: file.name,
          duration: -2, // unload
        });
      }
    };

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          pushFile(file);
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        pushFile(file);
      }
    }

    if (files.length !== 0) setFileList((prev) => [...prev, ...files]);
  }, []);

  return (
    <div className="App" onDrop={dropHandler}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {fileList.map((file) => {
        return <div>
			<label>{file.fileName}</label>
			<img src={file.blobURL} />
		</div>;
      })}
    </div>
  );
};

export default App;
