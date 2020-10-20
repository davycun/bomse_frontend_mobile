<template>
    <div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      style="margin-bottom: 80px"
                      @load="loadData">
                <van-cell-group v-for="log in editLogList"
                                style="margin-top: 10px;"
                                :key="log.id">
                    <van-cell :title="editLogTitle(log)"
                              center
                              style="text-align: left;"
                              size="large"
                              :key="log.id">
                        <template #label>
                            <p>{{log.remark}}</p>
                            <p>修改人：{{log.createName}}（{{log.createDeptName}}）</p>
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {List,PullRefresh,CellGroup,Cell} from 'vant';
    import {Utils,request} from "../../base/CiiUtils";

    export default {
        name: "EditLogList",
        components: {
            [List.name]:List,
            [PullRefresh.name]:PullRefresh,
            [CellGroup.name]:CellGroup,
            [Cell.name]:Cell,
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
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                },
                editLogList: [],
                finished: false,
                loading: false,
                refreshing: false,
            }
        },
        methods: {
            loadData: function (reload) {

                if (reload){
                    this.editLogList = [];
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }

                let qc = {
                    start: this.editLogList.length,
                    pageSize: this.page.pageSize,
                    entity: {
                        bizId: this.bizId
                    },
                };

                request({
                    conf: {
                        url: "editLog/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.editLogList = this.editLogList.concat(response.result.data);
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
            editLogTitle(log){
                return Utils.dateFormat(log.createTime,"yyyy-MM-dd hh:mm:ss");
            }
        }
    }
</script>

<style scoped>

</style>