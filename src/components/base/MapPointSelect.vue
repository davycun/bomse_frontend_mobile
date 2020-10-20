<template>
    <div>
        <van-popup v-model="selectVisible" :style="{height:height,width:width}" :position="position">
            <van-row>
                <van-col span="20">
                        {{detailAddress}}
                </van-col>
                <van-col span="4">
                    <van-button size="small" type="primary" @click="onSelectSubmitOk">确定</van-button>
                </van-col>
            </van-row>
            <div style="height: 100%; width: 100%; overflow:hidden" id="mapContainer"></div>
        </van-popup>
    </div>
</template>

<script>

    import {Popup,Row,Col,Button} from 'vant';

    export default {
        name: "MapPointSelect",
        components: {
            [Popup.name]: Popup,
            [Row.name]: Row,
            [Col.name]:Col,
            [Button.name]:Button
        },
        props: {
            visible: {
                type: Boolean
            },
            onCancel: {
                type: Function
            },
            onSubmitOk: {
                type: Function
            },
            position: {
                default: function () {
                    return 'bottom';
                }
            },
            height: {
                default() {
                    return '40%';
                }
            },
            width: {
                default() {
                    return '100%';
                }
            },
            addressData:{
                type:Object,
                default(){
                    return {
                        cityName:'上海',
                        address:''
                    }
                }
            }
        },
        data: function () {
            return {
                point:{}
            }
        },
        computed: {
            selectVisible: {
                get: function () {
                    return this.visible;
                },
                set: function () {
                    this.onSelectCancel()
                }
            },
            detailAddress:{
                get:function () {
                    return `${this.addressData.cityName||""}${this.addressData.regionName||""}${this.addressData.streetName||""}${this.addressData.communityName||""}${this.addressData.address||""}`;
                }
            }
        },
        updated:function(){

            const {BMap} = window;
            let myGeo = new BMap.Geocoder();
            myGeo.getPoint(this.detailAddress, (point) => {
                if (point) {
                    this.point = point;
                    this.showMap(point);
                }
            }, this.addressData.cityName);
        },
        methods: {
            onSelectCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },
            onSelectSubmitOk() {
                if (this.onSubmitOk){
                    this.onSubmitOk(this.point);
                }
            },
            showMap(point){

                const {BMap} = window;
                //新增地图
                let map = new BMap.Map("mapContainer"); // 创建Map实例
                map.centerAndZoom(point ? point : this.point, 15);
                map.setCurrentCity(this.addressData.cityName);
                map.enableScrollWheelZoom(true);
                map.addControl(new BMap.MapTypeControl()); //添加地图类型控件

                //添加覆盖物
                let myIcon = new BMap.Icon("zuobiao.png", new BMap.Size(40, 40), {
                    imageSize: new BMap.Size(40, 40)
                });
                let marker = new BMap.Marker(point ? point : this.point, {icon: myIcon});
                map.addOverlay(marker);

                //允许覆盖物拖动
                marker.enableDragging();
                marker.addEventListener("dragend", (e) => {
                    this.point={lng: e.point.lng, lat: e.point.lat}

                })
            }
        }
    }
</script>

<style scoped>

</style>