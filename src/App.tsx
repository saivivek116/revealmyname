import { Link } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Reveal My Name</h1>
        <p>Two ways to uncover a hidden name — pick your game.</p>
      </header>

      <div className="home-cards">
        <Link className="home-card home-card--wordle" to="/wordle">
          <span className="home-card-tiles" aria-hidden="true">
            <span className="t g">N</span>
            <span className="t y">A</span>
            <span className="t d">M</span>
            <span className="t g">E</span>
          </span>
          <h2>Name Wordle</h2>
          <p>Guess the hidden name in 6 tries. Green means right spot, yellow means wrong spot.</p>
          <span className="home-card-cta">Play →</span>
        </Link>

        <Link className="home-card home-card--crossword" to="/crossword">
          <span className="home-card-tiles" aria-hidden="true">
            <span className="t c">R</span>
            <span className="t c">E</span>
            <span className="t o">V</span>
            <span className="t c">E</span>
          </span>
          <h2>Crossword Reveal</h2>
          <p>Answer 7 clues to light up the letters that spell the hidden name.</p>
          <span className="home-card-cta">Play →</span>
        </Link>
      </div>
    </div>
  )
}
