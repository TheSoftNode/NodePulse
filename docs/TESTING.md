# NodePulse Testing Guide

## Test Suite Overview

NodePulse includes a comprehensive test suite to ensure code quality and reliability.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test validators.test.ts
```

## Test Structure

```
__tests__/
├── lib/
│   ├── utils/
│   │   ├── validators.test.ts     # URL and ObjectId validation tests
│   │   ├── formatters.test.ts     # Data formatting tests
│   │   └── status-helpers.test.ts # Node status logic tests
│   └── workers/
│       ├── HealthCheckWorker.test.ts (TODO)
│       └── AlertService.test.ts (TODO)
└── api/
    └── routes.test.ts (TODO)
```

## Coverage Targets

- **Unit Tests**: 80% coverage
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user flows

Current coverage focus:
- ✅ Utility functions (validators, formatters, status helpers)
- 🚧 Worker classes (health check, alerts)
- 🚧 API routes
- 🚧 React components

## Manual Testing

### Health Check Testing

```bash
# Add a test node
curl -X POST http://localhost:3000/api/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Helium Hotspot",
    "network": "helium",
    "endpoint": "https://api.helium.io/v1/hotspots/test-address",
    "checkInterval": 300
  }'

# Trigger manual health check
curl -X POST http://localhost:3000/api/health-check \
  -H "Content-Type: application/json" \
  -d '{"nodeId": "YOUR_NODE_ID"}'

# Get health check history
curl http://localhost:3000/api/nodes/YOUR_NODE_ID/health-checks?limit=10
```

### Cron Job Testing

```bash
# Test cron endpoint (requires CRON_SECRET in .env)
curl -X POST http://localhost:3000/api/cron/health-check \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### SSE Testing

```bash
# Connect to real-time updates
curl -N http://localhost:3000/api/sse/updates
```

## Integration Testing

### Database Testing

Tests should use a separate test database:

```bash
# Set test environment
export MONGODB_URI=mongodb://localhost:27017/nodepulse_test
export NODE_ENV=test

# Run tests
npm test
```

### API Testing with Postman/Thunder Client

Import the collection from `postman_collection.json` (TODO) to test:
- Node CRUD operations
- Health check triggers
- Alert management
- Real-time SSE streams

## Performance Testing

### Health Check Performance

Test health check execution time for multiple nodes:

```typescript
// Performance test example
const worker = new HealthCheckWorker();
const startTime = Date.now();
const results = await worker.executeScheduledChecks();
const duration = Date.now() - startTime;

console.log(`Checked ${results.length} nodes in ${duration}ms`);
// Target: < 30 seconds for 50 nodes
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage
```

## Known Issues & Limitations

1. MongoDB connection tests require a running MongoDB instance
2. External API tests (Helium, Render) may fail due to rate limiting
3. SSE tests require special handling for streaming responses

## Future Testing Improvements

- [ ] Add E2E tests with Playwright
- [ ] Add API integration tests with supertest
- [ ] Add load testing with k6
- [ ] Add component tests with React Testing Library
- [ ] Implement CI/CD pipeline with automated testing
