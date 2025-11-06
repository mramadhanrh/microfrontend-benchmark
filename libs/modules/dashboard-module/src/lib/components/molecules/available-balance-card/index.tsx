const AvailableBalanceCard = () => {
  const layers = [
    { value: 4000, color: '#1a4d4d', label: '$4k', percentage: 12.5 },
    { value: 6000, color: '#5a8a8a', label: '$6k', percentage: 18.75 },
    { value: 10000, color: '#8ab5b5', label: '$10k', percentage: 31.25 },
    { value: 12000, color: '#b5d4d4', label: '$12k', percentage: 37.5 },
  ];

  const total = 32000;
  const centerValue = '$4k';

  // Calculate cumulative percentages for the donut chart
  let cumulative = 0;
  const processedLayers = layers.map((layer) => {
    const startPercent = cumulative;
    const endPercent = cumulative + layer.percentage;
    cumulative = endPercent;
    return {
      ...layer,
      startPercent,
      endPercent,
    };
  });

  return (
    <div className="bg-[#0F0F0F] rounded-xl p-6 md:p-8 border border-[#2D2D2D] hover:border-[#404040] transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-white text-xl font-semibold mb-6">Available</h3>

      {/* Donut Chart */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-56 h-56 group">
          {/* SVG Donut Chart */}
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox="0 0 200 200"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#2D2D2D"
              strokeWidth="32"
              className="transition-all duration-300"
            />

            {/* Donut segments */}
            {processedLayers.map((layer, index) => {
              const radius = 80;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = circumference;
              const strokeDashoffset =
                circumference - (layer.percentage / 100) * circumference;
              const rotation = (layer.startPercent / 100) * 360;

              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={layer.color}
                  strokeWidth="32"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '100px 100px',
                  }}
                  className="transition-all duration-700 ease-out hover:stroke-[#E8232C] cursor-pointer"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                {centerValue}
              </p>
              <p className="text-[#858585] text-sm mt-1">Available</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
          {layers.map((layer, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 cursor-pointer group"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300 shadow-lg"
                style={{
                  backgroundColor: layer.color,
                  boxShadow: `0 0 12px ${layer.color}40`,
                }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm group-hover:text-[#E8232C] transition-colors duration-300">
                  {layer.label}
                </p>
                <p className="text-[#858585] text-xs">
                  {layer.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-[#2D2D2D]">
        <div className="flex items-center justify-between">
          <span className="text-[#B3B3B3] text-sm font-medium">
            Total Balance
          </span>
          <span className="text-white text-lg font-bold">
            ${(total / 1000).toFixed(0)}k
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailableBalanceCard;
