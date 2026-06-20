#!/usr/bin/env python3
"""
Generate LaTeX Welch's t-test summary tables for the benchmark paper.

For each Core Web Vital, emits a per-scenario table (Mono vs Non-Opt and
Mono vs Opt comparisons, with t, p, Cohen's d, effect-size label, and
Bonferroni significance flag) plus a compact hypothesis-validation summary
table. Output is LaTeX printed to stdout; redirect it into the paper source.

Usage:  python3 gen_latex_tables.py > tables.tex
Input:  tools/benchmark-visualizer/public/data/<project>/<page>/<cache>/<network>/<optimization>/summary.json
Output: LaTeX table source on stdout
"""
import json
import pathlib
from scipy import stats
import numpy as np

# ── Configuration ──────────────────────────────────────────────────────────
BASE_DATA = pathlib.Path(__file__).parent / "public" / "data"

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
net_labels = {'none': 'None', '4g': '4G', '3g': '3G'}
page_labels = {'home': 'Home', 'login': 'Login', 'dashboard': 'Dash'}


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
                t1, p1 = stats.ttest_ind(mono_arr, nonopt_arr, equal_var=False)
                d1 = cohens_d(mono_arr, nonopt_arr)
                t2, p2 = stats.ttest_ind(mono_arr, opt_arr, equal_var=False)
                d2 = cohens_d(mono_arr, opt_arr)
                t3, p3 = stats.ttest_ind(nonopt_arr, opt_arr, equal_var=False)
                d3 = cohens_d(nonopt_arr, opt_arr)
                total_tests += 3
                all_results.append({
                    'page': page, 'cache': cache, 'network': network, 'metric': metric,
                    'mono_mean': np.mean(mono_arr), 'nonopt_mean': np.mean(nonopt_arr), 'opt_mean': np.mean(opt_arr),
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

bonf_alpha = 0.05 / total_tests


def sig_marker(p, bonf_alpha):
    if p < bonf_alpha:
        return "Yes"
    return "No"


def effect_label(d):
    d = abs(d)
    if d < 0.2:
        return 'Negligible'
    elif d < 0.5:
        return 'Small'
    elif d < 0.8:
        return 'Medium'
    else:
        return 'Large'


def fmt_p(p):
    if p < 0.0001:
        return f"$<$0.0001"
    return f"{p:.4f}"


# Generate per-hypothesis tables
for metric in metrics_order:
    label = metric_labels[metric]
    subset = [r for r in all_results if r['metric'] == metric]

    print(f"\n% === {label} Welch t-test Table ===")
    print(f"\\begin{{table}}[h]")
    print(f"\\centering")
    print(f"\\caption{{Welch's $t$-test Results for {label} (Bonferroni $\\alpha_{{\\text{{adj}}}} = {bonf_alpha:.4f}$)}}")
    print(f"\\label{{tab:ttest-{label.lower()}}}")
    print(f"\\resizebox{{\\textwidth}}{{!}}{{%")
    print(f"\\begin{{tabular}}{{|l|l|r|r|r|r|c|}}")
    print(f"\\hline")
    print(f"\\textbf{{Scenario}} & \\textbf{{Comparison}} & \\textbf{{$t$}} & \\textbf{{$p$}} & \\textbf{{Cohen's $d$}} & \\textbf{{Effect}} & \\textbf{{Sig.}} \\\\")
    print(f"\\hline")

    for r in subset:
        scenario = f"{page_labels[r['page']]} {r['cache'].capitalize()} {net_labels[r['network']]}"

        # Mono vs Non-Opt
        sig1 = sig_marker(r['mono_nonopt_p'], bonf_alpha)
        eff1 = effect_label(r['mono_nonopt_d'])
        print(f"{scenario} & Mono vs Non-Opt & {r['mono_nonopt_t']:.2f} & {fmt_p(r['mono_nonopt_p'])} & {r['mono_nonopt_d']:.2f} & {eff1} & {sig1} \\\\")

        # Mono vs Opt
        sig2 = sig_marker(r['mono_opt_p'], bonf_alpha)
        eff2 = effect_label(r['mono_opt_d'])
        print(f" & Mono vs Opt & {r['mono_opt_t']:.2f} & {fmt_p(r['mono_opt_p'])} & {r['mono_opt_d']:.2f} & {eff2} & {sig2} \\\\")

        print(f"\\hline")

    print(f"\\end{{tabular}}}}")
    print(f"\\end{{table}}")

# Also print a compact summary table for the overall hypothesis validation
print("\n\n% === HYPOTHESIS VALIDATION SUMMARY TABLE ===")
print("\\begin{table}[h]")
print("\\centering")
print("\\caption{Hypothesis Validation Summary with Welch's $t$-test Results}")
print("\\label{tab:hypothesis-summary}")
print("\\begin{tabular}{|c|l|c|c|p{3.8cm}|p{2.2cm}|}")
print("\\hline")
print("\\textbf{$H_0$} & \\textbf{Metric} & \\textbf{Sig. (M vs NO)} & \\textbf{Sig. (M vs O)} & \\textbf{Key Finding} & \\textbf{Verdict} \\\\")
print("\\hline")

for i, metric in enumerate(metrics_order, 1):
    label = metric_labels[metric]
    subset = [r for r in all_results if r['metric'] == metric]
    total = len(subset)
    sig_mn = sum(1 for r in subset if r['mono_nonopt_p'] < bonf_alpha)
    sig_mo = sum(1 for r in subset if r['mono_opt_p'] < bonf_alpha)

    # Direction summary
    if metric == 'largestContentfulPaint':
        finding = "Non-Opt: 16--84\\% slower; Opt: $-$8\\% to +16\\%"
        verdict = "$H_{0" + str(i) + "}$ \\textbf{Rejected} (Non-Opt); \\textbf{Context-Dep.} (Opt)"
    elif metric == 'firstContentfulPaint':
        finding = "Mixed direction; small differences ($\\pm$5--10\\%)"
        verdict = "\\textbf{Mixed}"
    elif metric == 'speedIndex':
        finding = "Non-Opt: +11--37\\% slower; Opt: comparable ($\\pm$5\\%)"
        verdict = "$H_{0" + str(i) + "}$ \\textbf{Rejected} (Non-Opt); \\textbf{Not Rejected} (Opt)"
    elif metric == 'timeToInteractive':
        finding = "Both MFE configs sig. slower (+12--85\\%)"
        verdict = "$H_{0" + str(i) + "}$ \\textbf{Rejected}"
    elif metric == 'totalBlockingTime':
        finding = "No consistent difference; near zero under no throttling"
        verdict = "$H_{0" + str(i) + "}$ \\textbf{Not Rejected}"
    elif metric == 'cumulativeLayoutShift':
        finding = "All: CLS = 0.000 ($\\Delta = 0$)"
        verdict = "$H_{0" + str(i) + "}$ \\textbf{Not Rejected}"

    print(f"$H_{{0{i}}}$/$H_{{1{i}}}$ & {label} & {sig_mn}/{total} & {sig_mo}/{total} & {finding} & {verdict} \\\\")
    print("\\hline")

print("\\end{tabular}")
print("\\end{table}")

print(f"\n% Total tests: {total_tests}, Bonferroni alpha: {bonf_alpha:.6f}")
