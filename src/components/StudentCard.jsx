import React, { useState } from 'react'
    import { useSpring, animated } from '@react-spring/web'
    import './StudentCard.css'

    const StudentCard = ({ student, onScoreChange }) => {
      const [score, setScore] = useState(student.score)
      const [isDragging, setIsDragging] = useState(false)

      const [{ x }, api] = useSpring(() => ({
        x: score * 5,
        config: { tension: 300, friction: 30 }
      }))

      const handleMouseDown = () => {
        setIsDragging(true)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }

      const handleMouseMove = (e) => {
        if (!isDragging) return
        const rect = e.currentTarget.getBoundingClientRect()
        const newX = Math.min(Math.max(e.clientX - rect.left, 0), 100)
        const newScore = Math.round(newX / 5)
        setScore(newScore)
        api.start({ x: newX })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        onScoreChange(student.id, score)
      }

      return (
        <div className="student-card">
          <img 
            src={student.photo} 
            alt={student.name} 
            className="student-photo"
            loading="lazy"
          />
          <div className="slider-container">
            <div className="slider" onMouseDown={handleMouseDown}>
              <animated.div className="slider-track" style={{ width: x.to(v => `${v}%`) }} />
              <animated.div 
                className={`slider-thumb ${isDragging ? 'grabbing' : ''}`}
                style={{ left: x.to(v => `${v}%`) }}
              />
            </div>
            <div className="score">{score}</div>
          </div>
        </div>
      )
    }

    export default StudentCard
