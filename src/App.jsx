import { useState } from 'react'
import kysimused from './kysimused.js'
import statistikaLogo from './statistika.png'
import './App.css'

function StatLogo() {
  return (
    <img
      src={statistikaLogo}
      alt="Statistikaamet logo"
      className="stat-logo"
    />
  )
}

function DotPattern({ size = 3, gap = 22, opacity = 0.35 }) {
  const svgStyle = {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 0
  }
  return (
    <svg style={svgStyle} aria-hidden="true">
      <defs>
        <pattern id="dots" x="0" y="0" width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={gap / 2} cy={gap / 2} r={size / 2} fill="#ffffff" opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  )
}

function Progressbar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>Küsimus {current} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function StartScreen({ onStart }) {
  return (
    <div className="screen start-screen">
      <DotPattern />
      <div className="start-inner">
        <StatLogo />
        <h1 className="start-title">Eesti Statistika<br />Viktoriin</h1>
        <p className="start-sub">
          Testi oma teadmisi Eesti statistika ja Statistikaameti kohta.<br />
          {kysimused.length} küsimust · valikvastused
        </p>
        <button className="btn-primary" onClick={onStart} data-testid="start-btn">
          Alusta viktoriini →
        </button>
      </div>
    </div>
  )
}

function QuestionScreen({ kysimus, index, total, skoor, onVasta }) {
  const [valitud, setValitud] = useState(null)
  const [kinnitatud, setKinnitatud] = useState(false)
  const onige = valitud === kysimus.oige

  function vali(id) {
    if (kinnitatud) return
    setValitud(id)
  }

  function kinnita() {
    if (!valitud || kinnitatud) return
    setKinnitatud(true)
  }

  function edasi() {
    onVasta(valitud)
    setValitud(null)
    setKinnitatud(false)
  }

  return (
    <div className="screen question-screen">
      <header className="quiz-header">
        <StatLogo />
        <div className="skoor-badge" data-testid="skoor">
          <span className="skoor-num">{skoor}</span>
          <span className="skoor-label">punkti</span>
        </div>
      </header>

      <main className="quiz-main">
        <Progressbar current={index + 1} total={total} />

        <div className="kysimus-card">
          <span className="kysimus-nr">№ {index + 1}</span>
          <h2 className="kysimus-tekst" data-testid="kysimus">{kysimus.kysimus}</h2>

          <div className="variandid" role="group" aria-label="Vastusevariandid">
            {kysimus.variandid.map((v) => {
              let cls = 'variant'
              if (kinnitatud) {
                if (v.id === kysimus.oige) cls += ' oige'
                else if (v.id === valitud) cls += ' vale'
              } else if (v.id === valitud) {
                cls += ' valitud'
              }
              return (
                <button
                  key={v.id}
                  className={cls}
                  onClick={() => vali(v.id)}
                  data-testid={`variant-${v.id}`}
                  aria-pressed={valitud === v.id}
                  disabled={kinnitatud && v.id !== kysimus.oige && v.id !== valitud}
                >
                  <span className="variant-tht">{v.id.toUpperCase()}</span>
                  <span className="variant-txt">{v.tekst}</span>
                </button>
              )
            })}
          </div>

          {kinnitatud && (
            <div className={`tagasiside ${onige ? 'tagasiside--oige' : 'tagasiside--vale'}`} data-testid="tagasiside">
              <span className="tagasiside-ikoon">{onige ? '✓' : '✗'}</span>
              <span>
                {onige
                  ? 'Õige vastus! Tubli!'
                  : <>Vale. Õige vastus oli: <strong>{kysimus.variandid.find(v => v.id === kysimus.oige).tekst}</strong></>
                }
              </span>
            </div>
          )}
        </div>

        <div className="btn-row">
          {!kinnitatud && (
            <button
              className="btn-primary"
              onClick={kinnita}
              disabled={!valitud}
              data-testid="kinnita-btn"
            >
              Kontrolli vastust
            </button>
          )}
          {kinnitatud && (
            <button className="btn-primary" onClick={edasi} data-testid="edasi-btn">
              {index + 1 < total ? 'Järgmine küsimus →' : 'Vaata tulemusi →'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

function ResultsScreen({ vastused, onUuesti }) {
  const oigeid = vastused.filter(v => v.oige).length
  const total = vastused.length
  const protsent = Math.round((oigeid / total) * 100)

  function songel() {
    if (protsent === 100) return { tekst: 'Suurepärane! Oled tõeline statistikaekspert!', klass: 'songelm--top' }
    if (protsent >= 80) return { tekst: 'Väga hea tulemus! Statistika on sulle selgelt südameasjaks.', klass: 'songelm--hea' }
    if (protsent >= 60) return { tekst: 'Hea tulemus! Mõned faktid vajaksid veel kinnistamist.', klass: 'songelm--kesk' }
    if (protsent >= 40) return { tekst: 'Rohkem harjutamist ja statistika saab varsti tuttavaks!', klass: 'songelm--alla' }
    return { tekst: 'Alusta otsast — stat.ee on hea koht teadmiste täiendamiseks.', klass: 'songelm--madal' }
  }

  const { tekst, klass } = songel()

  return (
    <div className="screen results-screen">
      <DotPattern opacity={0.05} />
      <div className="results-inner">
        <header className="results-header">
          <StatLogo />
        </header>

        <div className="tulem-blokk">
          <div className="tulem-ring" data-testid="lopptulemus">
            <span className="tulem-num">{oigeid}</span>
            <span className="tulem-of">/ {total}</span>
          </div>
          <p className="tulem-protsent">{protsent}% õigeid vastuseid</p>
          <p className={`songelm ${klass}`}>{tekst}</p>
        </div>

        <div className="tabel-wrap">
          <h3 className="tabel-pealkiri">Vastuste kokkuvõte</h3>
          <table className="tabel" data-testid="tabel">
            <thead>
              <tr>
                <th>#</th>
                <th>Küsimus</th>
                <th>Sinu vastus</th>
                <th>Tulemus</th>
              </tr>
            </thead>
            <tbody>
              {vastused.map((v, i) => (
                <tr key={i} className={v.oige ? 'row-oige' : 'row-vale'}>
                  <td className="td-nr">{i + 1}</td>
                  <td className="td-kys">{v.kysimus}</td>
                  <td className="td-ans">{v.valitudTekst}</td>
                  <td className="td-res">
                    <span className={`badge ${v.oige ? 'badge--oige' : 'badge--vale'}`}>
                      {v.oige ? '✓ Õige' : '✗ Vale'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn-outline" onClick={onUuesti} data-testid="uuesti-btn">
          ↺ Alusta uuesti
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [faas, setFaas] = useState('start')
  const [index, setIndex] = useState(0)
  const [skoor, setSkoor] = useState(0)
  const [vastused, setVastused] = useState([])

  function alusta() {
    setFaas('kysimus')
    setIndex(0)
    setSkoor(0)
    setVastused([])
  }

  function vasta(valitudId) {
    const k = kysimused[index]
    const onige = valitudId === k.oige
    const uusSkoor = onige ? skoor + 1 : skoor
    const valitudTekst = k.variandid.find(v => v.id === valitudId)?.tekst || '—'

    const uusVastus = {
      kysimus: k.kysimus,
      valitudTekst,
      oigeTekst: k.variandid.find(v => v.id === k.oige).tekst,
      oige: onige
    }

    const uuedVastused = [...vastused, uusVastus]
    setVastused(uuedVastused)
    setSkoor(uusSkoor)

    if (index + 1 < kysimused.length) {
      setIndex(index + 1)
    } else {
      setFaas('tulemused')
    }
  }

  if (faas === 'start') return <StartScreen onStart={alusta} />
  if (faas === 'kysimus') {
    return (
      <QuestionScreen
        kysimus={kysimused[index]}
        index={index}
        total={kysimused.length}
        skoor={skoor}
        onVasta={vasta}
      />
    )
  }
  return <ResultsScreen vastused={vastused} onUuesti={alusta} />
}