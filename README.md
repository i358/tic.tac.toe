# Tic Tac Toe Game

**Status:** 🚧 Work in Progress  

## Overview  
This project is a Tic Tac Toe game built with a modern and scalable tech stack. The primary goal is to create an engaging and performant game with a robust backend and a smooth frontend user experience.  

Currently, the project is in its early stages of development, and features are subject to change as progress continues.  

## Features (Planned and In Progress)  
- ✅ Basic game logic for Tic Tac Toe  
- 🛠️ Interactive React.js-based frontend built with Vite  
- 🕐 WebSocket communication powered by Elixir's Phoenix Framework  
- 🕐 API development using Rust  
- 🕐 Database integration with Redis and PostgreSQL  

## Getting Started  

### Prerequisites  
- Node.js and npm installed  
- Elixir and Phoenix Framework setup  
- Rust installed  
- PostgreSQL and Redis installed and configured  

### Installation  
```bash  
# Clone the repository
git clone https://github.com/yourusername/tic-tac-toe.git  

# Navigate to the project directory
cd tic-tac-toe  

# Install frontend dependencies
npm install

# Build the Rust API
cd ../api
cargo build
```

## Usage  

```bash  
# Run the React frontend
npm run dev

# Start the Phoenix WebSocket server
cd src/wss
mix server

# Start the Rust API server
cd ../api
cargo run
```

## Contribution  
As this is an ongoing project, contributions are welcome! Feel free to fork the repository, open issues, or submit pull requests.  

## Roadmap  
- Implement real-time game updates using Phoenix channels  
- Integrate Redis for caching and real-time data management  
- Develop advanced AI for single-player mode  
- Add user authentication and game history tracking with PostgreSQL  

## License  
MIT License.
