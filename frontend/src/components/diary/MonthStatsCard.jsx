import React, { useState, useEffect } from 'react'
import SelectMonthYear from '../common/SelectMonthYear'
import SubmitButton from '../common/SubmitButton'
import { getMonthStats } from '../../utils/diary'

const AnalysisCard = () => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  })
  const [errors, setErrors] = useState({})
  const [stats, setStats] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value })

    // Clear error when field is changed
    if (errors[name]) {
      const updatedErrors = { ...errors }
      delete updatedErrors[name]
      setErrors(updatedErrors)
    }
  }

  const validateForm = () => {
    const currentYear = new Date().getFullYear()
    const newErrors = {}

    if (formData.year < 1900 || formData.year > currentYear + 5) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 5}`
    }

    if (formData.month < 1 || formData.month > 12) {
      newErrors.month = 'Month must be between 1 and 12'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        const data = await getMonthStats(formData.year, formData.month)
        setStats(data)
        setErrorMessage('') // Clear any previous error message
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage('No records found for this period.')
          setStats(null) // Clear previous stats
        } else {
          console.error('Error fetching month stats:', error)
          alert('An error occurred while fetching month stats. Please try again.')
        }
      }
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Month Statistics</h5>
        <form onSubmit={handleSubmit}>
          <SelectMonthYear
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
          <div className="d-flex justify-content-start mt-3">
            <SubmitButton label="Get Stats" type="submit" />
          </div>
        </form>
        {errorMessage && (
          <div className="mt-4 text-danger">
            <p>{errorMessage}</p>
          </div>
        )}
        {stats && (
          <div className="mt-4">
            <h6>Analysis for {formData.month}/{formData.year}</h6>
            <p>Average Pain Score: {stats.average_pain_score}</p>
            <p>Number of Cluster Days: {stats.number_of_cluster_days}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisCard