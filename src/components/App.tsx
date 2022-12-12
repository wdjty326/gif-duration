import React, { FunctionComponent } from "react";
import { v1 } from "uuid";
import logo from "@assets/logo.svg";
import useFileList from "@hooks/useFileList";

import StyledApp, {
  StyledAppHeader,
  StyledAppItem,
  StyledAppList,
  StyledAppLogo,
  StyledAppMenu,
} from "@styles/App";

const App: FunctionComponent = () => {
  const { fileList, clickHandler, dropHandler } = useFileList();

  return (
    <StyledApp
      onClick={clickHandler}
      onDrop={dropHandler}
      onDragOver={(e) => {
        // allow drop
        e.preventDefault();
      }}
    >
      {fileList.length === 0 ? (
        <StyledAppHeader>
          <StyledAppLogo src={logo} alt="logo" />
          <p>Drop Files Here</p>
        </StyledAppHeader>
      ) : (
        <React.Fragment>
          <StyledAppMenu>
            <StyledAppLogo src={logo} alt="logo" />
            <span>GIF duration</span>
          </StyledAppMenu>
          <StyledAppList>
            {fileList.map((file, idx) => {
              return (
                <StyledAppItem key={`App-Item-${v1()}`}>
                  <label>{file.fileName}</label>
                  <span>
                    {file.duration !== -2 &&
                      file.duration !== -1 &&
                      `${file.duration / 1000}s`}
                  </span>
                  <img src={file.blobURL} alt="" />
                </StyledAppItem>
              );
            })}
          </StyledAppList>
        </React.Fragment>
      )}
    </StyledApp>
  );
};

export default App;
