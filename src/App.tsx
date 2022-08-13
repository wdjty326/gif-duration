import React, { FunctionComponent, useMemo } from "react";
import WebWorker from "./webWorker";
import logo from "./logo.svg";
import "./App.scss";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";

const worker = new WebWorker(`${process.env.PUBLIC_URL}/worker.js`);
worker.connect();

interface FileData {
  fileName: string;
  fileType: string;
  blobURL: string;
  duration: number;
}

const App: FunctionComponent = () => {
  //  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileData[]>([]);

  useEffect(() => {
    const updateCount = fileList.filter((file) => file.duration === -2).length;

    if (updateCount > 0) {
      const updateList = fileList.map((file, idx) => {
        if (file.duration === -2) {
          worker.postMessage(file).then((value) => {
            const cloneFileList = fileList.concat([]);
            file.duration = value;

            cloneFileList.splice(idx, 1, file);
            setFileList(cloneFileList);
          });
          file.duration = -1; // loadedstart
        }

        return file;
      });

      setFileList(updateList);
    }
  }, [fileList]);

  const clickHandler = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const input = document.createElement("input");
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files: FileData[] = [];

        for (let i = 0; i < target.files.length; i++) {
          const file = target.files[i];
          files.push({
            blobURL: URL.createObjectURL(file),
            fileName: file.name,
            fileType: file.type,
            duration: -2, // unloaded
          });
        }

        setFileList((prev) => [...prev, ...files]);
      }
    };

    input.type = "file";
    input.accept = "image/gif";
    input.multiple = true;
    input.click();
  }, []);

  const dropHandler = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files: FileData[] = [];

    const pushFile = (file: File | null) => {
      if (file) {
        files.push({
          blobURL: URL.createObjectURL(file),
          fileName: file.name,
          fileType: file.type,
          duration: -2, // unloaded
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
    <div
      className={["App", fileList.length ? "App-Uploaded" : ""].join(" ")}
      onClick={clickHandler}
      onDrop={dropHandler}
      onDragOver={(e) => {
        // allow drop
        e.preventDefault();
      }}
    >
      {fileList.length === 0 ? (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Drop Files Here</p>
        </header>
      ) : (
        <React.Fragment>
          <div className="App-Menu">
            <img src={logo} className="App-logo" alt="logo" />
            <span>GIF duration</span>
          </div>
          <div className="App-List">
            {fileList.map((file, idx) => {
              return (
                <div className="App-Item" key={`App-Item-${idx}`}>
                  <label>{file.fileName}</label>
                  <span>
                    {file.duration !== -2 &&
                      file.duration !== -1 &&
                      `${file.duration / 1000}s`}
                  </span>
                  <img src={file.blobURL} alt="" />
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
