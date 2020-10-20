<template>
    <div>
        <van-popup v-model="popupVisible" style="width: 70%;height: 100%;" position="right">
            <van-form>
                <van-field v-model="filterCondition.leaseAcreageMinStart"
                           type="number"
                           name="leaseAcreageMinEnd"
                           label="起租面积大于"
                           placeholder="起租面积大于">
                </van-field>
                <van-field v-model="filterCondition.leaseAcreageMinEnd"
                           type="number"
                           name="leaseAcreageStart"
                           label="起租面积小于"
                           placeholder="起租面积小于">
                </van-field>
                <van-field v-model="filterCondition.leaseAcreageStart"
                           type="number"
                           name="leaseAcreageStart"
                           label="可租面积大于"
                           placeholder="可租面积大于">
                </van-field>
                <van-field v-model="filterCondition.leaseAcreageEnd"
                           type="number"
                           name="leaseAcreageEnd"
                           label="可租面积小于"
                           placeholder="可租面积小于">
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
    import {dictionaryStorage} from "../../base/DictionaryStorage";

    export default {
        name: "ParkQuery",
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
                    leaseAcreageMinStart: null,
                    leaseAcreageMinEnd: null,
                    leaseAcreageStart: null,
                    leaseAcreageEnd: null,
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
                    leaseAcreageStart: null,
                    leaseAcreageMinEnd: null,
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