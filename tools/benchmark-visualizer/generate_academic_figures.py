#!/usr/bin/env python3
"""
Generate publication-ready figures for Microfrontend vs Monolith benchmark paper.
Outputs PDF and PNG files suitable for IEEE/ACM conference/journal submissions.

Usage: python3 generate_academic_figures.py
Output: tools/benchmark-visualizer/figures/
"""

import json
import os
import pathlib
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from scipy import stats

# ── Configuration ──────────────────────────────────────────────────────────
BASE_DATA = pathlib.Path(__file__).parent / "public" / "data"
OUT_DIR = pathlib.Path(__file__).parent / "figures"
OUT_DIR.mkdir(exist_ok=True)

PAGES = ["home", "dashboard", "login"]
SCENARIOS = ["cold", "warm"]
NETWORKS = ["none", "4g", "3g"]
NETWORK_LABELS = {"none": "No Throttle", "4g": "4G", "3g": "3G"}
METRICS = ["speedIndex", "firstContentfulPaint", "largestContentfulPaint",
           "timeToInteractive", "totalBlockingTime"]
METRIC_SHORT = {"speedIndex": "SI", "firstContentfulPaint": "FCP",
                "largestContentfulPaint": "LCP", "timeToInteractive": "TTI",
                "totalBlockingTime": "TBT", "cumulativeLayoutShift": "CLS"}
METRIC_FULL = {"speedIndex": "Speed Index", "firstContentfulPaint": "First Contentful Paint",
               "largestContentfulPaint": "Largest Contentful Paint",
               "timeToInteractive": "Time to Interactive",
               "totalBlockingTime": "Total Blocking Time",
               "cumulativeLayoutShift": "Cumulative Layout Shift"}

# Academic color palette (colorblind-safe)
C_MFE_OPT = "#2171B5"       # Blue - MFE Optimized
C_MFE_NONOPT = "#6BAED6"    # Light Blue - MFE Non-Optimized
C_MONO = "#CB181D"           # Red - Monolith
C_MFE_OPT_LIGHT = "#9ECAE1"
C_MONO_LIGHT = "#FC9272"

# Publication-quality settings
plt.rcParams.update({
    'font.family': 'serif',
    'font.serif': ['Times New Roman', 'DejaVu Serif', 'serif'],
    'font.size': 9,
    'axes.titlesize': 10,
    'axes.labelsize': 9,
    'xtick.labelsize': 8,
    'ytick.labelsize': 8,
    'legend.fontsize': 8,
    'figure.dpi': 300,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.05,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.linestyle': '--',
    'axes.spines.top': False,
    'axes.spines.right': False,
})


# ── Data Loading ───────────────────────────────────────────────────────────
def load_summary(project, page, scenario, network, optimization):
    path = BASE_DATA / project / page / scenario / network / optimization / "summary.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def load_all_data():
    """Load all benchmark data into a nested dict."""
    data = {}
    for page in PAGES:
        data[page] = {}
        for scenario in SCENARIOS:
            data[page][scenario] = {}
            for network in NETWORKS:
                data[page][scenario][network] = {}
                # Monolith
                mono = load_summary("monolith", page, scenario, network, "default")
                data[page][scenario][network]["monolith"] = mono
                # MFE optimized
                mfe_opt = load_summary("mfe", page, scenario, network, "optimized")
                data[page][scenario][network]["mfe_opt"] = mfe_opt
                # MFE non-optimized
                mfe_nonopt = load_summary("mfe", page, scenario, network, "non-optimized")
                data[page][scenario][network]["mfe_nonopt"] = mfe_nonopt
    return data


def get_mean(summary, metric):
    if summary is None:
        return 0
    return summary.get("benchmarkSummary", {}).get(metric, {}).get("mean", 0)


def get_raw_values(summary, metric):
    if summary is None:
        return []
    results = summary.get("lighthouseResults", [])
    return [r.get(metric, 0) for r in results]


def get_stats(summary, metric):
    s = summary.get("benchmarkSummary", {}).get(metric, {})
    return {
        "mean": s.get("mean", 0),
        "median": s.get("median", 0),
        "q1": s.get("q1", 0),
        "q3": s.get("q3", 0),
        "min": s.get("min", 0),
        "max": s.get("max", 0),
    }


def ms_to_s(val):
    return val / 1000.0


# ── Figure 1: Grouped Bar Chart with Error Bars ───────────────────────────
def fig1_grouped_bar(data):
    """Mean comparison bar chart for warm/none (baseline) across all pages."""
    fig, axes = plt.subplots(1, 3, figsize=(7.16, 2.8), sharey=False)
    fig.suptitle("Mean Web Vitals: MFE vs Monolith (No Throttling, Warm Start)", fontsize=10, fontweight='bold', y=1.02)

    key_metrics = ["speedIndex", "firstContentfulPaint", "largestContentfulPaint", "timeToInteractive"]
    x = np.arange(len(key_metrics))
    width = 0.25

    for idx, page in enumerate(PAGES):
        ax = axes[idx]
        d = data[page]["warm"]["none"]

        means_opt = [ms_to_s(get_mean(d["mfe_opt"], m)) for m in key_metrics]
        means_nonopt = [ms_to_s(get_mean(d["mfe_nonopt"], m)) for m in key_metrics]
        means_mono = [ms_to_s(get_mean(d["monolith"], m)) for m in key_metrics]

        # Error bars: Q1 to Q3
        err_opt = [[ms_to_s(get_mean(d["mfe_opt"], m) - get_stats(d["mfe_opt"], m)["q1"]) for m in key_metrics],
                    [ms_to_s(get_stats(d["mfe_opt"], m)["q3"] - get_mean(d["mfe_opt"], m)) for m in key_metrics]]
        err_nonopt = [[ms_to_s(get_mean(d["mfe_nonopt"], m) - get_stats(d["mfe_nonopt"], m)["q1"]) for m in key_metrics],
                      [ms_to_s(get_stats(d["mfe_nonopt"], m)["q3"] - get_mean(d["mfe_nonopt"], m)) for m in key_metrics]]
        err_mono = [[ms_to_s(get_mean(d["monolith"], m) - get_stats(d["monolith"], m)["q1"]) for m in key_metrics],
                    [ms_to_s(get_stats(d["monolith"], m)["q3"] - get_mean(d["monolith"], m)) for m in key_metrics]]

        bars1 = ax.bar(x - width, means_opt, width, label='MFE (Optimized)', color=C_MFE_OPT,
                       yerr=err_opt, capsize=2, error_kw={'linewidth': 0.7})
        bars2 = ax.bar(x, means_nonopt, width, label='MFE (Non-Opt.)', color=C_MFE_NONOPT,
                       yerr=err_nonopt, capsize=2, error_kw={'linewidth': 0.7})
        bars3 = ax.bar(x + width, means_mono, width, label='Monolith', color=C_MONO,
                       yerr=err_mono, capsize=2, error_kw={'linewidth': 0.7})

        ax.set_title(f"{page.capitalize()} Page", fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels([METRIC_SHORT[m] for m in key_metrics])
        ax.set_ylabel("Time (s)" if idx == 0 else "")
        ax.set_ylim(bottom=0)

    axes[0].legend(loc='upper left', framealpha=0.9, edgecolor='gray')
    plt.tight_layout()
    save_fig(fig, "fig1_grouped_bar_warm_none")


# ── Figure 2: Box Plots ───────────────────────────────────────────────────
def fig2_box_plots(data):
    """Distribution box plots for key metrics across architectures."""
    key_metrics = ["speedIndex", "firstContentfulPaint", "largestContentfulPaint", "timeToInteractive"]
    fig, axes = plt.subplots(2, 2, figsize=(7.16, 5.0))
    fig.suptitle("Distribution of Web Vitals: MFE vs Monolith\n(All Pages Combined, No Throttling, Warm Start)",
                 fontsize=10, fontweight='bold', y=1.02)

    for midx, metric in enumerate(key_metrics):
        ax = axes[midx // 2][midx % 2]

        # Collect raw values across all pages
        raw_opt, raw_nonopt, raw_mono = [], [], []
        for page in PAGES:
            d = data[page]["warm"]["none"]
            raw_opt.extend(get_raw_values(d["mfe_opt"], metric))
            raw_nonopt.extend(get_raw_values(d["mfe_nonopt"], metric))
            raw_mono.extend(get_raw_values(d["monolith"], metric))

        # Convert to seconds
        raw_opt = [v / 1000 for v in raw_opt]
        raw_nonopt = [v / 1000 for v in raw_nonopt]
        raw_mono = [v / 1000 for v in raw_mono]

        bp = ax.boxplot([raw_opt, raw_nonopt, raw_mono],
                        labels=['MFE\n(Optimized)', 'MFE\n(Non-Opt.)', 'Monolith'],
                        patch_artist=True, widths=0.6,
                        medianprops=dict(color='black', linewidth=1.5),
                        whiskerprops=dict(linewidth=0.8),
                        capprops=dict(linewidth=0.8),
                        flierprops=dict(marker='o', markersize=3, alpha=0.5))
        colors = [C_MFE_OPT, C_MFE_NONOPT, C_MONO]
        for patch, color in zip(bp['boxes'], colors):
            patch.set_facecolor(color)
            patch.set_alpha(0.7)

        ax.set_title(METRIC_FULL[metric], fontweight='bold')
        ax.set_ylabel("Time (s)")
        ax.set_ylim(bottom=0)

    plt.tight_layout()
    save_fig(fig, "fig2_box_plots")


# ── Figure 3: Heatmap ─────────────────────────────────────────────────────
def fig3_heatmap(data):
    """Heatmap of % difference (MFE optimized vs Monolith) across conditions."""
    key_metrics = ["speedIndex", "firstContentfulPaint", "largestContentfulPaint", "timeToInteractive"]
    rows = []
    row_labels = []
    for page in PAGES:
        for scenario in SCENARIOS:
            for network in NETWORKS:
                row_labels.append(f"{page.capitalize()} / {scenario.capitalize()} / {NETWORK_LABELS[network]}")
                d = data[page][scenario][network]
                row = []
                for metric in key_metrics:
                    mfe_val = get_mean(d["mfe_opt"], metric)
                    mono_val = get_mean(d["monolith"], metric)
                    if mono_val > 0:
                        pct = ((mfe_val - mono_val) / mono_val) * 100
                    else:
                        pct = 0
                    row.append(pct)
                rows.append(row)

    matrix = np.array(rows)

    fig, ax = plt.subplots(figsize=(5.5, 6.5))
    im = ax.imshow(matrix, cmap='RdYlGn_r', aspect='auto', vmin=-30, vmax=30)

    ax.set_xticks(range(len(key_metrics)))
    ax.set_xticklabels([METRIC_SHORT[m] for m in key_metrics], fontweight='bold')
    ax.set_yticks(range(len(row_labels)))
    ax.set_yticklabels(row_labels, fontsize=7)

    # Add text annotations
    for i in range(len(row_labels)):
        for j in range(len(key_metrics)):
            val = matrix[i, j]
            color = 'white' if abs(val) > 20 else 'black'
            sign = "+" if val > 0 else ""
            ax.text(j, i, f"{sign}{val:.1f}%", ha='center', va='center',
                    fontsize=6.5, color=color, fontweight='bold')

    ax.set_title("% Difference: MFE (Optimized) vs Monolith\n(Positive = MFE Slower)",
                 fontsize=10, fontweight='bold', pad=12)
    cbar = plt.colorbar(im, ax=ax, shrink=0.8, pad=0.02)
    cbar.set_label("% Difference", fontsize=8)

    plt.tight_layout()
    save_fig(fig, "fig3_heatmap_pct_diff")


# ── Figure 4: Network Degradation Line Chart ──────────────────────────────
def fig4_network_degradation(data):
    """Line chart showing performance degradation across network conditions."""
    key_metrics = ["speedIndex", "largestContentfulPaint"]
    fig, axes = plt.subplots(1, 2, figsize=(7.16, 3.2))
    fig.suptitle("Performance Degradation Under Network Constraints (Cold Start)",
                 fontsize=10, fontweight='bold', y=1.02)

    x_pos = [0, 1, 2]
    x_labels = [NETWORK_LABELS[n] for n in NETWORKS]

    for midx, metric in enumerate(key_metrics):
        ax = axes[midx]

        for page in PAGES:
            # MFE Optimized
            vals_opt = [ms_to_s(get_mean(data[page]["cold"][n]["mfe_opt"], metric)) for n in NETWORKS]
            vals_mono = [ms_to_s(get_mean(data[page]["cold"][n]["monolith"], metric)) for n in NETWORKS]

            ax.plot(x_pos, vals_opt, 'o-', color=C_MFE_OPT, linewidth=1.3, markersize=5, alpha=0.8,
                    label=f'MFE - {page.capitalize()}' if midx == 0 else '')
            ax.plot(x_pos, vals_mono, 's--', color=C_MONO, linewidth=1.3, markersize=5, alpha=0.8,
                    label=f'Mono - {page.capitalize()}' if midx == 0 else '')

        ax.set_title(METRIC_FULL[metric], fontweight='bold')
        ax.set_xticks(x_pos)
        ax.set_xticklabels(x_labels)
        ax.set_xlabel("Network Condition")
        ax.set_ylabel("Time (s)" if midx == 0 else "")
        ax.set_ylim(bottom=0)

    # Create unified legend
    handles, labels = axes[0].get_legend_handles_labels()
    # De-duplicate and group
    fig.legend(handles, labels, loc='lower center', ncol=3, fontsize=7,
               bbox_to_anchor=(0.5, -0.08), framealpha=0.9)

    plt.tight_layout()
    save_fig(fig, "fig4_network_degradation")


# ── Figure 5: Cold vs Warm Comparison ─────────────────────────────────────
def fig5_cold_vs_warm(data):
    """Paired bar chart comparing cold vs warm performance for each architecture."""
    key_metrics = ["speedIndex", "firstContentfulPaint", "largestContentfulPaint", "timeToInteractive"]
    fig, axes = plt.subplots(1, 4, figsize=(7.16, 2.8))
    fig.suptitle("Cold Start vs Warm Start: Cache Impact on Performance\n(No Throttling, Averaged Across All Pages)",
                 fontsize=10, fontweight='bold', y=1.08)

    for midx, metric in enumerate(key_metrics):
        ax = axes[midx]

        # Average across pages
        cold_opt = np.mean([ms_to_s(get_mean(data[p]["cold"]["none"]["mfe_opt"], metric)) for p in PAGES])
        warm_opt = np.mean([ms_to_s(get_mean(data[p]["warm"]["none"]["mfe_opt"], metric)) for p in PAGES])
        cold_nonopt = np.mean([ms_to_s(get_mean(data[p]["cold"]["none"]["mfe_nonopt"], metric)) for p in PAGES])
        warm_nonopt = np.mean([ms_to_s(get_mean(data[p]["warm"]["none"]["mfe_nonopt"], metric)) for p in PAGES])
        cold_mono = np.mean([ms_to_s(get_mean(data[p]["cold"]["none"]["monolith"], metric)) for p in PAGES])
        warm_mono = np.mean([ms_to_s(get_mean(data[p]["warm"]["none"]["monolith"], metric)) for p in PAGES])

        x = np.arange(3)
        width = 0.35

        ax.bar(x - width/2, [cold_opt, cold_nonopt, cold_mono], width,
               label='Cold Start' if midx == 0 else '', color=[C_MFE_OPT, C_MFE_NONOPT, C_MONO],
               edgecolor='black', linewidth=0.5)
        ax.bar(x + width/2, [warm_opt, warm_nonopt, warm_mono], width,
               label='Warm Start' if midx == 0 else '', color=[C_MFE_OPT, C_MFE_NONOPT, C_MONO],
               alpha=0.5, edgecolor='black', linewidth=0.5, hatch='///')

        ax.set_title(METRIC_SHORT[metric], fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels(['MFE\n(Opt.)', 'MFE\n(Non.)', 'Mono.'], fontsize=6.5)
        if midx == 0:
            ax.set_ylabel("Time (s)")
        ax.set_ylim(bottom=0)

    # Custom legend for cold/warm
    from matplotlib.patches import Patch
    legend_elements = [Patch(facecolor='gray', edgecolor='black', label='Cold Start'),
                       Patch(facecolor='gray', alpha=0.5, edgecolor='black', hatch='///', label='Warm Start')]
    fig.legend(handles=legend_elements, loc='lower center', ncol=2, fontsize=8,
               bbox_to_anchor=(0.5, -0.04), framealpha=0.9)
    plt.tight_layout()
    save_fig(fig, "fig5_cold_vs_warm")


# ── Figure 6: Statistical Significance Table ──────────────────────────────
def fig6_statistical_table(data):
    """Generate a publication-quality table figure with t-test results."""
    key_metrics = ["speedIndex", "firstContentfulPaint", "largestContentfulPaint",
                   "timeToInteractive", "totalBlockingTime"]
    scenarios_to_show = [("warm", "none"), ("cold", "none"), ("warm", "4g"), ("cold", "4g"),
                         ("warm", "3g"), ("cold", "3g")]

    rows = []
    for scenario, network in scenarios_to_show:
        for metric in key_metrics:
            # Collect across all pages
            raw_mfe, raw_mono = [], []
            for page in PAGES:
                d = data[page][scenario][network]
                raw_mfe.extend(get_raw_values(d["mfe_opt"], metric))
                raw_mono.extend(get_raw_values(d["monolith"], metric))

            if len(raw_mfe) == 0 or len(raw_mono) == 0:
                continue

            mfe_mean = np.mean(raw_mfe)
            mono_mean = np.mean(raw_mono)

            if mono_mean > 0:
                pct_diff = ((mfe_mean - mono_mean) / mono_mean) * 100
            else:
                pct_diff = 0

            # Welch's t-test
            if np.std(raw_mfe) > 0 or np.std(raw_mono) > 0:
                t_stat, p_val = stats.ttest_ind(raw_mfe, raw_mono, equal_var=False)
            else:
                t_stat, p_val = 0, 1.0

            sig = "Yes" if p_val < 0.05 else "No"
            winner = ""
            if p_val < 0.05:
                winner = "MFE" if mfe_mean < mono_mean else "Monolith"

            rows.append([
                f"{scenario.capitalize()} / {NETWORK_LABELS[network]}",
                METRIC_SHORT[metric],
                f"{mfe_mean:.1f}",
                f"{mono_mean:.1f}",
                f"{pct_diff:+.1f}%",
                f"{t_stat:.2f}",
                f"{p_val:.4f}" if p_val >= 0.001 else "< 0.001",
                sig,
                winner if winner else "—"
            ])

    # Create figure with table
    fig, ax = plt.subplots(figsize=(7.16, 8.5))
    ax.axis('off')
    ax.set_title("Statistical Comparison: MFE (Optimized) vs Monolith\nWelch's t-test (α = 0.05, two-tailed). All pages combined.",
                 fontsize=10, fontweight='bold', pad=15)

    col_labels = ["Condition", "Metric", "MFE (ms)", "Mono (ms)", "Δ%", "t-stat", "p-value", "Sig?", "Winner"]
    table = ax.table(cellText=rows, colLabels=col_labels, loc='center', cellLoc='center')
    table.auto_set_font_size(False)
    table.set_fontsize(6.5)
    table.scale(1, 1.25)

    # Style header
    for j in range(len(col_labels)):
        table[0, j].set_facecolor('#2C3E50')
        table[0, j].set_text_props(color='white', fontweight='bold')

    # Color significance
    for i in range(len(rows)):
        row = rows[i]
        # Significance column
        if row[7] == "Yes":
            table[i+1, 7].set_facecolor('#D5F5E3')
        else:
            table[i+1, 7].set_facecolor('#FADBD8')

        # Winner column coloring
        if row[8] == "MFE":
            table[i+1, 8].set_facecolor('#D6EAF8')
        elif row[8] == "Monolith":
            table[i+1, 8].set_facecolor('#FDEDEC')

        # Alternate row shading
        if i % 2 == 0:
            for j in range(len(col_labels)):
                if table[i+1, j].get_facecolor() == (1.0, 1.0, 1.0, 1.0):
                    table[i+1, j].set_facecolor('#F8F9F9')

    plt.tight_layout()
    save_fig(fig, "fig6_statistical_table")


# ── Figure 7 (Bonus): Radar Chart ─────────────────────────────────────────
def fig7_radar_chart(data):
    """Radar chart comparing MFE vs Monolith across all metrics (normalized)."""
    key_metrics = ["speedIndex", "firstContentfulPaint", "largestContentfulPaint",
                   "timeToInteractive", "totalBlockingTime"]
    labels = [METRIC_SHORT[m] for m in key_metrics]

    fig, axes = plt.subplots(1, 2, figsize=(7.16, 3.5), subplot_kw=dict(polar=True))
    fig.suptitle("Normalized Performance Profile: MFE vs Monolith\n(Lower = Better, 1.0 = Max observed value)",
                 fontsize=10, fontweight='bold', y=1.05)

    for sidx, scenario in enumerate(["warm", "cold"]):
        ax = axes[sidx]
        angles = np.linspace(0, 2 * np.pi, len(key_metrics), endpoint=False).tolist()
        angles += angles[:1]

        # Average across pages, network=none
        vals_opt, vals_nonopt, vals_mono = [], [], []
        for metric in key_metrics:
            v_opt = np.mean([get_mean(data[p][scenario]["none"]["mfe_opt"], metric) for p in PAGES])
            v_nonopt = np.mean([get_mean(data[p][scenario]["none"]["mfe_nonopt"], metric) for p in PAGES])
            v_mono = np.mean([get_mean(data[p][scenario]["none"]["monolith"], metric) for p in PAGES])
            vals_opt.append(v_opt)
            vals_nonopt.append(v_nonopt)
            vals_mono.append(v_mono)

        # Normalize to [0, 1] per metric
        for i in range(len(key_metrics)):
            max_val = max(vals_opt[i], vals_nonopt[i], vals_mono[i])
            if max_val > 0:
                vals_opt[i] /= max_val
                vals_nonopt[i] /= max_val
                vals_mono[i] /= max_val

        vals_opt += vals_opt[:1]
        vals_nonopt += vals_nonopt[:1]
        vals_mono += vals_mono[:1]

        ax.plot(angles, vals_opt, 'o-', color=C_MFE_OPT, linewidth=1.5, markersize=4, label='MFE (Opt.)')
        ax.fill(angles, vals_opt, alpha=0.1, color=C_MFE_OPT)
        ax.plot(angles, vals_nonopt, 's-', color=C_MFE_NONOPT, linewidth=1.5, markersize=4, label='MFE (Non-Opt.)')
        ax.fill(angles, vals_nonopt, alpha=0.1, color=C_MFE_NONOPT)
        ax.plot(angles, vals_mono, '^-', color=C_MONO, linewidth=1.5, markersize=4, label='Monolith')
        ax.fill(angles, vals_mono, alpha=0.1, color=C_MONO)

        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(labels, fontsize=8)
        ax.set_title(f"{scenario.capitalize()} Start", fontweight='bold', pad=15)
        ax.set_ylim(0, 1.1)

    axes[0].legend(loc='upper right', bbox_to_anchor=(0.1, 0.1), fontsize=7)
    plt.tight_layout()
    save_fig(fig, "fig7_radar_chart")


# ── Figure 8: Per-page bars across networks ───────────────────────────────
def fig8_network_comparison_bars(data):
    """Grouped bar chart: LCP across all pages and network conditions."""
    metric = "largestContentfulPaint"
    fig, axes = plt.subplots(1, 2, figsize=(7.16, 3.2))
    fig.suptitle("Largest Contentful Paint (LCP) Across Network Conditions",
                 fontsize=10, fontweight='bold', y=1.02)

    for sidx, scenario in enumerate(SCENARIOS):
        ax = axes[sidx]
        x = np.arange(len(PAGES))
        width = 0.12
        offsets = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]

        conditions = []
        for network in NETWORKS:
            conditions.append(("mfe_opt", network, f'MFE Opt / {NETWORK_LABELS[network]}', C_MFE_OPT))
            conditions.append(("monolith", network, f'Mono / {NETWORK_LABELS[network]}', C_MONO))

        alphas = [1.0, 1.0, 0.7, 0.7, 0.4, 0.4]

        for cidx, (arch, net, label, color) in enumerate(conditions):
            vals = [ms_to_s(get_mean(data[p][scenario][net][arch], metric)) for p in PAGES]
            ax.bar(x + offsets[cidx] * width, vals, width, label=label if sidx == 0 else '',
                   color=color, alpha=alphas[cidx], edgecolor='black', linewidth=0.3)

        ax.set_title(f"{scenario.capitalize()} Start", fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels([p.capitalize() for p in PAGES])
        ax.set_ylabel("Time (s)" if sidx == 0 else "")
        ax.set_ylim(bottom=0)

    fig.legend(loc='lower center', ncol=3, fontsize=6.5,
               bbox_to_anchor=(0.5, -0.12), framealpha=0.9)
    plt.tight_layout()
    save_fig(fig, "fig8_lcp_network_comparison")


def save_fig(fig, name):
    """Save figure in both PDF (vector) and PNG (raster) formats."""
    fig.savefig(OUT_DIR / f"{name}.pdf", format='pdf', bbox_inches='tight')
    fig.savefig(OUT_DIR / f"{name}.png", format='png', bbox_inches='tight', dpi=300)
    plt.close(fig)
    print(f"  ✓ {name}.pdf / .png")


# ── Main ───────────────────────────────────────────────────────────────────
def main():
    print("Loading benchmark data...")
    data = load_all_data()
    print(f"  Loaded data for {len(PAGES)} pages × {len(SCENARIOS)} scenarios × {len(NETWORKS)} networks\n")

    print("Generating figures...")
    fig1_grouped_bar(data)
    fig2_box_plots(data)
    fig3_heatmap(data)
    fig4_network_degradation(data)
    fig5_cold_vs_warm(data)
    fig6_statistical_table(data)
    fig7_radar_chart(data)
    fig8_network_comparison_bars(data)

    print(f"\nAll figures saved to: {OUT_DIR.resolve()}")
    print("Formats: PDF (vector, for LaTeX) and PNG (300 DPI, for Word/preview)")


if __name__ == "__main__":
    main()
