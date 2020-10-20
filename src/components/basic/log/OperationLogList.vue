<template>
    <div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model="loading"
                      style="margin-bottom: 80px"
                      :finished="finished"
                      finished-text="没有更多了"
                      @load="loadData">
                <van-cell-group v-for="log in optLogList"
                                style="margin-top: 10px;"
                                :key="log.id">
                    <van-cell center style="text-align: left;" size="large" :title="log.optTypeName">
                        <template #label>
                            <p>{{log.content}}</p>
                            <p>操作人：{{log.createName}}（{{log.createDeptName}}）</p>
                            <p>操作时间：{{Utils.dateFormat(log.createTime,'yyyy-MM-dd hh:mm:ss')}}</p>
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {PullRefresh, List, CellGroup, Cell} from 'vant';
    import {Utils,request} from "../../base/CiiUtils";

    export default {
        name: "OperationLogList",
        components: {
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
            [CellGroup.name]: CellGroup,
            [Cell.name]: Cell,
        },
        props: {
            bizId:{
                // type: String,
                required:true
            }
        },
        data: function () {
            return {
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                optLogList: [],
                finished: false,
                refreshing: false,
                loading: false,
                Utils:Utils
            }
        },
        methods: {
            loadData(reload) {

                if (reload){
                    this.optLogList = [];
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }

                let qc = {
                    start: this.optLogList.length,
                    pageSize: this.page.pageSize,
                    entity: {
                        bizId: this.bizId
                    },
                };

                request({
                    conf: {
                        url: "operationLog/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.optLogList = this.optLogList.concat(response.result.data);
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