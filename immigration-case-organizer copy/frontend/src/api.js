const API_BASE = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export const getCases = () => request('/cases')
export const createCase = data => request('/cases', { method: 'POST', body: JSON.stringify(data) })
export const updateCase = (id, data) => request(`/cases/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteCase = id => request(`/cases/${id}`, { method: 'DELETE' })

export const getDocuments = caseId => request(`/cases/${caseId}/documents`)
export const createDocument = (caseId, data) => request(`/cases/${caseId}/documents`, { method: 'POST', body: JSON.stringify(data) })

export const getDeadlines = caseId => request(`/cases/${caseId}/deadlines`)
export const createDeadline = (caseId, data) => request(`/cases/${caseId}/deadlines`, { method: 'POST', body: JSON.stringify(data) })
