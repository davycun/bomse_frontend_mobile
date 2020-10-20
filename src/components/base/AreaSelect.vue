<template>
    <div>
        <van-popup v-model="selectVisible" :style="{height:height,width:width}" :position="position">
            <van-picker show-toolbar
                        title="市区镇选择"
                        :columns="areaList"
                        value-key="areaName"
                        @confirm="onSelectSubmitOk"
                        @cancel="onSelectCancel">

            </van-picker>
        </van-popup>
    </div>
</template>

<script>

    import {Popup, Picker} from 'vant';
    import {request} from "./CiiUtils";

    export default {
        name: "AreaSelect",
        components: {
            [Popup.name]: Popup,
            [Picker.name]: Picker
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
            }
        },
        data: function () {
            return {
                areaList: [],
                selectData: {
                    cityId: null,
                    cityName: null,
                    regionId: null,
                    regionName: null,
                    streetId: null,
                    streetName: null,
                    communityId: null,
                    communityName: null
                }
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
            }
        },
        created: function () {
            this.loadData()
        },
        methods: {
            loadData() {

                // let al = localStorage.getItem("areaList");
                // if (al){
                //     this.areaList = JSON.parse(al);
                //     return;
                // }
                request({
                    conf: {
                        url: 'areaCpy/queryAllToTree',
                        data: {
                            entity: {
                                notAreaTypes: ["Province"]
                            }
                        }
                    },
                    success: (response) => {
                        this.areaList = response.result;
                        // localStorage.setItem("areaList",JSON.stringify(response.result));
                    }
                })
            },
            onSelectCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },
            onSelectSubmitOk(value, index) {

                let city = null;
                let region = null;
                let street = null;
                let community = null;
                if (index.length >= 1) {
                    city = this.areaList[index[0]];
                    this.selectData.cityId = city.id;
                    this.selectData.cityName = city.areaName;
                }
                if (index.length >= 2) {
                    region = city['children'][index[1]];
                    this.selectData.regionId = region.id;
                    this.selectData.regionName = region.areaName;
                }
                if (index.length >= 3) {
                    street = region['children'][index[2]];
                    this.selectData.streetId = street.id;
                    this.selectData.streetName = street.areaName;
                }
                if (index.length >= 4) {
                    community = street['children'][index[3]];
                    this.selectData.communityId = community.id;
                    this.selectData.communityName = community.areaName;
                }

                if (this.onSubmitOk) {
                    this.onSubmitOk(this.selectData);
                }
            }
        }
    }
</script>

<style scoped>

</style>