<template>
    <div>
        <van-popup v-model="popupVisible" style="width: 70%;height: 100%;" position="right">
            <van-form>
                <van-field v-model="filterCondition.leaseAcreageStart"
                           type="number"
                           name="leaseAcreageStart"
                           label="面积大于"
                           placeholder="可租面积大于">
                </van-field>
                <van-field v-model="filterCondition.leaseAcreageEnd"
                           type="number"
                           name="leaseAcreageEnd"
                           label="面积小于"
                           placeholder="可租面积小于">
                </van-field>
                <van-field v-model="filterCondition.priceStart"
                           type="number"
                           name="priceStart"
                           label="价格大于"
                           placeholder="单位为 元/平米/天">
                </van-field>
                <van-field v-model="filterCondition.priceEnd"
                           type="number"
                           name="priceEnd"
                           label="价格小于"
                           placeholder="单位为 元/平米/天">
                </van-field>
                <van-field v-model="filterCondition.floorHeightStart"
                           type="digit"
                           name="floorHeightStart"
                           label="层高高于"
                           placeholder="单位为 米">
                </van-field>
                <van-field v-model="filterCondition.floorHeightEnd"
                           type="digit"
                           name="floorHeightEnd"
                           label="层高低于"
                           placeholder="单位为 米">
                </van-field>
                <van-field name="houseUseType" label="房源用途">
                    <template #input>
                        <van-radio-group v-model="filterCondition.houseUseType" direction="horizontal">
                            <van-radio v-for="ut in houseUseType" :key="ut.code" :name="ut.code">{{ut.name}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field name="advantageTypeList" label="房源特点">
                    <template #input>
                        <van-checkbox-group v-model="filterCondition.advantageTypeList">
                            <van-checkbox v-for="ad in floorAdvantageType" :key="ad.code" :name="ad.code">{{ad.name}}</van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>
            </van-form>
            <van-row style="position: fixed;bottom: 0px;width: 100%;">
                <van-col span="12">
                    <van-button type="default" block @click="onPopupReset">重置</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="primary" block @click="onPopupOk">确定</van-button>
                </van-col>
            </van-row>

        </van-popup>
    </div>
</template>

<script>
    import {Popup, Button, Form, Field, RadioGroup, Radio, Row, Col,Checkbox,CheckboxGroup} from 'vant';
    import {dictionaryStorage} from "../../base/DictionaryStorage";

    export default {
        name: "FloorQuery",
        components: {
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Form.name]: Form,
            [Field.name]: Field,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Row.name]: Row,
            [Col.name]: Col,
            [Checkbox.name]:Checkbox,
            [CheckboxGroup.name]:CheckboxGroup
        },
        props: {
            visible: {
                type: Boolean
            },
            onFilterSubmitOk: {
                type: Function
            },
            onFilterCancel: {
                type: Function
            }
        },
        data: function () {
            return {
                filterCondition: {
                    leaseAcreageStart: null,
                    leaseAcreageEnd: null,
                    priceStart: null,
                    priceEnd: null,
                    floorHeightStart: null,
                    floorHeightEnd: null,
                    houseUseType: null,
                }
            }
        },
        computed: {
            popupVisible: {
                get: function () {
                    return this.visible
                },
                set: function () {
                    this.onPopupClose()
                }
            },
            cusStatus: function () {
                return dictionaryStorage.get("com.cii.bomse.crm.customer.base.dictionary.CustomerStatus")
            },
            houseUseType: function () {
                return dictionaryStorage.get("com.cii.bomse.house.industry.dictionary.HouseIndustryUseType");
            },
            floorAdvantageType: function () {
                return dictionaryStorage.get("com.cii.bomse.house.industry.dictionary.AdvantageType");
            }
        },
        methods: {
            onPopupOk() {
                if (this.onFilterSubmitOk) {
                    this.onFilterSubmitOk(this.filterCondition);
                }
            },
            onPopupClose() {
                if (this.onFilterCancel) {
                    this.onFilterCancel();
                }
            },
            onPopupReset() {
                this.filterCondition = {
                    leaseAcreageStart: null,
                    leaseAcreageEnd: null,
                    priceStart: null,
                    priceEnd: null,
                    floorHeightStart: null,
                    floorHeightEnd: null,
                    houseUseType: null,
                }
                if (this.onFilterSubmitOk) {
                    this.onFilterSubmitOk(this.filterCondition);
                }
            }
        }
    }
</script>

<style scoped>

</style>