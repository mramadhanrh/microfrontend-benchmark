#!/usr/bin/env python3
"""
Compute inferential statistics for the Microfrontend vs Monolith benchmark.

Runs Welch's independent two-sample t-test (unequal variances) for every
metric across every scenario, computes Cohen's d effect sizes, applies a
Bonferroni correction for the full family of pairwise comparisons, and prints
a per-hypothesis significance/effect summary. The full per-test results are
also written to ttest_results.json for downstream use.

Usage:  python3 compute_stats.py
Input:  tools/benchmark-visualizer/public/data/<project>/<page>/<cache>/<network>/<optimization>/summary.json
Output: console summary + tools/benchmark-visualizer/ttest_results.json
"""
import json
import pathlib
from scipy import stats
import numpy as np

# ── Configuration ──────────────────────────────────────────────────────────
BASE_DATA = pathlib.Path(__file__).parent / "public" / "data"
OUT_FILE = pathlib.Path(__file__).parent / "ttest_results.json"

pages = ['home', 'login', 'dashboard']
caches = ['cold', 'warm']
networks = ['none', '4g', '3g']
metrics_order = ['largestContentfulPaint', 'firstContentfulPaint', 'speedIndex',
                 'timeToInteractive', 'totalBlockingTime', 'cumulativeLayoutShift']
metric_labels = {
    'largestContentfulPaint': 'LCP', 'firstContentfulPaint': 'FCP',
    'speedIndex': 'SI', 'timeToInteractive': 'TTI',
    'totalBlockingTime': 'TBT', 'cumulativeLayoutShift': 'CLS',
}


def load_ttest_data(path):
    with open(path) as f:
        return json.load(f).get('benchmarkTTestTable', {})


def cohens_d(a, b):
    """Cohen's d with pooled standard deviation (sample SD, ddof=1)."""
    na, nb = len(a), len(b)
    s1, s2 = np.std(a, ddof=1), np.std(b, ddof=1)
    pooled = np.sqrt(((na - 1) * s1 ** 2 + (nb - 1) * s2 ** 2) / (na + nb - 2))
    if pooled == 0:
        return 0.0
    return (np.mean(a) - np.mean(b)) / pooled


all_results = []
total_tests = 0

for page in pages:
    for cache in caches:
        for network in networks:
            mono_path = BASE_DATA / 'monolith' / page / cache / network / 'default' / 'summary.json'
            nonopt_path = BASE_DATA / 'mfe' / page / cache / network / 'non-optimized' / 'summary.json'
            opt_path = BASE_DATA / 'mfe' / page / cache / network / 'optimized' / 'summary.json'
            if not all(p.exists() for p in [mono_path, nonopt_path, opt_path]):
                continue
            mono_data = load_ttest_data(mono_path)
            nonopt_data = load_ttest_data(nonopt_path)
            opt_data = load_ttest_data(opt_path)
            for metric in metrics_order:
                mono_arr = np.array([x for x in mono_data.get(metric, []) if x is not None], dtype=float)
                nonopt_arr = np.array([x for x in nonopt_data.get(metric, []) if x is not None], dtype=float)
                opt_arr = np.array([x for x in opt_data.get(metric, []) if x is not None], dtype=float)
                if len(mono_arr) < 2 or len(nonopt_arr) < 2 or len(opt_arr) < 2:
                    continue
                # Welch's t-test (unequal variances) for the three pairwise comparisons
                t1, p1 = stats.ttest_ind(mono_arr, nonopt_arr, equal_var=False)
                d1 = cohens_d(mono_arr, nonopt_arr)
                t2, p2 = stats.ttest_ind(mono_arr, opt_arr, equal_var=False)
                d2 = cohens_d(mono_arr, opt_arr)
                t3, p3 = stats.ttest_ind(nonopt_arr, opt_arr, equal_var=False)
                d3 = cohens_d(nonopt_arr, opt_arr)
                total_tests += 3
                all_results.append({
                    'page': page, 'cache': cache, 'network': network, 'metric': metric,
                    'mono_mean': np.mean(mono_arr), 'mono_std': np.std(mono_arr, ddof=1),
                    'nonopt_mean': np.mean(nonopt_arr), 'nonopt_std': np.std(nonopt_arr, ddof=1),
                    'opt_mean': np.mean(opt_arr), 'opt_std': np.std(opt_arr, ddof=1),
                    'n_mono': len(mono_arr), 'n_nonopt': len(nonopt_arr), 'n_opt': len(opt_arr),
                    'mono_nonopt_t': t1, 'mono_nonopt_p': p1, 'mono_nonopt_d': d1,
                    'mono_opt_t': t2, 'mono_opt_p': p2, 'mono_opt_d': d2,
                    'nonopt_opt_t': t3, 'nonopt_opt_p': p3, 'nonopt_opt_d': d3,
                })

if total_tests == 0:
    raise SystemExit(
        f"No benchmark data found under {BASE_DATA}. "
        "Run the benchmark suite first so that summary.json files exist."
    )

# Bonferroni correction across the full family of pairwise comparisons
bonf = total_tests
bonf_alpha = 0.05 / bonf
print(f"Total pairwise tests: {total_tests}")
print(f"Bonferroni-corrected alpha: {bonf_alpha:.6f}")
print()

hyp_metrics = {
    'H1': 'largestContentfulPaint', 'H2': 'firstContentfulPaint',
    'H3': 'speedIndex', 'H4': 'timeToInteractive',
    'H5': 'totalBlockingTime', 'H6': 'cumulativeLayoutShift',
}

for hyp, metric in hyp_metrics.items():
    subset = [r for r in all_results if r['metric'] == metric]
    total = len(subset)
    sig_mn = sum(1 for r in subset if r['mono_nonopt_p'] < bonf_alpha)
    sig_mo = sum(1 for r in subset if r['mono_opt_p'] < bonf_alpha)
    sig_no = sum(1 for r in subset if r['nonopt_opt_p'] < bonf_alpha)
    # d>0 means cohens_d(mono, other) > 0 => mono_mean > other_mean => mono is slower
    # d<0 means mono_mean < other_mean => mono is faster
    mono_faster_nonopt = sum(1 for r in subset if r['mono_nonopt_d'] > 0 and r['mono_nonopt_p'] < bonf_alpha)
    mono_slower_nonopt = sum(1 for r in subset if r['mono_nonopt_d'] < 0 and r['mono_nonopt_p'] < bonf_alpha)
    mono_faster_opt = sum(1 for r in subset if r['mono_opt_d'] > 0 and r['mono_opt_p'] < bonf_alpha)
    mono_slower_opt = sum(1 for r in subset if r['mono_opt_d'] < 0 and r['mono_opt_p'] < bonf_alpha)
    avg_d_mn = np.mean([abs(r['mono_nonopt_d']) for r in subset])
    avg_d_mo = np.mean([abs(r['mono_opt_d']) for r in subset])
    print(f"=== {hyp}: {metric_labels[metric]} ===")
    print(f"  Mono vs Non-Opt: {sig_mn}/{total} sig (Bonf)")
    print(f"    Mono faster(d>0): {mono_faster_nonopt}, Mono slower(d<0): {mono_slower_nonopt}, Mean|d|: {avg_d_mn:.2f}")
    print(f"  Mono vs Opt:    {sig_mo}/{total} sig (Bonf)")
    print(f"    Mono faster(d>0): {mono_faster_opt}, Mono slower(d<0): {mono_slower_opt}, Mean|d|: {avg_d_mo:.2f}")
    print(f"  Non-Opt vs Opt: {sig_no}/{total} sig (Bonf)")
    print()

print("=== PERCENTAGE DIFFERENCES (positive = other is slower than monolith) ===")
for metric in metrics_order:
    subset = [r for r in all_results if r['metric'] == metric]
    pct_nonopt = [(r['nonopt_mean'] - r['mono_mean']) / r['mono_mean'] * 100 for r in subset if r['mono_mean'] != 0]
    pct_opt = [(r['opt_mean'] - r['mono_mean']) / r['mono_mean'] * 100 for r in subset if r['mono_mean'] != 0]
    if pct_nonopt:
        print(f"{metric_labels[metric]}: Non-Opt vs Mono avg={np.mean(pct_nonopt):+.1f}%, range=[{min(pct_nonopt):+.1f}%,{max(pct_nonopt):+.1f}%]")
    if pct_opt:
        print(f"     Opt vs Mono avg={np.mean(pct_opt):+.1f}%, range=[{min(pct_opt):+.1f}%,{max(pct_opt):+.1f}%]")

# Save full results to JSON for later use
with open(OUT_FILE, 'w') as f:
    json.dump({'bonferroni_alpha': bonf_alpha, 'total_tests': total_tests, 'results': all_results}, f, indent=2)
print(f"\nFull results saved to {OUT_FILE}")
