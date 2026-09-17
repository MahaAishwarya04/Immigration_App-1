import { useEffect, useMemo, useState } from 'react'
import {
  getCases, createCase, updateCase, deleteCase,
  getDocuments, createDocument,
  getDeadlines, createDeadline
} from './api'

const statuses = ['PLANNING', 'PREPARING', 'FILED', 'RECEIVED', 'RFE', 'APPROVED', 'DENIED', 'CLOSED']

function App() {
  const [cases, setCases] = useState([])
  const [selected, setSelected] = useState(null)
  const [documents, setDocuments] = useState([])
  const [deadlines, setDeadlines] = useState([])
  const [error, setError] = useState('')

  const [caseForm, setCaseForm] = useState({
    caseName: '', visaCategory: 'EB-2', receiptNumber: '', filingDate: '', status: 'PLANNING'
  })

  const [docForm, setDocForm] = useState({
    name: '', category: 'Identity', expirationDate: '', status: 'NOT_STARTED'
  })

  const [deadlineForm, setDeadlineForm] = useState({
    title: '', dueDate: '', completed: false
  })

  const loadCases = async () => {
    try {
      setCases(await getCases())
      setError('')
    } catch (e) {
      setError('Could not connect to the backend. Make sure Spring Boot is running on port 8080.')
    }
  }

  useEffect(() => { loadCases() }, [])

  const dashboard = useMemo(() => ({
    total: cases.length,
    active: cases.filter(c => !['APPROVED', 'DENIED', 'CLOSED'].includes(c.status)).length,
    approved: cases.filter(c => c.status === 'APPROVED').length
  }), [cases])

  const selectCase = async (item) => {
    setSelected(item)
    try {
      const [docs, due] = await Promise.all([getDocuments(item.id), getDeadlines(item.id)])
      setDocuments(docs)
      setDeadlines(due)
    } catch (e) {
      setError('Unable to load case details.')
    }
  }

  const handleCaseSubmit = async (e) => {
    e.preventDefault()
    try {
      const created = await createCase(caseForm)
      setCases(prev => [...prev, created])
      setCaseForm({ caseName: '', visaCategory: 'EB-2', receiptNumber: '', filingDate: '', status: 'PLANNING' })
      selectCase(created)
    } catch (e) {
      setError('Unable to create the case.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this case?')) return
    await deleteCase(id)
    if (selected?.id === id) setSelected(null)
    await loadCases()
  }

  const handleStatus = async (status) => {
    if (!selected) return
    const updated = await updateCase(selected.id, { ...selected, status })
    setSelected(updated)
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  const addDocument = async (e) => {
    e.preventDefault()
    const item = await createDocument(selected.id, docForm)
    setDocuments(prev => [...prev, item])
    setDocForm({ name: '', category: 'Identity', expirationDate: '', status: 'NOT_STARTED' })
  }

  const addDeadline = async (e) => {
    e.preventDefault()
    const item = await createDeadline(selected.id, deadlineForm)
    setDeadlines(prev => [...prev, item].sort((a,b) => String(a.dueDate).localeCompare(String(b.dueDate))))
    setDeadlineForm({ title: '', dueDate: '', completed: false })
  }

  return (
    <div className="app-shell">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">Immigration Case Organizer</span>
          <span className="text-white small">Local Development MVP</span>
        </div>
      </nav>

      <main className="container py-4">
        {error && <div className="alert alert-warning">{error}</div>}

        <div className="row g-3 mb-4">
          <Stat title="Total Cases" value={dashboard.total} />
          <Stat title="Active Cases" value={dashboard.active} />
          <Stat title="Approved" value={dashboard.approved} />
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm mb-4">
              <div className="card-header fw-bold">Create Immigration Case</div>
              <div className="card-body">
                <form onSubmit={handleCaseSubmit}>
                  <label className="form-label">Case Name</label>
                  <input className="form-control mb-3" required placeholder="My EB-2 Case"
                    value={caseForm.caseName}
                    onChange={e => setCaseForm({...caseForm, caseName: e.target.value})} />

                  <label className="form-label">Visa Category</label>
                  <select className="form-select mb-3" value={caseForm.visaCategory}
                    onChange={e => setCaseForm({...caseForm, visaCategory: e.target.value})}>
                    <option>EB-1</option><option>EB-2</option><option>EB-3</option>
                    <option>H-1B</option><option>F-1</option><option>Other</option>
                  </select>

                  <label className="form-label">Receipt Number</label>
                  <input className="form-control mb-3" placeholder="Optional for demo"
                    value={caseForm.receiptNumber}
                    onChange={e => setCaseForm({...caseForm, receiptNumber: e.target.value})} />

                  <label className="form-label">Filing Date</label>
                  <input type="date" className="form-control mb-3"
                    value={caseForm.filingDate}
                    onChange={e => setCaseForm({...caseForm, filingDate: e.target.value})} />

                  <button className="btn btn-primary w-100">Create Case</button>
                </form>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header fw-bold">Your Cases</div>
              <div className="list-group list-group-flush">
                {cases.length === 0 && <div className="p-3 text-muted">No cases yet.</div>}
                {cases.map(item => (
                  <button key={item.id}
                    className={`list-group-item list-group-item-action ${selected?.id === item.id ? 'active' : ''}`}
                    onClick={() => selectCase(item)}>
                    <div className="d-flex justify-content-between">
                      <strong>{item.caseName}</strong>
                      <span className="badge bg-light text-dark">{item.visaCategory}</span>
                    </div>
                    <small>{item.status}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            {!selected ? (
              <div className="card shadow-sm h-100">
                <div className="card-body empty-state">
                  <h3>Select a case</h3>
                  <p className="text-muted">Create a case or select one from the left to manage documents and deadlines.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="card shadow-sm mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h3>{selected.caseName}</h3>
                        <p className="text-muted mb-1">{selected.visaCategory}</p>
                        <small>Filing date: {selected.filingDate || 'Not entered'}</small>
                      </div>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
                    </div>

                    <label className="form-label mt-3">Case Status</label>
                    <select className="form-select" value={selected.status} onChange={e => handleStatus(e.target.value)}>
                      {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="card shadow-sm mb-4">
                  <div className="card-header fw-bold">Documents</div>
                  <div className="card-body">
                    <form className="row g-2 mb-3" onSubmit={addDocument}>
                      <div className="col-md-5"><input required className="form-control" placeholder="Document name"
                        value={docForm.name} onChange={e => setDocForm({...docForm, name:e.target.value})}/></div>
                      <div className="col-md-3"><input className="form-control" placeholder="Category"
                        value={docForm.category} onChange={e => setDocForm({...docForm, category:e.target.value})}/></div>
                      <div className="col-md-3"><input type="date" className="form-control"
                        value={docForm.expirationDate} onChange={e => setDocForm({...docForm, expirationDate:e.target.value})}/></div>
                      <div className="col-md-1"><button className="btn btn-primary w-100">+</button></div>
                    </form>
                    {documents.length === 0 ? <p className="text-muted">No documents added.</p> :
                      <ul className="list-group">
                        {documents.map(d => <li className="list-group-item d-flex justify-content-between" key={d.id}>
                          <span>{d.name} <small className="text-muted">({d.category})</small></span>
                          <span className="badge text-bg-secondary">{d.status}</span>
                        </li>)}
                      </ul>}
                  </div>
                </div>

                <div className="card shadow-sm">
                  <div className="card-header fw-bold">Important Deadlines</div>
                  <div className="card-body">
                    <form className="row g-2 mb-3" onSubmit={addDeadline}>
                      <div className="col-md-7"><input required className="form-control" placeholder="Deadline title"
                        value={deadlineForm.title} onChange={e => setDeadlineForm({...deadlineForm, title:e.target.value})}/></div>
                      <div className="col-md-4"><input required type="date" className="form-control"
                        value={deadlineForm.dueDate} onChange={e => setDeadlineForm({...deadlineForm, dueDate:e.target.value})}/></div>
                      <div className="col-md-1"><button className="btn btn-primary w-100">+</button></div>
                    </form>
                    {deadlines.length === 0 ? <p className="text-muted">No deadlines added.</p> :
                      <ul className="list-group">
                        {deadlines.map(d => <li className="list-group-item d-flex justify-content-between" key={d.id}>
                          <span>{d.title}</span><strong>{d.dueDate}</strong>
                        </li>)}
                      </ul>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function Stat({title, value}) {
  return <div className="col-md-4">
    <div className="card shadow-sm stat-card">
      <div className="card-body">
        <div className="text-muted">{title}</div>
        <div className="display-6 fw-bold">{value}</div>
      </div>
    </div>
  </div>
}

export default App
