import { makeObservable, observable } from "mobx";
import { action } from "mobx";

const STORADE_KEY = 'CC_SESSION_ID';

const storageManager = new (class {
  getSessionId(): string {
    return localStorage.getItem(STORADE_KEY) || '';
  }
  setSessionId(sessionId = '') {
    if (sessionId) {
      localStorage.setItem(STORADE_KEY, sessionId);
    } else {
      localStorage.removeItem(STORADE_KEY);
    }
  }
})();

export class SessionService {

  sessionId = storageManager.getSessionId();

  constructor() {
    makeObservable(this, {
      sessionId: observable,
      setSessionId: action.bound,
    });
  }

  dispose(): void {
    storageManager.setSessionId('');
    this.sessionId = '';
  }

  setSessionId(sessionId: string, keep = false): void {
    if (keep) {
      storageManager.setSessionId(sessionId);
    }
    this.sessionId = sessionId;
  }
};

export default SessionService;
