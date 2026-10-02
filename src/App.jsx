import './App.css'

function App() {
  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>HospitalFlow AI</h1>
          <p>Hospital Workflow Management System</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="container">

        <h2>Hospital Dashboard</h2>

        <p className="description">
          Monitor hospital resources, patient flow, and AI-powered tasks.
        </p>

        <div className="cards">

          <div className="card">
            <h3>Total Beds</h3>
            <div className="number">100</div>
            <p>Hospital capacity</p>
          </div>

          <div className="card">
            <h3>Available Beds</h3>
            <div className="number green">37</div>
            <p>Currently available</p>
          </div>

          <div className="card">
            <h3>Patients</h3>
            <div className="number blue">63</div>
            <p>Currently admitted</p>
          </div>

          <div className="card">
            <h3>AI Tasks</h3>
            <div className="number purple">12</div>
            <p>Processing tasks</p>
          </div>

        </div>

        <section className="workflow">

          <h2>Hospital Workflow</h2>

          <div className="workflow-item">
            <strong>01</strong>

            <div>
              <h3>Patient Registration</h3>
              <p>Register new patients.</p>
            </div>

            <span className="badge active">
              Active
            </span>
          </div>

          <div className="workflow-item">
            <strong>02</strong>

            <div>
              <h3>Bed Assignment</h3>
              <p>Identify available beds.</p>
            </div>

            <span className="badge active">
              Active
            </span>
          </div>

          <div className="workflow-item">
            <strong>03</strong>

            <div>
              <h3>AI Analysis</h3>
              <p>Analyze hospital workflow data.</p>
            </div>

            <span className="badge processing">
              Processing
            </span>
          </div>

          <div className="workflow-item">
            <strong>04</strong>

            <div>
              <h3>Patient Discharge</h3>
              <p>Complete patient discharge.</p>
            </div>

            <span className="badge pending">
              Pending
            </span>
          </div>

        </section>

        <footer>
          HospitalFlow AI • React + Docker + Azure
        </footer>

      </main>

    </div>
  )
}

export default App