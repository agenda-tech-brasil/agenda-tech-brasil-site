# API Documentation

## Overview

This directory contains the API endpoint implementation and documentation for the Agenda Tech Brasil events API.

## API Endpoints

### GET `/api/events`

Returns a list of tech events with optional filtering.

**Query Parameters:**
- `year` (string): Filter events by year
- `location` (string): Filter events by city (partial match)
- `type` (string): Filter by event type (`presencial`, `online`, `híbrido`)
- `month` (string): Filter by month (in Portuguese)
- `startDate` (string): Filter events after this date (ISO 8601 format)
- `endDate` (string): Filter events before this date (ISO 8601 format)

**Example:**
```bash
curl "http://localhost:3000/api/events?type=online&year=2026"
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 5
}
```

## Documentation

Interactive API documentation is available at:
- **Development:** http://localhost:3000/api/docs
- **Production:** https://agenda-tech-brasil.js.org/agenda-tech-brasil-site/api/docs

The documentation page offers two views:
1. **Swagger UI** - Standard OpenAPI documentation interface
2. **Scalar** - Modern, clean API documentation interface

## GitHub Pages Compatibility

**Important Note:** Since this site is deployed to GitHub Pages (static hosting), the API route (`/api/events`) will **only work in development mode**. 

For production use on GitHub Pages, consider:
1. Using the API endpoint during local development and testing
2. The OpenAPI specification (`/openapi.json`) and documentation page (`/api/docs`) will work on GitHub Pages as static files
3. For a production API, deploy the API routes to a serverless platform like Vercel, Netlify, or AWS Lambda

## OpenAPI Specification

The OpenAPI 3.0 specification is available at `/openapi.json` and can be used with any OpenAPI-compatible tools.

## Development

The API endpoint uses existing utilities from the codebase:
- `fetchEvents()` - Fetches events from the GitHub repository
- `applyEventFilters()` - Applies filters to the event list

## Testing

Test the API locally:

```bash
# Start development server
npm run dev

# Test basic endpoint
curl http://localhost:3000/api/events

# Test with filters
curl "http://localhost:3000/api/events?type=online"
curl "http://localhost:3000/api/events?year=2026&location=São Paulo"
```
