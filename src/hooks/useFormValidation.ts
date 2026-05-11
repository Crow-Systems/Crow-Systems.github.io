import { useState, useCallback } from 'react'
import type { ContactFormData, ValidationResult } from '@/types'

const VALIDATORS: Record<string, (value: string) => string | null> = {
  fullName: (v) =>
    !v.trim() ? 'Name is required' : v.trim().length < 2 ? 'Name must be at least 2 characters' : null,
  company: (v) => (!v.trim() ? 'Company is required' : null),
  email: (v) => {
    if (!v.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(v) ? 'Please enter a valid email address' : null
  },
  phone: () => null, // Optional
  serviceArea: (v) => (!v || v === 'Select a service...' ? 'Please select a service area' : null),
  businessProblem: (v) =>
    !v.trim() ? 'Please describe your business problem' : v.trim().length < 20
      ? 'Please provide more detail (at least 20 characters)'
      : null,
  projectGoals: () => null, // Optional
  budgetRange: () => null, // Optional
}

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = useCallback(
    (fieldName: string, value: string): string | null => {
      const validator = VALIDATORS[fieldName]
      const error = validator ? validator(value) : null

      setErrors((prev) => {
        const next = { ...prev }
        if (error) {
          next[fieldName] = error
        } else {
          delete next[fieldName]
        }
        return next
      })

      return error
    },
    [],
  )

  const validateAll = useCallback(
    (data: Partial<ContactFormData>): ValidationResult => {
      const result: Record<string, string> = {}

      Object.entries(VALIDATORS).forEach(([field, validator]) => {
        const value = (data as Record<string, string>)[field] || ''
        const error = validator(value)
        if (error) {
          result[field] = error
        }
      })

      setErrors(result)

      return {
        isValid: Object.keys(result).length === 0,
        errors: result,
      }
    },
    [],
  )

  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  return {
    errors,
    validateField,
    validateAll,
    clearError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0,
  }
}