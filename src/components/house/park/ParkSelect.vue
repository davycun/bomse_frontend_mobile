<template>
    <div>
        <van-popup v-model="selectVisible" :position="position" :style="{height:height,width:width}">
            <van-search v-model="keyword"
                        @search="onKeywordSearch"
                        @cancel="onKeywordCancel"
                        show-action>
            </van-search>
            <van-pull-refresh v-model="refreshing"
                              @refresh="onRefresh">
                <van-radio-group v-model="selectedData">
                    <van-list v-model="loading"
                              :finished="finished"
                              finished-text="没有更多了"
                              style="margin-bottom: 80px"
                              @load="loadData">
                        <van-cell-group v-for="park in parkList"
                                        style="margin-top:10px"
                                        :key="park.id">
                            <van-cell :title="park.detailAddress"
                                      center
                                      style="text-align: left;"
                                      size="large"
                                      :key="park.id">
                                <template #label>
                                    <van-radio :name="park">
                                        <p>
                                            起租 <span class="red-color">{{park.leaseAcreageMin}} m²</span>，
                                            目前可租 <span class="red-color">{{park.leaseAcreage}} m²</span>
                                        </p>
                                        <p>
                                            最低价格 <span class="red-color">{{park.priceMin}}{{park.priceMinUnitName}}</span>
                                        </p>
                                        <p>
                                            层高 <span class="red-color">{{park.floorHeightMax}} m</span>，
                                            共 <span class="red-color">{{park.buildingCount}}</span> 栋在出租
                                        </p>
                                        <p>
                                            <van-tag plain
                                                     type="warning"
                                                     style="margin-right: 2px;"
                                                     :key="tg"
                                                     v-for="tg in park.advantageTags">
                                                {{tg}}
                                            </van-tag>
                                        </p>
                                    </van-radio>
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-list>
                </van-radio-group>
            </van-pull-refresh>
            <van-button style="position: fixed;bottom: 0px;left: 0px;width: 100%;"
                        @click="onSelectSubmitOk"
                        type="primary">确定
            </van-button>
        </van-popup>
    </div>
</template>

<script>
    import {List, PullRefresh, Cell, CellGroup, Tag, Radio, RadioGroup, Button, Search, Sticky, Popup} from 'vant';
    import {request} from "../../base/CiiUtils";

    export default {
        name: "ParkSelect",
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Tag.name]: Tag,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Button.name]: Button,
            [Search.name]: Search,
            [Sticky.name]: Sticky,
            [Popup.name]: Popup
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
                    return '80%';
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
                selectedData: {},
                keyword: '',
                page: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                },
                parkList: [],
                finished: false,
                loading: false,
                refreshing: false,
            }
        },
        computed:{
            selectVisible:{
                get: function(){
                    return this.visible
                },
                set: function(){
                    this.onSelectCancel();
                }
            }
        },
        methods: {
            loadData: function (reload) {

                if (reload) {
                    this.parkList = [];
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }
                let qc = {
                    start: (this.page.currentPage - 1) * this.page.pageSize,
                    pageSize: this.page.pageSize,
                    entity: {},
                };
                qc.keyword = this.keyword ? this.keyword : null;

                request({
                    conf: {
                        url: "parkIndustry/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.parkList = this.parkList.concat(response.result.data);
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
            onRefresh: function () {
                this.loadData(true)
            },
            onKeywordSearch: function () {
                this.loadData(true);
            },
            onKeywordCancel: function () {
                this.loadData(true);
            },
            onSelectSubmitOk: function () {

                if (this.onSubmitOk){
                    this.onSubmitOk(this.selectedData);
                }
            },
            onSelectCancel:function(){
                if(this.onCancel){
                    this.onCancel();
                }

            }
        }
    }
</script>

<style scoped>
    .red-color {
        color: #ff0000;
    }
</style>