const EARTH_RADIUS = 6371.0
// lat1、lon1为测站位置, lat2, lon2为我的位置
let getDistance = function (lat1, lon1, lat2, lon2) { 
    let distance = 0
    lat1 = convertDegreesToRadians(lat1)
    lon1 = convertDegreesToRadians(lon1)
    lat2 = convertDegreesToRadians(lat2)
    lon2 = convertDegreesToRadians(lon2)
    let vLon = Math.abs(lon1 - lon2)
    let vLat = Math.abs(lat1 - lat2)
    let h = haverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * haverSin(vLon)
    distance = 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h))

    return distance * 1000
} 

let getAngle = function (lat1, lon1, lat2, lon2) { 
    let angle = 0
    lat1 = convertDegreesToRadians(lat1)
    lon1 = convertDegreesToRadians(lon1)
    lat2 = convertDegreesToRadians(lat2)
    lon2 = convertDegreesToRadians(lon2)
    let distanceNorth = EARTH_RADIUS * (lat2 - lat1)
    let distanceEast = EARTH_RADIUS * Math.cos(lat1) * (lon2 - lon1)
    angle = mod( Math.atan2(distanceEast, distanceNorth), 2 * Math.PI )
    angle = convertRadiansToDegrees(angle)
    return angle
} 

let haverSin = function (theta) {
    let v = Math.sin(theta / 2)
    return v * v;
}

let convertDegreesToRadians = function (degrees) {
    return degrees * Math.PI / 180
}

let convertRadiansToDegrees = function (radian) {
    return radian * 180.0 / Math.PI
}

let mod = function (a, b) {
    let num = a % b;
    return num;
}

/*
* 已知一个点的坐标和地图级别，计算这个点所在瓦片的坐标
*/
let convertLatlon2xy = function (lat, lng, level) {
    let tile = {tileX: 0, tileY: 0}
    let tileSize = 256
    let tilesCount = 1 << level

    let pointX = Math.floor(((tileSize / 2 + lng * tileSize / 360.0) * tilesCount) / tileSize )
    let sinY = Math.sin(lat * (Math.PI / 180.0))
    let pointY = Math.floor((((tileSize / 2) + 0.5 * Math.log((1 + sinY) / (1 - sinY)) *
               -(tileSize / (2 * Math.PI))) * tilesCount ) / tileSize )
    tile.tileX = pointX
    tile.tileY = pointY
    return tile
}

/*
* 给定一个点的坐标，以及距离和角度，计算另一个点的坐标
*/
let calcLatLng = function (lat, lng, distance, angle) {
    let positon = {lat: 0,lng: 0}
    let Ea = 6378137
    let Eb = 6356725
    let dx = distance * 1000 * Math.sin(angle * Math.PI / 180.0)
    let dy = distance * 1000 * Math.cos(angle * Math.PI / 180.0)
    let ec = Eb + (Ea - Eb) * (90.0 - lat) / 90.0
    let ed = ec * Math.cos(lat * Math.PI / 180)
    positon.lng = (dx / ed + lng * Math.PI / 180.0) * 180.0 / Math.PI
    positon.lat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI
    return positon
}

/*
* 从经纬度获取点在某一级别瓦片中的像素坐标
*/
let lnglatToPixel = function (longitude, latitude, level) {
    let pixelX = lngToPixelX(longitude, level)
    let pixelY = latToPixelY(latitude, level)

    return {
        pixelX,
        pixelY
    }
}

let lngToPixelX = function (longitude, level) {
    let mapSize = Math.pow(2, level)
    let x = (longitude + 180) / 360
    let pixelX = Math.floor(x * mapSize * 256 % 256)

    return pixelX
}

let latToPixelY = function (latitude, level) {
    let mapSize = Math.pow(2, level)
    let sinLatitude = Math.sin(latitude * Math.PI / 180)
    let y = 0.5 + Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)
    let pixelY = 255 - Math.floor(y * mapSize * 256 % 256)

    return pixelY
}

/*
* 根据经纬度计算测站在瓦片图片中的像素位置
*/
let calcPixel = function (lat, lng, level, radius) {
    const tileSize = 256
    const leftAngle = 315
    const crossDistance = Math.sqrt(2) * radius
    
    let tile = convertLatlon2xy(lat, lng, level)
    let start = calcLatLng(lat, lng, crossDistance, leftAngle)
    let tileStart = convertLatlon2xy(start.lat, start.lng, level)
    let pixel = lnglatToPixel(lng, lat, level);
    let pixelX = pixel.pixelX + tileSize * (tile.tileX - tileStart.tileX)
    let pixelY = pixel.pixelY + tileSize * (tile.tileY - tileStart.tileY)

    return {pixelX,pixelY}
}

export default {getAngle, getDistance, calcPixel}

// let distance = getDistance(37.565613, 109.304499, 37.570306, 109.306605)
// console.log('距离:' + distance * 1000 + ' 米')

// let angle = getAngle(37.565613, 109.304499, 37.570306, 109.306605)
// console.log('方位角(正北为0°，顺时针为正向):' + angle + ' °')

// const center_lat = 37.5655603356
// const center_lng = 109.3042606131
// const radius = 0.6
// const level = 17
// console.log(calcPixel(center_lat, center_lng, level, radius))

