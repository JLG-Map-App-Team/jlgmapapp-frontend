import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './firebase'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

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