import React, {Component} from 'react'
import Header from "../common/Header";
import Main from "../common/Main";
import "./weather.css";
import axios from "../../modules/utils/Axios";
import result from "../../modules/utils/result";
import Icon from "../../modules/utils/Icon";
import Message from "../../modules/message/Message";

const AMap = window.AMap;
const STATE = {
    skycon: {
        "CLEAR_DAY": "晴",
        "CLEAR_NIGHT": "晴",
        "PARTLY_CLOUDY_DAY": "多云",
        "PARTLY_CLOUDY_NIGHT": "多云",
        "CLOUDY": "阴",
        "LIGHT_HAZE": "轻度雾霾",
        "MODERATE_HAZE": "中度雾霾",
        "HEAVY_HAZE": "重度雾霾",
        "LIGHT_RAIN": "小雨",
        "MODERATE_RAIN": "中雨",
        "HEAVY_RAIN": "大雨",
        "STORM_RAIN": "暴雨",
        "FOG": "雾",
        "LIGHT_SNOW": "小雪",
        "MODERATE_SNOW": "中雪",
        "HEAVY_SNOW": "大雪",
        "STORM_SNOW": "暴雪",
        "DUST": "浮尘",
        "SAND": "沙尘",
        "WIND": "大风",
        "THUNDER_SHOWER": "雷阵雨",
        "HAIL": "冰雹",
        "SLEET": "雨夹雪",
    },
    ultraviolet: ["无", "很弱", "弱", "中等", "强", "很强", "极强"],
    comfort: ["闷热", "酷热", "很热", "热", "温暖", "舒适", "凉爽", "冷", "很冷", "寒冷", "极冷", "刺骨的冷", "湿冷", "干冷"],
    carWashing: ["适宜", "较适宜", "较不适宜", "不适应"],
    coldRisk: ["少发", "较易发", "易发", "极易发"],
    rainOrSnowFall: (level, type) => {
        let desc = Number.parseInt(level);
        if (level > 0) desc = "小";
        if (level > 0.25) desc = "中";
        if (level > 0.35) desc = "大";
        if (level > 0.48) desc = "暴";
        desc += type || "";
        if (type !== "雨" && type !== "雨") desc = "无";
        return desc;
    },
    windDirection: (direction) => {
        let i = Math.floor(direction / 22.5);
        let dName = ["北", "东北偏北", "东北", "东北偏东", "东", "东南偏东", "东南", "东南偏南", "南", "西南偏南", "西南", "西南偏西", "西", "西北偏西", "西北", "西北偏北"];
        return dName[i] + "风";
    },
    windSpeed: (speed) => {
        if (speed < 1) return "无风";
        if (speed < 6) return "轻风";
        if (speed < 28) return "微风";
        if (speed < 38) return "摆风";
        if (speed < 61) return "强风";
        if (speed > 61) return "风暴";
    }
};

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 0,
            location: [],
            weatherData: false,
        }
    }

    componentDidMount = () => {
        this.getLocation();
    };

    render() {

        let widget = <div className={"ya-loading"}>
            <div className="loader3"><span/><span/></div>
        </div>;
        let weatherData = this.state.weatherData;
        if (weatherData) {
            console.log(weatherData);
            console.log(this.state.location);
            let realtime = weatherData.result.realtime;
            let minutely = weatherData.result.minutely;
            let hourly = weatherData.result.hourly;
            let daily = weatherData.result.daily;
            widget = <>
                <div className={"widget"}>
                    <div className={"content"}>
                        <div className={"row locationName"}>
                            <Icon name={"i-zu-copy"}/>
                            <span className={"content"}>{this.state.locationData.formattedAddress}</span>
                        </div>
                        <div className={"row now"}>
                            <Icon name={"i-tongzhi1"}/>
                            <span className={"content"}>{weatherData.result.forecast_keypoint}</span>
                        </div>
                        <div className={"row"}>
                            <div className={"main"}>
                                <div className={"column temperature"}>
                                    <Icon name={"i-wendu"}/>
                                    <span>{Math.floor(realtime.temperature)}°</span>
                                </div>
                                <div className={"column min"}>
                                    <div className={"top"}>
                                        <span className={"skycon"}>{STATE.skycon[realtime.skycon]}</span>
                                        <span className={"air ya-greenBorder"}>
                                        <span>{realtime.air_quality.aqi.chn}</span>
                                        <span>{realtime.air_quality.description.chn}</span>
                                    </span>
                                    </div>
                                    <div className={"bottom"}>
                                        <span>{STATE.windSpeed(realtime.wind.speed)}</span>
                                        <span>紫外线：{STATE.ultraviolet[realtime.life_index.ultraviolet.index % 2]}</span>
                                    </div>
                                </div>
                                <div className={"column weatherIcon"}>
                                    <Icon name={"i-yun"}/>
                                </div>
                            </div>
                        </div>
                        {this.pages.recentDay3(daily)}
                        <div className={"row"}>
                            <div className={"humidity"}>
                                <Icon name={"i-shidu"}/>
                                <span className={"content"}>湿度：{Math.floor(realtime.humidity * 100) + "%"}</span>
                            </div>
                            <div className={"windDirection"}>
                                <Icon name={"i-fengxiang"}/>
                                <span className={"content"}>风向：{STATE.windDirection(realtime.wind.direction)}</span>
                            </div>
                            <div className={"windSpeed"}>
                                <Icon name={"i-icon-fengsu-"}/>
                                <span className={"content"}>风速：{STATE.windSpeed(realtime.wind.speed)}</span>
                            </div>
                            <div className={"pres"}>
                                <Icon name={"i-daqiyali"}/>
                                <span className={"content"}>气压：{Math.floor(realtime.pressure / 1000)} KPA</span>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"location"}>
                                <Icon name={"i-zhengsheyingxiangzhuanhuanweijingweidugeshi"}/>
                                <span
                                    className={"content"}>经度：{weatherData.location[0]}，纬度：{weatherData.location[1]}</span>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"cloudrate"}>
                                <Icon name={"i-yun"}/>
                                <span className={"content"}>云量：{realtime.cloudrate}</span>
                            </div>
                            <div className={"localIntensity"}>
                                <Icon name={"i-qiangjiangshui"}/>
                                <span
                                    className={"content"}>本地降水强度：{STATE.rainOrSnowFall(realtime.precipitation.local.intensity, STATE.skycon[result.skycon])}</span>
                            </div>
                            <div className={"nearestDistance"}>
                                <Icon name={"i-qiangjiangshui"}/>
                                <span className={"content"}>最近降水距离：{realtime.precipitation.nearest.distance}km</span>
                            </div>
                            <div className={"nearestIntensity"}>
                                <Icon name={"i-qiangjiangshui"}/>
                                <span
                                    className={"content"}>最近降水强度：{STATE.rainOrSnowFall(realtime.precipitation.nearest.intensity)}</span>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"ultraviolet"}>
                                <Icon name={"i-ziwaixian"}/>
                                <span className={"content"}>紫外线指数：{realtime.life_index.ultraviolet.index}</span>
                            </div>
                            <div className={"comfort"}>
                                <Icon name={"i-shushiduzhishu"}/>
                                <span className={"content"}>舒适度：{realtime.life_index.comfort.desc}</span>
                            </div>
                            <div className={"apparent_temperature"}>
                                <Icon name={"i---rentitu"}/>
                                <span className={"content"}>体感温度：{realtime.apparent_temperature}℃</span>
                            </div>
                            <div className={"visibility"}>
                                <Icon name={"i-nengjiandu"}/>
                                <span className={"content"}>能见度：{realtime.visibility}m</span>
                            </div>
                            <div className={"dswrf"}>
                                <Icon name={"i-radiation"}/>
                                <span className={"content"}>短波辐射：{realtime.dswrf}（W/㎡）</span>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"airDescription"}>
                                <Icon name={"i-kongqizhiliang"}/>
                                <span className={"content"}>
                                <span>空气质量：{realtime.air_quality.aqi.chn}，{realtime.air_quality.description.chn}</span>
                            </span>
                            </div>
                            <div>
                                <div>
                                    <Icon name={"i-pmcopy"}/>
                                    <span className={"content"}>PM25浓度：{realtime.air_quality.pm25}（μg/m³）</span>
                                </div>
                                <div>
                                    <Icon name={"i-PM"}/>
                                    <span className={"content"}>PM10浓度：{realtime.air_quality.pm10}（μg/m³）</span>
                                </div>
                                <div>
                                    <Icon name={"i-chouyang"}/>
                                    <span className={"content"}>臭氧浓度：{realtime.air_quality.o3}（μg/m³）</span>
                                </div>
                                <div>
                                    <Icon name={"i-eryanghuadan"}/>
                                    <span className={"content"}>二氧化氮浓度：{realtime.air_quality.no2}（μg/m³）</span>
                                </div>
                                <div>
                                    <Icon name={"i-eryanghualiu2"}/>
                                    <span className={"content"}>二氧化硫浓度：{realtime.air_quality.so2}（μg/m³）</span>
                                </div>
                                <div>
                                    <Icon name={"i-yiyanghuatan"}/>
                                    <span className={"content"}>一氧化碳浓度：{realtime.air_quality.co}（μg/m³）</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
        return (<>
                <Header occupied={false}>天气</Header>
                <Main className={"padding0 heightFull"}>
                    <div id="container" className="map"/>
                    <div className={"ya-weather"}>{widget}</div>
                </Main>
            </>
        )
    }

    pages = {
        recentDay3: (daily) => {
            let days = ["今天", "明天", "后天"];
            let day3Tag = days.map((item, index) => {
                return <div className={"column"} key={index}>
                    <div className={"top"}>
                        {item}
                        <span className={"air ya-greenBorder"}>
                            <span>{Math.floor(daily.air_quality.aqi[index].avg.chn)}</span>
                        </span>
                    </div>
                    <div className={"bottom"}>
                        <span>{Math.floor(daily.temperature[index].min) + "° ~ " + Math.floor(daily.temperature[index].max) + "°"}</span>
                        <span className={"sky"}>{STATE.skycon[daily.skycon[index].value]}</span>
                    </div>
                </div>
            });
            return <div className={"row future3Day"}>{day3Tag}</div>
        }
    };
    //获取当前定位
    getLocation = () => {
        let map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
            resizeEnable: true
        });

        // 绑定事件
        let clickHandler = (e) => {
            Message('您在[ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ]的位置点击了地图！拖动点选位置获取天气信息功能即将上线！', false, true);
        };
        map.on('click', clickHandler);

        //解析定位结果
        let onComplete = (locationData) => {
            console.log(locationData);
            let location = locationData.position.toString().split(',');

            //获取天气信息
            let url = "/service/weather/getData?location=" + location.toString() + "&version=v2.5&type=weather";
            axios.get(url, {withCredentials: true})
                .then((res) => {
                    result(res, (weatherData) => {
                        console.log(weatherData);
                        this.setState({location, weatherData, locationData});
                    });
                })
                .catch(function (res) {
                    console.log(res);
                });
        };

        map.plugin('AMap.Geolocation', () => {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：无穷大
                zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition: 'RT',
                buttonOffset: new AMap.Pixel(10, 70),
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete.bind(this)); //返回定位信息
            AMap.event.addListener(geolocation, 'error', onError) //返回定位出错信息
        });

        //解析定位错误信息
        let onError = (data) => {
            alert('定位失败')
        }
    };
}

export default Weather
