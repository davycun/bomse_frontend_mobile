<template>
    <div>
        <van-pull-refresh v-model="refreshing"
                          @refresh="onRefresh">
            <van-list v-model="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      style="margin-bottom: 80px"
                      @load="loadData">

                <van-cell-group v-for="(floor) in floorList"
                                style="margin-top:10px"
                                :key="floor.id">
                    <van-cell :title="floorTitle(floor)"
                              center
                              style="text-align: left;"
                              size="large"
                              is-link :to="{path:'/floor/detail/'+floor.id}"
                              :key="floor.id">
                        <template #label>
                            <p>
                                起租 <span class="red-color">{{floor.leaseAcreageMin}} m²</span>，
                                目前可租 <span class="red-color">{{floor.leaseAcreage}} m²</span>
                            </p>
                            <p>
                                价格 <span class="red-color">{{floor.price}}{{floor.priceUnitName}}</span>，
                                层高 <span class="red-color">{{floor.floorHeight}} m</span>，
                                用途：{{floor.houseUseTypeName}}
                            </p>
                            <p>
                                <van-tag plain
                                         type="warning"
                                         style="margin-right: 2px;"
                                         :key="tg"
                                         v-for="tg in floor.park.advantageTags.concat(floor.advantageTags)">
                                    {{tg}}
                                </van-tag>
                            </p>
                        </template>
                    </van-cell>
                </van-cell-group>

            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {List, PullRefresh, Cell, CellGroup,Tag} from 'vant';
    import {request} from "../../base/CiiUtils";

    export default {
        name: "FloorList",
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Tag.name]:Tag
        },
        props: {
            entityCondition:{
                type:Object
            },
            autoLoadData:{
                type:Boolean,
                required:true
            }
        },
        data: function () {
            return {
                page: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                },
                floorList: [],
                finished: true,
                loading: false,
                refreshing: false,
            }
        },
        created(){
            if (this.autoLoadData){
                this.loadData(true);
            }
        },
        methods: {
            loadData: function (reload) {

                if (reload){
                    this.floorList = [];
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }
                let qc = {
                    start: (this.page.currentPage - 1) * this.page.pageSize,
                    pageSize: this.page.pageSize,
                    entity: this.entityCondition,
                    orderBy:'p.address,b.bd_name,t.floor_number',
                    isAsc:true
                };

                request({
                    conf: {
                        url: "floorIndustry/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.floorList = this.floorList.concat(response.result.data);
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
            floorTitle: function (floor) {
                return floor.building.bdName + '栋第' + floor.floorNumber + '层';
            }
        }
    }
</script>

<style scoped>
    .red-color {
        color: #ff0000;
    }
</style>