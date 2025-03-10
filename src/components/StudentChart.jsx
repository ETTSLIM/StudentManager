import React, { useState, useRef, useEffect } from 'react';
import './StudentChart.css';

const StudentChart = ({ students, onScoreChange }) => {
  const CHART_SIZE = 600;
  const PADDING = 40;
  const PHOTO_SIZE = 40;
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartContainerRef = useRef(null);

  const toggleFullscreen = () => {
    const element = chartContainerRef.current;
    if (!element) {
      console.error("Chart container not found.");
      return;
    }

    if (!document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const formatNumber = (num) => num.toFixed(2).replace('.', ',');

  const getChartPosition = (score) => (score - 10) * (CHART_SIZE - 2 * PADDING) / 10 + PADDING;

  const getScoreFromPosition = (position) => Math.min(Math.max(((position - PADDING) * 10) / (CHART_SIZE - 2 * PADDING) + 10, 10), 20);

  const handleDown = (student, clientX, clientY) => (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = getChartPosition(student.scores.x);
    const yPos = CHART_SIZE - getChartPosition(student.scores.y);
    const offsetX = clientX - (xPos - PHOTO_SIZE / 2 + rect.left);
    const offsetY = clientY - (yPos - PHOTO_SIZE / 2 + rect.top);

    setDraggedStudent({ ...student, offsetX, offsetY });
    e.preventDefault();
  };

  const handleMove = (e) => {
    if (!draggedStudent) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newX = Math.min(Math.max(clientX - rect.left - draggedStudent.offsetX, PADDING), CHART_SIZE - PADDING);
    const newY = Math.min(Math.max(clientY - rect.top - draggedStudent.offsetY, PADDING), CHART_SIZE - PADDING);

    const xScore = getScoreFromPosition(newX);
    const yScore = getScoreFromPosition(CHART_SIZE - newY);

    onScoreChange(draggedStudent.massar_numbr, { x: xScore, y: yScore });
  };

  const handleUp = () => {
    setDraggedStudent(null);
  };

  return (
    <div className="chart-container" ref={chartContainerRef}>
      <button className="fullscreen-button" onClick={toggleFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </button>
      <svg width={CHART_SIZE} height={CHART_SIZE}>
        {Array.from({ length: 11 }).map((_, i) => {
          const score = i + 10;
          const position = getChartPosition(score);
          return (
            <React.Fragment key={i}>
              <line x1={PADDING} y1={position} x2={CHART_SIZE - PADDING} y2={position} stroke="#e2e8f0" strokeWidth="1" />
              <line x1={position} y1={PADDING} x2={position} y2={CHART_SIZE - PADDING} stroke="#e2e8f0" strokeWidth="1" />
            </React.Fragment>
          );
        })}
        <line x1={PADDING} y1={CHART_SIZE - PADDING} x2={CHART_SIZE - PADDING} y2={CHART_SIZE - PADDING} stroke="#4a5568" strokeWidth="2" />
        <line x1={PADDING} y1={PADDING} x2={PADDING} y2={CHART_SIZE - PADDING} stroke="#4a5568" strokeWidth="2" />
        {Array.from({ length: 11 }).map((_, i) => {
          const score = i + 10;
          const position = getChartPosition(score);
          return (
            <React.Fragment key={i}>
              <text x={position} y={CHART_SIZE - PADDING + 20} textAnchor="middle" fontSize="12" fill="#4a5568">
                {formatNumber(score)}
              </text>
              <text x={PADDING - 10} y={CHART_SIZE - position} textAnchor="end" fontSize="12" fill="#4a5568" dominantBaseline="middle">
                {formatNumber(score)}
              </text>
            </React.Fragment>
          );
        })}
        {students.map((student) => {
          const xPos = getChartPosition(student.scores.x);
          const yPos = CHART_SIZE - getChartPosition(student.scores.y);

          return (
            <g key={`${student.massar_numbr}-g`} transform={`translate(${xPos}, ${yPos})`}>
              <foreignObject
                x={-PHOTO_SIZE / 2}
                y={-PHOTO_SIZE / 2}
                width={PHOTO_SIZE}
                height={PHOTO_SIZE}
                style={{ touchAction: 'none' }}
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clientX = e.clientX;
                  const clientY = e.clientY;
                  handleDown(student, clientX, clientY)(e);
                }}
                onTouchStart={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clientX = e.touches[0].clientX;
                  const clientY = e.touches[0].clientY;
                  handleDown(student, clientX, clientY)(e);
                }}
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                onMouseUp={handleUp}
                onTouchEnd={handleUp}
                onTouchCancel={handleUp}
              >
                <div className="chart-student-photo">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="student-photo"
                    onError={(e) => {
                      if (!student.photo.startsWith('https://')) {
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`;
                      }
                    }}
                  />
                </div>
              </foreignObject>
              <text x={0} y={PHOTO_SIZE / 2 + 15} textAnchor="middle" fontSize="14" fill="#2d3748" fontWeight="500">
                {formatNumber(student.scores.y)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default StudentChart;
