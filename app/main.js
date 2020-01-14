import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { CSSRulePlugin } from 'gsap/CSSRulePlugin'
import { getScaleFactor } from './utils'
import { EXTRA_SCALE_WHEN_ACTIVE } from './constants'

// -- Setup --------------------------------------------------------------------

const blueButton = document.querySelector('.button')
const buttonText = document.querySelector('.text')
const grayBlock = document.querySelector('.gray-block')

gsap.registerPlugin(Draggable)
gsap.registerPlugin(CSSRulePlugin)

// -- Gray Block ---------------------------------------------------------------

let currentScaleFactor = 1

let grayBlockAnim = gsap.fromTo(
  grayBlock,
  {
    scale: 0,
    display: 'none'
  },
  {
    scale: () => currentScaleFactor,
    duration: 0.2,
    display: 'block',
    paused: true
  }
)

Draggable.create(grayBlock, {
  type: 'x, y',
  force3D: false, // Better rendering on mobile
  onPress() {
    gsap.to(grayBlock, {
      scale: currentScaleFactor + EXTRA_SCALE_WHEN_ACTIVE,
      duration: 0.2
    })
  },
  onRelease() {
    gsap.to(grayBlock, {
      scale: currentScaleFactor,
      duration: 0.2
    })
  },
  onDrag(event) {
    gsap.killTweensOf(grayBlock, 'scale')

    let scaleFactor = getScaleFactor(event.y)

    gsap.set(grayBlock, { scale: scaleFactor.active })

    currentScaleFactor = scaleFactor.normal
  }
})

grayBlock.addEventListener('click', event => {
  event.stopImmediatePropagation()
})

// -- Blue Button Hover Animation ----------------------------------------------

let handleMouseEnter = () => {
  gsap.killTweensOf(blueButton, 'x,y,boxShadow')

  gsap.fromTo(
    blueButton,
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
        // Add Safe Area
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
  gsap.killTweensOf(blueButton, 'x,y,boxShadow')

  gsap.fromTo(
    blueButton,
    {
      boxShadow: '4px 4px 4px 2px #b9b9b9'
    },
    {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power4',
      boxShadow: '-2px -2px 4px 2px white',
      onStart() {
        // Remove Safe Area
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

blueButton.addEventListener('mouseenter', handleMouseEnter)

blueButton.addEventListener('mouseleave', handleMouseLeave)

// -- Blue Button Animation ----------------------------------------------------

let blueButtonAnim = gsap.timeline({
  paused: true,
  reversed: true,
  onComplete() {
    grayBlockAnim.timeScale(1).play(0)
  }
})

blueButtonAnim.fromTo(
  blueButton,
  {
    width: 140,
    height: 48
  },
  {
    duration: 0.4,
    ease: 'sine.in',
    rotationY: 180,
    width: '101vw', // Fixes 1 pixel gap on iPhone
    height: '100vh',
    borderRadius: 0
  }
)

blueButtonAnim.fromTo(
  buttonText,
  {
    color: 'white'
  },
  { color: 'transparent', duration: 0.2 },
  0
)

blueButton.addEventListener('click', () => {
  if (blueButtonAnim.reversed()) {
    // Hover off and remove `active` & `hover` listeners
    handleMouseLeave()
    blueButton.classList.remove('activatable')
    blueButton.removeEventListener('mouseenter', handleMouseEnter)

    // Play animation
    blueButtonAnim.play()
  } else {
    // Add `active` & `hover` listeners
    blueButton.classList.add('activatable')
    blueButton.addEventListener('mouseenter', handleMouseEnter)

    // Play reverse animation
    blueButtonAnim.reverse()
    grayBlockAnim
      .invalidate()
      // Quickly hide gray block
      .timeScale(20)
      .reverse()
  }
})
