import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { auth } from './firebase'
import './App.css'
import 'leaflet/dist/leaflet.css'

function FitRouteBounds({ data }) {
  const map = useMap()

  useEffect(() => {
    const layer = L.geoJSON(data)
    const bounds = layer.getBounds()
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] })
  }, [data, map])

  return null
}

function RouteMapPreview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    fetch('/api/v1/segments')
      .then((response) => {
        if (!response.ok) throw new Error(`API returned ${response.status}`)
        return response.json()
      })
      .then((segments) => {
        if (active) setData(segments)
      })
      .catch(() => {
        if (active) setError('The route could not be loaded. Start the backend API on port 3000.')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="map-preview-page">
      <header className="map-preview-header">
        <button className="menu-button" type="button" aria-label="Open menu">☰</button>
        <h1>Joe Louis Greenway</h1>
        <a href="/?admin" className="admin-link">Admin</a>
      </header>

      <section className="map-frame" aria-label="Joe Louis Greenway route map">
        <div className="map-controls">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search or plan a route" placeholder="Search or plan a route" />
          </label>
          <nav className="filter-row" aria-label="Map filters">
            <button className="filter-pill active" type="button">● Access points</button>
            <button className="filter-pill" type="button">Restrooms</button>
            <button className="filter-pill" type="button">Food</button>
            <button className="filter-pill" type="button">Events</button>
          </nav>
        </div>
        {error ? <p className="map-error">{error}</p> : null}
        <MapContainer center={[42.35, -83.1]} zoom={11} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data ? (
            <>
              <GeoJSON data={data} pathOptions={{ color: '#d84a32', weight: 5, opacity: 0.9 }} />
              <FitRouteBounds data={data} />
            </>
          ) : null}
        </MapContainer>
        <button className="locate-button" type="button" aria-label="Find my location">◎</button>
        <aside className="map-sheet">
          <span className="sheet-handle" aria-hidden="true" />
          <p>Tap any point for details</p>
          <small>{data ? `${data.features.length} segments loaded from PostGIS` : 'Loading route data…'}</small>
        </aside>
      </section>
    </main>
  )
}

function App() {
  const isAdmin = new URLSearchParams(window.location.search).has('admin')
  const isMapPreview = !isAdmin
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isMapPreview) return undefined

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [isMapPreview])

  async function handleLogin(event) {
    event.preventDefault()
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('The email or password is incorrect.')
    }
  }

  async function handleLogout() {
    await signOut(auth)
  }

  if (isMapPreview) {
    return <RouteMapPreview />
  }

  if (loading) {
    return <main className="auth-page">Checking authentication…</main>
  }

  if (user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>jlg Admin</h1>
          <p>Signed in as {user.email}</p>
          <button type="button" onClick={handleLogout}>
            Sign out
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Joe Louis Greenway Admin Login</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Sign in</button>
      </form>
    </main>
  )
}

export default App