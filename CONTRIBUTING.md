# SkillBridge Backend - Contributing Guide

## Code Style Guidelines

### Commit Message Format
- Use lowercase for commit messages
- Be descriptive but concise
- Examples:
  - `add user authentication`
  - `fix booking validation`
  - `update schema for ratings`

### Code Structure
- Use TypeScript for type safety
- Follow ESM module syntax
- Place business logic in service files
- Keep controllers thin - delegate to services
- Use Prisma for all database operations

### File Naming
- Use kebab-case for files: `user-service.ts`
- Use PascalCase for classes: `UserService`
- Use camelCase for functions: `getUserById`

### API Response Format
All API responses should follow this structure:
```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  error?: string
}
```

### Error Handling
- Always use try-catch blocks in controllers
- Return appropriate HTTP status codes
- Provide meaningful error messages

## Development Workflow

1. Create a new branch for your feature
2. Make small, atomic commits
3. Write descriptive commit messages
4. Test your changes locally
5. Push and create a pull request

## Testing
- Test all API endpoints manually
- Verify database migrations work correctly
- Check error scenarios

## Database Migrations
```bash
# Create a new migration
pnpm prisma migrate dev --name descriptive_name

# Apply migrations
pnpm prisma migrate deploy
```

## Questions?
Contact the development team for any questions or clarifications.
