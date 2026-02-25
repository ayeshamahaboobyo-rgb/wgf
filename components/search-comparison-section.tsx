'use client'

import { useEffect, useState } from 'react'

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const PlayIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const FileIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)

interface AnimatedImageCardProps {
  title?: string
  description?: string
}

const AnimatedImageCard = ({ title = 'Images', description = 'Search your images by describing what\'s in them — people, objects, text, scenes.' }: AnimatedImageCardProps) => {
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

  useEffect(() => {
    setAnimationCycle(1)
  }, [])

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
    <div className="relative bg-gradient-to-br from-secondary/60 to-background backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/20 h-screen md:h-[650px] flex flex-col shadow-lg hover:shadow-2xl hover:border-accent/40 transition-all duration-300">
      <div className="p-6 border-b border-accent/10 space-y-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Windows Search looks at filenames.</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-accent/20">
          <span className="text-muted-foreground">🔍</span>
          <span className="text-sm font-mono text-foreground">{displayedQuery}</span>
          {displayedQuery.length < fullQuery.length && <span className="w-1 h-4 bg-accent animate-pulse"></span>}
        </div>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center overflow-hidden">
        {(stage === 'initial' || stage === 'typing' || stage === 'scanning') && (
          <div className="w-full flex gap-4 justify-center items-center h-full overflow-hidden">
            {images.map((img, idx) => (
              <div key={img.id} className="flex flex-col items-center gap-3 transition-opacity duration-500 flex-1 min-w-0" style={{ opacity: fadeOpacity[idx] }}>
                <div className="relative w-full aspect-square bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-lg border border-accent/30 flex items-center justify-center text-muted-foreground overflow-hidden shadow-lg backdrop-blur-sm hover:shadow-xl hover:border-accent/50 transition-all duration-300">
                  <ImageIcon />
                  {stage === 'scanning' && (
                    <div 
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-b from-transparent via-accent to-transparent"
                      style={{
                        top: `${scanProgress}%`,
                        opacity: 0.9,
                        boxShadow: '0 0 16px rgba(34, 211, 238, 0.8), 0 0 8px rgba(34, 211, 238, 0.5)',
                        zIndex: 10
                      }}
                    />
                  )}
                </div>
                <p className="text-xs text-foreground font-medium text-center line-clamp-1">{img.name}</p>
              </div>
            ))}
          </div>
        )}

        {stage === 'expanded' && selectedImage !== null && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 animate-expand overflow-hidden px-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-10%20234755-1X0I4sbNHjndxVD0EHbA2StS4wHhKL.png"
              alt="JavaScript error screenshot"
              className="w-full max-h-[calc(100%-100px)] object-contain"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="px-3 py-2 bg-accent/20 border border-accent/60 rounded-lg backdrop-blur-sm">
                <p className="text-xs font-semibold text-accent">✓ Match found: javascript error</p>
              </div>
              <p className="text-sm text-foreground font-medium">{images[selectedImage].name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AnimatedVideoCard = ({ title = 'Videos', description = 'Search your videos by describing what\'s happening — scenes, objects, moments.' }: AnimatedImageCardProps) => {
  const [animationCycle, setAnimationCycle] = useState(0)
  const [stage, setStage] = useState<'initial' | 'typing' | 'scanning' | 'expanded'>('initial')
  const [displayedQuery, setDisplayedQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const [fadeOpacity, setFadeOpacity] = useState([1, 1])

  const fullQuery = "pricing discussion"
  const videos = [
    { id: 1, name: 'recording_042' },
    { id: 2, name: 'recording_189' }
  ]

  useEffect(() => {
    setAnimationCycle(1)
  }, [])

  useEffect(() => {
    if (stage === 'initial' && animationCycle > 0) {
      let index = 0
      const typeInterval = setInterval(() => {
        if (index <= fullQuery.length) {
          setDisplayedQuery(fullQuery.slice(0, index))
          index++
        } else {
          clearInterval(typeInterval)
          setTimeout(() => setStage('expanded'), 200)
        }
      }, 50)
      return () => clearInterval(typeInterval)
    }
  }, [stage, animationCycle])

  useEffect(() => {
    if (stage === 'expanded') {
      const expandedTimer = setTimeout(() => {
        setStage('initial')
        setDisplayedQuery('')
        setSelectedVideo(null)
        setFadeOpacity([1, 1])
      }, 2000)
      return () => clearTimeout(expandedTimer)
    }
  }, [stage])

  return (
    <div className="bg-gradient-to-br from-secondary/60 to-background rounded-2xl overflow-hidden border border-accent/20 h-screen md:h-[650px] flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="p-6 border-b border-accent/10 space-y-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Windows Search looks at filenames.</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-accent/20">
          <span className="text-muted-foreground">🔍</span>
          <span className="text-sm font-mono text-foreground">{displayedQuery}</span>
          {displayedQuery.length < fullQuery.length && <span className="w-1 h-4 bg-accent animate-pulse"></span>}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center overflow-hidden">
        {(stage === 'initial' || stage === 'typing') && (
          <div className="flex gap-4 justify-center items-center h-full w-full transition-opacity duration-500 overflow-hidden">
            {videos.map((video, idx) => (
              <div key={video.id} className="flex flex-col items-center gap-3 transition-opacity duration-500 flex-1 min-w-0" style={{ opacity: fadeOpacity[idx] }}>
                <div className="relative w-full aspect-video bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-lg border border-accent/30 flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-sm hover:shadow-xl hover:border-accent/50 transition-all duration-300">
                  <PlayIcon />
                </div>
                <p className="text-xs text-foreground font-medium text-center line-clamp-1">{video.name}</p>
              </div>
            ))}
          </div>
        )}

        {stage === 'expanded' && selectedVideo !== null && (
          <div className="animate-expand flex flex-col items-center justify-center gap-2 h-full w-full overflow-auto">
            <div className="relative w-full max-w-2xl aspect-video bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-lg border border-accent/40 flex items-center justify-center overflow-hidden backdrop-blur-sm">
              <PlayIcon />
              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-accent/20 border border-accent/60 rounded-lg backdrop-blur-sm z-20">
                <p className="text-xs font-semibold text-accent">We'll test the new pricing next quarter.</p>
              </div>
            </div>
            <p className="text-xs text-foreground font-medium line-clamp-1">{videos[selectedVideo].name}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const AnimatedPDFCard = () => {
  return (
    <div className="bg-gradient-to-br from-secondary/60 to-background rounded-2xl overflow-hidden border border-accent/20 h-screen md:h-[650px] flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="p-6 border-b border-accent/10 space-y-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Windows Search looks at filenames.</h2>
        <p className="text-sm text-muted-foreground">Search PDFs by content, metadata, or descriptions.</p>
      </div>
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileIcon />
          <p className="text-muted-foreground">PDF search coming soon</p>
        </div>
      </div>
    </div>
  )
}

const AnimatedDataCard = () => {
  return (
    <div className="relative bg-gradient-to-br from-secondary/60 to-background backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/20 h-screen md:h-[650px] flex flex-col shadow-lg hover:shadow-2xl hover:border-accent/40 transition-all duration-300">
      <div className="p-6 border-b border-accent/10 space-y-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Windows Search looks at filenames.</h2>
        <p className="text-sm text-muted-foreground">Search data files by content and structure.</p>
      </div>
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileIcon />
          <p className="text-muted-foreground">Data search coming soon</p>
        </div>
      </div>
    </div>
  )
}

const AnimatedNoteCard = () => {
  return (
    <div className="bg-gradient-to-br from-secondary/60 to-background rounded-2xl overflow-hidden border border-accent/20 h-screen md:h-[650px] flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="p-6 border-b border-accent/10 space-y-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Windows Search looks at filenames.</h2>
        <p className="text-sm text-muted-foreground">Search your notes instantly with semantic understanding.</p>
      </div>
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileIcon />
          <p className="text-muted-foreground">Note search coming soon</p>
        </div>
      </div>
    </div>
  )
}

const AnimatedCodeCard = () => {
  return (
    <div className="relative bg-gradient-to-br from-secondary/60 to-background backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/20 h-screen md:h-[650px] flex flex-col shadow-lg hover:shadow-2xl hover:border-accent/40 transition-all duration-300">
      <div className="p-6 border-b border-accent/10 space-y-4 flex-shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Windows Search looks at filenames.</h2>
        <p className="text-sm text-muted-foreground">Search code snippets by function, logic, or patterns.</p>
      </div>
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileIcon />
          <p className="text-muted-foreground">Code search coming soon</p>
        </div>
      </div>
    </div>
  )
}

export default function SearchComparisonSection() {
  return (
    <section id="features" className="w-full py-24 md:py-32 bg-background border-b border-border">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Title and description */}
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Windows Search looks at filenames.
            </h2>
            <p className="text-lg text-muted-foreground">
              AltDump looks inside your files.
            </p>
          </div>

          {/* 6 Animated Feature Cards - 2 per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-14">
            <div>
              <AnimatedImageCard />
            </div>

            <div className="relative">
              <AnimatedVideoCard />
            </div>

            <div>
              <AnimatedPDFCard />
            </div>

            <div>
              <AnimatedDataCard />
            </div>

            <div>
              <AnimatedNoteCard />
            </div>

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
        
        @keyframes expand {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-expand {
          animation: expand 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
