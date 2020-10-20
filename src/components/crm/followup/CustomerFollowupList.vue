<template>
    <div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model="loading"
                      style="margin-bottom: 80px"
                      :finished="finished"
                      finished-text="没有更多了"
                      @load="loadData">
                <van-cell-group v-for="followup in dataList"
                                style="margin-top: 10px;"
                                :key="followup.id">
                    <van-cell center style="text-align: left;" size="large" :title="followup.followupTypeName">
                        <template #label>
                            <p>{{followup.followupContent}}</p>
                            <p>跟进人：{{followup.createName}}（{{followup.createDeptName}}）</p>
                            <p>跟进时间：{{Utils.dateFormat(followup.createTime,'yyyy-MM-dd hh:mm:ss')}}</p>
                        </template>
                    </van-cell>
                    <van-swipe style="margin: 0 18px;" v-if="followup.followupImagesList && followup.followupImagesList.length>0">
                        <van-swipe-item v-for="(img,index) in followup.followupImagesList" :key="index">
                            <van-image height="200" width="100%" :src="Constants.fileReadUrl+img"/>
                        </van-swipe-item>
                    </van-swipe>

                </van-cell-group>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {PullRefresh, List, CellGroup, Cell, Swipe, SwipeItem,Image} from 'vant';
    import {Utils, request} from "../../base/CiiUtils";
    import {Constants} from "../../base/Constants";

    export default {
        name: "CustomerFollowupList",
        components: {
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
            [CellGroup.name]: CellGroup,
            [Cell.name]: Cell,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Image.name]:Image
        },
        props: {
            cusId: {
                required: true
            }
        },
        data: function () {
            return {
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                dataList: [],
                finished: false,
                refreshing: false,
                loading: false,
                Utils: Utils,
                Constants: Constants
            }
        },
        methods: {
            loadData(reload) {

                if (reload) {
                    this.dataList = [];
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }

                let qc = {
                    start: this.dataList.length,
                    pageSize: this.page.pageSize,
                    entity: {
                        cusId: this.cusId
                    },
                };

                request({
                    conf: {
                        url: "customerIndustryFollowup/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.dataList = this.dataList.concat(response.result.data);
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
        }
    }
</script>

<style scoped>

</style>