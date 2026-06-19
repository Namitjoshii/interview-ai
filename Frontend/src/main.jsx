import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./style.scss"
import posthog from 'posthog-js'

posthog.init(
  'phc_wEJWzKnEFc8T5qdLWGfD5uHotzigiX6yQZ2xkEG3Tu2b',
  {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
