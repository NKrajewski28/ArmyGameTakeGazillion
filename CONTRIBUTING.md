# Contributing to 3JS Military Game

Thank you for considering contributing to 3JS Military Game! This document outlines our contribution guidelines and processes.

## Development Workflow

### Branching Strategy
We follow a modified Git Flow branching model:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches (e.g., `feature/tank-movement`)
- `bugfix/*`: Bug fix branches (e.g., `bugfix/collision-detection`)
- `release/*`: Release preparation branches (e.g., `release/v1.0.0`)
- `hotfix/*`: Urgent fixes for production (e.g., `hotfix/critical-crash`)

### Branch Naming
- Use lowercase
- Use hyphens as separators
- Be descriptive but concise
- Include issue number if applicable

Examples:
- `feature/infantry-squad-ai`
- `bugfix/medic-healing-range`
- `feature/12-terrain-generator`

### Commit Messages
- Use the imperative mood ("Add feature" not "Added feature")
- First line is a summary (max 50 characters)
- Optionally followed by a blank line and detailed description
- Reference issues with #issue-number

Example:
```
Add InfantrySquad movement behavior

- Implement pathfinding for squads
- Add obstacle avoidance
- Fix collision with terrain

Closes #42
```

## Pull Requests
- Create a branch from `develop` for your changes
- Make focused, logical commits
- Update documentation if needed
- Add/update tests for your changes
- Make sure all tests pass
- Submit PR against `develop` branch

## Code Style
- Follow the established code style in the project
- Use TypeScript features appropriately
- Document public APIs
- Keep functions small and focused
- Prioritize readability and maintainability

## Testing
- Write unit tests for new functionality
- Ensure existing tests pass
- Test your changes in different scenarios
- Include performance considerations

## Asset Guidelines
- All assets must be optimized for web (low poly, compressed textures)
- Follow the naming conventions from the Simple Military pack
- Document the source of any third-party assets
- Respect asset licenses

## Communication
- Use issues for bug reports and feature requests
- Be respectful and constructive in discussions
- Ask questions if something is unclear

Thank you for contributing! 