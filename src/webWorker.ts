export default class WebWorker {
  private scriptURL: string | URL;
  private worker: Worker | null;

  constructor(scriptURL: string | URL) {
    this.scriptURL = scriptURL;
    this.worker = null;
  }

  private onError(e: ErrorEvent) {
    this.worker = null;
    throw e.error;
  }

  /**
   * 워커가 정상적으로 실행중인지 여부입니다.
   * @returns
   */
  public get isActived(): boolean {
    return this.worker !== null;
  }

  /**
   * 워커 파일을 연결합니다.
   * @param scriptURL
   * @param options
   */
  public connect(options?: WorkerOptions) {
    this.worker = new Worker(this.scriptURL, options);
    this.worker.onerror = this.onError;
  }

  /**
   * 워커에 이벤트를 전달합니다. `Promise` 로 결과를 받을 수 있습니다.
   * @param message
   * @param transfers
   * @returns
   */
  public postMessage<T = any, K = any>(message: K, transfer?: Transferable[]) {
    return new Promise<T>((resolve, reject) => {
      if (this.worker) {
        const onClear = () => {
          if (this.worker) {
            this.worker.removeEventListener("message", onMessage);
            this.worker.removeEventListener("messageerror", onMessageError);
          }
        };

        const onMessage = (ev: MessageEvent<T>) => {
          resolve(ev.data);
          onClear();
        };

        const onMessageError = (ev: MessageEvent<T>) => {
          reject(ev.data);
          onClear();
        };

        this.worker.addEventListener("message", onMessage);
        this.worker.addEventListener("messageerror", onMessageError);
        // @ts-ignore: Unreachable code error
        this.worker.postMessage(message, transfer);
      }
    });
  }

  /**
   * 리스너를 생성합니다. 원본데이터를 받을수 있습니다.
   * @param listen
   * @returns 리스너를 제거하는 함수입니다.
   */
  public subscribe<T = any>(listen: (ev: MessageEvent<T>) => void) {
    const callback = (ev: MessageEvent<T>) => listen(ev);

    if (this.worker) {
      this.worker.addEventListener("message", callback);
      this.worker.addEventListener("messageerror", callback);

      return ((worker: Worker) => {
        return () => {
          worker.removeEventListener("message", callback);
          worker.removeEventListener("messageerror", callback);
        };
      })(this.worker);
    }
  }

  /**
   * 리스너를 호출합니다.
   * @param type
   */
  public dispacth(type: keyof WorkerEventMap) {
    if (this.worker) this.worker.dispatchEvent(new Event(type));
  }

  /**
   * 워커를 종료합니다. 종료된 워커객체는 재사용이 불가능합니다.
   * @returns
   */
  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      return;
    }
    throw new Error("worker is null");
  }
}
