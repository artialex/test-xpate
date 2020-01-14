import {
  BOTTOM_BOUNDARY,
  EXTRA_SCALE_WHEN_ACTIVE,
  MAX_SCALE,
  MIN_SCALE,
  TOP_BOUNDARY
} from './constants'

export function getScaleFactor(posY) {
  let scaleFactor
  let scaleRange = MAX_SCALE - MIN_SCALE

  if (TOP_BOUNDARY >= posY) {
    scaleFactor = 0
  }

  if (BOTTOM_BOUNDARY <= posY) {
    scaleFactor = scaleRange
  }

  if (TOP_BOUNDARY < posY && posY < BOTTOM_BOUNDARY) {
    let boundaryRange = BOTTOM_BOUNDARY - TOP_BOUNDARY
    let pos = posY - TOP_BOUNDARY

    scaleFactor = (pos * scaleRange) / boundaryRange
  }

  return {
    normal: scaleFactor + MIN_SCALE,
    active: scaleFactor + MIN_SCALE + EXTRA_SCALE_WHEN_ACTIVE
  }
}
