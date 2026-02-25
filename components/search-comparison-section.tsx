'use client'

import { useEffect, useState } from 'react'

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const AnimatedImageCard = () => {
  const [animationCycle, setAnimationCycle] = useState(0)
  const [stage, setStage] = useState<'initial' | 'typing' | 'scanning' | 'expanded'>('initial')
  const [displayedQuery, setDisplayedQuery] = useState('')
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [fadeOpacity, setFadeOpacity] = useState([1, 1, 1])

  const fullQuery = "javascript error"
  const images = [
    { id: 1, name: 'screenshot_357' },
    { id: 2, name: 'screenshot_843' },
    { id: 3, name: 'screenshot_236' }
  ]

  // Start animation cycle
  useEffect(() => {
    setAnimationCycle(1)
  }, [])

  // Stage 1: Type search query (0-1s)
  useEffect(() => {
    if (stage === 'initial' && animationCycle > 0) {
      let index = 0
      const typeInterval = setInterval(() => {
        if (index <= fullQuery.length) {
          setDisplayedQuery(fullQuery.slice(0, index))
          index++
        } else {
          clearInterval(typeInterval)
          setTimeout(() => setStage('scanning'), 200)
        }
      }, 50)

      return () => clearInterval(typeInterval)
    }
  }, [stage, animationCycle])

  // Stage 2: Scanning animation (1-2.5s)
  useEffect(() => {
    if (stage === 'scanning') {
      setScanProgress(0)
      const scanInterval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(scanInterval)
            setTimeout(() => {
              setSelectedImage(0)
              setFadeOpacity([1, 0, 0])
              setStage('expanded')
            }, 300)
            return 100
          }
          return p + 3
        })
      }, 25)

      return () => clearInterval(scanInterval)
    }
  }, [stage])

  // Stage 3: Stay expanded for 2 seconds then reset
  useEffect(() => {
    if (stage === 'expanded') {
      const expandedTimer = setTimeout(() => {
        setStage('initial')
        setDisplayedQuery('')
        setScanProgress(0)
        setSelectedImage(null)
        setFadeOpacity([1, 1, 1])
      }, 2000)

      return () => clearTimeout(expandedTimer)
    }
  }, [stage])

  return (
      <div className="relative bg-gradient-to-br from-secondary/60 to-background backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/20 h-screen md:h-[650px] flex flex-col shadow-lg hover:shadow-2xl hover:border-accent/40 transition-all duration-300 smooth-glow">
        {/* Card header with search input */}
        <div className="p-6 border-b border-accent/10 space-y-4 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-foreground">
            Windows Search looks at filenames.
          </h2>
            </div>
            
            {/* Second line - AltDump */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
                  AltDump looks inside your files.
                </span>
              </h2>
            </div>
            
            {/* Descriptive text with visual hierarchy */}
            <div className="space-y-4 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="border-l-4 border-accent bg-secondary/40 rounded-lg p-6 md:p-8 space-y-3">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Even if you forgot the filename—
                </p>
                
                <div className="flex flex-col gap-2 text-center">
                  <p className="text-lg md:text-xl text-accent/80 italic">
                    if it's buried in a PDF,
                  </p>
                  <p className="text-lg md:text-xl text-accent/70 italic">
                    if it's inside an image,
                  </p>
                  <p className="text-lg md:text-xl text-accent/90 italic">
                    if it's hidden in a document —
                  </p>
                </div>
                
                <div className="pt-2">
                  <p className="text-xl md:text-2xl font-bold text-accent">
                    results appear instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Animated Feature Cards - 2 per row - longer cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-14">
            {/* Images */}
            <div>
              <AnimatedImageCard />
            </div>

            {/* Video */}
            <div className="relative">
              <AnimatedVideoCard 
                title="Video"
                description="Search your videos by describing what's happening — scenes, objects, moments."
              />
            </div>

            {/* PDFs & Docs */}
            <div>
              <AnimatedPDFCard />
            </div>

            {/* Data Files */}
            <div>
              <AnimatedDataCard />
            </div>

            {/* Notes */}
            <div>
              <AnimatedNoteCard />
            </div>

            {/* Code */}
            <div>
              <AnimatedCodeCard />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
