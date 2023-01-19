import { ChangeEvent, StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { atom } from '@atom/core';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const val$ = atom('');
const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
  val$.set(e.target.value);

const App = () => (
  <div>
    <input value={val$} onChange={handleChange} />
    <span>Value: {val$}</span>
  </div>
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
