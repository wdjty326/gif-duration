onmessage = (ev) => {
  const { uid, message } = ev.data;
  const { blobURL, fileName } = message;
  gifDuration(blobURL, fileName).then((value) =>
    postMessage({ uid, message: value })
  );
};

const gifDuration = (blobURL, fileName) => {
  return new Promise((resolve, reject) => {
    const callback = (buffer) => {
      const result = new Uint8Array(buffer);
      let i = 10;
      const flag = Math.floor(result[i] / 128) === 1;

      let size = 0;

      if (flag) {
        if (Math.floor((result[i] % 8) / 4) === 1) size += 4;
        if (Math.floor((result[i] % 4) / 2) === 1) size += 2;
        if (Math.floor((result[i] % 2) / 1) === 1) size += 1;

        size = 3 * Math.pow(2, size + 1);
      }
      // 3byte + color table 만큼
      i += 3 + size;

      if (0x21 === result[i]) {
        // Graphic Control이 먼저 시작할 경우
        if (0xf9 === result[i + 1]) i += 4; // sub블럭 및 bit filed 무시
        else if (0xff === result[i + 1]) i += 23;
      }

      var msArray = result.slice(i, i + 2);
      var ms = (msArray[0] + msArray[1]) * 10; // 리틀엔디안 방식

      while (
        i < result.length &&
        !(result[i] === 0x2c && result[i - 1] === 0x00)
      )
        i++;

      var frame = 0;
      do {
        if (
          (0x00 === result[i - 1] &&
            0x21 === result[i] &&
            0xf9 === result[i + 1]) ||
          (0x00 === result[i] &&
            0x21 === result[i + 1] &&
            0xf9 === result[i + 2]) ||
          (0x00 === result[i - 2] &&
            0x21 === result[i - 1] &&
            0xf9 === result[i])
        ) {
          frame++;
        }
        i += 3;
      } while (i < result.length);
      frame++; // 마지막프레임

      resolve(frame * ms);
    };

    const reader = new FileReader();
    reader.addEventListener("loadend", (e) => {
      callback(e.target.result);
    });

    reader.addEventListener("error", (e) => reject(e));
    fetch(blobURL)
      .then((resp) => resp.arrayBuffer())
      .then((buffer) => {
        callback(buffer);
      });
  });
};
