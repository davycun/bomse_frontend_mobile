<template>
    <div>
        <van-popup v-model="editorVisible" :position="position" :style="{width:width,height:height}">
            <van-form ref="partTimerEditor" style="margin-bottom: 70px;">
                <van-field label="兼职姓名" name="ptName" v-model="currentData.ptName" placeholder="填写兼职姓名">
                </van-field>
                <van-field label="兼职电话" name="ptPhone" v-model="currentData.ptPhone"
                           :rules="[{required: true,message:'请填写正确的兼职电话',pattern:/^1[3-9][0-9]{9}$/}]"
                           placeholder="填写兼职电话">
                </van-field>
                <van-field label="性别" name="sex" :rules="[{required:true,message:'性别必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.sex" direction="horizontal">
                            <van-radio v-for="dic in sexType" :key="dic.code" :name="dic.code">{{dic.name}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="职位" name="post"
                           v-model="currentData.post"
                           placeholder="填写客户所在公司职位">
                </van-field>
                <van-field label="职位" name="company"
                           v-model="currentData.company"
                           placeholder="填写客户所在公司职位">
                </van-field>
                <van-field label="职位" name="job"
                           v-model="currentData.job"
                           placeholder="填写客户所在公司职位">
                </van-field>
                <van-field label="省市区"
                           readonly
                           clickable
                           :value="areaString"
                           name="location"
                           @click="onAreaSelectClick"
                           placeholder="选择市区街道">
                </van-field>
                <van-field label="详细地址"
                           name="address"
                           v-model="currentData.address"
                           placeholder="详细路段及门牌号">

                </van-field>
            </van-form>
            <van-button style="position: fixed;bottom: 0px;" type="primary" block @click="onEditorSubmitOk">提交
            </van-button>
        </van-popup>

        <AreaSelect :visible="areaSelectVisible" :on-submit-ok="onAreaSelectSubmitOk" :on-cancel="onAreaSelectCancel"/>
    </div>
</template>

<script>

    import {
        Popup,
        Form,
        Field,
        RadioGroup,
        Radio,
        CheckboxGroup,
        Checkbox,
        Button,
        Calendar,
        Icon,
        Tag,
        Row,
        Col
    } from 'vant';
    import {dictionaryStorage} from "../../base/DictionaryStorage";
    import AreaSelect from "../../base/AreaSelect";
    import {request} from "../../base/CiiUtils";

    export default {
        name: "PartTimerEditor",
        components: {
            AreaSelect,
            [Popup.name]: Popup,
            [Form.name]: Form,
            [Field.name]: Field,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            [Button.name]: Button,
            [Calendar.name]: Calendar,
            [Icon.name]: Icon,
            [Tag.name]: Tag,
            [Row.name]: Row,
            [Col.name]: Col
        },
        props: {
            editor: {
                type: Boolean,
                required: true,
                default: function () {
                    return false;
                }
            },
            editorData: {
                type: Object
            },
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
        data() {

            return {
                currentData: {
                    ptName: null,
                    ptPhone: null,
                    sex: null,
                    post: null,
                    company: null,

                    fromType: null,
                    job: null,

                    cityId: null,
                    cityName: null,
                    regionId: null,
                    regionName: null,
                    streetId: null,
                    streetName: null,
                    communityId: null,
                    communityName: null,
                    address: null,
                },
                enterTimeSelectVisible: false,
                areaSelectVisible: false,
            }
        },
        computed: {
            editorVisible: {
                get: function () {
                    return this.visible;
                },
                set: function () {
                    this.onEditorCancel()
                }
            },
            areaString: {
                get: function () {
                    return `${this.currentData.cityName || ""}${this.currentData.regionName || ""}${this.currentData.streetName || ""}${this.currentData.communityName || ""}`;
                }
            },
            sexType: {
                get() {
                    return dictionaryStorage.get("com.ciiframework.common.dictionary.SexType")
                }
            },
            fromType() {
                return dictionaryStorage.get("com.cii.bomse.crm.parttimer.dictionary.FromType")
            }
        },
        methods: {

            onEditorCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },
            onEditorSubmitOk() {

                request({
                    conf: {
                        url: this.editor ? 'partTimer/update' : 'partTimer/create',
                        data: {
                            entity: this.currentData
                        }
                    },
                    success:()=>{
                        if (this.onSubmitOk){
                            this.onSubmitOk();
                        }
                    }
                })

            },
            onAreaSelectClick() {
                this.areaSelectVisible = true;
            },
            onAreaSelectCancel() {
                this.areaSelectVisible = false;
            },
            onAreaSelectSubmitOk(area) {
                this.areaSelectVisible = false;
                this.currentData.cityId = area.cityId;
                this.currentData.cityName = area.cityName;
                this.currentData.regionId = area.regionId;
                this.currentData.regionName = area.regionName;
                this.currentData.streetId = area.streetId;
                this.currentData.streetName = area.streetName;
                this.currentData.communityId = area.communityId;
                this.currentData.communityName = area.communityName;
            }
        }
    }
</script>

<style scoped>

</style>