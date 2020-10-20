<template>
    <div>
        <van-sticky>
            <van-row>
                <van-col span="21">
                    <van-search v-model="keyword"
                                @search="onKeywordSearch">
                    </van-search>
                </van-col>
                <van-col span="3" style="text-align: center">
                    <van-icon style="padding-top: 12px"
                              size="32"
                              @click="onFilterClick"
                              name="filter-o"></van-icon>
                </van-col>
                <CustomerQuery :visible="filterVisible" :on-filter-cancel="onFilterCancel" :on-filter-submit-ok="onFilterSubmitOk"/>

            </van-row>

            <van-tabs v-model="cusOwnerType"
                      type="card"
                      @click="onCusOwnerTypeChange">
                <van-tab title="个人客户" name="Personal"></van-tab>
                <van-tab title="拉私客户" name="Hide"></van-tab>
                <van-tab title="公盘客户" name="Company"></van-tab>
            </van-tabs>
        </van-sticky>
        <van-pull-refresh v-model="refreshing"
                          @refresh="onRefresh">
            <van-list v-model="loading"
                      :finished="finished"
                      finished-text="下拉刷新"
                      style="margin-bottom: 80px"
                      @load="loadData">

                <van-cell-group v-for="(cus) in customerList"
                                style="margin-top:10px"
                                :key="cus.id">
                    <van-cell :title="cus.cusName+'（'+cus.product+'）'"
                              center
                              style="text-align: left;"
                              size="large"
                              is-link :to="{path:'/customer/detail/'+cus.id}"
                              :key="cus.id">
                        <template #label>
                            <p>
                                求租 <span class="red-color">{{cus.needAcreage}}</span> m²,
                                用做 <span class="red-color">{{cus.houseUseTypeName}}</span>
                            </p>
                            <p v-if="cus.areas && cus.areas.length>0">
                                需求区域：
                                <span v-for="area in cus.areas" :key="area.id">
                                    {{area.cityName+(area.regionName||"")+(area.streetName||"")}}
                                </span>
                            </p>
                            <p>
                                创建时间：{{Utils.dateFormat(cus.createTime,'yyyy-MM-dd')}},
                                <span class="red-color">{{cus.noFollowupDay}}</span> 天未跟进
                            </p>
                            <p v-if="cusOwnerType!=='Company'">
                                所属人：{{cus.ownerName}}（{{cus.ownerDeptName}}）,创建人:{{cus.createName}}
                            </p>
                            <p v-if="cusOwnerType==='Company'">
                                所属部门：{{cus.ownerDeptName}}
                            </p>
                            <p>
                                <van-tag type="warning">{{cus.cusStatusName}}</van-tag>
                                <van-tag style="margin-left: 2px" type="warning">{{cus.cusOwnerTypeName}}</van-tag>
                            </p>

                        </template>
                    </van-cell>
                </van-cell-group>

            </van-list>
        </van-pull-refresh>

        <van-pagination v-model="page.currentPage"
                        style="position: fixed;bottom: 50px;width: 100%;"
                        :items-per-page="page.pageSize"
                        :total-items="page.totalCount"
                        mode="simple">
        </van-pagination>
    </div>
</template>

<script>
    import {List, PullRefresh, Pagination, Search, Cell, CellGroup, Tabs, Tab, Tag, Sticky,Row,Col,Icon} from 'vant';
    import {request, Utils} from "../base/CiiUtils";
    import CustomerQuery from "./CustomerQuery";

    export default {
        name: 'CustomerManager',
        components: {
            CustomerQuery,
            [List.name]: List,
            [Pagination.name]: Pagination,
            [PullRefresh.name]: PullRefresh,
            [Search.name]: Search,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
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
                cusOwnerType: 'Personal',
                keyword: '',
                customerList: [],
                finished: false,
                loading: false,
                refreshing: false,
                Utils: Utils
            }
        },
        methods: {
            loadData: function (reload) {
                this.customerList = [];

                if (reload){
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
                qc.entity.cusOwnerType = this.cusOwnerType;
                qc.keyword = this.keyword ? this.keyword : null;

                request({
                    conf: {
                        url: "customerIndustry/query",
                        data: qc
                    },
                    success: (response) => {
                        this.customerList = response.result.data;
                        this.page.totalCount = response.result.totalCount;
                        this.finished = true;
                        this.loading = false;
                        this.refreshing = false;

                    }
                })

            },
            onRefresh: function () {
                this.loadData(true);
            },
            onCusOwnerTypeChange: function () {
                this.loadData(true);
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
    .red-color{
        color: #ff0000;
    }
</style>