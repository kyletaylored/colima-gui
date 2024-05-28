import { useState, useEffect, useRef } from 'react';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { getCurrent } from '@tauri-apps/api/window';

function App() {
  const [output, setOutput] = useState<string[]>([]);
  const [debug, setDebug] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unlisten = listen<string>('command-output', (event) => {
      console.log('Received event:', event.payload); // Debugging print
      setOutput((prevOutput) => [...prevOutput, event.payload]);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleClick = async (command: string, label?: string) => {
    try {
      setOutput((prevOutput) => [...prevOutput, `$ ${label || command}`]); // Add command to output
      const currentWindow = await getCurrent();
      await invoke(command, { window: currentWindow, debug });
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  const formatOutput = (line: string) => {
    if (line.toLowerCase().includes('error') || line.toLowerCase().includes('fatal')) {
      return <span className="error">{line}</span>;
    } else if (line.toLowerCase().includes('warn')) {
      return <span className="warn">{line}</span>;
    }
    return <span>{line}</span>;
  };

  return (
    <div className="App">
      <h1>Colima GUI</h1>
      <div className="container">
        <div className="inputs">
          <button onClick={() => handleClick('start_colima', 'colima start')}>Start</button>
          <button onClick={() => handleClick('stop_colima', 'colima stop')}>Stop</button>
          <button onClick={() => handleClick('restart_colima', 'colima restart')}>Restart</button>
          <button onClick={() => handleClick('status_colima', 'colima status')}>Check Status</button>
          <button onClick={() => handleClick('open_config', 'open ~/.colima/default/colima.yaml')}>Edit Config</button>
          <button onClick={() => handleClick('delete_colima', 'colima delete')}>Delete</button>
          <button onClick={() => handleClick('list_colima', 'colima list')}>List Instances</button>
          <button onClick={() => handleClick('prune_colima', 'colima prune')}>Prune Assets</button>
          <button onClick={() => handleClick('version_colima', 'colima version')}>Version</button>
          <label>
            <input
              type="checkbox"
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
            />
            Debug Mode
          </label>
        </div>
        <div className="terminal" ref={terminalRef}>
          {output.map((line, index) => (
            <div key={index}>{formatOutput(line)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
