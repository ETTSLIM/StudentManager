import React, { useState } from 'react'
    import StudentManager from './components/StudentManager'
    import StudentList from './components/StudentList'
    import StudentChart from './components/StudentChart'
    import CSVHandler from './components/CSVHandler'
    import './App.css'

    const App = () => {
      const [students, setStudents] = useState(() => 
        Array.from({ length: 20 }, (_, i) => {
          const x = Math.floor(Math.random() * 21)
          const y = Math.floor(Math.random() * 21)
          const gender = Math.random() > 0.5 ? 'male' : 'female'
          const name = `Student ${i + 1}`
          return {
            id: i + 1,
            name,
            gender,
            photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&gender=${gender}`,
            scores: {
              x,
              y,
              mean: Math.round((x + y) / 2)
            }
          }
        })
      )

      const handleScoreChange = (id, scores) => {
        setStudents(prev =>
          prev.map(student =>
            student.id === id ? { ...student, scores } : student
          )
        )
      }

      const handleImport = (importedStudents) => {
        setStudents(importedStudents)
      }

      return (
        <div className="container">
          <h1>Student Evaluation Chart</h1>
          <CSVHandler 
            students={students}
            onImport={handleImport}
          />
          <StudentChart students={students} onScoreChange={handleScoreChange} />
          <StudentManager students={students} onUpdate={setStudents} />
          <StudentList students={students} />
        </div>
      )
    }

    export default App
