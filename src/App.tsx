import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronLeft, ChevronRight,
  Clock3, Flower2, Heart, MapPin, Menu, Music2, Pause, Play, Send, Volume2, VolumeX, X
} from 'lucide-react'

/* ─── constants ─── */
const WEDDING_DATE = new Date('2027-02-14T18:00:00+05:30')
const BRIDE = 'Priya'
const GROOM = 'Arjun'
const BRIDE_INITIAL = 'P'
const GROOM_INITIAL = 'A'
const VENUE_NAME = 'The Royal Mahal Palace'
const VENUE_ADDRESS = '42, Lakeside Boulevard, Sardar Patel Marg, Jaipur, Rajasthan 302001'
const WEDDING_DAY = 'SUNDAY'
const WEDDING_DATE_NUM = '14'
const WEDDING_MONTH = 'FEBRUARY'
const WEDDING_YEAR = '2027'
const WEDDING_DATE_DISPLAY = '14 · 02 · 2027'
const WEDDING_DATE_LONG = '14 February 2027'
const MAP_QUERY = encodeURIComponent(`${VENUE_NAME}, ${VENUE_ADDRESS}`)

const gallery = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1100&q=85',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1100&q=85',
]

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}
const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}
const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

/* ─── AnimatedSection wrapper ─── */
function AnimatedSection({ children, className, id, variants = fadeUp, ...rest }: {
  children: React.ReactNode
  className?: string
  id?: string
  variants?: typeof fadeUp
  [key: string]: any
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      className={className}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.section>
  )
}

function AnimatedDiv({ children, className, variants = fadeUp, delay = 0, ...rest }: {
  children: React.ReactNode
  className?: string
  variants?: typeof fadeUp
  delay?: number
  [key: string]: any
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const v = delay > 0
    ? { ...variants, visible: { ...variants.visible, transition: { ...((variants.visible as any).transition || {}), delay } } }
    : variants
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={v} {...rest}>
      {children}
    </motion.div>
  )
}

/* ─── countdown ─── */
function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return useMemo(() => {
    const diff = Math.max(0, WEDDING_DATE.getTime() - now)
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      passed: diff === 0,
    }
  }, [now])
}

/* ─── scratch card ─── */
function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [isScratching, setIsScratching] = useState(false)
  const scratchPercentRef = useRef(0)

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width
    const sy = canvas.height / rect.height
    const cx = (x - rect.left) * sx
    const cy = (y - rect.top) * sy

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(cx, cy, 32, 0, Math.PI * 2)
    ctx.fill()

    // Check percentage scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let transparent = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++
    }
    const percent = (transparent / (imageData.data.length / 4)) * 100
    scratchPercentRef.current = percent
    if (percent > 45) {
      setRevealed(true)
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => { setIsScratching(true); draw(e.clientX, e.clientY) }, [draw])
  const handleMouseMove = useCallback((e: React.MouseEvent) => { if (isScratching) draw(e.clientX, e.clientY) }, [isScratching, draw])
  const handleMouseUp = useCallback(() => setIsScratching(false), [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsScratching(true)
    const t = e.touches[0]
    draw(t.clientX, t.clientY)
  }, [draw])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!isScratching) return
    const t = e.touches[0]
    draw(t.clientX, t.clientY)
  }, [isScratching, draw])
  const handleTouchEnd = useCallback(() => setIsScratching(false), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 380
    canvas.height = 220

    // Create golden scratch surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#c9a84c')
    gradient.addColorStop(0.3, '#e8d48b')
    gradient.addColorStop(0.5, '#dbb94d')
    gradient.addColorStop(0.7, '#e8d48b')
    gradient.addColorStop(1, '#c09030')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add shine line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, canvas.height * 0.3)
    ctx.lineTo(canvas.width, canvas.height * 0.6)
    ctx.stroke()

    // Add text
    ctx.fillStyle = '#8b6914'
    ctx.font = '700 11px "DM Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '3px'
    ctx.fillText('✨  SCRATCH TO REVEAL  ✨', canvas.width / 2, canvas.height / 2 - 8)
    ctx.fillStyle = '#a07c28'
    ctx.font = '500 10px "DM Sans", sans-serif'
    ctx.fillText('THE WEDDING DATE', canvas.width / 2, canvas.height / 2 + 14)

    // Sparkle dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255, 255, 220, ${Math.random() * 0.5 + 0.2})`
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [])

  return (
    <div className={`scratch-card-container ${revealed ? 'revealed' : ''}`}>
      <div className="scratch-card-inner">
        {/* Content underneath */}
        <div className="scratch-content">
          <span className="scratch-label">SAVE THE DATE</span>
          <div className="scratch-date-big">{WEDDING_DATE_NUM}</div>
          <div className="scratch-month">{WEDDING_MONTH} {WEDDING_YEAR}</div>
          <div className="scratch-day">{WEDDING_DAY}</div>
          <div className="scratch-names">{BRIDE} & {GROOM}</div>
          <div className="scratch-hearts">💕</div>
        </div>
        {/* Scratch overlay */}
        {!revealed && (
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        )}
      </div>
      {revealed && (
        <motion.div
          className="scratch-revealed-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ✨ You're Invited! ✨
        </motion.div>
      )}
      {!revealed && (
        <p className="scratch-hint">Use your finger or mouse to scratch ☝️</p>
      )}
    </div>
  )
}

/* ─── floral mark ─── */
function FloralMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`floral-mark ${small ? 'small' : ''}`} aria-hidden="true">
      <span>✳</span><i>✧</i><span>✳</span>
    </div>
  )
}

/* ─── floating petals ─── */
function FloatingPetals() {
  return (
    <div className="floating-petals" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`petal petal-${i + 1}`}>🌸</div>
      ))}
    </div>
  )
}

/* ─── App ─── */
export default function App() {
  const countdown = useCountdown()
  const [musicOn, setMusicOn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', attendance: 'Joyfully accepts', guests: '2', message: '' })
  const [musicError, setMusicError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showEnvelope, setShowEnvelope] = useState(true)

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (musicOn) { audio.pause(); setMusicOn(false); return }
    try { await audio.play(); setMusicOn(true); setMusicError('') }
    catch { setMusicError('Add your music file at public/wedding-song.mp3 to enable the soundtrack.') }
  }

  const updateForm = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }))
  const submitRsvp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (galleryIndex === null) return
      if (event.key === 'Escape') setGalleryIndex(null)
      if (event.key === 'ArrowRight') setGalleryIndex((galleryIndex + 1) % gallery.length)
      if (event.key === 'ArrowLeft') setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [galleryIndex])

  const closeMenu = () => setMenuOpen(false)
  const navItems = [['The story', '#story'], ['Celebration', '#celebration'], ['Gallery', '#gallery'], ['RSVP', '#rsvp']]

  /* ─── Envelope intro ─── */
  if (showEnvelope) {
    return (
      <div className="envelope-intro">
        <FloatingPetals />
        <motion.div
          className="envelope-card"
          initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="envelope-seal">💌</div>
          <p className="envelope-pre">You are cordially invited to</p>
          <h1 className="envelope-names">{BRIDE} <span>&</span> {GROOM}</h1>
          <p className="envelope-subtitle">Wedding Celebration</p>
          <div className="envelope-date-badge">{WEDDING_DATE_DISPLAY}</div>
          <motion.button
            className="envelope-open-btn"
            onClick={() => setShowEnvelope(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            OPEN INVITATION <ArrowUpRight size={14} />
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <main>
      <audio ref={audioRef} src="/wedding-song.mp3" loop />
      <button className="music-toggle" onClick={toggleMusic} aria-label={musicOn ? 'Pause music' : 'Play music'}>
        {musicOn ? <Pause size={16} /> : <Music2 size={16} />} <span>{musicOn ? 'Pause music' : 'Play music'}</span>
      </button>
      {musicError && <div className="music-hint" role="status">{musicError}</div>}

      {/* ─── Header ─── */}
      <motion.header
        className="site-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <a href="#home" className="monogram">{BRIDE_INITIAL}<span>&</span>{GROOM_INITIAL}</a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
        </nav>
        <a className="header-date" href="#rsvp">{WEDDING_DATE_DISPLAY} <ArrowUpRight size={14} /></a>
      </motion.header>

      {/* ─── Hero ─── */}
      <section className="hero" id="home">
        <FloatingPetals />
        <div className="hero-wash" />
        <div className="hero-ornament ornament-left">❧</div>
        <div className="hero-ornament ornament-right">❧</div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <span /> A CELEBRATION OF LOVE <span />
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}>
            Two hearts.<br /><em>One beautiful</em> forever.
          </motion.h1>
          <motion.div className="hero-names" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>
            {BRIDE} <span>&</span> {GROOM}
          </motion.div>
          <motion.p className="hero-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            {WEDDING_DAY} · {WEDDING_DATE_NUM} {WEDDING_MONTH} {WEDDING_YEAR}
          </motion.p>
          <motion.a className="round-link" href="#story" aria-label="Discover the invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
            <ArrowDown size={19} />
          </motion.a>
        </motion.div>
        <div className="hero-bottom"><span>WITH LOVE & BLESSINGS</span><span>SCROLL TO EXPLORE</span><span>EST. {WEDDING_YEAR}</span></div>
      </section>

      {/* ─── Intro ─── */}
      <AnimatedSection className="intro section-pad" id="story">
        <motion.div className="section-kicker" variants={fadeDown}>01 / THE INVITATION</motion.div>
        <div className="intro-grid">
          <AnimatedDiv className="intro-image-wrap" variants={fadeLeft}>
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85" alt="Wedding celebration" />
            <div className="image-stamp"><span>THE</span><strong>Wedding</strong><span>OF OUR DREAMS</span></div>
          </AnimatedDiv>
          <AnimatedDiv className="intro-copy" variants={fadeRight} delay={0.2}>
            <FloralMark />
            <p className="script-label">Together with our families</p>
            <h2>With hearts full<br />of <em>happiness,</em></h2>
            <p className="body-copy">We invite you to join us as we begin our forever. Your presence will make our celebration more beautiful, and your blessings will make it unforgettable.</p>
            <div className="signature">{BRIDE} <span>&</span> {GROOM}</div>
            <p className="tiny-note">REQUEST THE PLEASURE OF YOUR COMPANY</p>
          </AnimatedDiv>
        </div>
      </AnimatedSection>

      {/* ─── Couple band ─── */}
      <AnimatedSection className="couple-band" variants={scaleIn}>
        <div className="couple-band-inner">
          <motion.span className="band-overline" variants={fadeUp}>A NEW CHAPTER BEGINS</motion.span>
          <motion.h2 variants={fadeUp}>Made for each other.<br /><em>Meant to be together.</em></motion.h2>
          <div className="band-divider"><span>✧</span></div>
          <motion.p variants={fadeUp}>Some stories are written in the stars.<br />Ours is written in every little moment.</motion.p>
        </div>
      </AnimatedSection>

      {/* ─── Celebration + Scratch Card ─── */}
      <AnimatedSection className="celebration section-pad" id="celebration">
        <motion.div className="section-kicker" variants={fadeDown}>02 / SAVE THE DATE</motion.div>
        <AnimatedDiv className="center-heading" variants={fadeUp}>
          <p className="script-label">The day we've been waiting for</p>
          <h2>Let the <em>celebration</em> begin</h2>
          <p className="body-copy">A day filled with laughter, traditions, music and memories. We cannot wait to celebrate with you.</p>
        </AnimatedDiv>

        {/* Scratch Card */}
        <AnimatedDiv className="scratch-section" variants={scaleIn}>
          <ScratchCard />
        </AnimatedDiv>

        <AnimatedDiv className="date-card" variants={fadeUp} delay={0.1}>
          <div className="date-side"><span>{WEDDING_DAY}</span><strong>{WEDDING_DATE_NUM}</strong><span>{WEDDING_MONTH}</span></div>
          <div className="date-main"><FloralMark small /><span>THE WEDDING DAY</span><strong>{WEDDING_YEAR}</strong><span>AN OCCASION TO REMEMBER</span></div>
          <div className="date-side"><span>{BRIDE.toUpperCase()}</span><strong className="amp-date">&</strong><span>{GROOM.toUpperCase()}</span></div>
        </AnimatedDiv>
        <AnimatedDiv className="countdown-wrap" variants={fadeUp} delay={0.2}>
          <p className="tiny-note">{countdown.passed ? 'TODAY IS THE DAY!' : 'COUNTING DOWN TO FOREVER'}</p>
          <div className="countdown">
            {Object.entries({ Days: countdown.days, Hours: countdown.hours, Minutes: countdown.minutes, Seconds: countdown.seconds }).map(([label, value]) =>
              <motion.div
                className="count-unit"
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: label === 'Days' ? 0 : label === 'Hours' ? 0.1 : label === 'Minutes' ? 0.2 : 0.3 }}
              >
                <strong>{String(value).padStart(2, '0')}</strong><span>{label}</span>
              </motion.div>
            )}
          </div>
        </AnimatedDiv>
      </AnimatedSection>

      {/* ─── Venue ─── */}
      <AnimatedSection className="venue-section" variants={fadeUp}>
        <AnimatedDiv className="venue-image" variants={fadeLeft}>
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=85" alt="Wedding venue" />
        </AnimatedDiv>
        <AnimatedDiv className="venue-card" variants={fadeRight} delay={0.2}>
          <span className="tiny-note">THE PLACE</span>
          <FloralMark small />
          <h2>Where our<br /><em>forever begins</em></h2>
          <p className="venue-name">{VENUE_NAME}</p>
          <p className="venue-address">{VENUE_ADDRESS}</p>
          <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`} target="_blank" rel="noreferrer">OPEN IN GOOGLE MAPS <ArrowUpRight size={15} /></a>
        </AnimatedDiv>
      </AnimatedSection>

      {/* ─── Timeline ─── */}
      <AnimatedSection className="timeline-section section-pad" variants={fadeUp}>
        <motion.div className="section-kicker" variants={fadeDown}>WEDDING EVENTS</motion.div>
        <AnimatedDiv className="center-heading" variants={fadeUp}>
          <p className="script-label">The Schedule</p>
          <h2>A day of <em>celebrations</em></h2>
        </AnimatedDiv>
        <div className="timeline">
          {[
            { time: '4:00 PM', event: 'Baraat & Welcome', icon: '🎺', desc: 'The groom arrives with music, dance, and joy' },
            { time: '5:30 PM', event: 'Wedding Ceremony', icon: '💍', desc: 'The sacred rituals that bind two souls forever' },
            { time: '7:00 PM', event: 'Reception & Dinner', icon: '🍽️', desc: 'An evening of music, food, and celebration' },
            { time: '9:00 PM', event: 'Dance & Party', icon: '💃', desc: 'Let loose and celebrate till the stars fade' },
          ].map((item, i) => (
            <AnimatedDiv className="timeline-item" key={i} variants={i % 2 === 0 ? fadeLeft : fadeRight} delay={i * 0.15}>
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-dot"><span>{item.icon}</span></div>
              <div className="timeline-info">
                <h3>{item.event}</h3>
                <p>{item.desc}</p>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── Gallery ─── */}
      <AnimatedSection className="gallery-section section-pad" id="gallery">
        <motion.div className="section-kicker" variants={fadeDown}>03 / LITTLE MOMENTS</motion.div>
        <AnimatedDiv className="gallery-heading" variants={fadeUp}>
          <div><p className="script-label">A glimpse into the magic</p><h2>Love, in <em>frames.</em></h2></div>
          <p className="gallery-note">A few beautiful moments<br />to inspire our own.</p>
        </AnimatedDiv>
        <motion.div
          className="gallery-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {gallery.map((src, i) => (
            <motion.button
              className={`gallery-item gallery-${i + 1}`}
              key={src}
              onClick={() => setGalleryIndex(i)}
              aria-label={`Open gallery image ${i + 1}`}
              variants={scaleIn}
            >
              <img src={src} alt={`Wedding inspiration ${i + 1}`} loading="lazy" />
              <span>0{i + 1}</span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* ─── RSVP ─── */}
      <AnimatedSection className="rsvp-section" id="rsvp">
        <div className="rsvp-decoration">✳</div>
        <div className="rsvp-inner">
          <motion.div className="section-kicker" variants={fadeDown}>04 / BE OUR GUEST</motion.div>
          {submitted ? (
            <AnimatedDiv className="success-state" variants={scaleIn}>
              <div className="success-icon"><Check /></div>
              <p className="script-label">Thank you so much</p>
              <h2>Your love means<br /><em>the world to us.</em></h2>
              <p>This is a demo confirmation only — your response has not been saved or sent. We can't wait to celebrate with you!</p>
              <button className="text-link" onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', attendance: 'Joyfully accepts', guests: '2', message: '' }) }}>SUBMIT ANOTHER RESPONSE</button>
            </AnimatedDiv>
          ) : (
            <div className="rsvp-grid">
              <AnimatedDiv className="rsvp-copy" variants={fadeLeft}>
                <p className="script-label">Kindly let us know</p>
                <h2>Will you join<br />our <em>happily ever after?</em></h2>
                <p>It would mean the world to have you with us on our special day. Please let us know if you can make it.</p>
                <div className="rsvp-date"><CalendarDays size={18} /><span>{WEDDING_DATE_LONG}</span></div>
              </AnimatedDiv>
              <AnimatedDiv variants={fadeRight} delay={0.15}>
                <form className="rsvp-form" onSubmit={submitRsvp}>
                  <label>Your name<input required value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Enter your full name" /></label>
                  <label>Phone number<input required type="tel" pattern="[0-9+() -]{8,16}" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+91 00000 00000" /></label>
                  <label>Will you be attending?<select value={form.attendance} onChange={e => updateForm('attendance', e.target.value)}><option>Joyfully accepts</option><option>Regretfully declines</option></select></label>
                  <label>Number of guests<select value={form.guests} onChange={e => updateForm('guests', e.target.value)}><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5+">5+ guests</option></select></label>
                  <label className="full-field">A little note for us<textarea rows={3} value={form.message} onChange={e => updateForm('message', e.target.value)} placeholder="Share a wish, a memory, or just say hello..." /></label>
                  <button className="submit-button" type="submit">SEND YOUR WISHES <Send size={15} /></button>
                  <p className="form-note">This is a demo — no data is stored or sent.</p>
                </form>
              </AnimatedDiv>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* ─── Footer ─── */}
      <AnimatedSection className="footer" as="footer" variants={fadeUp}>
        <FloralMark small />
        <p className="script-label">With love,</p>
        <div className="footer-names">{BRIDE} <span>&</span> {GROOM}</div>
        <p className="footer-date">{WEDDING_DATE_DISPLAY}</p>
        <p className="footer-thanks">THANK YOU FOR BEING PART OF OUR STORY</p>
        <a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={14} /></a>
      </AnimatedSection>

      {/* ─── Lightbox ─── */}
      {galleryIndex !== null && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button className="lightbox-close" onClick={() => setGalleryIndex(null)} aria-label="Close gallery"><X /></button>
          <button className="lightbox-arrow left" onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)} aria-label="Previous image"><ChevronLeft /></button>
          <motion.img
            key={galleryIndex}
            src={gallery[galleryIndex]}
            alt={`Wedding gallery ${galleryIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <button className="lightbox-arrow right" onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)} aria-label="Next image"><ChevronRight /></button>
          <span className="lightbox-count">{galleryIndex + 1} / {gallery.length}</span>
        </motion.div>
      )}
    </main>
  )
}
