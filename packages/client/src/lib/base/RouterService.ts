import { makeObservable } from "mobx";
import { observable, computed, action } from "mobx";

import { Action, Blocker, Listener, State, To, Location, BrowserHistory } from "history";

import { createBrowserHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";

const browserHistory = createBrowserHistory();

export class RouterService implements BrowserHistory {

  routerHistory = createObservableHistory(browserHistory);

  get location(): Location {
    return this.routerHistory.location;
  }

  get action(): Action {
    return this.routerHistory.action;
  }

  constructor() {
    makeObservable(this, {
      routerHistory: observable,
      location: computed,
      action: computed,
      createHref: action.bound,
      push: action.bound,
      replace: action.bound,
      go: action.bound,
      back: action.bound,
      forward: action.bound,
      listen: action.bound,
      block: action.bound,
    });
  }

  createHref(to: To) {
    return this.routerHistory.createHref(to);
  }

  push(to: To, state?: State) {
    return this.routerHistory.push(to, state);
  }

  replace(to: To, state?: State) {
    return this.routerHistory.replace(to, state);
  }

  go(delta: number) {
    return this.routerHistory.go(delta);
  }

  back() {
    return this.routerHistory.back();
  }

  forward() {
    return this.routerHistory.forward();
  }

  listen(listener: Listener) {
    return this.routerHistory.listen(listener);
  }

  block(blocker: Blocker) {
    return this.routerHistory.block(blocker);
  }
};

export default RouterService;
