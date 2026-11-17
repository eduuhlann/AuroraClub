import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Menu,
  Moon,
  Plus,
  Sun,
  X,
} from 'lucide-react'
import { products, photoStyle } from './catalog'

const Editor = lazy(() => import('./Editor'))

const navItems = [
  ['Início', '#inicio'],
  ['Peças', '#pecas'],
  ['Como funciona', '#como-funciona'],
  ['Galeria', '#galeria'],
  ['Sobre', '#sobre'],
] as const

const steps = [
  ['ESCOLHA SUA PEÇA', 'Encontre o caimento que combina com a sua ideia.'],
  ['ENVIE SUA ARTE', 'PNG, JPG ou JPEG de até 10 MB. Suas cores, intactas.'],
  ['FAÇA DO SEU JEITO', 'Mova, gire, amplie. Misture textos e crie sem moldes.'],
  ['VEJA. SALVE. VISTA.', 'Visualize em modelos e exporte a prévia e sua arte.'],
] as const

const filters = ['Todos', 'Oversized', 'Polo', 'Baby look'] as const

export default function App() {
  const [route, setRoute] = useState(location.hash || '#inicio')
  const [menu, setMenu] = useState(false)
  const [filter, setFilter] = useState<string>('Todos')
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const [activeSection, setActiveSection] = useState(location.hash || '#inicio')
  const editor = route.startsWith('#personalizar')
  const lockRef = useRef(0)

  const applyRoute = useCallback(() => {
    const hash = location.hash || '#inicio'
    setRoute(hash)
    setMenu(false)
    if (hash.startsWith('#personalizar')) {
      setActiveSection(navItems[0][1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(hash.slice(1))
    if (!el) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setActiveSection(hash)
    lockRef.current = Date.now() + 900
    el.classList.remove('section-switch')
    void el.offsetWidth
    el.classList.add('section-switch')
    el.addEventListener(
      'animationend',
      () => el.classList.remove('section-switch'),
      { once: true },
    )
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    applyRoute()
    window.addEventListener('hashchange', applyRoute)
    window.addEventListener('popstate', applyRoute)
    return () => {
      window.removeEventListener('hashchange', applyRoute)
      window.removeEventListener('popstate', applyRoute)
    }
  }, [applyRoute])

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, url: string) => {
    event.preventDefault()
    if (location.hash !== url) history.pushState(null, '', url)
    applyRoute()
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name=theme-color]')
      ?.setAttribute('content', theme === 'dark' ? '#101010' : '#f5f5f3')
    try {
      localStorage.setItem('auroraclub-theme', theme)
    } catch (e) {}
  }, [theme])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (editor) return
    let frame = 0
    const update = () => {
      frame = 0
      if (lockRef.current > Date.now()) return
      const marker = 130
      let current: string = navItems[0][1]
      let bestTop = -Infinity
      navItems.forEach(([, url]) => {
        const el = document.getElementById(url.slice(1))
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top <= marker && top > bestTop) {
          bestTop = top
          current = url
        }
      })
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = navItems[navItems.length - 1][1]
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onScrollEnd = () => {
      lockRef.current = 0
      update()
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('scrollend', onScrollEnd)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [editor])

  useEffect(() => {
    if (editor) return
    const elements = document.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-reveal-group]',
    )
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [editor, filter, route])
  const visibleProducts = products.filter(
    (p) => filter === 'Todos' || filter === p.name,
  )

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a className="logo" href="#inicio">
            aurora<span>club</span>
            <sup>®</sup>
          </a>

          <nav className={menu ? 'open' : ''} aria-label="Navegação principal">
            {navItems.map(([name, url]) => {
              const current = activeSection === url
              return (
                <a
                  key={url}
                  className={current ? 'current' : ''}
                  aria-current={current ? 'location' : undefined}
                  href={url}
                  onClick={(event) => onNavClick(event, url)}
                >
                  {name}
                </a>
              )
            })}
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle"
              aria-label={
                theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'
              }
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="menu-toggle"
              aria-label="Abrir ou fechar menu"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {editor ? (
        <Suspense fallback={<div className="loading">ABRINDO SEU ESTÚDIO…</div>}>
          <Editor
            key={route}
            startProduct={
              products.some((p) => p.id === route.split('/')[1])
                ? route.split('/')[1]
                : 'oversized'
            }
          />
        </Suspense>
      ) : (
        <main>
          <section className="hero" id="inicio">
            <div className="hero-top" data-reveal>
              <span className="eyebrow">
                <span className="status-dot" /> ESTÚDIO INDEPENDENTE DE
                PERSONALIZAÇÃO
              </span>
              <span className="eyebrow">FEITO PARA SER SEU. © 2026</span>
            </div>

            <div className="hero-heading">
              <h1 data-reveal>
                VISTA SUAS
                <br />
                <span>IDEIAS.</span>
                <ArrowUpRight strokeWidth={1.2} />
              </h1>
              <div className="hero-copy" data-reveal-group>
                <span className="small-cross">
                  <Asterisk size={42} />
                </span>
                <p>Sua criatividade não precisa caber em um molde.</p>
                <p className="muted">
                  Escolha uma peça. Envie sua arte. Transforme uma ideia em algo
                  seu.
                </p>
                <a className="black" href="#personalizar">
                  PERSONALIZAR AGORA <ArrowUpRight size={19} />
                </a>
              </div>
            </div>

            <div className="campaign-banner" data-reveal>
              <picture className="campaign-picture">
                <source
                  media="(max-width: 760px)"
                  srcSet="/images/banners/auroraclub-campaign-hero-mobile.webp"
                  width={1086}
                  height={1448}
                />
                <img
                  src="/images/banners/auroraclub-campaign-hero.webp"
                  alt="Três modelos em poses editoriais com camisetas brancas e pretas do AuroraClub."
                  width={1942}
                  height={809}
                  fetchPriority="high"
                />
              </picture>
              <div className="campaign-copy">
                <span className="campaign-kicker">
                  AURORACLUB / FEITO PARA SER SEU
                </span>
                <h2>
                  SUA ARTE.
                  <br />
                  SUAS REGRAS.
                </h2>
                <a className="campaign-cta" href="#personalizar">
                  CRIE SUA PEÇA <ArrowUpRight size={19} />
                </a>
              </div>
              <span className="campaign-note">
                SUA PRÓXIMA CRIAÇÃO COMEÇA AQUI.
              </span>
            </div>

            <div className="hero-caption" data-reveal>
              <span>PEÇAS REAIS. POSSIBILIDADES INFINITAS.</span>
              <a href="#pecas">
                DESCUBRA SUA PRÓXIMA TELA <ArrowDown size={15} />
              </a>
            </div>
          </section>

          <div className="marquee" data-reveal>
            <span>SEM PADRÃO. SEM LIMITES.</span>
            <Plus />
            <span>100% SUA CRIAÇÃO.</span>
            <Plus />
            <span>NADA DE MAIS DO MESMO.</span>
            <Plus />
          </div>

          <section className="catalog section" id="pecas">
            <div className="section-heading" data-reveal-group>
              <div>
                <span className="eyebrow">
                  01 / ESCOLHA SEU PONTO DE PARTIDA
                </span>
                <h2>
                  UMA PEÇA.
                  <br />
                  INFINITAS VERSÕES.
                </h2>
              </div>
              <div className="section-aside">
                <p>A roupa é a tela. O resto é com você.</p>
              </div>
            </div>

            <div className="catalog-toolbar" data-reveal>
              <div className="catalog-filters">
                {filters.map((t) => (
                  <button
                    key={t}
                    className={filter === t ? 'active' : ''}
                    onClick={() => setFilter(t)}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="catalog-count">
                {String(visibleProducts.length).padStart(2, '0')} PEÇAS
              </span>
            </div>

            <div className="product-grid" data-reveal-group>
              {visibleProducts.map((p, i) => (
                <a
                  href={'#personalizar/' + p.id}
                  className="product-card"
                  key={p.id}
                >
                  <div className="product-image" style={photoStyle(p.models[0])}>
                    <span className="product-badge">
                      {String(i + 1).padStart(2, '0')} / SEM ESTAMPA. SEM
                      LIMITES.
                    </span>
                    <div className="product-arrow">
                      <ArrowUpRight />
                    </div>
                  </div>
                  <div className="product-info">
                    <div>
                      <h3>{p.name}</h3>
                      <span>{p.fit}</span>
                    </div>
                    <span className="color-dots">● ◯</span>
                  </div>
                  <div className="product-bottom">
                    <span>{p.tag}</span>
                    <span>PERSONALIZAR ↗</span>
                  </div>
                </a>
              ))}
            </div>
            <p className="tiny">
              Catálogo de visualização. Cores e tamanhos são configurações de
              projeto, não uma oferta de estoque ou venda.
            </p>
          </section>

          <section className="how section" id="como-funciona">
            <div className="section-heading" data-reveal-group>
              <div>
                <span className="eyebrow">02 / DA IDEIA À PEÇA</span>
                <h2>
                  VOCÊ CRIA.
                  <br />
                  A GENTE SIMPLIFICA.
                </h2>
              </div>
              <div className="section-aside">
                <p>Quatro passos. Nenhum cadastro.</p>
                <a className="outlined" href="#personalizar">
                  ABRIR O ESTÚDIO <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            <div className="steps" data-reveal-group>
              {steps.map(([t, d], i) => (
                <article key={t}>
                  <span className="step-num">
                    0{i + 1}
                    <ArrowUpRight />
                  </span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="gallery section" id="galeria">
            <div className="section-heading" data-reveal-group>
              <div>
                <span className="eyebrow">03 / EXPERIMENTOS DO ESTÚDIO</span>
                <h2>NADA DE PADRÃO.</h2>
              </div>
              <div className="section-aside">
                <p>Estudos visuais para inspirar. A próxima ideia pode ser a sua.</p>
              </div>
            </div>

            <div className="gallery-grid campaign-gallery" data-reveal-group>
              <a
                href="#personalizar/oversized"
                className="campaign-gallery-card campaign-gallery-dark"
              >
                <div className="campaign-gallery-frame">
                  <img
                    className="campaign-gallery-image"
                    src="/images/banners/auroraclub-campaign-oversized.webp"
                    alt="Modelo em pose editorial usando uma camiseta oversized."
                    width={1536}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="campaign-gallery-copy">
                    <span className="campaign-kicker">01 / OVERSIZED</span>
                    <h3>
                      SEM
                      <br />
                      PADRÃO.
                    </h3>
                    <span className="campaign-gallery-cta">
                      CRIE A SUA <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
                <span>OVERSIZED / AMPLITUDE É LIBERDADE ↗</span>
              </a>
              <a
                href="#personalizar/baby"
                className="campaign-gallery-card campaign-gallery-light"
              >
                <div className="campaign-gallery-frame">
                  <img
                    className="campaign-gallery-image"
                    src="/images/banners/auroraclub-campaign-baby-look.webp"
                    alt="Modelo de cabelos cacheados usando baby look em um ensaio de estúdio."
                    width={1536}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="campaign-gallery-copy">
                    <span className="campaign-kicker">02 / BABY LOOK</span>
                    <h3>
                      NA SUA
                      <br />
                      MEDIDA.
                    </h3>
                    <span className="campaign-gallery-cta">
                      CRIE A SUA <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
                <span>BABY LOOK / SEU JEITO EM CADA DETALHE ↗</span>
              </a>
            </div>
          </section>

          <section className="manifesto" id="sobre">
            <div className="manifesto-inner">
              <div className="manifesto-top" data-reveal>
                <span className="eyebrow">AURORACLUB / NOSSO MANIFESTO</span>
                <span className="manifesto-index">SOBRE O ESTÚDIO</span>
              </div>
              <div className="manifesto-body" data-reveal-group>
                <div className="manifesto-intro">
                  <h2>
                    NÃO COMPRE APENAS
                    <br />
                    UMA CAMISETA.
                    <br />
                    <span>CRIE A SUA.</span>
                  </h2>
                </div>
                <div className="manifesto-main">
                  <div className="manifesto-copy">
                    <p>
                      No AuroraClub, sua criatividade não precisa caber em um
                      molde. Um estúdio independente para transformar ideias em
                      peças que representam você. Sem conta, sem cadastro: apenas
                      você e sua próxima criação.
                    </p>
                    <a className="white" href="#personalizar">
                      VAMOS CRIAR ALGO <ArrowUpRight size={20} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="manifesto-facts" data-reveal-group>
                <div>
                  <strong>00</strong>
                  <span>CONTAS OU CADASTROS</span>
                </div>
                <div>
                  <strong>01</strong>
                  <span>ESTÚDIO INDEPENDENTE</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>DA CRIAÇÃO É SUA</span>
                </div>
              </div>
            </div>
          </section>

          <footer data-reveal-group>
            <a className="logo" href="#inicio">
              aurora<span>club</span>
              <sup>®</sup>
            </a>
            <span>SUA ARTE. SUA PEÇA. SUAS REGRAS.</span>
            <span>UM ESTÚDIO ABERTO À SUA CRIATIVIDADE. © 2026</span>
          </footer>
        </main>
      )}
    </>
  )
}
