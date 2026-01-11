# Lighthouse CI Setup Summary

## 📁 Files Created/Modified

### 1. `index.ts`

Main script that runs Lighthouse CI using Bun runtime. It spawns the lhci process and handles output.

### 2. `lighthouserc.json`

Configuration file for Lighthouse CI with:

- URL to test: https://google.com
- 3 runs per test (for averaging results)
- Desktop preset
- Performance thresholds (80%+ required, others are warnings)
- Uploads results to temporary public storage

### 3. `package.json`

Updated with:

- `@lhci/cli` dependency (v0.13.0)
- `lighthouse` and `lighthouse:ci` scripts

### 4. `run.sh`

Quick run script for testing with different presets (mobile/desktop)

### 5. `.gitignore`

Added Lighthouse CI output directories

### 6. `README.md`

Comprehensive documentation with usage examples

## 🚀 Usage

### Basic Usage

```bash
cd tools/web-vitals-benchmark
bun run lighthouse
```

### Alternative

```bash
bun run lighthouse:ci
```

### Quick Test with Presets

```bash
# Desktop (default)
./run.sh desktop

# Mobile
./run.sh mobile
```

## ⚙️ Configuration Options

Edit `lighthouserc.json` to customize:

### Change URLs

```json
"url": ["https://google.com", "https://example.com"]
```

### Change Device Preset

```json
"preset": "mobile"  // or "desktop"
```

### Adjust Number of Runs

```json
"numberOfRuns": 5
```

### Modify Performance Thresholds

```json
"assertions": {
  "categories:performance": ["error", { "minScore": 0.9 }],
  "categories:accessibility": ["warn", { "minScore": 0.8 }]
}
```

## 📊 Output

Lighthouse CI generates:

1. **Console Output**: Summary scores for each category
2. **HTML Reports**: Detailed reports in `.lighthouseci/` directory
3. **Public Links**: Temporary URLs to view results online

### Metrics Collected

- **Performance**: LCP, FID, CLS, TTI, Speed Index, TBT
- **Accessibility**: ARIA, color contrast, labels, semantics
- **Best Practices**: HTTPS, console errors, deprecated APIs, security
- **SEO**: Meta tags, mobile-friendly, structured data, crawlability

## 🔧 Advanced Features

### CI/CD Integration

Add to GitHub Actions:

```yaml
- name: Lighthouse CI
  run: |
    cd tools/web-vitals-benchmark
    bun install
    bun run lighthouse:ci
```

### Custom Chrome Flags

```json
"chromeFlags": "--no-sandbox --disable-dev-shm-usage --headless"
```

### Budget Assertions

```json
"assertions": {
  "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
  "interactive": ["error", { "maxNumericValue": 5000 }]
}
```

## 🎯 Example Output

```
✅ .lighthouseci/
  └── google_com/
      ├── lhr-1234567890.html
      ├── lhr-1234567891.html
      └── lhr-1234567892.html

Scores:
  Performance: 95
  Accessibility: 98
  Best Practices: 100
  SEO: 100
```

## 📝 Notes

- Chrome/Chromium must be installed on the system
- First run may take longer as Lighthouse downloads necessary resources
- Results are averaged across multiple runs for accuracy
- Desktop preset typically yields higher performance scores than mobile
