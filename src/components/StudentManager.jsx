import React, { useState, useRef } from 'react'
    import './StudentManager.css'

    const StudentManager = ({ students, onUpdate }) => {
      const [newStudent, setNewStudent] = useState({ 
        name: '', 
        photoUrl: '',
        gender: 'male' 
      })
      const fileInputRef = useRef(null)
      
      const addStudent = (e) => {
        e.preventDefault()
        const id = Math.max(0, ...students.map(s => s.id)) + 1
        onUpdate([...students, {
          id,
          name: newStudent.name,
          photo: newStudent.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudent.name}&gender=${newStudent.gender}`,
          gender: newStudent.gender,
          scores: { x: 0, y: 0, mean: 0 }
        }])
        setNewStudent({ name: '', photoUrl: '', gender: 'male' })
      }

      const handleCSVUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const csvData = event.target.result
            const lines = csvData.split('\n')
            const headers = lines[0].toLowerCase().split(',')
            
            const idIndex = headers.indexOf('id')
            const nameIndex = headers.indexOf('name')
            const photoIndex = headers.indexOf('photo')
            const genderIndex = headers.indexOf('gender')
            const xScoreIndex = headers.indexOf('x_score')
            const yScoreIndex = headers.indexOf('y_score')

            const importedStudents = lines
              .slice(1)
              .filter(line => line.trim())
              .map(line => {
                const values = line.split(',')
                const name = values[nameIndex]?.trim() || 'Unknown'
                const gender = values[genderIndex]?.trim().toLowerCase() || 'male'
                const x = parseInt(values[xScoreIndex]) || 0
                const y = parseInt(values[yScoreIndex]) || 0

                return {
                  id: parseInt(values[idIndex]) || Math.random() * 10000,
                  name,
                  gender,
                  photo: values[photoIndex]?.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&gender=${gender}`,
                  scores: {
                    x,
                    y,
                    mean: Math.round((x + y) / 2)
                  }
                }
              })

            onUpdate(importedStudents)
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          }
          reader.readAsText(file)
        }
      }

      const exportToCSV = () => {
        const headers = ['id', 'name', 'photo', 'gender', 'x_score', 'y_score', 'mean_score']
        const csvContent = [
          headers.join(','),
          ...students.map(student => [
            student.id,
            student.name,
            student.photo,
            student.gender,
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
            <select
              value={newStudent.gender}
              onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button type="submit">Add Student</button>
          </form>
        </div>
      )
    }

    export default StudentManager
