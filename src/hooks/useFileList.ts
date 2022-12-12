import React, { useCallback, useEffect, useState } from "react";
import FileData from "@defines/FileData";

import WebWorker from "@libs/webWorker";

const worker = new WebWorker(`${process.env.PUBLIC_URL}/worker.js`);
worker.connect();

/** 파일 업로드 클릭 이벤트 입니다. */
export function useClickHandler(
  setFileList: React.Dispatch<React.SetStateAction<FileData[]>>
) {
  const clickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
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
    },
    [setFileList]
  );

  return clickHandler;
}

/** 파일 드랍 이벤트 입니다. */
export function useDropHandler(
  setFileList: React.Dispatch<React.SetStateAction<FileData[]>>
) {
  const dropHandler: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
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
    },
    [setFileList]
  );

  return dropHandler;
}

/** 파일 업로드 객체 훅 */
export default function useFileList() {
  const [fileList, setFileList] = useState<FileData[]>([]);
  const clickHandler = useClickHandler(setFileList);
  const dropHandler = useDropHandler(setFileList);

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

  return {
	fileList,
	clickHandler,
	dropHandler,
  };
}
