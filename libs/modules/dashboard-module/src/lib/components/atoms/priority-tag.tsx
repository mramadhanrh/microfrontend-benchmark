interface PriorityTagProps {
  label: string;
  textClass: string;
  tone: string;
}

const PriorityTag = ({ label, textClass, tone }: PriorityTagProps) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${textClass} bg-opacity-10`}
    style={{
      backgroundColor: `var(--${tone}-50)`,
    }}
  >
    {label}
  </span>
);

export default PriorityTag;
