import React, { useState, useMemo } from 'react'
    import './StudentList.css'

    const StudentList = ({ students }) => {
      const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
      })

      // Sorting logic
      const sortedStudents = useMemo(() => {
        if (!sortConfig.key) return students

        return [...students].sort((a, b) => {
          let aValue, bValue

          if (sortConfig.key === 'score') {
            aValue = a.scores.y;
            bValue = b.scores.y;
          } else if (sortConfig.key === 'massar_numbr') {
            aValue = a.massar_numbr;
            bValue = b.massar_numbr;
          } else if (sortConfig.key === 'name') {
            aValue = a.name;
            bValue = b.name;
          } else {
            return 0; // No valid sort key
          }

          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1
          }
          return 0
        })
      }, [students, sortConfig])

      // Function to handle sorting
      const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc'
        }
        setSortConfig({ key, direction })
      }

      // Function to get sort icon
      const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕'
        return sortConfig.direction === 'asc' ? '↑' : '↓'
      }

      return (
        <div className="student-list-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Massar Number</th>
                <th>Photo</th>
                <th>Name</th>
                <th onClick={() => requestSort('score')} className="sortable">
                  Score {getSortIcon('score')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map(student => (
                <tr key={student.massar_numbr}>
                  <td>{student.massar_numbr}</td>
                  <td>
                    <div className="student-photo-container">
                      <img 
                        src={student.photo} 
                        alt={student.name}
                        className="student-photo"
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
                        }}
                      />
                    </div>
                  </td>
                  <td>{student.name}</td>
                  <td>{student.scores.y.toFixed(2).replace('.', ',')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    export default StudentList
