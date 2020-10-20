<template>
    <div>
        <van-popup v-model="popupVisible" style="width: 70%;height: 100%;" position="right">
            <van-form>
                <van-field v-model="filterCondition.cusId"
                           name="cusId"
                           label="客户ID"
                           placeholder="请输入客户ID">
                </van-field>
                <van-field v-model="filterCondition.cusName"
                           name="cusName"
                           label="客户姓名"
                           placeholder="请输入客户姓名">
                </van-field>
                <van-field v-model="filterCondition.cusPhone"
                           name="cusPhone"
                           label="客户电话"
                           placeholder="请输入客户电话">
                </van-field>
                <van-field v-model="filterCondition.company"
                           name="company"
                           label="公司名称"
                           placeholder="请输入客户公司名称">
                </van-field>
                <van-field name="cusStatus" label="客户状态">
                    <template #input>
                        <van-radio-group v-model="filterCondition.cusStatus" direction="horizontal">
                            <van-radio v-for="cs in cusStatus" :name="cs.code" :key="cs.code">{{cs.name}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="filterCondition.needAcreageStart"
                           type="number"
                           name="needAcreageStart"
                           label="面积大于"
                           placeholder="客户需求面积大于">
                </van-field>
                <van-field v-model="filterCondition.needAcreageEnd"
                           type="number"
                           name="needAcreageEnd"
                           label="面积小于"
                           placeholder="客户需求面积小于">
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
    import {Popup, Button, Form, Field, RadioGroup, Radio, Row, Col} from 'vant';
    import {dictionaryStorage} from "../base/DictionaryStorage";

    export default {
        name: "CustomerQuery",
        components: {
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Form.name]: Form,
            [Field.name]: Field,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Row.name]: Row,
            [Col.name]: Col
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
                    cusId: null,
                    cusName: null,
                    cusStatus: null,
                    needAcreageStart:null,
                    needAcreageEnd:null,
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
                    cusId: null,
                    cusName: null,
                    cusStatus: null,
                    needAcreageStart:null,
                    needAcreageEnd:null,
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