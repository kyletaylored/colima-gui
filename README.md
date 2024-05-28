# Colima GUI

Colima GUI is a desktop application for managing Colima, a tool that provides container runtimes on macOS with minimal setup. This application offers a graphical user interface for starting, stopping, restarting, and managing Colima instances.

## Features

- Start, stop, and restart Colima instances
- Check the status of Colima
- Delete and prune Colima instances
- List Colima instances
- Edit Colima configuration
- View Colima version

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- [Tauri CLI](https://tauri.studio/en/docs/getting-started/intro#setting-up-your-environment)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/colima-gui.git
   cd colima-gui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application in development mode:

   ```bash
   npm run tauri dev
   ```

4. Build the application for production:

   ```bash
   npm run tauri build
   ```

## Usage

Once the application is running, you can use the provided buttons to manage your Colima instances. The terminal output will display the results of the commands executed.

## GitHub Actions Workflow

This project includes a GitHub Actions workflow that builds and releases the application when a new tag is pushed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or issues, please open an issue in this repository.

### Explanation

- **Features**: Lists the main functionalities of the application.
- **Installation**: Provides instructions for setting up the development environment, including prerequisites, installation steps, and commands to run and build the application.
- **Usage**: Describes how to use the application.
- **GitHub Actions Workflow**: Explains how to trigger the GitHub Actions workflow for building and releasing the application.
- **Contributing**: Provides guidelines for contributing to the project.
- **License**: States the project's license.
- **Contact**: Instructs users to open issues for questions or problems.

Feel free to customize this README to better fit your project's needs.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
