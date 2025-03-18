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

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.result = error;
      this.reject.call(this, error)
    }

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
    this.onFinally();
  }

  private reject(reason: PromiseResult) {
    if (this.state !== 'pending') {
      return
    }

    this.state = 'rejected';
    this.result = reason;
    this.onRejected();
    this.onFinally();
  }

  private onFullfilled() {
    setTimeout(() => {
      this.successCallbacks.forEach((cb) => {
        if (cb) {
          cb(this.result)
        }
      })
    })
  }

  private onRejected() {
    setTimeout(() => {
      this.errorCallbacks.forEach((cb) => {
        if (typeof cb === 'function') {
          cb(this.result)
        }
      })
    })
  }

  private onFinally() {
    setTimeout(() => {
      this.finallyCallbacks.forEach((cb) => {
        if (typeof cb === "function") {
          cb()
        }
      })
    })

  }

  then(onFullfilled?: (value: any) => void, onRejected?: (value: any) => void) {

    if (this.state === 'fulfilled' && onFullfilled) {
      setTimeout(() => {
        onFullfilled(this.result)
      })

      return this;
    }
    else if (this.state === 'rejected' && onRejected) {
      setTimeout(() => {
        onRejected(this.result)
      })
      return this;
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
    if (this.state !== 'pending' && onFinally) {
      onFinally()
      return
    }
    else {
      this.addFinallyCallback(onFinally)
      return this;
    }

  }

}

const promise = new MyPromise((resolve, reject) => {
  reject("error")
});

setTimeout(() => {
  promise.then(undefined, () => { console.log("error") }).finally(() => console.log("onFinally"))
}, 1000)
