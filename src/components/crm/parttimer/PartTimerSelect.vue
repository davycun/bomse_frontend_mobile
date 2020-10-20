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
                    <van-button style="margin-top: 12px" size="small" type="primary" @click="onPartTimerCreateClick">
                        新增
                    </van-button>
                </van-col>
            </van-row>
            <van-pull-refresh v-model="refreshing"
                              @refresh="onRefresh">
                <van-radio-group v-model="selectedData">
                    <van-list v-model="loading"
                              :finished="finished"
                              finished-text="没有更多了"
                              style="margin-bottom: 80px"
                              @load="loadData">
                        <van-cell v-for="pt in selectDataList"
                                  :key="pt.id"
                                  :title="`${pt.ptName}（${pt.ptPhone}）`"
                                  center
                                  style="text-align: left;"
                                  size="large">
                            <template #label>
                                <van-radio :name="pt">
                                    {{pt.post?`岗位：${pt.post};`:''}}
                                    {{pt.company?`单位：${pt.company};`:''}}
                                    {{pt.job?`职业：${pt.job};`:''}}
                                    {{pt.detailAddress?`联系地址：${pt.detailAddress};`:''}}
                                </van-radio>
                            </template>
                        </van-cell>
                    </van-list>
                </van-radio-group>
            </van-pull-refresh>
            <van-button style="position: fixed;bottom: 0px;left: 0px;width: 100%;"
                        @click="onSelectSubmitOk"
                        type="primary">确定
            </van-button>
        </van-popup>

        <PartTimerEditor :editor="false" :visible="partTimerCreateVisible" :on-submit-ok="onPartTimerCreateSubmitOk"
                         :on-cancel="onPartTimerCreateCancel"/>
    </div>
</template>

<script>
    import {
        List,
        PullRefresh,
        Cell,
        CellGroup,
        Tag,
        Radio,
        RadioGroup,
        Button,
        Search,
        Sticky,
        Popup,
        Row,
        Col
    } from 'vant';
    import {request} from "../../base/CiiUtils";
    import PartTimerEditor from "./PartTimerEditor";

    export default {
        name: "PartTimerSelect",
        components: {
            PartTimerEditor,
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
            [Popup.name]: Popup,
            [Row.name]: Row,
            [Col.name]: Col
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
                selectDataList: [],
                finished: false,
                loading: false,
                refreshing: false,

                //
                partTimerCreateVisible: false
            }
        },
        computed: {
            selectVisible: {
                get: function () {
                    return this.visible
                },
                set: function () {
                    this.onSelectCancel();
                }
            }
        },
        methods: {
            loadData: function (reload) {

                if (reload) {
                    this.selectDataList = [];
                    this.page = {
                        currentPage: 1,
                        totalCount: 0,
                        pageSize: 20
                    }
                }
                let qc = {
                    start: (this.page.currentPage - 1) * this.page.pageSize,
                    pageSize: this.page.pageSize,
                    entity: {}
                };
                qc.keyword = this.keyword ? this.keyword : null;

                request({
                    conf: {
                        url: "partTimer/query",
                        data: qc
                    },
                    success: (response) => {
                        if (response.result.data) {
                            this.selectDataList = this.selectDataList.concat(response.result.data);
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

                if (this.onSubmitOk) {
                    this.onSubmitOk(this.selectedData);
                }
            },
            onSelectCancel: function () {
                if (this.onCancel) {
                    this.onCancel();
                }

            },
            onPartTimerCreateClick() {
                this.partTimerCreateVisible = true;
            },
            onPartTimerCreateCancel() {
                this.partTimerCreateVisible = false;
            },
            onPartTimerCreateSubmitOk() {
                this.partTimerCreateVisible = false;
            }
        }
    }
</script>

<style scoped>
    .red-color {
        color: #ff0000;
    }
</style>