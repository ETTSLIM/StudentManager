import React, { useState } from 'react'
    import './StudentChart.css'

    const StudentChart = ({ students, onScoreChange }) => {
      // Define chart constants
      const CHART_SIZE = 600 // Size of the chart (width and height)
      const PADDING = 40 // Padding around the chart
      const PHOTO_SIZE = 40 // Size of student photos
      const [draggedStudent, setDraggedStudent] = useState(null)

      // Function to format numbers with two decimal places and comma as separator
      const formatNumber = (num) => {
        return num.toFixed(2).replace('.', ',')
      }

      // Convert score to chart position (10-20 scale)
      const getChartPosition = (score) => {
        const adjustedScore = score - 10;
        return (adjustedScore * (CHART_SIZE - 2 * PADDING) / 10) + PADDING;
      }

      // Convert position to score (10-20 scale)
      const getScoreFromPosition = (position) => {
        const rawScore = ((position - PADDING) * 10) / (CHART_SIZE - 2 * PADDING);
        return Math.min(Math.max(rawScore + 10, 10), 20);
      }

     // Handle mouse and touch down event for dragging
     const handleMouseDown = (student) => (e) => {
      setDraggedStudent(student);
      e.preventDefault(); // Prevent default mouse/touch behavior

      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
    }

      // Handle mouse move event for dragging
      const handleMouseMove = (e) => {
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
        const x = Math.min(Math.max(clientX - rect.left, PADDING), CHART_SIZE - PADDING);
        const y = Math.min(Math.max(clientY - rect.top, PADDING), CHART_SIZE - PADDING);

        const xScore = getScoreFromPosition(x);
        const yScore = getScoreFromPosition(CHART_SIZE - y);

        onScoreChange(draggedStudent.massar_numbr, {
          x: xScore,
          y: yScore
        });
      }

      // Handle mouse up event for dragging
      const handleMouseUp = () => {
        setDraggedStudent(null)
      }

      return (
        <div className="chart-container">
          <svg 
            width={CHART_SIZE} 
            height={CHART_SIZE}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onTouchCancel={handleMouseUp}
          >
            {/* Grid lines */}
            {Array.from({ length: 11 }).map((_, i) => {
              const score = i + 10;
              const position = getChartPosition(score);
              return (
                <React.Fragment key={i}>
                  <line
                    x1={PADDING}
                    y1={position}
                    x2={CHART_SIZE - PADDING}
                    y2={position}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <line
                    x1={position}
                    y1={PADDING}
                    x2={position}
                    y2={CHART_SIZE - PADDING}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </React.Fragment>
              )
            })}

            {/* Axes */}
            <line
              x1={PADDING}
              y1={CHART_SIZE - PADDING}
              x2={CHART_SIZE - PADDING}
              y2={CHART_SIZE - PADDING}
              stroke="#4a5568"
              strokeWidth="2"
            />
            <line
              x1={PADDING}
              y1={PADDING}
              x2={PADDING}
              y2={CHART_SIZE - PADDING}
              stroke="#4a5568"
              strokeWidth="2"
            />

            {/* Axis labels */}
            {Array.from({ length: 11 }).map((_, i) => {
              const score = i + 10;
              const position = getChartPosition(score);
              return (
                <React.Fragment key={i}>
                  <text
                    x={position}
                    y={CHART_SIZE - PADDING + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#4a5568"
                  >
                    {formatNumber(score)}
                  </text>
                  <text
                    x={PADDING - 10}
                    y={CHART_SIZE - position}
                    textAnchor="end"
                    fontSize="12"
                    fill="#4a5568"
                    dominantBaseline="middle"
                  >
                    {formatNumber(score)}
                  </text>
                </React.Fragment>
              )
            })}

            {/* Students */}
            {students.map(student => {
              const xPos = getChartPosition(student.scores.x)
              const yPos = CHART_SIZE - getChartPosition(student.scores.y)
              
              return (
                <g key={student.massar_numbr}>
                  <foreignObject
                    x={xPos - PHOTO_SIZE/2}
                    y={yPos - PHOTO_SIZE/2}
                    width={PHOTO_SIZE}
                    height={PHOTO_SIZE}
                    onMouseDown={handleMouseDown(student)}
                  >
                    <div className="chart-student-photo">
                      <img
                        src={student.photo}
                        alt={student.name}
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
                        }}
                      />
                    </div>
                  </foreignObject>
                  <text
                    x={xPos}
                    y={yPos + PHOTO_SIZE/2 + 15}
                    textAnchor="middle"
                    fontSize="14"
                    fill="#2d3748"
                    fontWeight="500"
                  >
                    {formatNumber(student.scores.y)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      )
    }

    export default StudentChart
