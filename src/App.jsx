import { useEffect, useState } from 'react'
import Survey from './components/Survey.jsx'
import ShareScreen from './components/ShareScreen.jsx'
import Results from './components/Results.jsx'
import {
  encodeResults,
  decodeResults,
  parseHash,
} from './utils/encode.js'
import { loadDraft, saveDraft, clearDraft } from './utils/storage.js'
import './App.css'

function App() {
  const draft = loadDraft()
  const [name, setName] = useState(draft.name)
  const [answers, setAnswers] = useState(draft.answers)
  const [route, setRoute] = useState(() => parseHash())

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (route.view === 'survey') {
      saveDraft({ name, answers })
    }
  }, [name, answers, route.view])

  function handleAnswer(id, seen) {
    setAnswers((prev) => ({ ...prev, [id]: seen }))
  }

  function handleReset() {
    setName('')
    setAnswers({})
    clearDraft()
  }

  function handleSubmit() {
    const token = encodeResults({ name, answers })
    clearDraft()
    window.location.hash = `#/share/${token}`
  }

  if (route.view === 'share' && route.token) {
    return (
      <ShareScreen
        token={route.token}
        onViewResults={() => {
          window.location.hash = `#/r/${route.token}`
        }}
      />
    )
  }

  if (route.view === 'results') {
    const decoded = decodeResults(route.token)
    if (!decoded) {
      return <Results invalid />
    }
    return <Results name={decoded.name} answers={decoded.answers} />
  }

  return (
    <Survey
      name={name}
      answers={answers}
      onNameChange={setName}
      onAnswer={handleAnswer}
      onReset={handleReset}
      onSubmit={handleSubmit}
    />
  )
}

export default App
