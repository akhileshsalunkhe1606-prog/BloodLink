import { useEffect, useState } from 'react'
import './App.css'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const initialBloodData = {
  'A+': { units: 12, status: 'available' },
  'A-': { units: 8, status: 'available' },
  'B+': { units: 4, status: 'limited' },
  'B-': { units: 7, status: 'available' },
  'AB+': { units: 6, status: 'available' },
  'AB-': { units: 2, status: 'limited' },
  'O+': { units: 15, status: 'available' },
  'O-': { units: 3, status: 'limited' },
}

const demoAccounts = {
  user: {
    email: 'user@bloodlink.com',
    password: 'user123',
    name: 'Demo User',
  },
  admin: {
    email: 'admin@bloodlink.com',
    password: 'admin123',
    name: 'Blood Bank Admin',
  },
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginRole, setLoginRole] = useState('user')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginMessage, setLoginMessage] = useState('')

  const [bloodData, setBloodData] = useState(initialBloodData)
  useEffect(() => {
  const fetchBloodData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blood')

      if (!response.ok) {
        throw new Error('Failed to fetch blood inventory')
      }

      const data = await response.json()

      const formattedData = {}

      data.forEach((blood) => {
        formattedData[blood.bloodGroup] = {
          units: blood.units,
          status: blood.status,
        }
      })

      setBloodData(formattedData)
    } catch (error) {
      console.error('Failed to load blood inventory:', error)
    }
  }

  fetchBloodData()
}, [])
  const [selectedBlood, setSelectedBlood] = useState('')
  const [message, setMessage] = useState('')

  const [donorForm, setDonorForm] = useState({
    name: '', age: '', email: '', phone: '', bloodGroup: '', city: '',
  })
  const [donorMessage, setDonorMessage] = useState('')
  const [donorRegistrations, setDonorRegistrations] = useState([])
  useEffect(() => {
  const fetchDonors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/donors')

      if (!response.ok) {
        throw new Error('Failed to fetch donors')
      }

      const data = await response.json()
      setDonorRegistrations(data)
    } catch (error) {
      console.error('Failed to load donors:', error)
    }
  }

  fetchDonors()
}, [])
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: '', bloodGroup: '', hospital: '', contact: '', notes: '',
  })
  const [emergencyMessage, setEmergencyMessage] = useState('')
  const [emergencyRequests, setEmergencyRequests] = useState([])
  useEffect(() => {
  const fetchEmergencyRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/emergency')

      if (!response.ok) {
        throw new Error('Failed to fetch emergency requests')
      }

      const data = await response.json()
      setEmergencyRequests(data)
    } catch (error) {
      console.error('Failed to load emergency requests:', error)
    }
  }

  fetchEmergencyRequests()
}, [])
  function closeMenu() {
    setIsMenuOpen(false)
  }

  function openLogin(role = 'user') {
    setLoginRole(role)
    setLoginForm({ email: '', password: '' })
    setLoginMessage('')
    setShowLogin(true)
    closeMenu()
  }

  function handleLoginChange(event) {
    const { name, value } = event.target
    setLoginForm((previous) => ({ ...previous, [name]: value }))
  }

  function handleLogin(event) {
    event.preventDefault()
    const account = demoAccounts[loginRole]

    if (loginForm.email === account.email && loginForm.password === account.password) {
      setIsLoggedIn(true)
      setCurrentUser({ role: loginRole, name: account.name, email: account.email })
      setShowLogin(false)
      setLoginMessage('')
      setLoginForm({ email: '', password: '' })
    } else {
      setLoginMessage(`Invalid ${loginRole} login details.`)
    }
  }

  function logout() {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowLogin(false)
  }

  function checkAvailability() {
    if (!selectedBlood) {
      setMessage('Please select a blood group first.')
      return
    }

    const info = bloodData[selectedBlood]
    setMessage(
      info.status === 'available'
        ? `${selectedBlood} is available — ${info.units} units currently in stock.`
        : `${selectedBlood} is in limited supply — only ${info.units} units left. Please contact the blood bank directly for urgent needs.`
    )
  }

  function handleDonorChange(event) {
    const { name, value } = event.target
    setDonorForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleDonorSubmit(event) {
    event.preventDefault()

    if (!donorForm.name || !donorForm.age || !donorForm.bloodGroup || !donorForm.phone) {
      setDonorMessage('Please fill in your name, age, blood group and phone number.')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: donorForm.name,
          age: Number(donorForm.age),
          bloodGroup: donorForm.bloodGroup,
          phone: donorForm.phone,
          email: donorForm.email,
          address: donorForm.city || 'Not provided',
        }),
      })

      if (!response.ok) throw new Error('Failed to register donor')

      const savedDonor = await response.json()
      setDonorRegistrations((previous) => [...previous, savedDonor])
      setDonorMessage(
        `Thank you, ${donorForm.name}! Your donor registration (${donorForm.bloodGroup}) has been recorded. Our team will contact you at ${donorForm.phone}.`
      )
      setDonorForm({ name: '', age: '', email: '', phone: '', bloodGroup: '', city: '' })
    } catch (error) {
      console.error('Donor registration failed:', error)
      setDonorMessage('Could not register donor. Please make sure the backend is running.')
    }
  }

  function handleEmergencyChange(event) {
    const { name, value } = event.target
    setEmergencyForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleEmergencySubmit(event) {
  event.preventDefault()

  if (!emergencyForm.patientName || !emergencyForm.bloodGroup || !emergencyForm.contact) {
    setEmergencyMessage('Please fill in patient name, blood group and a contact number.')
    return
  }

  try {
    const response = await fetch('http://localhost:5000/api/emergency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emergencyForm),
    })

    if (!response.ok) {
      throw new Error('Failed to submit emergency request')
    }

    const savedRequest = await response.json()

    setEmergencyRequests((previous) => [...previous, savedRequest])

    setEmergencyMessage(
      `Request received for ${emergencyForm.bloodGroup} blood for ${emergencyForm.patientName}. The blood bank team will reach out at ${emergencyForm.contact} shortly.`
    )

    setEmergencyForm({
      patientName: '',
      bloodGroup: '',
      hospital: '',
      contact: '',
      notes: '',
    })
  } catch (error) {
    console.error('Emergency request failed:', error)
    setEmergencyMessage('Could not submit request. Please make sure the backend is running.')
  }
}

 async function updateBloodUnits(group, value) {
  const units = Math.max(0, Number(value))

  try {
    const response = await fetch(`http://localhost:5000/api/blood/${encodeURIComponent(group)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ units }),
    })

    if (!response.ok) {
      throw new Error('Failed to update blood inventory')
    }

    const updatedBlood = await response.json()

    setBloodData((previous) => ({
      ...previous,
      [group]: {
        units: updatedBlood.units,
        status: updatedBlood.status,
      },
    }))
  } catch (error) {
    console.error('Blood inventory update failed:', error)
    alert('Could not update blood inventory. Make sure the backend is running.')
  }
}

  async function updateRequestStatus(id, status) {
  try {
    const response = await fetch(`http://localhost:5000/api/emergency/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error('Failed to update request status')
    }

    const updatedRequest = await response.json()

    setEmergencyRequests((previous) =>
      previous.map((request) =>
        request._id === updatedRequest._id ? updatedRequest : request
      )
    )
  } catch (error) {
    console.error('Emergency status update failed:', error)
    alert('Could not update emergency request status.')
  }
}

  function goToSection(id) {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  if (showLogin) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <button className="auth-close" onClick={() => setShowLogin(false)} aria-label="Close login">✕</button>
          <div className="auth-logo"><span>+</span> BloodLink</div>
          <p className="small-heading">{loginRole === 'admin' ? 'ADMIN PORTAL' : 'USER PORTAL'}</p>
          <h1>{loginRole === 'admin' ? 'Admin Login' : 'Welcome Back'}</h1>
          <p className="auth-description">
            {loginRole === 'admin' ? 'Access the blood-bank management dashboard.' : 'Log in to access your blood-bank account.'}
          </p>

          <div className="login-role-switch">
            <button className={loginRole === 'user' ? 'active' : ''} onClick={() => { setLoginRole('user'); setLoginMessage('') }}>User Login</button>
            <button className={loginRole === 'admin' ? 'active' : ''} onClick={() => { setLoginRole('admin'); setLoginMessage('') }}>Admin Login</button>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" name="email" type="email" placeholder="Enter your email" value={loginForm.email} onChange={handleLoginChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" name="password" type="password" placeholder="Enter your password" value={loginForm.password} onChange={handleLoginChange} required />
            </div>
            <button type="submit" className="primary-button auth-submit">{loginRole === 'admin' ? 'Login as Admin' : 'Login'}</button>
          </form>

          {loginMessage && <p className="auth-error">{loginMessage}</p>}

          <div className="demo-credentials">
            <strong>Demo credentials</strong>
            <p>Email: {demoAccounts[loginRole].email}</p>
            <p>Password: {demoAccounts[loginRole].password}</p>
          </div>

          <button className="back-home-button" onClick={() => setShowLogin(false)}>← Back to Website</button>
        </div>
      </div>
    )
  }

  if (isLoggedIn && currentUser?.role === 'user') {
    return (
      <div className="dashboard-page">
        <nav className="dashboard-navbar">
          <div className="logo"><span>+</span> BloodLink</div>
          <button className="dashboard-logout" onClick={logout}>Logout</button>
        </nav>
        <main className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <p className="small-heading">USER DASHBOARD</p>
              <h1>Welcome, {currentUser.name}</h1>
              <p>Manage your blood-bank activities from one place.</p>
            </div>
            <div className="dashboard-role">USER</div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-icon">🩸</div>
              <h2>Blood Availability</h2>
              <p>Check the current availability of all blood groups.</p>
              <button className="primary-button" onClick={() => goToSection('availability')}>Check Blood</button>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-icon">♥</div>
              <h2>Donate Blood</h2>
              <p>Register yourself as a blood donor.</p>
              <button className="primary-button" onClick={() => goToSection('donor-form')}>Register as Donor</button>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-icon">+</div>
              <h2>Emergency Request</h2>
              <p>Submit an urgent blood requirement.</p>
              <button className="emergency-button" onClick={() => goToSection('emergency-form')}>Request Blood</button>
            </div>
          </div>

          <div className="dashboard-info">
            <h2>Your Account</h2>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Account Type:</strong> User</p>
          </div>
        </main>
      </div>
    )
  }

  if (isLoggedIn && currentUser?.role === 'admin') {
    const totalUnits = Object.values(bloodData).reduce((total, item) => total + item.units, 0)
    const limitedGroups = Object.values(bloodData).filter((item) => item.status === 'limited').length

    return (
      <div className="dashboard-page">
        <nav className="dashboard-navbar">
          <div className="logo"><span>+</span> BloodLink</div>
          <button className="dashboard-logout" onClick={logout}>Logout</button>
        </nav>

        <main className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <p className="small-heading">ADMIN DASHBOARD</p>
              <h1>Blood Bank Management</h1>
              <p>Manage blood inventory, donors, emergency requests and users.</p>
            </div>
            <div className="dashboard-role admin">ADMIN</div>
          </div>

          <div className="admin-stats">
            <div className="stat-card"><span>Total Blood Groups</span><strong>{bloodGroups.length}</strong></div>
            <div className="stat-card"><span>Total Units</span><strong>{totalUnits}</strong></div>
            <div className="stat-card"><span>Limited Groups</span><strong>{limitedGroups}</strong></div>
            <div className="stat-card"><span>Donor Registrations</span><strong>{donorRegistrations.length}</strong></div>
            <div className="stat-card"><span>Emergency Requests</span><strong>{emergencyRequests.length}</strong></div>
            <div className="stat-card"><span>Pending Requests</span><strong>{emergencyRequests.filter((item) => item.status === 'Pending').length}</strong></div>
          </div>

          <section className="admin-section">
            <div className="admin-section-heading">
              <p className="small-heading">INVENTORY MANAGEMENT</p>
              <h2>Blood Stock</h2>
            </div>
            <div className="inventory-table">
              <div className="inventory-row inventory-header">
                <span>Blood Group</span><span>Units</span><span>Status</span><span>Update</span>
              </div>
              {Object.entries(bloodData).map(([group, info]) => (
                <div className="inventory-row" key={group}>
                  <strong>{group}</strong>
                  <span>{info.units}</span>
                  <span className={`status ${info.status}`}>{info.status === 'available' ? 'Available' : 'Limited'}</span>
                  <input className="inventory-input" type="number" min="0" value={info.units} onChange={(event) => updateBloodUnits(group, event.target.value)} />
                </div>
              ))}
            </div>
          </section>

          <div className="admin-management-grid">
            <div className="dashboard-card admin-feature-card">
              <div className="dashboard-icon">♥</div>
              <h2>Donor Registrations</h2>
              <div className="admin-count">{donorRegistrations.length}</div>
              <p>Donor registrations received through the portal.</p>
              {donorRegistrations.length === 0 ? (
                <p className="admin-empty">No donor registrations yet.</p>
              ) : (
                <div className="admin-record-list">
                  {donorRegistrations.map((donor) => (
                    <div className="admin-record" key={donor.id}>
                      <strong>{donor.name}</strong>
                      <span>Blood Group: {donor.bloodGroup}</span>
                      <span>Phone: {donor.phone}</span>
                      {donor.email && <span>Email: {donor.email}</span>}
                      {donor.city && <span>City: {donor.city}</span>}
                      <small>{donor.date}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-card admin-feature-card">
              <div className="dashboard-icon">+</div>
              <h2>Emergency Requests</h2>
              <div className="admin-count">{emergencyRequests.length}</div>
              <p>Urgent blood requests submitted by users.</p>
              {emergencyRequests.length === 0 ? (
                <p className="admin-empty">No emergency requests yet.</p>
              ) : (
                <div className="admin-record-list">
                  {emergencyRequests.map((request) => (
                    <div className="admin-record" key={request._id}>
                      <strong>{request.patientName}</strong>
                      <span>Blood Needed: {request.bloodGroup}</span>
                      <span>Hospital: {request.hospital || 'Not provided'}</span>
                      <span>Contact: {request.contact}</span>
                      {request.notes && <span>Notes: {request.notes}</span>}
                      <select className="request-status-select" value={request.status} onChange={(event) => updateRequestStatus(request._id, event.target.value)}>
                        <option>Pending</option>
                        <option>Accepted</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                      <small>{request.date}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-card admin-feature-card">
              <div className="dashboard-icon">●</div>
              <h2>Users</h2>
              <div className="admin-count">2</div>
              <p>Portal accounts currently available in this demo.</p>
              <div className="admin-record-list">
                <div className="admin-record"><strong>Demo User</strong><span>user@bloodlink.com</span><small>User Account</small></div>
                <div className="admin-record"><strong>Blood Bank Admin</strong><span>admin@bloodlink.com</span><small>Administrator Account</small></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo"><span>+</span> BloodLink</div>
        <button className="nav-toggle" onClick={() => setIsMenuOpen((open) => !open)} aria-label="Toggle navigation menu" aria-expanded={isMenuOpen}>{isMenuOpen ? '✕' : '☰'}</button>
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#availability" onClick={closeMenu}>Blood Availability</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#donate" onClick={closeMenu}>Donate Blood</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <button className="nav-login-button" onClick={() => openLogin('user')}>Login</button>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="small-heading">DIGITAL BLOOD BANK PORTAL</p>
            <h1>Every Drop of Blood<span>Can Save a Life</span></h1>
            <p className="hero-text">Find blood, register as a donor, and help connect patients with the blood they need through a simple digital blood-bank platform.</p>
            <div className="hero-buttons">
              <a href="#availability" className="primary-button">Find Blood</a>
              <a href="#donor-form" className="secondary-button">Become a Donor</a>
            </div>
          </div>
          <div className="hero-card">
            <div className="blood-icon">+</div>
            <h2>BloodLink</h2>
            <p>Connecting donors with patients in need.</p>
            <div className="hero-card-line"></div>
            <small>Digital blood-bank management platform</small>
          </div>
        </section>

        <section className="availability-section" id="availability">
          <p className="small-heading">CHECK AVAILABILITY</p>
          <h2>Find the Blood You Need</h2>
          <p className="section-description">Search for available blood groups through the digital blood-bank portal.</p>
          <div className="search-box">
            <select value={selectedBlood} onChange={(event) => setSelectedBlood(event.target.value)}>
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
            <button onClick={checkAvailability}>Check Availability</button>
          </div>
          {message && <p className="availability-message">{message}</p>}
          <div className="blood-cards">
            {Object.entries(bloodData).map(([group, info]) => (
              <div key={group} className={`blood-card ${group === selectedBlood && message ? 'highlighted' : ''}`}>
                <div className="blood-card-top"><h3>{group}</h3><span className={`status ${info.status}`}>{info.status === 'available' ? 'Available' : 'Limited'}</span></div>
                <p>{info.units} units available</p>
              </div>
            ))}
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <p className="small-heading">OUR SERVICES</p>
            <h2>How We Can Help</h2>
            <p className="section-description">Simple and reliable digital services for patients, donors, and blood-bank teams.</p>
          </div>
          <div className="service-cards">
            <div className="service-card"><div className="service-icon">🩸</div><h3>Blood Availability</h3><p>Check blood-group availability and find the blood required for your patient.</p><a href="#availability">Check Blood →</a></div>
            <div className="service-card"><div className="service-icon">♥</div><h3>Donate Blood</h3><p>Register as a donor and contribute to saving lives in your community.</p><a href="#donor-form">Register Now →</a></div>
            <div className="service-card"><div className="service-icon">+</div><h3>Emergency Request</h3><p>Submit an urgent blood request so the blood-bank team can assist you.</p><a href="#emergency-form">Request Blood →</a></div>
          </div>
        </section>

        <section className="donor-section" id="donate">
          <div><p className="small-heading">BECOME A DONOR</p><h2>Your Donation Can Be Someone's Second Chance</h2><p>A single blood donation can make a meaningful difference to patients, accident victims, and people undergoing treatment.</p></div>
          <a href="#donor-form" className="light-button">Register as a Donor</a>
        </section>

        <section className="form-section" id="donor-form">
          <p className="small-heading">DONOR REGISTRATION</p>
          <h2>Register as a Blood Donor</h2>
          <p className="section-description">Fill in your details below to register your interest in donating blood.</p>
          <form className="app-form" onSubmit={handleDonorSubmit}>
            <div className="form-row">
              <div className="form-field"><label htmlFor="donor-name">Full Name</label><input id="donor-name" name="name" type="text" placeholder="Enter your full name" value={donorForm.name} onChange={handleDonorChange} required /></div>
              <div className="form-field"><label htmlFor="donor-age">Age</label><input id="donor-age" name="age" type="number" min="18" max="65" placeholder="Your age" value={donorForm.age} onChange={handleDonorChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label htmlFor="donor-blood-group">Blood Group</label><select id="donor-blood-group" name="bloodGroup" value={donorForm.bloodGroup} onChange={handleDonorChange} required><option value="">Select Blood Group</option>{bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></div>
              <div className="form-field"><label htmlFor="donor-phone">Phone Number</label><input id="donor-phone" name="phone" type="tel" placeholder="10-digit mobile number" value={donorForm.phone} onChange={handleDonorChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label htmlFor="donor-email">Email (optional)</label><input id="donor-email" name="email" type="email" placeholder="you@example.com" value={donorForm.email} onChange={handleDonorChange} /></div>
              <div className="form-field"><label htmlFor="donor-city">City</label><input id="donor-city" name="city" type="text" placeholder="Your city" value={donorForm.city} onChange={handleDonorChange} /></div>
            </div>
            <button type="submit" className="primary-button form-submit">Submit Registration</button>
          </form>
          {donorMessage && <p className="form-success">{donorMessage}</p>}
        </section>

        <section className="emergency-section" id="emergency">
          <div className="emergency-content"><p className="small-heading">NEED BLOOD URGENTLY?</p><h2>Request Emergency Assistance</h2><p>Submit an urgent blood requirement through the portal.</p></div>
          <a href="#emergency-form" className="emergency-button">Request Blood</a>
        </section>

        <section className="form-section" id="emergency-form">
          <p className="small-heading">EMERGENCY REQUEST</p>
          <h2>Submit an Urgent Blood Request</h2>
          <p className="section-description">Provide the patient and contact details below.</p>
          <form className="app-form" onSubmit={handleEmergencySubmit}>
            <div className="form-row">
              <div className="form-field"><label htmlFor="patient-name">Patient Name</label><input id="patient-name" name="patientName" type="text" placeholder="Enter patient's name" value={emergencyForm.patientName} onChange={handleEmergencyChange} required /></div>
              <div className="form-field"><label htmlFor="required-blood-group">Blood Group Needed</label><select id="required-blood-group" name="bloodGroup" value={emergencyForm.bloodGroup} onChange={handleEmergencyChange} required><option value="">Select Blood Group</option>{bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label htmlFor="hospital-name">Hospital Name</label><input id="hospital-name" name="hospital" type="text" placeholder="Where the patient is admitted" value={emergencyForm.hospital} onChange={handleEmergencyChange} /></div>
              <div className="form-field"><label htmlFor="contact-number">Contact Number</label><input id="contact-number" name="contact" type="tel" placeholder="Number our team can reach you on" value={emergencyForm.contact} onChange={handleEmergencyChange} required /></div>
            </div>
            <div className="form-field"><label htmlFor="notes">Additional Notes (optional)</label><textarea id="notes" name="notes" rows="3" placeholder="Anything else the team should know" value={emergencyForm.notes} onChange={handleEmergencyChange}></textarea></div>
            <button type="submit" className="emergency-button form-submit">Submit Emergency Request</button>
          </form>
          {emergencyMessage && <p className="form-success">{emergencyMessage}</p>}
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="footer-main">
          <div><div className="logo footer-logo"><span>+</span> BloodLink</div><p>A digital blood-bank portal designed to connect donors, patients, and blood-bank services.</p></div>
          <div><h3>Quick Links</h3><a href="#home">Home</a><a href="#availability">Blood Availability</a><a href="#services">Services</a><a href="#donor-form">Donate Blood</a><a href="#emergency-form">Emergency Request</a></div>
          <div><h3>Portal</h3><button className="footer-login" onClick={() => openLogin('user')}>User Login</button><button className="footer-login" onClick={() => openLogin('admin')}>Admin Login</button><p>Digital Blood Bank Platform</p></div>
        </div>
        <div className="footer-bottom"><p>© 2026 BloodLink. Frontend prototype.</p><p>Designed for blood-bank organizations.</p></div>
      </footer>
    </div>
  )
}

export default App
