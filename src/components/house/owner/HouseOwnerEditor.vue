<template>
    <div>
        <van-popup v-model="editorVisible" :style="{width:width,height:height}" :position="position">
            <van-form>
                <van-field v-if="parkId" label="园区ID" name="parkId" readonly v-model="parkId" placeholder="园区ID无序关注"></van-field>
                <van-field v-if="currentData.id" label="联系人ID" name="id" readonly v-model="currentData.id" placeholder="联系人ID无序关注"></van-field>
                <van-field center label="姓名" name="id" v-model="currentData.ownName"
                           :rules="[{required:true,message:'姓名必填'}]"
                           placeholder="联系人姓名"></van-field>
                <van-field center label="联系电话" name="id" v-model="currentData.ownPhone"
                           :rules="[{required: true,message:'请填写正确的号码',pattern:/^1[3-9][0-9]{9}$/}]"
                           placeholder="联系人电话"></van-field>
                <van-field center label="性别" name="sex"
                           :rules="[{required:true,message:'性别必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.sex" direction="horizontal">
                            <van-radio v-for="sx in sexType" :key="sx.code" :name="sx.code">{{sx.name}}</van-radio>
                        </van-radio-group>
                    </template>

                </van-field>
                <van-field center label="联系人类型" name="ownType"
                           :rules="[{required:true,message:'联系人类型必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.ownType" direction="horizontal">
                            <van-radio v-for="ot in houseOwnerType" :key="ot.code" :name="ot.code">{{ot.name}}</van-radio>
                        </van-radio-group>
                    </template>

                </van-field>
                <van-field label="所属公司" name="id" v-model="currentData.company" placeholder="联系人公司名称"></van-field>
                <van-field label="联系人岗位" name="id" v-model="currentData.post" placeholder="联系人岗位"></van-field>
            </van-form>

            <van-button style="position: fixed;bottom: 0px"
                        type="primary" block
                        @click="onEditorSubmitOk">提交
            </van-button>
        </van-popup>
    </div>
</template>

<script>
    import {Popup, Form, Field, Button, Radio, RadioGroup} from 'vant';
    import {dictionaryStorage} from "../../base/DictionaryStorage";
    import {request} from "../../base/CiiUtils";

    export default {
        name: "HouseOwnerEditor",
        components: {
            [Popup.name]: Popup,
            [Form.name]: Form,
            [Field.name]: Field,
            [Button.name]: Button,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup
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
                type: Boolean,
                required: true
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
                    id: null,
                    parkId: null,
                    ownName: null,
                    ownPhone: null,
                    sex: null,
                    ownType: null,
                    company: null,
                    post: null
                }
            }
        },
        computed: {
            editorVisible: {
                get() {
                    return this.visible;
                },
                set() {
                    this.onEditorCancel()
                }
            },
            parkId() {
                return this.editorData ? this.editorData.parkId:null
            },
            houseOwnerType: {
                get() {
                    return dictionaryStorage.get("com.cii.bomse.house.base.dictionary.HouseOwnerType")
                }
            },
            sexType: {
                get() {
                    return dictionaryStorage.get("com.ciiframework.common.dictionary.SexType")
                }
            }
        },
        methods: {

            onEditorCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },
            onEditorSubmitOk() {

                this.currentData.parkId = this.parkId;

                request({
                    conf: {
                        url: this.editor ? 'houseOwner/update' : 'houseOwner/create',
                        data:{
                            entity:this.currentData
                        }
                    },
                    success:()=>{
                        if (this.onSubmitOk) {
                            this.onSubmitOk()
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>