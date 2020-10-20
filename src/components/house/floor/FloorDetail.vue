<template>
    <div>
        <van-sticky>
            <van-nav-bar title="楼层详情"
                         @click-left="onBackClick"
                         left-arrow left-text="返回">
            </van-nav-bar>
        </van-sticky>
        <van-swipe>
            <van-swipe-item v-for="(img,index) in floor.floorImagesList" :key="index">
                <img :style="imgClass" :src="Constants.fileReadUrl+img+'@detail'"/>
            </van-swipe-item>
        </van-swipe>
        <van-tabs sticky style="margin-bottom: 50px;">
            <van-tab title="基本信息">
                <FloorInfo :floor="floor"/>
            </van-tab>
            <van-tab title="联系业主">
                <HouseOwnerList :entity-condition="{parkId:floor.parkId}"/>
            </van-tab>
            <van-tab title="操作记录">
                <OperationLogList ref="optLogList" :biz-id="floor.id"/>
            </van-tab>
            <van-tab title="修改记录">
                <EditLogList ref="editLogList" :biz-id="floor.id"/>
            </van-tab>
        </van-tabs>

        <van-button type="primary" block style="position: fixed;bottom: 0px;" @click="functionVisible=true">功能区
        </van-button>

        <van-popup v-model="functionVisible" position="bottom" style="height:40%;width:100%">
            <van-grid>
                <van-grid-item icon="photo-o" text="编辑楼层" @click="onFloorEditClick"></van-grid-item>
            </van-grid>
        </van-popup>

        <FloorEditor ref="floorEditor" :editor="true" :visible="floorEditVisible" :on-submit-ok="onFloorEditSubmitOk"
                     :on-cancel="onFloorEditCancel"/>

    </div>
</template>

<script>

    import {NavBar, Sticky, Swipe, SwipeItem, Tabs, Tab, GridItem, Grid, Button, Popup} from 'vant';
    import {request} from "../../base/CiiUtils";
    import {Constants} from "../../base/Constants";
    import {Size} from "../../base/Size";
    import OperationLogList from "../../basic/log/OperationLogList";
    import EditLogList from "../../basic/log/EditLogList";
    import FloorInfo from "./FloorInfo";
    import HouseOwnerList from "../owner/HouseOwnerList";
    import FloorEditor from "./FloorEditor";

    export default {
        name: "FloorDetail",
        components: {
            FloorEditor,
            HouseOwnerList,
            FloorInfo,
            EditLogList,
            OperationLogList,
            [NavBar.name]: NavBar,
            [Sticky.name]: Sticky,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Tabs.name]: Tabs,
            [Tab.name]: Tab,
            [GridItem.name]: GridItem,
            [Grid.name]: Grid,
            [Button.name]: Button,
            [Popup.name]: Popup
        },
        data: function () {
            return {
                floor: {},
                Constants: Constants,
                imgClass: {
                    width: '100%',
                    height: Size.screenWidth() * 3 / 5 + 'px'
                },

                functionVisible: false,
                floorEditVisible: false,
            }
        },
        created: function () {
            this.loadData();
        },
        methods: {
            loadData: function () {
                request({
                    conf: {
                        url: 'floorIndustry/detail',
                        data: {
                            entity: {
                                id: this.$route.params.id
                            }
                        }
                    },
                    success: (response) => {
                        this.floor = response.result;
                    }
                })
            },
            onBackClick: function () {
                this.$router.back();
            },
            onFloorEditClick() {
                this.floorEditVisible = true;
                this.$refs.floorEditor.initCurrentData(this.floor);
            },
            onFloorEditCancel() {
                this.floorEditVisible = false;
            },
            onFloorEditSubmitOk() {
                this.floorEditVisible = false;
                this.loadData();
            }
        }
    }
</script>

<style scoped>

</style>