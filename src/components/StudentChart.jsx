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

      // Convert score to chart position
      const getChartPosition = (score) => {
        return (score * (CHART_SIZE - 2 * PADDING) / 20) + PADDING
      }

      // Convert position to score
      const getScoreFromPosition = (position) => {
        const rawScore = ((position - PADDING) * 20) / (CHART_SIZE - 2 * PADDING)
        return Math.min(Math.max(rawScore, 0), 20)
      }

      // Handle mouse down event for dragging
      const handleMouseDown = (student) => (e) => {
        setDraggedStudent(student)
        e.preventDefault()
      }

      // Handle mouse move event for dragging
      const handleMouseMove = (e) => {
        if (!draggedStudent) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.min(Math.max(e.clientX - rect.left, PADDING), CHART_SIZE - PADDING)
        const y = Math.min(Math.max(e.clientY - rect.top, PADDING), CHART_SIZE - PADDING)
        
        const xScore = getScoreFromPosition(x)
        const yScore = getScoreFromPosition(CHART_SIZE - y)

        onScoreChange(draggedStudent.id, {
          x: xScore,
          y: yScore
        })
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
          >
            {/* Grid lines */}
            {Array.from({ length: 21 }).map((_, i) => {
              const position = getChartPosition(i)
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
            {Array.from({ length: 21 }).map((_, i) => {
              const position = getChartPosition(i)
              return (
                <React.Fragment key={i}>
                  <text
                    x={position}
                    y={CHART_SIZE - PADDING + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#4a5568"
                  >
                    {formatNumber(i)}
                  </text>
                  <text
                    x={PADDING - 10}
                    y={CHART_SIZE - position}
                    textAnchor="end"
                    fontSize="12"
                    fill="#4a5568"
                    dominantBaseline="middle"
                  >
                    {formatNumber(i)}
                  </text>
                </React.Fragment>
              )
            })}

            {/* Students */}
            {students.map(student => {
              const xPos = getChartPosition(student.scores.x)
              const yPos = CHART_SIZE - getChartPosition(student.scores.y)
              
              return (
                <g key={student.id}>
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
                          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}&gender=${student.gender}`
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
