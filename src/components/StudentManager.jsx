import React, { useState, useRef } from 'react'
    import './StudentManager.css'

    const StudentManager = ({ students, onUpdate }) => {
      const [newStudent, setNewStudent] = useState({ 
        name: '', 
        photoUrl: ''
      })
      const fileInputRef = useRef(null)
      
      const addStudent = (e) => {
        e.preventDefault()
        let massar_numbr = 1;
        if (students.length > 0) {
          massar_numbr = Math.max(0, ...students.map(s => s.massar_numbr)) + 1
        }
        onUpdate([...students, {
          massar_numbr,
          name: newStudent.name,
          photo: newStudent.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudent.name}`,
          scores: { x: 0, y: 0, mean: 0 }
        }])
        setNewStudent({ name: '', photoUrl: '' });
      }

      const handleCSVUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const csvData = event.target.result
            const lines = csvData.split('\n')
            const headers = lines[0].toLowerCase().split(',')
            
            const massarNumbrIndex = headers.indexOf('massar_numbr')
            const nameIndex = headers.indexOf('name')
            const photoIndex = headers.indexOf('photo')
            const xScoreIndex = headers.indexOf('x_score')
            const yScoreIndex = headers.indexOf('y_score')

            const importedStudents = lines
              .slice(1)
              .filter(line => line.trim())
              .map(line => {
                const values = line.split(',')
                const name = values[nameIndex]?.trim() || 'Unknown'
                const x = parseInt(values[xScoreIndex]) || 0
                const y = parseInt(values[yScoreIndex]) || 0

                return {
                  massar_numbr: values[massarNumbrIndex]?.trim() || Math.random() * 10000,
                  name,
                  photo: values[photoIndex]?.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                  scores: {
                    x,
                    y,
                    mean: Math.round((x + y) / 2)
                  }
                }
              });

            onUpdate(importedStudents)
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          }
          reader.readAsText(file)
        }
      }

      const exportToCSV = () => {
        const headers = ['massar_numbr', 'name', 'photo', 'x_score', 'y_score', 'mean_score']
        const csvContent = [
          headers.join(','),
          ...students.map(student => [
            student.massar_numbr,
            student.name,
            student.photo,
            student.scores.x,
            student.scores.y,
            student.scores.mean
          ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'students-evaluation.csv'
        link.click()
        URL.revokeObjectURL(url)
      }

      return (
        <div className="student-manager">
          <div className="manager-actions">
            <button onClick={exportToCSV} className="action-button">
              Export CSV
            </button>
            <label className="action-button">
              Import CSV
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <form onSubmit={addStudent} className="add-student-form">
            <input
              type="text"
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Photo URL (optional)"
              value={newStudent.photoUrl}
              onChange={(e) => setNewStudent({ ...newStudent, photoUrl: e.target.value })}
            />
            <button type="submit">Add Student</button>
          </form>
        </div>
      )
    }

    export default StudentManager
