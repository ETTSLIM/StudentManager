import React, { useRef } from 'react'
    import './CSVHandler.css'

    const CSVHandler = ({ onImport, onExport, students }) => {
      const fileInputRef = useRef(null)

      const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const csvText = event.target.result
            const lines = csvText.split('\n')
            const headers = lines[0].toLowerCase().trim().split(',')

            // Validate CSV structure
            const requiredFields = ['name']
            const missingFields = requiredFields.filter(field => !headers.includes(field))
            
            if (missingFields.length > 0) {
              alert(`Missing required fields: ${missingFields.join(', ')}`)
              return
            }

            const importedStudents = lines
              .slice(1)
              .filter(line => line.trim())
              .map(line => {
                const values = line.split(',').map(val => val.trim())
                const studentData = {}

                headers.forEach((header, index) => {
                  studentData[header] = values[index]
                })

                return {
                  massar_numbr: parseInt(studentData.massar_numbr) || Math.floor(Math.random() * 10000),
                  name: studentData.name,
                  photo: studentData.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`,
                  scores: {
                    x: parseInt(studentData.x_score) || 0,
                    y: parseInt(studentData.y_score) || 0,
                    mean: parseInt(studentData.mean_score) || 0
                  }
                }
              })

            onImport(importedStudents)
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          } catch (error) {
            console.error('CSV Import Error:', error)
            alert('Error importing CSV file. Please check the file format.')
          }
        }

        reader.readAsText(file)
      }

      const handleExport = () => {
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
        <div className="csv-handler">
          <div className="csv-buttons">
            <label className="csv-button import">
              Import CSV
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            <button className="csv-button export" onClick={handleExport}>
              Export CSV
            </button>
          </div>
          <div className="csv-info">
            <h3>CSV Format:</h3>
            <pre>
              massar_numbr,name,photo,x_score,y_score,mean_score
              1,John Doe,,15,18,16
              2,Jane Smith,,12,14,13
            </pre>
          </div>
        </div>
      )
    }

    export default CSVHandler
