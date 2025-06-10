import React, { useState, useRef, useEffect, useMemo } from 'react';

const monthsShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Define shared sections
const SECTIONS = [
  { key: 'work', label: 'Work', color: '#60a5fa' },
  { key: 'study', label: 'Study', color: '#a78bfa' },
  { key: 'break', label: 'Break', color: '#fbbf24' },
  { key: 'other', label: 'Other', color: '#34d399' },
  { key: 'sleep', label: 'Sleep', color: '#818cf8' },
];

// Improved color palette for intensity (from brightest to darkest)
const INTENSITY_COLORS = ["#f0fdf4", "#60a5fa", "#1e40af"];

function DonutChart({ data }) {
  // Simple SVG donut chart (mock)
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let acc = 0;
  const radius = 65;
  const cx = 95;
  const cy = 85;
  const strokeWidth = 25;
  return (
    <div className="flex flex-col items-center">
      <svg width={180} height={200} viewBox="0 0 180 200">
        {data.map((d, i) => {
          const startAngle = (acc / total) * 2 * Math.PI;
          acc += d.value;
          const endAngle = (acc / total) * 2 * Math.PI;
          const x1 = cx + radius * Math.sin(startAngle);
          const y1 = cy - radius * Math.cos(startAngle);
          const x2 = cx + radius * Math.sin(endAngle);
          const y2 = cy - radius * Math.cos(endAngle);
          const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
          const path = `M${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}`;
          return (
            <path
              key={d.label}
              d={path}
              stroke={d.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={radius - strokeWidth / 2} fill="transparent" />
      </svg>
      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: d.color }}></span>
            <span className="text-sm text-gray-300">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generate mock section data for a month (realistic, total <= 24)
function getMonthSectionData(month, year) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    // Generate plausible hours
    let work = Math.floor(4 + 4 * Math.abs(Math.sin((month + 1) * (i + 1) + year)) + Math.random() * 2);
    let study = Math.floor(2 + 3 * Math.abs(Math.cos((month + 1) * (i + 2) + year)) + Math.random() * 2);
    let breakH = Math.floor(1 + 2 * Math.abs(Math.sin((month + 1) * (i + 3) + year)));
    let other = Math.floor(1 + 2 * Math.abs(Math.cos((month + 1) * (i + 4) + year)));
    let total = work + study + breakH + other;
    if (total > 24) {
      // Scale down proportionally
      work = Math.round(work * 24 / total);
      study = Math.round(study * 24 / total);
      breakH = Math.round(breakH * 24 / total);
      other = Math.max(0, 24 - (work + study + breakH));
    }
    return {
      work,
      study,
      break: breakH,
      other
    };
  });
}

// Generate mock section data for a year (realistic, total <= 24*30 per month)
function getYearSectionData(year) {
  return Array.from({ length: 12 }, (_, i) => {
    let work = Math.floor(80 + 40 * Math.abs(Math.sin((year + 1) * (i + 1))));
    let study = Math.floor(40 + 30 * Math.abs(Math.cos((year + 1) * (i + 2))));
    let breakH = Math.floor(20 + 10 * Math.abs(Math.sin((year + 1) * (i + 3))));
    let other = Math.floor(10 + 10 * Math.abs(Math.cos((year + 1) * (i + 4))));
    let total = work + study + breakH + other;
    const maxMonth = 24 * 30;
    if (total > maxMonth) {
      work = Math.round(work * maxMonth / total);
      study = Math.round(study * maxMonth / total);
      breakH = Math.round(breakH * maxMonth / total);
      other = Math.max(0, maxMonth - (work + study + breakH));
    }
    return {
      work,
      study,
      break: breakH,
      other
    };
  });
}

// Utility to map hours to intensity index (0-4h: 0, 5-9h: 1, 10-15h: 2, 16h+: 2)
function hoursToIntensity(hours) {
  if (hours <= 4) return 0;
  if (hours <= 9) return 1;
  return 2;
}

function MiniMonthHeatmap({ month, year, sectionData }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const intensities = sectionData.map(day => hoursToIntensity(day.work + day.study));
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-[2px]">
        {Array.from({ length: daysInMonth }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded"
            style={{ background: INTENSITY_COLORS[intensities[i]] }}
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-400 mt-1">{monthsShort[month]}</span>
    </div>
  );
}

function CalendarHeatmap({ period, monthIndex, year, weekIndex, dayIndex, onDayClick, monthSectionData }) {
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  let days = [];
  let labels = [];
  if (period === 'Month' || period === 'Day' || period === 'Week') {
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const sectionData = monthSectionData || Array.from({ length: daysInMonth }, () => ({ work: 0, study: 0 }));
    const intensities = sectionData.map(day => hoursToIntensity(day.work + day.study));
    days = Array.from({ length: daysInMonth }, (_, i) => ({
      dayNumber: i + 1,
      intensity: (period === 'Week' && i >= Math.min((weekIndex + 1) * 7, daysInMonth)) ? null : intensities[i]
    }));
    labels = days.map(d => d.dayNumber);
  } else if (period === 'Year') {
    // Show 12 mini heatmaps, one per month
    return (
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <MiniMonthHeatmap key={i} month={i} year={year} sectionData={getMonthSectionData(i, year)} />
        ))}
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-7 gap-2`}>
      {days.map((d, idx) => (
        <div
          key={idx}
          className={`w-8 h-8 rounded flex items-center justify-center relative cursor-pointer ${period === 'Day' && idx === dayIndex ? 'ring-2 ring-blue-400' : d.intensity !== null ? 'bg-gray-700' : 'bg-gray-800 opacity-40'}`}
          onClick={onDayClick && d.intensity !== null ? () => onDayClick(idx) : undefined}
        >
          <div
            className="w-7 h-7 rounded"
            style={{ background: d.intensity !== null ? INTENSITY_COLORS[d.intensity] : 'transparent' }}
          ></div>
          <span className="absolute text-xs text-gray-300 font-medium">
            {d.dayNumber}
          </span>
        </div>
      ))}
    </div>
  );
}

function getDayTimeBreakdown(day) {
  // Split work+study into 7 time slots, with some random variation
  const total = day.work + day.study;
  // Generate 7 random weights, normalize to sum to 1
  let weights = Array.from({ length: 7 }, () => 0.8 + Math.random() * 0.4);
  const sum = weights.reduce((a, b) => a + b, 0);
  weights = weights.map(w => w / sum);
  // Distribute total hours
  return weights.map(w => Math.round(w * total * 10) / 10); // round to 0.1h
}

function LineGraph({ period, dayIndex, lineData, monthSectionData, weekIndex }) {
  let times, values, w, h, padding, graphWidth, graphHeight, xStep, yMax, yLabels, highlight = {};
  if (period === 'Year') {
    times = monthsShort;
    values = lineData || Array.from({ length: 12 }, (_, i) => 10 + Math.round(Math.sin(i) * 10 + Math.random() * 2));
    w = 500;
    h = 340;
    padding = { top: 60, right: 60, bottom: 95, left: 80 };
    yMax = 400;
    yLabels = [0, 100, 200, 300, 400];
  } else if (period === 'Day' && monthSectionData) {
    times = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const day = monthSectionData[dayIndex];
    values = getDayTimeBreakdown(day);
    w = 400;
    h = 300;
    padding = { top: 50, right: 60, bottom: 85, left: 80 };
    yMax = 24;
    yLabels = Array.from({ length: 13 }, (_, i) => i * 2); // 0,2,...,24
  } else if (period === 'Month' && monthSectionData) {
    // X: weeks, Y: total work+study for each week
    const daysInMonth = monthSectionData.length;
    const weeks = Math.ceil(daysInMonth / 7);
    times = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
    values = Array.from({ length: weeks }, (_, i) => {
      const weekDays = monthSectionData.slice(i * 7, (i + 1) * 7);
      return weekDays.reduce((sum, d) => sum + d.work + d.study, 0);
    });
    w = 500;
    h = 300;
    padding = { top: 50, right: 60, bottom: 85, left: 80 };
    yMax = 168; // 7*24
    yLabels = [0, 24, 48, 72, 96, 120, 144, 168];
  } else if (period === 'Week' && monthSectionData) {
    // Week view: show productivity for each day of the week
    const start = weekIndex * 7;
    const weekData = monthSectionData.slice(start, start + 7);
    times = weekData.map((_, i) => `Day ${i + 1}`); // or use weekday names
    values = weekData.map(day => Math.min(24, day.work + day.study));
    // Find peak and lowest
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    highlight = {
      max: values.indexOf(maxVal),
      min: values.indexOf(minVal)
    };
    w = 400;
    h = 300;
    padding = { top: 50, right: 60, bottom: 85, left: 80 };
    yMax = 24;
    yLabels = Array.from({ length: 13 }, (_, i) => i * 2); // 0,2,...,24
  } else {
    times = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    values = lineData || [4, 6, 8, 7, 5, 6, 5];
    w = 400;
    h = 300;
    padding = { top: 50, right: 60, bottom: 85, left: 80 };
    yMax = 24;
    yLabels = Array.from({ length: 13 }, (_, i) => i * 2); // 0,2,...,24
  }
  // Cap all values at yMax
  values = values.map(v => Math.min(yMax, v));
  graphWidth = w - padding.left - padding.right;
  graphHeight = h - padding.top - padding.bottom;
  xStep = graphWidth / (times.length - 1);
  const points = values.map((v, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + graphHeight - (v / yMax) * graphHeight;
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className={period === 'Year' ? 'mt-10' : ''}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Y axis */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={h - padding.bottom} stroke="#4b5563" strokeWidth={1} />
        {/* X axis */}
        <line x1={padding.left} y1={h - padding.bottom} x2={w - padding.right} y2={h - padding.bottom} stroke="#4b5563" strokeWidth={1} />
        {/* Y axis labels */}
        {yLabels.map((v, i) => (
          <text
            key={i}
            x={padding.left - 8}
            y={padding.top + graphHeight - (v / yMax) * graphHeight + 4}
            fontSize="12"
            fill="#9ca3af"
            textAnchor="end"
          >
            {v}
          </text>
        ))}
        {/* X axis labels */}
        {times.map((t, i) => (
          <text
            key={i}
            x={padding.left + i * xStep}
            y={h - padding.bottom + 20}
            fontSize="12"
            fill="#9ca3af"
            textAnchor="middle"
          >
            {t}
          </text>
        ))}
        {/* Line */}
        <polyline
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          points={points}
        />
        {/* Dots */}
        {values.map((v, i) => {
          const x = padding.left + i * xStep;
          const y = padding.top + graphHeight - (v / yMax) * graphHeight;
          let color = '#60a5fa';
          let label = '';
          if (period === 'Week' && i === highlight.max) {
            color = '#fbbf24';
            label = 'Peak';
          } else if (period === 'Week' && i === highlight.min) {
            color = '#ef4444';
            label = 'Lowest';
          }
          return <g key={i}>
            <circle cx={x} cy={y} r={4} fill={color} />
            {label && (
              <text x={x} y={y - 12} fontSize="12" fill={color} textAnchor="middle">{label}</text>
            )}
          </g>;
        })}
        {/* Axis labels */}
        <text
          x={w/2}
          y={h - 35}
          fontSize="14"
          fill="#9ca3af"
          textAnchor="middle"
        >
          {period === 'Year' ? 'Month' : period === 'Month' ? 'Week of Month' : period === 'Week' ? 'Day of Week' : 'Time of Day'}
        </text>
        <text
          x={padding.left - 35}
          y={h/2}
          fontSize={period === 'Year' ? '11' : '14'}
          fill="#9ca3af"
          textAnchor="middle"
          transform={`rotate(-90 ${padding.left - 35},${h/2})`}
        >
          Productivity
        </text>
        {/* Color explanation */}
        <text
          x={w/2}
          y={h - 10}
          fontSize="12"
          fill="#60a5fa"
          textAnchor="middle"
        >
          {period === 'Year' ? 'Blue line shows productivity by month' : period === 'Month' ? 'Each point = week total' : period === 'Week' ? 'Yellow = peak, Red = lowest' : 'Blue line shows productivity level throughout the day'}
        </text>
      </svg>
    </div>
  );
}

// Replace the SpiderGraph component with the provided implementation
const SpiderGraph = ({ data, attributes }) => {
  const svgRef = useRef(null);
  const [width, setWidth] = useState(360);
  const [height, setHeight] = useState(360);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        setWidth(container.clientWidth);
        setHeight(container.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2.5;
  const numAxes = attributes.length;
  const angleSlice = (2 * Math.PI) / numAxes;
  const numLevels = 5;

  const calculatePoint = (value, index, maxVal) => {
    const r = (value / maxVal) * radius;
    const angle = angleSlice * index - Math.PI / 2;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  const generateWebPoints = () => {
    const webPoints = [];
    for (let i = 0; i < numLevels; i++) {
      const levelRadius = ((i + 1) / numLevels) * radius;
      const points = [];
      for (let j = 0; j < numAxes; j++) {
        const angle = angleSlice * j - Math.PI / 2;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      webPoints.push(points.join(' '));
    }
    return webPoints;
  };

  const generateAxisLines = () => {
    const axisLines = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      axisLines.push({ x2: x, y2: y });
    }
    return axisLines;
  };

  const generateDataPoints = (dataSet) => {
    const points = attributes.map((attr, i) => {
      const value = dataSet.values[attr.name] || 0;
      return calculatePoint(value, i, attr.max);
    });
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  const handleMouseEnter = (event, attribute, value, dataSetName) => {
    setHoveredPoint({
      attribute: attribute.name,
      value: value,
      dataSetName: dataSetName,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const renderTooltip = () => {
    if (!hoveredPoint) return null;
    const tooltipStyle = {
      left: hoveredPoint.x + 15,
      top: hoveredPoint.y + 15,
    };
    return (
      <div
        className="absolute bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50 transition-opacity duration-200"
        style={tooltipStyle}
      >
        <p className="font-bold">{hoveredPoint.dataSetName}</p>
        <p>{hoveredPoint.attribute}: {hoveredPoint.value}</p>
      </div>
    );
  };

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Background web (concentric polygons) */}
        {generateWebPoints().map((points, i) => (
          <polygon
            key={`web-level-${i}`}
            points={points}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="1"
            className="transition-all duration-300 ease-in-out"
          />
        ))}
        {/* Axis lines */}
        {generateAxisLines().map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={centerX}
            y1={centerY}
            x2={line.x2}
            y2={line.y2}
            stroke="#a0a0a0"
            strokeWidth="1"
            className="transition-all duration-300 ease-in-out"
          />
        ))}
        {/* Axis labels */}
        {attributes.map((attr, i) => {
          const { x, y } = calculatePoint(attr.max * 1.1, i, attr.max);
          let textAnchor = 'middle';
          if (x < centerX - 10) textAnchor = 'end';
          else if (x > centerX + 10) textAnchor = 'start';
          let dyOffset = 0;
          if (y < centerY - 10) dyOffset = -5;
          else if (y > centerY + 10) dyOffset = 15;
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y + dyOffset}
              textAnchor={textAnchor}
              alignmentBaseline="middle"
              fontSize="0.9em"
              fill="#333"
              fontWeight="bold"
              className="transition-all duration-300 ease-in-out"
            >
              {attr.name}
            </text>
          );
        })}
        {/* Data polygons and points */}
        {data.map((dataSet, dataIndex) => (
          <React.Fragment key={`data-set-${dataIndex}`}>
            <polygon
              points={generateDataPoints(dataSet)}
              fill={dataSet.color}
              stroke={dataSet.borderColor}
              strokeWidth="2"
              fillOpacity="0.6"
              className="transition-all duration-500 ease-in-out hover:fill-opacity-80"
              style={{ filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))` }}
            />
            {attributes.map((attr, attrIndex) => {
              const value = dataSet.values[attr.name] || 0;
              const { x, y } = calculatePoint(value, attrIndex, attr.max);
              return (
                <circle
                  key={`data-point-${dataIndex}-${attrIndex}`}
                  cx={x}
                  cy={y}
                  r="5"
                  fill={dataSet.borderColor}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125"
                  onMouseEnter={(e) => handleMouseEnter(e, attr, value, dataSet.name)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </React.Fragment>
        ))}
      </svg>
      {renderTooltip()}
    </div>
  );
};

export default function Statistics() {
  // Time period switcher state
  const periods = ['Day', 'Week', 'Month', 'Year'];
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Month navigation state
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [monthIndex, setMonthIndex] = useState(5); // Default to June
  const [year, setYear] = useState(new Date().getFullYear());
  const [weekIndex, setWeekIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);

  // Navigation logic
  const getWeeksInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Math.ceil((daysInMonth + firstDay) / 7);
  };

  const handlePrev = () => {
    if (selectedPeriod === 'Month') {
      if (monthIndex === 0) {
        setMonthIndex(11);
        setYear(y => y - 1);
      } else {
        setMonthIndex(m => m - 1);
      }
      setWeekIndex(0);
      setDayIndex(0);
    } else if (selectedPeriod === 'Week') {
      if (weekIndex === 0) {
        // Go to last week of previous month
        if (monthIndex === 0) {
          setMonthIndex(11);
          setYear(y => y - 1);
        } else {
          setMonthIndex(m => m - 1);
        }
        setWeekIndex(getWeeksInMonth(monthIndex === 0 ? 11 : monthIndex - 1, monthIndex === 0 ? year - 1 : year) - 1);
      } else {
        setWeekIndex(w => w - 1);
      }
      setDayIndex(0);
    } else if (selectedPeriod === 'Day') {
      if (dayIndex === 0) {
        if (monthIndex === 0) {
          setMonthIndex(11);
          setYear(y => y - 1);
        } else {
          setMonthIndex(m => m - 1);
        }
        const daysInPrevMonth = new Date(year, monthIndex === 0 ? 12 : monthIndex, 0).getDate();
        setDayIndex(daysInPrevMonth - 1);
      } else {
        setDayIndex(d => d - 1);
      }
    } else if (selectedPeriod === 'Year') {
      setYear(y => y - 1);
    }
  };

  const handleNext = () => {
    if (selectedPeriod === 'Month') {
      if (monthIndex === 11) {
        setMonthIndex(0);
        setYear(y => y + 1);
      } else {
        setMonthIndex(m => m + 1);
      }
      setWeekIndex(0);
      setDayIndex(0);
    } else if (selectedPeriod === 'Week') {
      const weeksInMonth = getWeeksInMonth(monthIndex, year);
      if (weekIndex === weeksInMonth - 1) {
        if (monthIndex === 11) {
          setMonthIndex(0);
          setYear(y => y + 1);
        } else {
          setMonthIndex(m => m + 1);
        }
        setWeekIndex(0);
      } else {
        setWeekIndex(w => w + 1);
      }
      setDayIndex(0);
    } else if (selectedPeriod === 'Day') {
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      if (dayIndex === daysInMonth - 1) {
        if (monthIndex === 11) {
          setMonthIndex(0);
          setYear(y => y + 1);
        } else {
          setMonthIndex(m => m + 1);
        }
        setDayIndex(0);
      } else {
        setDayIndex(d => d + 1);
      }
    } else if (selectedPeriod === 'Year') {
      setYear(y => y + 1);
    }
  };

  // Reset week/day when period changes
  useEffect(() => {
    setWeekIndex(0);
    setDayIndex(0);
  }, [selectedPeriod, monthIndex, year]);

  // Label logic
  let periodLabel = '';
  if (selectedPeriod === 'Month') {
    periodLabel = `${months[monthIndex]} ${year}`;
  } else if (selectedPeriod === 'Week') {
    periodLabel = `Week ${weekIndex + 1} of ${months[monthIndex]} ${year}`;
  } else if (selectedPeriod === 'Day') {
    periodLabel = `${months[monthIndex]} ${dayIndex + 1}, ${year}`;
  } else if (selectedPeriod === 'Year') {
    periodLabel = `${year}`;
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Generate section data for the current period
  const monthSectionData = useMemo(() => getMonthSectionData(monthIndex, year), [monthIndex, year]);
  const yearSectionData = useMemo(() => getYearSectionData(year), [year]);

  // Use these values for all statistics
  let summary, donutData, lineData;
  if (selectedPeriod === 'Day') {
    const day = monthSectionData[dayIndex];
    summary = [
      { label: 'Free Time/Breaks', value: `${Math.max(0, 24 - (day.work + day.study + day.break + day.other))}h` },
      { label: 'Focused Work', value: `${day.work + day.study}h` },
      { label: 'Tasks Done', value: `${Math.round((day.work + day.study) / 2)}` },
    ];
    donutData = SECTIONS.map(s => ({ label: s.label, value: day[s.key], color: s.color }));
    lineData = [day.work + day.study];
  } else if (selectedPeriod === 'Week') {
    const start = weekIndex * 7;
    const weekData = monthSectionData.slice(start, start + 7);
    const totals = SECTIONS.reduce((acc, s) => {
      acc[s.key] = weekData.reduce((sum, d) => sum + d[s.key], 0);
      return acc;
    }, {});
    const totalProductive = totals.work + totals.study;
    summary = [
      { label: 'Free Time/Breaks', value: `${Math.max(0, 7 * 24 - (totals.work + totals.study + totals.break + totals.other))}h` },
      { label: 'Focused Work', value: `${totalProductive}h` },
      { label: 'Tasks Done', value: `${Math.round(totalProductive / 2)}` },
    ];
    donutData = SECTIONS.map(s => ({ label: s.label, value: totals[s.key], color: s.color }));
    lineData = weekData.map(d => d.work + d.study);
  } else if (selectedPeriod === 'Month') {
    const totals = SECTIONS.reduce((acc, s) => {
      acc[s.key] = monthSectionData.reduce((sum, d) => sum + d[s.key], 0);
      return acc;
    }, {});
    const totalProductive = totals.work + totals.study;
    summary = [
      { label: 'Free Time/Breaks', value: `${Math.max(0, 24 * monthSectionData.length - (totals.work + totals.study + totals.break + totals.other))}h` },
      { label: 'Focused Work', value: `${totalProductive}h` },
      { label: 'Tasks Done', value: `${Math.round(totalProductive / 2)}` },
    ];
    donutData = SECTIONS.map(s => ({ label: s.label, value: totals[s.key], color: s.color }));
    lineData = monthSectionData.map(d => d.work + d.study);
  } else if (selectedPeriod === 'Year') {
    const totals = SECTIONS.reduce((acc, s) => {
      acc[s.key] = yearSectionData.reduce((sum, d) => sum + d[s.key], 0);
      return acc;
    }, {});
    const totalProductive = totals.work + totals.study;
    summary = [
      { label: 'Free Time/Breaks', value: `${Math.max(0, 24 * 365 - (totals.work + totals.study + totals.break + totals.other))}h` },
      { label: 'Focused Work', value: `${totalProductive}h` },
      { label: 'Tasks Done', value: `${Math.round(totalProductive / 2)}` },
    ];
    donutData = SECTIONS.map(s => ({ label: s.label, value: totals[s.key], color: s.color }));
    lineData = yearSectionData.map(d => d.work + d.study);
  }

  // Prepare radar data for all periods (move this inside the Statistics component, before return)
  const daySection = monthSectionData[dayIndex];
  // Calculate sleep for the day
  const daySleep = Math.max(0, 24 - (daySection.work + daySection.study + daySection.break + daySection.other));
  const dayValues = [daySection.work, daySection.study, daySection.break, daySection.other, daySleep];
  const start = weekIndex * 7;
  const weekData = monthSectionData.slice(start, start + 7);
  // Calculate sleep for the week
  const weekTotalsRaw = SECTIONS.slice(0, 4).map(s => weekData.reduce((sum, d) => sum + d[s.key], 0));
  const weekSleep = Math.max(0, 7 * 24 - weekTotalsRaw.reduce((a, b) => a + b, 0));
  const weekTotals = [...weekTotalsRaw, weekSleep];
  // Calculate sleep for the month
  const monthTotalsRaw = SECTIONS.slice(0, 4).map(s => monthSectionData.reduce((sum, d) => sum + d[s.key], 0));
  const monthSleep = Math.max(0, monthSectionData.length * 24 - monthTotalsRaw.reduce((a, b) => a + b, 0));
  const monthTotals = [...monthTotalsRaw, monthSleep];
  // Calculate sleep for the year
  const yearTotalsRaw = SECTIONS.slice(0, 4).map(s => yearSectionData.reduce((sum, d) => sum + d[s.key], 0));
  const yearSleep = Math.max(0, 12 * 30 * 24 - yearTotalsRaw.reduce((a, b) => a + b, 0));
  const yearTotals = [...yearTotalsRaw, yearSleep];
  const radarDataSets = [
    { label: 'Day', values: dayValues, color: '#ef4444' },
    { label: 'Week', values: weekTotals, color: '#6366f1' },
    { label: 'Month', values: monthTotals, color: '#10b981' },
    { label: 'Year', values: yearTotals, color: '#f59e42' },
  ];

  const [selectedSection, setSelectedSection] = useState(SECTIONS[0].key);

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-lg font-semibold text-gray-200 min-w-[90px] text-center">
            {periodLabel}
          </span>
          <button
            className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-300"
            onClick={handleNext}
            aria-label="Next"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-800 text-gray-200 font-medium shadow hover:bg-gray-700 transition-colors focus:outline-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {selectedPeriod}
            <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
              {periods.map(period => (
                <button
                  key={period}
                  className={`w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors ${selectedPeriod === period ? 'bg-gray-700 font-semibold' : ''}`}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Row 1: Centered summary bar */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-row gap-6">
          {summary.map((item) => (
            <div key={item.label} className="bg-gray-800 rounded-xl px-8 py-4 flex flex-col items-center shadow min-w-[120px]">
              <span className="text-lg font-semibold text-gray-400">{item.label}</span>
              <span className="text-2xl font-bold mt-1">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Row 2: Three-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
        {/* Left: Time Spent Overview (SpiderGraph) */}
        <div className="bg-gray-800 rounded-xl p-8 flex flex-col items-center shadow">
          <h2 className="text-xl font-semibold mb-4">Time Spent Overview</h2>
          <SpiderGraph
            data={[
              {
                name: selectedPeriod,
                values: Object.fromEntries(SECTIONS.map((s, i) => {
                  let val = (
                    selectedPeriod === 'Day' ? dayValues[i] :
                    selectedPeriod === 'Week' ? weekTotals[i] :
                    selectedPeriod === 'Month' ? monthTotals[i] :
                    yearTotals[i]
                  );
                  // If value is exactly zero, set a small minimum for visibility
                  if (val === 0) val = 0.2;
                  return [s.label, val];
                })),
                color: SECTIONS.find(s => s.key === selectedSection).color + '80',
                borderColor: SECTIONS.find(s => s.key === selectedSection).color,
              },
            ]}
            attributes={(() => {
              // Get the values for the selected period
              const values = SECTIONS.map((s, i) => (
                selectedPeriod === 'Day' ? dayValues[i] :
                selectedPeriod === 'Week' ? weekTotals[i] :
                selectedPeriod === 'Month' ? monthTotals[i] :
                yearTotals[i]
              ));
              // Use a minimum of 1 for max to avoid division by zero
              const dynamicMax = Math.max(...values, 1);
              return SECTIONS.map((s) => ({ name: s.label, max: dynamicMax, color: s.color }));
            })()}
          />
          <div className="flex gap-4 mt-4 flex-wrap justify-center">
            {SECTIONS.map((s) => (
              <button
                key={s.label}
                className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${selectedSection === s.key ? 'bg-white/10 ring-2 ring-white' : 'hover:bg-white/5'}`}
                onClick={() => setSelectedSection(s.key)}
                style={{ outline: 'none', border: 'none' }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: s.color }}></span>
                <span className="text-sm text-gray-300">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Center: Study/Work Intensity (heatmap) */}
        <div className="bg-gray-800 rounded-xl p-8 shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 md:mb-2">Study/Work Intensity</h2>
          <CalendarHeatmap period={selectedPeriod} monthIndex={monthIndex} year={year} weekIndex={weekIndex} dayIndex={dayIndex} onDayClick={selectedPeriod === 'Day' ? (idx) => setDayIndex(idx) : undefined} monthSectionData={monthSectionData} />
          <div className="text-xs text-gray-400 mt-3">Darker = more study/work</div>
        </div>
        {/* Right: Concentration & Breaks (line graph) */}
        <div className="bg-gray-800 rounded-xl p-8 shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Concentration & Breaks</h2>
          <LineGraph period={selectedPeriod} dayIndex={dayIndex} lineData={lineData} monthSectionData={monthSectionData} weekIndex={weekIndex} />
          <div className="text-xs text-gray-400 mt-3">Graph of concentration, breaks, learning, etc.</div>
        </div>
      </div>
      {/* Row 3: AI Advice and Next Week Planner side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* AI Advice */}
        <div className="bg-gray-800 rounded-xl p-8 shadow flex flex-col items-center min-h-[180px] md:min-h-[220px] w-full">
          <h2 className="text-xl font-semibold mb-4">AI Advice</h2>
          <div className="text-gray-300 mb-4 text-center">Try to take more regular breaks and focus on your main goals. AI will suggest improvements based on your behavior.</div>
        </div>
        {/* Next Week Planner */}
        <div className="bg-gray-800 rounded-xl p-8 shadow w-full">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Next Week Planner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-400 mb-2">Morning Focus</h3>
                  <p className="text-gray-300">Schedule 2-hour study blocks in the morning when your concentration is highest.</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-400 mb-2">Afternoon Balance</h3>
                  <p className="text-gray-300">Add 2 extra breaks in the afternoon to maintain energy levels.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-purple-400 mb-2">Evening Review</h3>
                  <p className="text-gray-300">Dedicate 30 minutes each evening to review and plan the next day's tasks.</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-400 mb-2">Suggested Schedule</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <div className="flex justify-between">
                      <span>Morning Study</span>
                      <span>9:00 - 11:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Break</span>
                      <span>11:00 - 11:15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Afternoon Work</span>
                      <span>13:00 - 15:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <button className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors">
                Apply Schedule
              </button>
              <button className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
