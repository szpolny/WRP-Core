*⚠️ This project is Work in progress. There is no release yet. Feel free to contribute and request features.*

# WRP Framework - RedM Roleplay Framework

## Overview

The WRP Framework is a roleplay framework designed for RedM, the multiplayer modification framework for Red Dead Redemption 2. This project provides a robust foundation for creating immersive roleplay experiences in the Red Dead Redemption 2 world. It main goal is to popularize using Typescript for RedM and to make customizable experience for all.

## Features

- **Server and Client Bundling**: Uses `esbuild` for efficient bundling of server and client scripts.
- **Prisma Integration**: Utilizes Prisma for database management.
- **Biome Linting and Formatting**: Ensures code quality and consistency with Biome.
- **TypeScript Support**: Written in TypeScript for type safety and modern JavaScript features.

## Development

### Prerequisites

- Node.js
- pnpm (Package Manager)
- Docker (optional, for quick database setup) or Postgres Database
- [FiveM Builders (customized by Z3rio) installed on your server](https://github.com/Z3rio/fivem-builders)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/szpolny/WRP-Core.git
   cd WRP-Core
   ```

2. Install dependencies
   ```sh
   pnpm install
   ```

3. Set up environment variables: Create a .env file in the root directory (based on .env.example) and add necessary environment variables.

### Building the project
To build the project, run:
```sh
pnpm run build
```
This will bundle the server and client scripts into the build/ directory. And the resource whole folder is ready to use on server.

### Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

### License 
This project is licensed under the MIT License.