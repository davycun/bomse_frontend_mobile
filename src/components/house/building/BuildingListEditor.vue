<template>
    <div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" @load="loadData" finished-text="没有更多了">
                <van-cell v-for="bd in buildingList"
                          :key="bd.id"
                          center
                          style="text-align: left;margin-top: 10px;"
                          size="large"
                          :title="bd.bdName +(bd.bdNameDesc?'（'+bd.bdNameDesc+'）':'')">
                    <template #label>
                        <p>共<span class="red-color"> {{bd.floorCount||0}} </span>层在出租</p>
                        <p>电梯：{{bd.liftDesc}}</p>
                        <p>建筑结构：{{bd.structureTypeName}}</p>
                        <p>月台：{{bd.railwayDesc}}</p>
                        <p>雨棚：{{bd.canopyDesc}}</p>
                    </template>
                    <template #default>
                        <van-button type="primary" size="small" @click="()=>onFloorListClick(bd)">楼层列表</van-button>
                        <van-button style="margin-left: 5px;" type="primary" size="small"
                                    @click="()=>onFloorCreateClick(bd)">新增楼层
                        </van-button>
                    </template>
                </van-cell>
            </van-list>
        </van-pull-refresh>

        <van-button type="primary" block style="position: fixed; bottom: 0px;left:0px;" @click="onBuildingCreateClick">
            新增楼栋
        </van-button>
        <FloorEditor ref="floorCreate" :editor="false" :visible="floorCreateVisible"
                     :on-submit-ok="onFloorCreateSubmitOk" :on-cancel="onFloorCreateCancel"/>

        <BuildingEditor ref="buildingCreate" :editor="false" :visible="buildingCreateVisible"
                        :on-submit-ok="onBuildingCreateSubmitOk" :on-cancel="onBuildingCreateCancel"/>
        <van-popup v-model="floorListVisible" style="height:80%;width:100%" position="bottom">
            <FloorList :auto-load-data="false" ref="floorList" :entity-condition="floorListEntityCondition"/>
        </van-popup>


    </div>
</template>

<script>
    import {PullRefresh, List, Panel, Button, Row, Col, Cell, Toast, Popup} from 'vant';
    import {request} from "../../base/CiiUtils";
    import FloorEditor from "../floor/FloorEditor";
    import BuildingEditor from "./BuildingEditor";
    import FloorList from "../floor/FloorList";

    export default {
        name: "BuildingListEditor",
        components: {
            FloorList,
            BuildingEditor,
            FloorEditor,
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
            [Panel.name]: Panel,
            [Button.name]: Button,
            [Row.name]: Row,
            [Col.name]: Col,
            [Cell.name]: Cell,
            [Popup.name]: Popup
        },
        props: {
            parkId: {
                required: true
            },
            autoLoadData:{
                type:Boolean
            }
        },
        data: function () {
            return {
                buildingList: [],
                page: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                },
                refreshing: false,
                loading: false,
                finished: false,

                //楼层相关属性
                floorCreateVisible: false,
                floorCreateData: {
                    parkId: null,
                    buildingId: null
                },

                //楼栋相关属性
                buildingCreateVisible: false,
                buildingCreateData: {
                    parkId: null
                },

                //
                floorListVisible: false,
                floorListEntityCondition: {buildingId: null}
            }
        },
        methods: {

            //缓存清空数据
            clear() {
                this.buildingList = [];
                this.page = {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                };
                this.refreshing = false;
                this.loading = false;
                this.finished = true;
            },
            created(){
                if (this.autoLoadData){
                    this.loadData(true);
                }
            },
            loadData(reload) {

                if (!this.parkId) {
                    this.loading = false;
                    this.refreshing = false;
                    this.finished = true;
                    return;
                }

                if (reload) {
                    this.buildingList = [];
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }

                let qc = {
                    start: (this.page.currentPage - 1) * this.page.pageSize,
                    pageSize: this.page.pageSize,
                    entity: {
                        parkId: this.parkId
                    },
                };

                request({
                    conf: {
                        url: "buildingIndustry/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.buildingList = this.buildingList.concat(response.result.data);
                            this.page.totalCount = response.result.totalCount;
                        }
                        if (!response.result.hasNextPage) {
                            this.finished = true
                        }
                        this.loading = false;
                        this.refreshing = false;
                    }
                })

            },
            onRefresh() {
                this.loadData(true);
            },
            onFloorCreateClick(building) {

                this.$refs.floorCreate.initCurrentData({
                    parkId: building.parkId,
                    buildingId: building.id
                });

                this.floorCreateVisible = true;
            },
            onFloorCreateCancel() {
                this.floorCreateVisible = false;
            },
            onFloorCreateSubmitOk() {
                this.floorCreateVisible = false;
            },
            onBuildingCreateClick() {
                if (!this.parkId) {
                    Toast.fail("请先选择或者新增园区!");
                    return;
                }
                this.$refs.buildingCreate.initCurrentData({parkId:this.parkId});
                this.buildingCreateVisible = true;
            },
            onBuildingCreateCancel() {
                this.buildingCreateVisible = false;
            },
            onBuildingCreateSubmitOk() {
                this.buildingCreateVisible = false;
            },

            onFloorListClick(building) {
                this.floorListEntityCondition = {
                    buildingId: building.id
                }
                setTimeout(() => {
                    if (this.$refs.floorList && this.$refs.floorList.loadData) {
                        this.$refs.floorList.loadData(true);
                    }
                }, 500);

                this.floorListVisible = true;
            },
        }
    }
</script>

<style scoped>
    .red-color {
        color: #ff0000;
    }
</style>