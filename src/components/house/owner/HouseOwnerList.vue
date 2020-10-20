<template>
    <div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadData">
                <van-cell center style="text-align: left;" v-for="own in dataList" :key="own.id" :title="own.ownName + '（'+own.ownPhone+'）'">
                    <template #label>
                        {{own.ownTypeName}}，{{own.company}}，{{own.post}}
                    </template>
                    <template #default>
                        <van-button size="small" type="primary" @click="()=>onCallPhoneClick(own.id)">拨号</van-button>
                    </template>
                </van-cell>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>

    import {PullRefresh, List, Cell,Button,Dialog} from 'vant';
    import {request} from "../../base/CiiUtils";

    export default {
        name: "HouseOwnerList",
        components: {
            [PullRefresh.name]:PullRefresh,
            [List.name]:List,
            [Cell.name]:Cell,
            [Button.name]:Button
        },
        props: {
            entityCondition: {
                type: Object
            }
        },
        data() {
            return {
                dataList: [],
                page: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                },
                finished: true,
                refreshing: false,
                loading: false
            }
        },
        created(){
            this.loadData(true);
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
                    start: (this.currentData - 1) * this.pageSize,
                    pageSize: this.pageSize,
                    entity: this.entityCondition || {}
                }

                request({
                    conf: {
                        url: 'houseOwner/queryByParkId',
                        data: qc
                    },
                    success:(response)=>{

                        //非分页查询结构
                        this.dataList = response.result;
                        this.finished = true;
                        this.loading = false;
                        this.refreshing = false;
                    }
                })
            },
            onRefresh() {
                this.loadData(true);
            },
            onCallPhoneClick(ownId){

                request({
                    conf: {
                        url: 'houseOwner/callPhone',
                        data: {
                            entity: {
                                id: ownId
                            }
                        }
                    },
                    success:(response)=>{
                        Dialog.confirm({
                            title:'电话号码如下',
                            message:response.result,
                            confirmButtonText:'拨号'
                        }).then(()=>{
                            window.location.href='tel:'+response.result;
                        }).catch(()=>{

                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>