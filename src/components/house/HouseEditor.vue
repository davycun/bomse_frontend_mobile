<template>
    <div>
        <van-sticky>
            <van-nav-bar title="房源编辑"
                         @click-left="onBackClick"
                         left-arrow
                         left-text="返回">
            </van-nav-bar>
        </van-sticky>
        <van-tabs>
            <van-tab name="parkInfo" title="园区信息">
                <van-row style="margin-top:10px">
                    <van-col span="12">
                        <van-button type="primary" size="small" icon="plus" text="选择园区"
                                    @click="onParkSelectClick"></van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button type="primary" size="small" icon="plus" text="新增园区"
                                    @click="onParkCreateClick"></van-button>
                    </van-col>
                </van-row>

                <van-cell :title="park.detailAddress"
                          v-if="park.id"
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
            </van-tab>
            <van-tab name="buildingInfo" title="楼栋信息">
                <BuildingListEditor ref="buildingList" :park-id="park.id" :auto-load-data="true"/>
            </van-tab>
        </van-tabs>

        <ParkEditor :visible="parkCreateVisible"
                    :editor="false"
                    :on-submit-ok="onParkCreateSubmitOk"
                    :on-cancel="onParkCreateCancel"/>
        <ParkSelect :visible="parkSelectVisible"
                    :on-submit-ok="onParkSelectSubmitOk"
                    :on-cancel="onParkSelectCancel"/>
    </div>
</template>

<script>
    import {NavBar, Tabs, Tab, Sticky, Row, Col, Button, Cell, Tag} from 'vant';
    import ParkEditor from "./park/ParkEditor";
    import ParkSelect from "./park/ParkSelect";
    import BuildingListEditor from "./building/BuildingListEditor";

    export default {
        name: "HouseEditor",
        components: {
            BuildingListEditor,
            ParkSelect,
            ParkEditor,
            [NavBar.name]: NavBar,
            [Tabs.name]: Tabs,
            [Tab.name]: Tab,
            [Sticky.name]: Sticky,
            [Row.name]: Row,
            [Col.name]: Col,
            [Button.name]: Button,
            [Cell.name]: Cell,
            [Tag.name]: Tag
        },

        data: function () {
            return {
                park: {},
                parkCreateVisible: false,
                parkSelectVisible: false,
            }
        },

        beforeRouteEnter: function (to, from, next) {
            next((vm) => {
                if (from.name !== 'floorDetail' && from.name !=='parkDetail') {
                    vm.park = {};
                    vm.parkCreateVisible = false;
                    vm.parkSelectorVisible = false;

                    if (vm.$refs.buildingList && vm.$refs.buildingList.clear) {
                        vm.$refs.buildingList.clear();
                    }
                }
            });
        },

        methods: {
            onBackClick() {
                this.$router.back();
            },
            onParkCreateClick() {
                this.parkCreateVisible = true;
            },
            onParkCreateCancel() {
                this.parkCreateVisible = false;
            },
            onParkCreateSubmitOk(selectData) {
                this.park = selectData;
                this.parkCreateVisible = false;

                setTimeout(() => {
                    this.$refs.buildingList.loadData(true);
                }, 1000);

            },
            onParkSelectClick() {
                this.parkSelectVisible = true;
            },
            onParkSelectCancel() {
                this.parkSelectVisible = false;
            },
            onParkSelectSubmitOk(selectData) {
                this.park = selectData;
                this.parkSelectVisible = false;

                setTimeout(() => {
                    if (this.$refs.buildingList && this.$refs.buildingList.loadData){
                        this.$refs.buildingList.loadData(true);
                    }
                }, 1000);
            }
        }
    }
</script>

<style scoped>
    .red-color {
        color: #ff0000;
    }
</style>