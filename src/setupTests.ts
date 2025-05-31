// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];

  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Mock localStorage
const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
};

// Mock sessionStorage
const mockSessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock URL.createObjectURL
global.URL.createObjectURL = () => 'mocked-url';

// Mock URL.revokeObjectURL
global.URL.revokeObjectURL = () => {};

// Mock FileReader
global.FileReader = class FileReader {
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  readAsDataURL = () => {};
  readAsText = () => {};
  readAsArrayBuffer = () => {};
  result = null;
  error = null;
  onload = null;
  onerror = null;
  onabort = null;
  onloadstart = null;
  onloadend = null;
  onprogress = null;
  readyState = 0;
  EMPTY = 0;
  LOADING = 1;
  DONE = 2;
  abort = () => {};
  addEventListener = () => {};
  removeEventListener = () => {};
  dispatchEvent = () => {};
};

// Mock fetch
global.fetch = () => Promise.resolve({
  ok: true,
  status: 200,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
  blob: () => Promise.resolve(new Blob()),
});

// Mock XMLHttpRequest
global.XMLHttpRequest = class XMLHttpRequest {
  static readonly UNSENT = 0;
  static readonly OPENED = 1;
  static readonly HEADERS_RECEIVED = 2;
  static readonly LOADING = 3;
  static readonly DONE = 4;

  open = () => {};
  send = () => {};
  setRequestHeader = () => {};
  abort = () => {};
  getAllResponseHeaders = () => '';
  getResponseHeader = () => null;
  overrideMimeType = () => {};
  addEventListener = () => {};
  removeEventListener = () => {};
  dispatchEvent = () => {};
  readyState = 0;
  response = null;
  responseText = '';
  responseType = '';
  responseURL = '';
  responseXML = null;
  status = 0;
  statusText = '';
  timeout = 0;
  upload = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  };
  withCredentials = false;
  onreadystatechange = null;
  ontimeout = null;
  onload = null;
  onerror = null;
  onabort = null;
  onloadstart = () => {};
  onloadend = () => {};
  onprogress = () => {};
  UNSENT = 0;
  OPENED = 1;
  HEADERS_RECEIVED = 2;
  LOADING = 3;
  DONE = 4;
};

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
  writable: true,
});

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillUpdate'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test utilities
export const createMockFile = (name: string, size: number, type: string): File => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

export const createMockEvent = (type: string, properties: any = {}): Event => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, properties);
  return event;
};

export const waitForNextTick = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock environment variables
process.env.REACT_APP_API_URL = 'http://localhost:3001';
process.env.NODE_ENV = 'test'; 