import { useState, useEffect } from 'react';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

function App() {
  const [output, setOutput] = useState<string[]>([]);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const unlisten = listen<string>('command-output', (event) => {
      console.log('Received event:', event.payload); // Debugging print
      setOutput((prevOutput) => [...prevOutput, event.payload]);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const handleClick = async (command: string, label?: string) => {
    try {
      setOutput((prevOutput) => [...prevOutput, `$ ${label || command}`]); // Add command to output
      await invoke(command, { window: window.__TAURI__.window.getCurrent(), debug });
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const formatOutput = (line: string) => {
    console.log(line);
    if (line.toLowerCase().includes('error') || line.toLowerCase().includes('fatal')) {
      return <span className="error">{line}</span>;
    } else if (line.toLowerCase().includes('warn')) {
      return <span className="warn">{line}</span>;
    }
    return <span>{line}</span>;
  };

  return (
    <div className="App">
      <h1>Colima Desktop GUI</h1>
      <button onClick={() => handleClick('start_colima', 'colima start')}>Start Colima</button>
      <button onClick={() => handleClick('stop_colima', 'colima stop')}>Stop Colima</button>
      <button onClick={() => handleClick('restart_colima', 'colima restart')}>Restart Colima</button>
      <button onClick={() => handleClick('status_colima', 'colima status')}>Check Colima Status</button>
      <button onClick={() => handleClick('open_config', 'open ~/.colima/default/colima.yaml')}>Edit Colima Configuration</button>
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
          <div key={index}>{formatOutput(line)}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
