
/**
 * Created by liusj on 2019/4/23
 * <p>
 * 坐标转换.
 * <p>
 * 火星坐标系 GCJ-02  中国坐标偏移标准，Google Map、高德、腾讯使用
 * 国际坐标   WGS-84  国际标准，GPS坐标（Google Earth使用、或者GPS模块）
 * BD-09   百度坐标偏移标准，Baidu Map使用
 */


    let pi = 3.1415926535897932384626
    let a = 6378245.0  // 长半轴
    let ee = 0.00669342162296594323  // 偏心率平方

    /**
     * 火星坐标系(GCJ02)转国际坐标(WGS84).
     *
     * @param lng 经度
     * @param lat 纬度
     */
    function gcj02ToWgs84(lng, lat) {
        if (typeof lng === 'string') { // 判读是否在国内
            lng = parseFloat(lng)
        }
        if (typeof lat === 'string') { // 判读是否在国内
            lat = parseFloat(lat)
        }
        if (outOfChina(lng, lat)) { // 判读是否在国内
            return [lng, lat]
        }
        let dlat = transformlat(lng - 105.0, lat - 35.0)
        let dlng = transformlng(lng - 105.0, lat - 35.0)
        let radlat = lat / 180.0 * pi
        let magic = Math.sin(radlat)
        magic = 1 - ee * magic * magic
        let sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi)
        let mglat = lat + dlat
        let mglng = lng + dlng
        return [lng * 2 - mglng, lat * 2 - mglat]
    }

    /**
     * 国际坐标(WGS84)转火星坐标系(GCJ02)转.
     *
     * @param lng 经度
     * @param lat 纬度
     */
    function wgs84Togcj02 (lng, lat) {
        if (typeof lng === 'string') {
            lng = parseFloat(lng)
        }
        if (typeof lat === 'string') {
            lat = parseFloat(lat)
        }
        if (outOfChina(lng, lat)) { // 判读是否在国内
            return [lng, lat]
        }
        let dlat = transformlat(lng - 105.0, lat - 35.0)
        let dlng = transformlng(lng - 105.0, lat - 35.0)
        let radlat = lat / 180.0 * pi
        let magic = Math.sin(radlat)
        magic = 1 - ee * magic * magic
        let sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi)
        let mglat = lat + dlat
        let mglng = lng + dlng
        return [mglng, mglat]
    }

    function transformlat(lng, lat) {
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat +
                0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 *
                Math.sin(2.0 * lng * pi)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lat * pi) + 40.0 *
                Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(lat / 12.0 * pi) + 320 *
                Math.sin(lat * pi / 30.0)) * 2.0 / 3.0
        return ret
    }

    function transformlng(lng, lat) {
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng +
                0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 *
                Math.sin(2.0 * lng * pi)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lng * pi) + 40.0 *
                Math.sin(lng / 3.0 * pi)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(lng / 12.0 * pi) + 300.0 *
                Math.sin(lng / 30.0 * pi)) * 2.0 / 3.0
        return ret
    }


    /**
     * 判断是否在国内，不在国内不做偏移.
     */
    function outOfChina(lng, lat) {
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
    }


    export {gcj02ToWgs84, wgs84Togcj02 as default}

