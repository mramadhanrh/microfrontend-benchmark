# Statistical Analysis & Figure Generation

This folder contains the Python pipeline that turns raw Lighthouse benchmark
output into the inferential statistics, LaTeX tables, and publication figures
used in the paper *"Benchmarking Core Web Vitals: A Case Study of Monolithic
vs. Module Federation Microfrontend Architectures in React."*

There are three independent scripts. All read the same benchmark data and can
be run in any order:

| Script | Purpose | Output |
| --- | --- | --- |
| [`compute_stats.py`](compute_stats.py) | Welch's t-test, Cohen's *d*, Bonferroni correction; per-hypothesis significance summary | Console report + `ttest_results.json` |
| [`gen_latex_tables.py`](gen_latex_tables.py) | Per-metric Welch t-test tables + hypothesis-validation summary table | LaTeX on stdout |
| [`generate_academic_figures.py`](generate_academic_figures.py) | Publication-quality figures (bar/box/heatmap/etc.) | `figures/*.pdf` and `figures/*.png` |

---

## 1. Setup

```bash
cd tools/benchmark-visualizer
python3 -m pip install -r requirements.txt
```

Dependencies: `numpy`, `scipy` (all scripts) and `matplotlib`
(figures script only). Python 3.9+.

---

## 2. Input data layout

Every script reads pre-aggregated Lighthouse output from `public/data/`, which
is the same directory the TypeScript visualizer app serves. The path schema is:

```
public/data/<project>/<page>/<cache>/<network>/<optimization>/summary.json
```

| Segment | Values |
| --- | --- |
| `<project>` | `monolith`, `mfe` |
| `<page>` | `home`, `login`, `dashboard` |
| `<cache>` | `cold`, `warm` |
| `<network>` | `none`, `4g`, `3g` |
| `<optimization>` | `default` (monolith), `non-optimized`, `optimized` (mfe) |

Each `summary.json` contains a `benchmarkTTestTable` object that maps each
metric key to an **array of per-iteration raw values** (the individual
Lighthouse runs — 30 for cold, 60 for warm). `null` entries are dropped before
analysis. Metrics consumed:

```
largestContentfulPaint (LCP)  firstContentfulPaint (FCP)  speedIndex (SI)
timeToInteractive (TTI)       totalBlockingTime (TBT)     cumulativeLayoutShift (CLS)
```

A scenario is skipped if any of the three required `summary.json` files
(`monolith/default`, `mfe/non-optimized`, `mfe/optimized`) is missing, or if a
metric has fewer than 2 valid samples (a t-test needs ≥2 per group).

---

## 3. Statistical method (shared by `compute_stats.py` and `gen_latex_tables.py`)

The two scripts apply identical statistics; they differ only in how they
present the result (console summary vs. LaTeX tables).

### 3.1 Comparisons

For every (page × cache × network × metric) cell, three pairwise comparisons
are computed:

1. Monolith vs. MFE Non-Optimized
2. Monolith vs. MFE Optimized
3. MFE Non-Optimized vs. MFE Optimized

Total comparisons: `3 pages × 2 caches × 3 networks × 6 metrics × 3 pairs =
324`. This `324` is the family size used for the Bonferroni correction below.

### 3.2 Welch's two-sample t-test

`scipy.stats.ttest_ind(a, b, equal_var=False)` — the **unequal-variance**
(Welch) variant, because the configurations are independent samples whose
variances are not assumed equal. The statistic is

```
t = (mean_a − mean_b) / sqrt(s_a²/n_a + s_b²/n_b)
```

with degrees of freedom from the Welch–Satterthwaite approximation (handled
internally by SciPy). All tests are two-tailed at a nominal α = 0.05.

### 3.3 Bonferroni correction

To control the family-wise error rate across the 324 simultaneous tests, the
significance threshold is adjusted:

```
α_adj = α / m = 0.05 / 324 ≈ 0.000154   (printed/rounded as 0.0002)
```

A comparison is flagged significant only when its *p*-value < α_adj. This is
the `bonf_alpha` variable in both scripts.

### 3.4 Cohen's *d* (effect size)

`cohens_d(a, b)` reports practical magnitude using the pooled standard
deviation (sample SD, `ddof=1`):

```
d   = (mean_a − mean_b) / s_pooled
s_pooled = sqrt(((n_a−1)·s_a² + (n_b−1)·s_b²) / (n_a + n_b − 2))
```

Sign convention: `cohens_d(mono, other) > 0` ⇒ `mono_mean > other_mean` ⇒ the
monolith is **slower**; `< 0` ⇒ the monolith is **faster**. `gen_latex_tables.py`
bins `|d|` into Negligible (<0.2), Small (<0.5), Medium (<0.8), Large (≥0.8).

> These four equations correspond exactly to Eq. (1)–(4) in the paper's
> Methodology → *Statistical Analysis* subsection.

---

## 4. Script reference

### 4.1 `compute_stats.py`

```bash
python3 compute_stats.py
```

Prints:
- Total pairwise tests and the Bonferroni-corrected α.
- Per-hypothesis (H1–H6, one per metric) block showing, for each of the three
  comparisons, the count of Bonferroni-significant scenarios out of 18, how
  many favored each side (by sign of *d*), and the mean `|d|`.
- A percentage-difference summary (mean and range) of Non-Opt and Opt relative
  to the monolith per metric.

Writes `ttest_results.json` containing `bonferroni_alpha`, `total_tests`, and
the full per-cell results array (means, SDs, n, and *t*/*p*/*d* for all three
comparisons) for any downstream use.

This is the script behind the narrative significance counts in the paper's
Results (e.g. "18/18 significant for Non-Optimized, 14/18 for Optimized").

### 4.2 `gen_latex_tables.py`

```bash
python3 gen_latex_tables.py > tables.tex
```

Emits LaTeX to stdout (redirect to a file or paste into the paper):
- One `table` per metric: every scenario row with the Mono-vs-Non-Opt and
  Mono-vs-Opt comparison, showing *t*, *p* (formatted `<0.0001` when tiny),
  Cohen's *d*, the effect-size label, and a Yes/No Bonferroni significance flag.
  Tables are wrapped in `\resizebox{\textwidth}{!}{...}` to fit the column.
- A compact **hypothesis-validation summary** table (`tab:hypothesis-summary`)
  with significant-scenario counts and a hand-authored key finding/verdict per
  hypothesis.

> Note: the per-hypothesis "Key Finding"/"Verdict" strings in the summary table
> are curated prose, not computed — review them if the underlying data changes.

Requires only `numpy`/`scipy` (no matplotlib).

### 4.3 `generate_academic_figures.py`

```bash
python3 generate_academic_figures.py
```

Writes PDF + PNG figures to `figures/` (grouped bars, box plots, percentage-
difference heatmap, network-degradation lines, cold-vs-warm comparison, radar,
and a t-test table figure). Uses the non-interactive `Agg` matplotlib backend,
so it runs headless. Reads the same `public/data/` layout via its own
`BASE_DATA` constant.

---

## 5. Reproducing the paper's numbers

```bash
cd tools/benchmark-visualizer
python3 -m pip install -r requirements.txt
python3 compute_stats.py            # significance counts + ttest_results.json
python3 gen_latex_tables.py > tables.tex   # LaTeX tables for the paper
python3 generate_academic_figures.py       # figures/*.pdf, figures/*.png
```

With the committed dataset this yields `total_tests = 324` and
`bonferroni_alpha ≈ 0.000154`, matching the paper's reported `m = 324` and
`α_adj ≈ 0.0002`.
