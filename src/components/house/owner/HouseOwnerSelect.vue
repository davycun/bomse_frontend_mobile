<template>
    <div>
        <van-popup v-model="selectVisible" :position="position" :style="{height:height,width:width}">
            <van-row>
                <van-col span="18">
                    <van-search v-model="keyword"
                                @search="onKeywordSearch">
                    </van-search>
                </van-col>
                <van-col span="6">
                    <van-button style="margin-top: 12px" size="small" type="primary" @click="onHouseOwnerCreateClick">新增</van-button>
                </van-col>
            </van-row>


            <van-pull-refresh v-model="refreshing"
                              @refresh="onRefresh">
                <van-radio-group v-model="selectedData">
                    <van-list v-model="loading"
                              :finished="finished"
                              finished-text="可下拉刷新"
                              style="margin-bottom: 80px"
                              @load="loadData">
                            <van-cell v-for="own in houseOwnerList"
                                      :key="own.id"
                                      :title="own.ownName +'（'+ own.ownPhone+'）'"
                                      center
                                      size="large"
                                      style="text-align: left;">
                                <template #label>
                                    <van-radio :name="own">
                                            {{own.ownTypeName}}，{{own.company}}，{{own.post}}
                                    </van-radio>
                                </template>
                            </van-cell>
                    </van-list>
                </van-radio-group>
            </van-pull-refresh>

            <van-button style="position: fixed;bottom: 0px" block type="primary" @click="onSelectSubmitOk">确定</van-button>
        </van-popup>

        <HouseOwnerEditor :editor="false" :visible="houseOwnerCreateVisible" :on-submit-ok="onHouseOwnerCreateSubmitOk" :on-cancel="onHouseOwnerCreateCancel"/>
    </div>
</template>

<script>
    import {Popup,Button,RadioGroup,Radio,Search,PullRefresh,List,Cell,Row,Col} from 'vant';
    import {request} from "../../base/CiiUtils";
    import HouseOwnerEditor from "./HouseOwnerEditor";

    export default {
        name: "HouseOwnerSelect",
        components:{
            HouseOwnerEditor,
            [Popup.name]:Popup,
            [Button.name]:Button,
            [RadioGroup.name]:RadioGroup,
            [Radio.name]:Radio,
            [Search.name]:Search,
            [PullRefresh.name]:PullRefresh,
            [List.name]:List,
            [Cell.name]:Cell,
            [Row.name]:Row,
            [Col.name]:Col
        },
        props:{
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
                    return '60%';
                }
            },
            width: {
                default() {
                    return '100%';
                }
            }
        },
        data:function(){
            return {
                selectedData: {},
                keyword: '',
                page: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 20
                },
                houseOwnerList: [],
                finished: false,
                loading: false,
                refreshing: false,

                //新建业主
                houseOwnerCreateVisible:false,
            }
        },
        computed:{
            selectVisible:{
                get:function(){
                    return this.visible;
                },
                set:function(){
                    this.onSelectCancel()
                }
            }
        },
        methods:{
            loadData(reload){
                if (reload) {
                    this.houseOwnerList = [];
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
                        url: "houseOwner/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.houseOwnerList = this.houseOwnerList.concat(response.result.data);
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
            onKeywordSearch: function () {
                this.loadData(true);
            },
            onRefresh: function () {
                this.loadData(true)
            },
            onSelectCancel(){
                if (this.onCancel){
                    this.onCancel()
                }
            },
            onSelectSubmitOk(){
                if(this.onSubmitOk){
                    this.onSubmitOk(this.selectedData);
                }
            },
            onHouseOwnerCreateClick(){
                this.houseOwnerCreateVisible = true;
            },
            onHouseOwnerCreateCancel(){
                this.houseOwnerCreateVisible = false;
            },
            onHouseOwnerCreateSubmitOk(){
                this.houseOwnerCreateVisible = false;
                this.loadData(true);
            }
        }
    }
</script>

<style scoped>

</style>