<template>
    <div>
        <van-sticky>
            <van-nav-bar title="园区详情"
                         @click-left="onBackClick"
                         left-arrow left-text="返回">
            </van-nav-bar>
        </van-sticky>

        <van-swipe>
            <van-swipe-item v-for="(img,index) in park.parkImagesList" :key="index">
                <img :style="imgClass" :src="fileReadBaseUrl+img+'@detail'"/>
            </van-swipe-item>
        </van-swipe>
        <van-tabs sticky style="margin-bottom: 50px;">
            <van-tab title="基本信息">
                <ParkInfo :park="park"/>
            </van-tab>
            <van-tab title="楼栋信息">
                <BuildingListEditor :auto-load-data="false" ref="buildingEditorList" :park-id="$route.params.id"/>
            </van-tab>
            <van-tab title="楼层信息">
                <FloorList :auto-load-data="true" ref="floorList" :entity-condition="{parkId:$route.params.id}"/>
            </van-tab>
            <van-tab title="联系业主">
                <HouseOwnerList ref="houseOwnerList" :entity-condition="{parkId:park.id}"/>
            </van-tab>
            <van-tab title="操作记录">
                <OperationLogList ref="optLogList" :biz-id="$route.params.id"/>
            </van-tab>
            <van-tab title="修改记录">
                <EditLogList ref="editLogList" :biz-id="$route.params.id"/>
            </van-tab>
        </van-tabs>

        <van-button type="primary" block style="position: fixed;bottom: 0px;" @click="functionVisible=true">功能区
        </van-button>

        <van-popup v-model="functionVisible" position="bottom" style="height:40%;width:100%">

            <van-grid>
                <van-grid-item icon="photo-o" text="新增联系人" @click="onHouseOwnerCreateClick"></van-grid-item>
                <van-grid-item icon="photo-o" text="编辑园区" @click="onParkEditClick"></van-grid-item>
                <van-grid-item icon="photo-o" text="新增楼栋" @click="onBuildingCreateClick"></van-grid-item>
            </van-grid>
        </van-popup>

        <HouseOwnerEditor :editor="false" :editor-data="{parkId:park.id}"
                          :visible="houseOwnerCreateVisible"
                          :on-submit-ok="onHouseOwnerCreateSubmitOk"
                          :on-cancel="onHouseOwnerCreateCancel"/>

        <ParkEditor ref="parkEditor" :editor="true" :visible="parkEditVisible" :on-cancel="onParkEditCancel"
                    :on-submit-ok="onParkEditSubmitOk"/>

        <BuildingEditor ref="buildingCreate" :editor="false" :visible="buildingCreateVisible"
                        :on-submit-ok="onBuildingCreateSubmitOk" :on-cancel="onBuildingCreateCancel"/>
    </div>
</template>

<script>
    import {Sticky, NavBar, Swipe, SwipeItem, Tabs, Tab, Button, Popup, Grid, GridItem} from 'vant';
    import {request} from "../../base/CiiUtils";
    import {Constants} from "../../base/Constants";
    import {Size} from "../../base/Size";
    import ParkInfo from "./ParkInfo";
    import FloorList from "../floor/FloorList";
    import OperationLogList from "../../basic/log/OperationLogList";
    import EditLogList from "../../basic/log/EditLogList";
    import HouseOwnerList from "../owner/HouseOwnerList";
    import HouseOwnerEditor from "../owner/HouseOwnerEditor";
    import ParkEditor from "./ParkEditor";
    import BuildingEditor from "../building/BuildingEditor";
    import BuildingListEditor from "../building/BuildingListEditor";

    export default {
        name: "ParkDetail",
        components: {
            BuildingListEditor,
            BuildingEditor,
            ParkEditor,
            HouseOwnerEditor,
            HouseOwnerList,
            EditLogList,
            OperationLogList,
            FloorList,
            ParkInfo,
            [Sticky.name]: Sticky,
            [NavBar.name]: NavBar,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Tabs.name]: Tabs,
            [Tab.name]: Tab,
            [Button.name]: Button,
            [Popup.name]: Popup,
            [Grid.name]: Grid,
            [GridItem.name]: GridItem
        },
        data: function () {
            return {
                parkId: '',
                park: {},
                imgClass: {
                    width: '100%',
                    height: Size.screenWidth() * 3 / 5 + 'px'
                },

                //功能区
                functionVisible: false,

                //新增业主
                houseOwnerCreateVisible: false,

                //编辑
                parkEditVisible: false,
                //楼栋
                buildingCreateVisible: false,
            }
        },
        computed: {
            fileReadBaseUrl() {
                return Constants.fileReadUrl
            }
        },
        beforeRouteEnter: function (to, from, next) {
            next((vm) => {
                if (from.name !== 'floorDetail') {
                    vm.loadData();
                    if (vm.$refs) {
                        if (vm.$refs.floorList && vm.$refs.floorList.loadData) {
                            vm.$refs.floorList.loadData(true);
                        }
                        if (vm.$refs.optLogList && vm.$refs.optLogList.loadData) {
                            vm.$refs.optLogList.loadData(true);
                        }
                        if (vm.$refs.editLogList && vm.$refs.editLogList.loadData) {
                            vm.$refs.editLogList.loadData(true);
                        }
                        if (vm.$refs.houseOwnerList && vm.$refs.houseOwnerList.loadData) {
                            vm.$refs.houseOwnerList.loadData();
                        }
                        if (vm.$refs.buildingEditorList && vm.$refs.buildingEditorList.loadData) {
                            vm.$refs.buildingEditorList.loadData(true);
                        }
                    }
                }
            });
        },
        methods: {
            loadData: function () {
                request({
                    conf: {
                        url: 'parkIndustry/detail',
                        data: {
                            entity: {
                                id: this.$route.params.id
                            }
                        }
                    },
                    success: (response) => {
                        this.park = response.result;
                    }
                })
            },
            onBackClick() {
                this.$router.back();
            },
            onHouseOwnerCreateClick() {
                this.houseOwnerCreateVisible = true;
            },
            onHouseOwnerCreateCancel() {
                this.houseOwnerCreateVisible = false;
            },
            onHouseOwnerCreateSubmitOk() {
                this.houseOwnerCreateVisible = false;
                if (this.$refs.houseOwnerList) {
                    this.$refs.houseOwnerList.loadData();
                }
            },
            onParkEditClick() {
                this.parkEditVisible = true;
                this.$refs.parkEditor.initCurrentData(this.park);
            },
            onParkEditCancel() {
                this.parkEditVisible = false;
            },
            onParkEditSubmitOk() {
                this.parkEditVisible = false;
                this.loadData(true);
            },
            onBuildingCreateClick() {
                this.buildingCreateVisible = true;
                this.$refs.buildingCreate.initCurrentData({parkId: this.park.id})
            },
            onBuildingCreateCancel() {
                this.buildingCreateVisible = false;
            },
            onBuildingCreateSubmitOk() {
                this.buildingCreateVisible = false;
            }
        }
    }
</script>

<style scoped>

    .my-swipe {
        width: 100%;
        height: 150px;
    }

    .my-swipe-img {
        width: 100%;
        height: 300px;
    }
</style>