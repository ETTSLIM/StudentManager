import React, { useRef, useState, useEffect } from 'react'
    import { useSpring, animated } from '@react-spring/web'
    import StudentCard from './StudentCard'
    import './Slider.css'

    const Slider = ({ students, onScoreChange }) => {
      const containerRef = useRef(null)
      const [currentSlide, setCurrentSlide] = useState(0)
      const [slidesPerView, setSlidesPerView] = useState(1)
      const totalSlides = Math.ceil(students.length / slidesPerView)

      const [{ x }, api] = useSpring(() => ({
        x: 0,
        config: { tension: 300, friction: 30 }
      }))

      const updateSlidesPerView = () => {
        const width = window.innerWidth
        if (width >= 1200) setSlidesPerView(4)
        else if (width >= 800) setSlidesPerView(3)
        else if (width >= 600) setSlidesPerView(2)
        else setSlidesPerView(1)
      }

      useEffect(() => {
        updateSlidesPerView()
        window.addEventListener('resize', updateSlidesPerView)
        return () => window.removeEventListener('resize', updateSlidesPerView)
      }, [])

      const goToSlide = (index) => {
        if (index < 0 || index >= totalSlides) return
        setCurrentSlide(index)
        const offset = -index * 100
        api.start({ x: offset })
      }

      return (
        <div className="slider-container" ref={containerRef}>
          <animated.div 
            className="slider-track"
            style={{ transform: x.to(x => `translateX(${x}%)`) }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="slide">
                {students
                  .slice(slideIndex * slidesPerView, (slideIndex + 1) * slidesPerView)
                  .map(student => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onScoreChange={onScoreChange}
                    />
                  ))}
              </div>
            ))}
          </animated.div>

          <button 
            className="slider-nav prev"
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
          >
            &lt;
          </button>

          <button 
            className="slider-nav next"
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === totalSlides - 1}
          >
            &gt;
          </button>

          <div className="slider-dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      )
    }

    export default Slider
