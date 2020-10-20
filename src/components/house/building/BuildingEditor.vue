<template>
    <div>
        <van-popup v-model="editorVisible" :style="{height:height,width:width}" :position="position">

            <van-form ref="buildingEditorForm" style="margin-bottom: 50px">
                <van-field label="园区ID" name="parkId" readonly v-model="currentData.parkId" placeholder="园区ID">
                </van-field>
                <van-field label="楼栋名称" name="bdName" v-model="currentData.bdName"
                           :rules="[{required: true,message:'由A~Z和1~9组成的字符，比如A、1、A1、22',pattern: /^[A-Z|0-9]*$/}]"
                           placeholder="只能由字符A~Z 和 1~9组成">
                </van-field>
                <van-field label="位置描述" name="bdNameDesc" v-model="currentData.bdNameDesc"
                           placeholder="类似进门最里面那栋">
                </van-field>
                <van-field label="建筑结构" name="structureType" :rules="[{required: true,message:'建筑结构必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.structureType" direction="horizontal">
                            <van-radio v-for="lu in buildingStructureType" :name="lu.code" :key="lu.code">{{lu.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="是否单层" name="singleFloor" :rules="[{required: true,message:'是否单层必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.singleFloor" direction="horizontal">
                            <van-radio name="true">是</van-radio>
                            <van-radio name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="电梯" name="hasLift" :rules="[{required: true,message:'电梯必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasLift" direction="horizontal">
                            <van-radio name="true">有电梯</van-radio>
                            <van-radio name="false">无电梯</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="currentData.hasLift==='true'" label="电梯数量" type="digit" name="liftCount" v-model="currentData.liftCount"
                           placeholder="填写总共电梯数量"
                           :rules="[{required: currentData.hasLift==='true',message:'电梯数量必填'}]">
                </van-field>
                <van-field v-if="currentData.hasLift==='true'"  label="电梯承重" type="number" name="liftBearing" v-model="currentData.liftBearing"
                           placeholder="填写每部电梯的承重"
                           :rules="[{required: currentData.hasLift==='true',message:'电梯承重必填'}]">
                    <template #button>吨</template>
                </van-field>
                <van-field label="月台" name="hasRailway" :rules="[{required: true,message:'月台必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasRailway" direction="horizontal">
                            <van-radio name="true">有月台</van-radio>
                            <van-radio name="false">无月台</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="currentData.hasRailway==='true'" label="月台类型" name="railwayType"
                           :rules="[{required: currentData.hasRailway==='true',message:'月台类型必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.railwayType" direction="horizontal">
                            <van-radio v-for="lu in railwayType" :name="lu.code" :key="lu.code">{{lu.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="currentData.hasRailway==='true'" label="月台高度" type="number"
                           name="railwayHeight" v-model="currentData.railwayHeight"
                           placeholder="填写卸货平台高度"
                           :rules="[{required: currentData.hasRailway==='true',message:'月台高度必填'}]">
                    <template #button>米</template>
                </van-field>
                <van-field v-if="railwayWidthNeed" label="月台宽度" type="number" name="railwayWidth" v-model="currentData.railwayWidth"
                           placeholder="外置式月台的宽度"
                           :rules="[{required: railwayWidthNeed,message:'月台高度必填'}]">
                    <template #button>米</template>
                </van-field>
                <van-field label="雨棚" name="hasCanopy" :rules="[{required: true,message:'雨棚必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasCanopy" direction="horizontal">
                            <van-radio name="true">有雨棚</van-radio>
                            <van-radio name="false">无雨棚</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="currentData.hasCanopy==='true'" label="雨棚宽度" type="number" name="canopyWidth" v-model="currentData.canopyWidth"
                           placeholder="雨棚宽度宽度"
                           :rules="[{required: currentData.hasCanopy==='true',message:'雨棚宽度必填'}]">
                    <template #button>米</template>
                </van-field>

                <van-field label="卸货面" name="uploadType" :rules="[{required: true,message:'卸货面必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.uploadType" direction="horizontal">
                            <van-radio v-for="lu in uploadType" :name="lu.code" :key="lu.code">{{lu.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>

            </van-form>

            <van-button style="position: fixed;bottom: 0px"
                        type="primary" block
                        @click="onEditorSubmitOk">提交
            </van-button>
        </van-popup>
    </div>
</template>

<script>
    import {Popup, Button, Form, Field, CheckboxGroup, Checkbox,RadioGroup, Radio, Uploader,Row,Col,Cell} from 'vant';
    import {request} from "../../base/CiiUtils";
    import {dictionaryStorage} from "../../base/DictionaryStorage";

    export default {
        name: "BuildingEditor",
        components: {
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Form.name]: Form,
            [Field.name]: Field,
            [CheckboxGroup.name]: CheckboxGroup,
            [Checkbox.name]: Checkbox,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Uploader.name]: Uploader,
            [Row.name]:Row,
            [Col.name]:Col,
            [Cell.name]:Cell
        },
        props: {
            editor: {
                type: Boolean,
                required: true,
                default: function () {
                    return false;
                }
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
        data: function () {
            return {
                currentData: {
                    parkId: null,
                    bdName: null,
                    bdNameDesc: null,
                    structureType: null,
                    singleFloor: null,
                    hasLift: null,
                    liftCount: null,
                    liftBearing: null,
                    hasRailway: null,
                    railwayType: null,
                    railwayHeight: null,
                    railwayWidth: null,
                    hasCanopy: null,
                    canopyWidth: null,
                    uploadType: null,
                },
                floorImagesList: [],
                enterTimeSelectVisible:false,
            }
        },
        computed: {
            railwayWidthNeed(){
                return this.currentData.hasRailway==='true' && this.currentData.railwayType==='External';
            },
            editorVisible: {
                get: function () {
                    return this.visible;
                },
                set: function () {
                    this.onEditorCancel()
                }
            },
            buildingStructureType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.base.dictionary.BuildingStructureType")
                }
            },
            railwayType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.industry.dictionary.RailwayType")
                }
            },
            uploadType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.industry.dictionary.UploadType")
                }
            },
        },
        methods: {

            initCurrentData(editData){
                Object.assign(this.currentData,editData);
            },
            onEditorCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },

            onEditorSubmitOk() {

                this.$refs.buildingEditorForm.validate().then(() => {
                    request({
                        conf: {
                            url: this.editor ? 'buildingIndustry/update' : 'buildingIndustry/create',
                            data: {
                                entity: this.currentData
                            }
                        },
                        success: (response) => {
                            if (this.onSubmitOk) {
                                this.onSubmitOk(response.result);
                            }
                        }
                    });

                }).catch(() => {
                });


            },
            onEnterTimeSelectSubmitOk(date){
                this.enterTimeSelectVisible = false;
                this.currentData.enterTime = date;
            }
        }
    }
</script>

<style scoped>

</style>