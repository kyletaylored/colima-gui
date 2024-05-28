import React, { useState, useEffect } from 'react';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import Ansi from 'ansi-to-react';

function App() {
  const [output, setOutput] = useState<string[]>([]);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const unlisten = listen<string>('command-output', (event) => {
      setOutput((prevOutput) => [...prevOutput, event.payload]);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const handleClick = async (command: string) => {
    try {
      await invoke(command, { window: window.__TAURI__.window.getCurrent(), debug });
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  return (
    <div className="App">
      <h1>Colima Desktop GUI</h1>
      <button onClick={() => handleClick('start_colima')}>Start Colima</button>
      <button onClick={() => handleClick('stop_colima')}>Stop Colima</button>
      <button onClick={() => handleClick('restart_colima')}>Restart Colima</button>
      <button onClick={() => handleClick('status_colima')}>View Colima Configuration</button>
      <button onClick={() => handleClick('open_config')}>Edit Colima Configuration</button>
      <button onClick={() => handleClick('status_colima')}>Check Colima Status</button>
      <label>
        <input
          type="checkbox"
          checked={debug}
          onChange={(e) => setDebug(e.target.checked)}
        />
        Debug Mode
      </label>

      <div className="terminal">
        {output.map((line, index) => (
          <Ansi key={index}>{line}</Ansi>
        ))}
      </div>
    </div>
  );
}

export default App;
