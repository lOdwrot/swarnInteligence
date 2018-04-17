export const ackleyFunction  = (a = 20, b = 0.2, c = 2 * Math.PI, d = 2) => (x, y) => {
  let arg1, arg2
  if(Array.isArray(x)) {
    arg1 = x[0]
    arg2 = x[1]
  } else {
    arg1 = x
    arg2 = y
  }
  return -a * Math.exp(
      -b * Math.sqrt(1/d * (Math.pow(arg1, 2) + Math.pow(arg2, 2)))
    ) - Math.exp(
      1/d + (Math.cos(c*arg1) + Math.cos(c*arg2))
    ) + a + Math.exp(1)
}


export const FT_SOFA = 'sofa'
export const FT_TV = 'tv'
export const FT_TABLE = 'table'
export const FT_LOCKER = 'locker'
export const FT_CHAIR = 'chair'
const maxTvSofaAngle = 0.524

export const roomDimmensions = [20, 20]
export const doors = {x: 1, y: 0, xW: 1, yW: 1}
export const mWindow = {x: 10, y: 0, xW: 5, yW: 2}

const buildFurniture = (xW, yW, type, canStandOnCarpet, color) => ({
    x: 0,
    y: 0,
    xW: xW,
    yW: yW,
    type: type,
    canStandOnCarpet: canStandOnCarpet,
    color: color
})

export const getRandomizedFurnitures = () => {
  let result = [...furnitures]
  result.forEach(v => {
    v.x = Math.random() * roomDimmensions[0]
    v.y = Math.random() * roomDimmensions[1]
  })

  return result
}

export const furnitures = [
  buildFurniture(5, 1, FT_TV, false, "#6600cc"),
  buildFurniture(6, 2, FT_SOFA, true, "#cc00ff"),
  buildFurniture(3, 2, FT_LOCKER, false, "#0066ff"),
  buildFurniture(3, 2, FT_LOCKER, false, "#339966"),
  buildFurniture(2, 2, FT_CHAIR, true, "#00cc66"),
  buildFurniture(2, 2, FT_CHAIR, true, "#ccff66"),
  buildFurniture(2, 2, FT_CHAIR, true, "#ffcc00"),
  buildFurniture(2, 2, FT_CHAIR, true, "#ff0000"),
  buildFurniture(2, 2, FT_CHAIR, true, "#336600"),
  buildFurniture(2, 2, FT_CHAIR, true, "#990000")
]

export const resetFurnitures = () => furnitures.forEach(v => {
  v.x = 0
  v.y = 0
})

const roomCenter = roomDimmensions.map(v => v/2)

export const roomFunction = (inputArgs = [], _furnitures=furnitures) => {
  let posArray = []
  let currentPos = []
  inputArgs.forEach(v => {
    currentPos.push(v)
    if(currentPos.length == 2) {
      posArray.push(currentPos)
      currentPos = []
    }
  })

  // set positions from inputs
  _furnitures.forEach((v, index) => {
    v.x = posArray[index][0]
    v.y = posArray[index][1]
  })

  //rotate
  _furnitures.forEach(v => {
    let dimMin, dimMax
    if(v.xW > v.yW) {
      dimMin = v.xW
      dimMax = v.yW
    } else {
      dimMax = v.xW
      dimMin = v.yW
    }

    if(Math.min(v.x, roomDimmensions[0] - v.x) < Math.min(v.y, roomDimmensions[1] - v.y)) {
      v.xW = dimMax
      v.yW = dimMin
    } else {
      v.xW = dimMin
      v.yW = dimMax
    }
  })

  // count base score
  let baseScore = countDistanceFromCentrum([..._furnitures].sort((v1, v2) => countDistanceFromCentrum(v1) - countDistanceFromCentrum(v2)).find(v => !v.canStandOnCarpet))

  //check tv angle sofa
  let mTv = _furnitures.find(v => v.type == FT_TV)
  let mSofa = _furnitures.find(v => v.type == FT_SOFA)
  let a = Math.abs(mTv.x - mSofa.x)
  let b = Math.abs(mTv.y - mSofa.y)
  // let c = Math.sqrt(Math.pow(a, 2), Math.pow(b, 2))
  if((b >= a && Math.atan2(a, b) < maxTvSofaAngle) || (b < a && Math.atan2(b, a) < maxTvSofaAngle)) baseScore += 15

  // violation points
  let violationPoints = 0
  _furnitures.forEach((v, index) => {
    if(v.x + v.xW / 2 > roomDimmensions[0]) {
      console.log('Object out of room in X: ' + v.type)
      violationPoints = violationPoints + 1 + v.x + v.xW / 2 - roomDimmensions[0]
    } else if (v.x - v.xW  / 2 < 0){
      console.log('Object out of room in X: ' + v.type)
      violationPoints = violationPoints + 1 + Math.abs(v.x - v.xW )
    }

    if(v.y + v.yW / 2 > roomDimmensions[0]) {
      console.log('Object out of room in X: ' + v.type)
      violationPoints = violationPoints + 1 + v.y + v.yW / 2 - roomDimmensions[0]
    } else if (v.y - v.yW  / 2 < 0){
      console.log('Object out of room in X: ' + v.type)
      violationPoints = violationPoints + 1 + Math.abs(v.y - v.yW )
    }

    _furnitures.forEach((v2, index2) => {
      if(index2 <= index) return
      if(colides(v, v2)) {
        console.log('Colision between objects: ' + v.type + ' ' + v2.type)
        violationPoints++
      }
    })
  })
  //doors and window
  _furnitures.forEach(v => {
    if(colides(v, doors)) {
      console.log('Colision between objects: ' + v.type + ' ' + 'doors')
      violationPoints++
    }
    if(colides(v, mWindow)) {
      console.log('Colision between objects: ' + v.type + ' ' + 'window')
      violationPoints++
    }
  })


  violationPoints *= 2

  console.log('Base score: ' + baseScore)
  console.log('Violation points: ' + violationPoints)



  return baseScore - violationPoints
}

const colides = (v1, v2) =>{
  if(v1.x + v1.xW / 2 <= v2.x - v2.xW / 2 || v1.x - v1.xW / 2 >= v2.x + v2.xW / 2) return false
  if(v1.y + v1.yW / 2 <= v2.y - v2.yW / 2 || v1.y - v1.yW / 2 >= v2.y + v2.yW / 2) return false

  return true
}

const countDistanceFromCentrum = (v) => {
  if(v.x - v.xW / 2 <= roomCenter[0] && v.x + v.xW / 2 >= roomCenter[0] && v.y - v.yW / 2 <= roomCenter[0] && v.y + v.yW / 2 >= roomCenter[0]) return 0

  let cx = Math.max(Math.min(roomCenter[0], v.x+v.xW/2 ), v.x-v.xW/2)
  let cy = Math.max(Math.min(roomCenter[0], v.y+v.yW/2 ), v.y-v.yW/2)

  return Math.sqrt( (roomCenter[0]-cx)*(roomCenter[0]-cx) + (roomCenter[1]-cy)*(roomCenter[1]-cy) )
}
