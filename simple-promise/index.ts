type PromiseState = 'pending' | 'fulfilled' | 'rejected';
type PromiseResult = any;
type SuccessCallbackFn = (result: PromiseResult) => void;
type ErrorCallbackFn = (reason: PromiseResult) => void;
type FinallyCallbackFn = () => void;
type Executor = (resolve: (value: any) => void, reject: (value: any) => void) => void;

class MyPromise {

  private _state: PromiseState = 'pending';
  private _result: PromiseResult = undefined;

  private _successCallbacks: SuccessCallbackFn[] = [];
  private _errorCallbacks: ErrorCallbackFn[] = [];
  private _finallyCallbacks: FinallyCallbackFn[] = [];

  constructor(executor: Executor) {
    if (typeof executor !== 'function') {
      throw new Error('Executor should be a function!');
    }

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  set state(newState: PromiseState) {
    this._state = newState;
  }

  set result(newResult: PromiseResult) {
    this._result = newResult;
  }

  get state() {
    return this._state;
  }

  get result() {
    return this._result;
  }

  addSuccessCallback(cb: SuccessCallbackFn) {
    if (cb) {
      this._successCallbacks.push(cb)
    }

  }

  addErrorCallback(cb: ErrorCallbackFn) {
    if (cb) {
      this._errorCallbacks.push(cb)
    }

  }

  addFinallyCallback(cb: FinallyCallbackFn) {
    if (cb) {
      this._finallyCallbacks.push(cb)
    }

  }

  get successCallbacks() {
    return this._successCallbacks
  }

  get errorCallbacks() {
    return this._errorCallbacks
  }

  get finallyCallbacks() {
    return this._finallyCallbacks
  }

  private resolve(result: PromiseResult) {
    if (this.state !== 'pending') {
      return
    }

    this.state = 'fulfilled';
    this.result = result;
    this.onFullfilled();
  }

  private reject(reason: PromiseResult) {
    if (this.state !== 'pending') {
      return
    }

    this.state = 'rejected';
    this.result = reason;
    this.onRejected()
  }

  private onFullfilled(cb?: SuccessCallbackFn) {
    setTimeout(() => {

      if (cb) {
        cb(this.result)
      } else {
        this.successCallbacks.forEach((cb) => {
          if (cb) {
            cb(this.result)
          }
        })
        this.onFinally();
      }
    })
  }

  private onRejected(cb?: ErrorCallbackFn) {
    setTimeout(() => {
      if (cb) {
        cb(this.result)
      }
      else {
        this.errorCallbacks.forEach((cb) => {
          if (typeof cb === 'function') {
            cb(this.result)
          }
        })
        this.onFinally();
      }
    })
  }

  private onFinally() {
    this.finallyCallbacks.forEach((cb) => {
      if (typeof cb === "function") {
        cb()
      }
    })
  }

  then(onFullfilled?: (value: any) => void, onRejected?: (value: any) => void) {
    if (this.state === "fulfilled" && onFullfilled) {
      this.onFullfilled(onFullfilled)
    }

    else if (this.state === "rejected" && onRejected) {
      this.onRejected(onRejected)
    }
    else {
      this.addSuccessCallback(onFullfilled);
      this.addErrorCallback(onRejected);
    }

    return this;
  }

  catch(onRejected: (reason: any) => void) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally?: () => void) {
    this.addFinallyCallback(onFinally)
    return this;
  }

}

const promise = new MyPromise((resolve) => {
  setTimeout(() => resolve("Done!"), 500);
});

setTimeout(() => {
  console.log('timeout')
  promise.then((value) => console.log("First then:", value)).finally(() => {console.log("Funally!")});
  promise.then((value) => console.log("Second then:", value));
}, 2000);