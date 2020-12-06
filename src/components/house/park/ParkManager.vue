<template>
    <div>
        <van-sticky>
            <van-row>
                <van-col span="21">
                    <van-search v-model="keyword"
                                @search="onKeywordSearch">
                    </van-search>
                </van-col>
                <van-col span="3">
                    <van-icon style="padding-top: 12px"
                              size="32"
                              @click="onFilterClick"
                              name="filter-o"></van-icon>
                </van-col>
                <ParkQuery :visible="filterVisible" :on-filter-cancel="onFilterCancel" :on-filter-submit-ok="onFilterSubmitOk"/>
            </van-row>

        </van-sticky>
        <van-pull-refresh v-model="refreshing"
                          @refresh="onRefresh">
            <van-list v-model="loading"
                      :finished="finished"
                      finished-text="下拉刷新"
                      style="margin-bottom: 80px"
                      @load="loadData">

                <van-cell-group v-for="(park) in parkList"
                                style="margin-top:10px"
                                :key="park.id">
                    <van-cell :title="park.regionName+park.streetName+(park.communityName||'')+park.address"
                              center
                              style="text-align: left;"
                              size="large"
                              is-link :to="{path:'/park/detail/'+park.id}"
                              :key="park.id">
                        <template #label>
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
                        </template>
                    </van-cell>
                </van-cell-group>

            </van-list>
        </van-pull-refresh>

        <van-pagination v-model="page.currentPage"
                        style="position: fixed;bottom: 50px;width: 100%;"
                        @change="loadData"
                        :items-per-page="page.pageSize"
                        :total-items="page.totalCount"
                        mode="simple">
        </van-pagination>
    </div>
</template>

<script>
    import {List, PullRefresh, Pagination, Search, Cell, CellGroup, Tag, Sticky,Row,Col,Icon} from 'vant';
    import {request, Utils} from "../../base/CiiUtils";
    import ParkQuery from "./ParkQuery";

    export default {
        name: 'Park',
        components: {
            ParkQuery,
            [List.name]: List,
            [Pagination.name]: Pagination,
            [PullRefresh.name]: PullRefresh,
            [Search.name]: Search,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Tag.name]: Tag,
            [Sticky.name]: Sticky,
            [Row.name]:Row,
            [Col.name]:Col,
            [Icon.name]:Icon
        },
        data: function () {
            return {
                page: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                },
                filterCondition: {},
                filterVisible:false,
                keyword: '',
                parkList: [],
                finished: false,
                loading: false,
                refreshing: false,
                Utils: Utils
            }
        },
        methods: {
            loadData: function (reload) {
                this.parkList = [];
                if (reload===true){
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }

                let qc = {
                    start: (this.page.currentPage - 1) * this.page.pageSize,
                    pageSize: this.page.pageSize,
                    entity: this.filterCondition
                };
                qc.keyword = this.keyword ? this.keyword : null;

                request({
                    conf: {
                        url: "parkIndustry/query",
                        data: qc
                    },
                    success: (response) => {
                        this.parkList = response.result.data;
                        this.page.totalCount = response.result.totalCount;
                        this.finished = true;
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
            onFilterClick(){
                this.filterVisible=true
            },
            onFilterSubmitOk(values){
                this.filterVisible=false;
                this.filterCondition = values;
                this.loadData(true);
            },
            onFilterCancel(){
                this.filterVisible=false
            }
        }
    }
</script>

<style scoped>
    /deep/ .van-tabs__nav--card {
        margin: 0px 0px !important;
    }
    .red-color {
        color: #ff0000;
    }
</style>