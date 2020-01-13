import { gsap, Elastic } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { CSSRulePlugin } from 'gsap/CSSRulePlugin'

// -- Setup --------------------------------------------------------------------

const wrapper = document.querySelector('.wrapper')
const button = document.querySelector('.button')
const block = document.querySelector('.gray-block')

gsap.registerPlugin(Draggable)
gsap.registerPlugin(CSSRulePlugin)

// -- Logic --------------------------------------------------------------------

let handleMouseEnter = () => {
  gsap.killTweensOf('.button', 'x,y,boxShadow')

  gsap.fromTo(
    '.button',
    {
      boxShadow: '0 0 4px 2px #b9b9b9'
    },
    {
      x: -4,
      y: -4,
      ease: 'elastic',
      boxShadow: '4px 4px 4px 2px #b9b9b9',
      duration: 1,
      onStart() {
        gsap.to(CSSRulePlugin.getRule('.button::before'), {
          cssRule: {
            width: 190,
            height: 90
          },
          duration: 0.2
        })
      }
    }
  )
}

let handleMouseLeave = () => {
  gsap.killTweensOf('.button', 'x,y,boxShadow')

  gsap.fromTo(
    '.button',
    {
      boxShadow: '4px 4px 4px 2px #b9b9b9'
    },
    {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'elastic',
      boxShadow: '-2px -2px 4px 2px white',

      onStart() {
        gsap.to(CSSRulePlugin.getRule('.button::before'), {
          cssRule: {
            width: 160,
            height: 60
          },
          duration: 0.2
        })
      }
    }
  )
}

let currentScale = 1

let dragTween1 = gsap.fromTo(
  '.gray-block',
  {
    scale: 0,
    display: 'none'
  },
  {
    scale: () => currentScale,
    duration: 0.2,
    display: 'block',
    paused: true
  }
)

let timeline = gsap.timeline({
  paused: true,
  reversed: true,
  onComplete() {
    dragTween1.play()
  }
})

// Blue Button
timeline.fromTo(
  '.button',
  {
    width: 140,
    height: 48
  },
  {
    duration: 0.4,
    ease: 'sine.in',
    rotationY: 180,
    width: '100%',
    height: '100vh',
    borderRadius: 0
  }
)

// Text
timeline.fromTo(
  '.text',
  {
    color: 'white'
  },
  { color: 'transparent', duration: 0.2 },
  0
)

// `mousedown` instead of `click`
button.addEventListener('mousedown', () => {
  dragTween1.invalidate()

  if (timeline.reversed()) {
    handleMouseLeave()
    button.classList.remove('activatable')
    button.removeEventListener('mouseenter', handleMouseEnter)

    timeline.play()
  } else {
    button.classList.add('activatable')
    button.addEventListener('mouseenter', handleMouseEnter)

    timeline.reverse()
    dragTween1.reverse()
  }
})

let drag = gsap.to('.gray-block', {
  scale: '+=.1',
  paused: true
})

Draggable.create('.gray-block', {
  type: 'x, y',
  bounds: document.body,
  onPress() {
    gsap.to('.gray-block', {
      scale: '+=.05',
      duration: 0.2
    })
  },
  onRelease() {
    gsap.to('.gray-block', {
      scale: '-=.05',
      duration: 0.2
    })
  },
  onDrag(event) {
    const TOP_BOUNDARY = 150
    const BOTTOM_BOUNDARY = 450

    const MIN_SCALE = 0.3
    const MAX_SCALE = 1

    let x

    if (TOP_BOUNDARY >= event.screenY) {
      x = 0
    }

    if (TOP_BOUNDARY < event.screenY && event.screenY < BOTTOM_BOUNDARY) {
      let range = BOTTOM_BOUNDARY - TOP_BOUNDARY // 300
      // console.log('main :: 106', range)
      let pos = event.screenY - TOP_BOUNDARY // between 100 and 400
      // console.log('main :: 108', pos)

      x = (pos * 0.7) / range
    }

    if (BOTTOM_BOUNDARY <= event.screenY) {
      x = 0.7
    }

    gsap.set('.gray-block', { scale: x + 0.35 })

    currentScale = x + 0.35
  }
})

block.addEventListener('click', event => {
  event.stopImmediatePropagation()
  event.stopPropagation()
  event.preventDefault()
})

button.addEventListener('mouseenter', handleMouseEnter)

button.addEventListener('mouseleave', handleMouseLeave)
