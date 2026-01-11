# web-vitals-benchmark

A Lighthouse CI-based tool for benchmarking web vitals and performance metrics.

## Prerequisites

- [Bun](https://bun.sh) runtime installed
- Chrome/Chromium browser (required for Lighthouse)

## Installation

Install dependencies:

```bash
bun install
```

## Usage

### Run Lighthouse CI Benchmark

Test the configured URLs (default: https://google.com):

```bash
bun run lighthouse
```

Or use the npm script:

```bash
bun run lighthouse:ci
```

### Test Local Applications

To test your local applications (monolith or microfrontend apps):

```bash
bun run lighthouse:local
```

This uses `lighthouserc.local.json` which tests:
- http://localhost:3000
- http://localhost:3001
- http://localhost:3002

Make sure your apps are running before executing this command!

### Configuration

Edit `lighthouserc.json` to customize:

- **URLs to test**: Modify the `collect.url` array
- **Number of runs**: Change `collect.numberOfRuns` (default: 3)
- **Device preset**: Switch between `desktop` and `mobile` in `collect.settings.preset`
- **Performance thresholds**: Adjust `assert.assertions` scores

Example configuration:

```json
{
  "ci": {
    "collect": {
      "url": ["https://google.com", "https://example.com"],
      "numberOfRuns": 5,
      "settings": {
        "preset": "mobile"
      }
    }
  }
}
```

### Output

Lighthouse CI will generate:

- Console summary with scores for each category
- Detailed HTML reports in `.lighthouseci/` directory
- Temporary public storage links (if configured)

## Metrics Tracked

- **Performance**: LCP, FID, CLS, TTI, Speed Index
- **Accessibility**: ARIA, color contrast, labels
- **Best Practices**: HTTPS, console errors, deprecated APIs
- **SEO**: Meta tags, mobile-friendly, structured data

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Lighthouse CI
  run: |
    cd tools/web-vitals-benchmark
    bun install
    bun run lighthouse:ci
```

## Project Info

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
