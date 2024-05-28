#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Stdio;
use tauri::{command, Manager};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

#[command]
async fn start_colima(window: tauri::Window, debug: bool) -> Result<(), String> {
    stream_command_output(window, "colima start", debug).await
}

#[command]
async fn stop_colima(window: tauri::Window, debug: bool) -> Result<(), String> {
    stream_command_output(window, "colima stop", debug).await
}

#[command]
async fn restart_colima(window: tauri::Window, debug: bool) -> Result<(), String> {
    stream_command_output(window, "colima restart", debug).await
}

#[command]
async fn status_colima(window: tauri::Window, debug: bool) -> Result<(), String> {
    stream_command_output(window, "colima status", debug).await
}

#[command]
fn open_config() -> Result<String, String> {
    let config_path = dirs::home_dir()
        .ok_or("Cannot find home directory")?
        .join(".colima/default/colima.yaml");

    if config_path.exists() {
        std::process::Command::new("open")
            .arg(config_path)
            .output()
            .map_err(|e| e.to_string())?;
        Ok("Opening configuration file".into())
    } else {
        Err("Configuration file not found".into())
    }
}

async fn stream_command_output(window: tauri::Window, command: &str, debug: bool) -> Result<(), String> {
    let mut cmd = Command::new("sh")
        .arg("-c")
        .arg(command)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = cmd.stdout.take().ok_or("Failed to capture stdout")?;
    let stderr = cmd.stderr.take().ok_or("Failed to capture stderr")?;
    let mut reader = BufReader::new(stdout).lines();
    let mut err_reader = BufReader::new(stderr).lines();

    let window_clone = window.clone();
    tokio::spawn(async move {
        while let Some(line) = reader.next_line().await.unwrap_or(None) {
            if debug || (!debug && !line.contains("[debug]") && !line.contains("[info]")) {
                window_clone.emit("command-output", line).unwrap();
            }
        }
    });

    tokio::spawn(async move {
        while let Some(line) = err_reader.next_line().await.unwrap_or(None) {
            if debug || (!debug && !line.contains("[debug]") && !line.contains("[info]")) {
                window.emit("command-output", line).unwrap();
            }
        }
    });

    let status = cmd.wait().await.map_err(|e| e.to_string())?;
    if status.success() {
        Ok(())
    } else {
        Err("Command failed".into())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_colima,
            stop_colima,
            restart_colima,
            status_colima,
            open_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
