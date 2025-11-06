# 🎯 Quick Reference - Report Dashboard

## Component Import Paths

```tsx
// Main section
import ReportDashboardSection from './components/organisms/report-dashboard-section';

// Individual molecules (if needed)
import BalanceCard from './components/molecules/balance-card';
import IncomeSpendingChart from './components/molecules/income-spending-chart';
import TransactionHistory from './components/molecules/transaction-history';
import AvailableBalanceCard from './components/molecules/available-balance-card';
import SavingsCard from './components/molecules/savings-card';
```

## Color Reference

```tsx
// Primary colors
const COLORS = {
  brand: '#E8232C', // Red accent
  black: '#000000', // Background
  gray900: '#0F0F0F', // Card background
  gray800: '#1A1A1A', // Hover background
  gray700: '#2D2D2D', // Border
  gray600: '#404040', // Hover border
  gray500: '#5C5C5C', // Disabled
  gray400: '#858585', // Tertiary text
  gray300: '#B3B3B3', // Secondary text
  white: '#FFFFFF', // Primary text

  // Semantic
  success: '#4CAF50', // Income, positive trends
  info: '#1E88E5', // Investments
  warning: '#FB8C00', // Expenses
  error: '#E8232C', // Withdrawals

  // Chart specific
  income: '#7dd87d', // Income bars
  spending: '#1a4d4d', // Spending bars
};
```

## Responsive Breakpoints

```tsx
// Mobile
@media (max-width: 640px) { }

// Tablet
@media (min-width: 641px) and (max-width: 1024px) { }

// Desktop
@media (min-width: 1025px) { }
```

## Animation Durations

```tsx
const ANIMATIONS = {
  fast: '150ms', // Button clicks
  base: '200ms', // Tooltips, fades
  normal: '300ms', // Hover effects
  slow: '500ms', // Chart transitions
  slower: '700ms', // Progress bars
  slowest: '1000ms', // Shimmer effects
};
```

## Common Tailwind Classes

```tsx
// Cards
className = 'bg-[#0F0F0F] rounded-xl p-6 md:p-8 border border-[#2D2D2D] hover:border-[#404040] transition-all duration-300 hover:shadow-2xl';

// Buttons (Primary)
className = 'px-4 py-2 bg-[#E8232C] text-white rounded-lg hover:bg-[#C41E26] transition-all duration-300 font-medium';

// Buttons (Secondary)
className = 'px-4 py-2 bg-[#2D2D2D] text-white rounded-lg border border-[#404040] hover:bg-[#404040] transition-all duration-300';

// Text (Headings)
className = 'text-white text-xl font-semibold';

// Text (Secondary)
className = 'text-[#B3B3B3] text-sm';

// Text (Tertiary)
className = 'text-[#858585] text-xs';

// Badges (Success)
className = 'flex items-center gap-1.5 text-[#4CAF50] bg-[#4CAF50] bg-opacity-10 px-2.5 py-1 rounded-full';

// Progress Bar Container
className = 'h-2 bg-[#2D2D2D] rounded-full overflow-hidden';

// Progress Bar Fill
className = 'h-full rounded-full transition-all duration-700 ease-out';
```

## Grid Layouts

```tsx
// Main dashboard grid
className = 'grid grid-cols-1 lg:grid-cols-3 gap-6';

// Left content (2 columns)
className = 'lg:col-span-2 space-y-6';

// Right sidebar (1 column)
className = 'lg:col-span-1 space-y-6';

// Legend grid
className = 'grid grid-cols-2 gap-4';
```

## Hover Effects

```tsx
// Scale on hover
className = 'transition-all duration-300 hover:scale-110';

// Shadow on hover
className = 'hover:shadow-lg hover:shadow-[#E8232C]/50';

// Color transition
className = 'text-[#B3B3B3] hover:text-white transition-colors duration-300';

// Border glow
className = 'border border-[#2D2D2D] hover:border-[#E8232C] transition-all duration-300';
```

## Chart Tooltips

```tsx
// Tooltip container
className = 'absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-[#404040] rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200 z-10';
```

## Icon Styling

```tsx
// Standard icon
className = 'w-5 h-5 text-[#858585] group-hover:text-white transition-colors duration-300';

// Active icon
className = 'w-5 h-5 text-white';

// Large icon
className = 'w-6 h-6';
```

## State Management Example

```tsx
const [selectedPeriod, setSelectedPeriod] = useState('This month');
const [activeTab, setActiveTab] = useState<TabType>('investments-detail');
const [hoveredBar, setHoveredBar] = useState<number | null>(null);
```

## Dropdown Usage

```tsx
<Dropdown
  label="This month"
  icon={<FunnelIcon className="w-4 h-4" />}
  options={[
    { label: 'This week', value: 'This week' },
    { label: 'This month', value: 'This month' },
    { label: 'This quarter', value: 'This quarter' },
    { label: 'This year', value: 'This year' },
  ]}
  onSelect={(value) => setSelectedPeriod(value)}
/>
```

## Kebab Menu Usage

```tsx
<KebabMenu
  options={[
    {
      label: 'Edit Goal',
      value: 'edit',
      icon: <PencilIcon className="w-5 h-5" />,
    },
    {
      label: 'Delete Goal',
      value: 'delete',
      icon: <TrashIcon className="w-5 h-5" />,
      variant: 'danger',
    },
  ]}
  onSelect={(action) => handleAction(action)}
/>
```

## SVG Donut Chart Pattern

```tsx
<svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="32" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
</svg>
```

## Performance Tips

1. Use `transition-all` sparingly - prefer specific properties
2. Debounce hover states for complex animations
3. Use `will-change` for frequently animated elements
4. Lazy load heavy components when possible
5. Memoize expensive calculations with `useMemo`

## Accessibility

- All interactive elements are keyboard navigable (via Radix UI)
- Color contrast meets WCAG AA standards
- Focus indicators are visible
- ARIA labels provided by Radix components
- Semantic HTML structure used throughout

---

**Happy coding!** 🚀
