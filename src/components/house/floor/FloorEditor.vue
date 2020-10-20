<template>
    <div>
        <van-popup v-model="editorVisible" :style="{height:height,width:width}" :position="position">

            <van-form ref="floorEditorForm" style="margin-bottom: 50px">
                <van-field label="园区ID" name="parkId" readonly v-model="currentData.parkId" placeholder="园区ID">
                </van-field>
                <van-field label="楼栋ID" name="buildingId" readonly v-model="currentData.buildingId" placeholder="楼栋ID">
                </van-field>
                <van-field label="房源用途" name="houseUseTypeList" :rules="[{required: true,message:'房源用途必填'}]">
                    <template #input>
                        <van-checkbox-group v-model="currentData.houseUseTypeList" direction="horizontal">
                            <van-checkbox v-for="ct in houseIndustryUseType" :name="ct.code" :key="ct.code">{{ct.name}}
                            </van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>
                <van-field label="所在楼层" type="digit" name="floorNumber" v-model="currentData.floorNumber"
                           placeholder="请填写所在楼层"
                           :rules="[{required: true,message:'所在楼层必填'}]">
                </van-field>
                <van-field label="楼层总面积" type="number" name="totalAcreage" v-model="currentData.totalAcreage"
                           placeholder="请填写楼层总面积"
                           :rules="[{required: true,message:'楼层总面积必填'}]">
                    <template #button>平米</template>
                </van-field>
                <van-field label="可租面积" type="number" name="leaseAcreage" v-model="currentData.leaseAcreage"
                           placeholder="请填写可租面积"
                           :rules="[{required: true,message:'楼层可租面积必填'}]">
                    <template #button>平米</template>
                </van-field>
                <van-field label="起租面积" type="number" name="leaseAcreageMin" v-model="currentData.leaseAcreageMin"
                           placeholder="请填写楼层最小出租面积"
                           :rules="[{required: true,message:'楼层起租面积必填'}]">
                    <template #button>平米</template>
                </van-field>

                <van-row>
                    <van-col span="12">
                        <van-field center label="单价" type="number" name="price" v-model="currentData.price"
                                   placeholder="出租单价"
                                   :rules="[{required: true,message:'楼层出租单价必填'}]">
                        </van-field>
                    </van-col>
                    <van-col sapn="12">
                        <van-field label="" name="priceUnit" :rules="[{required: true,message:'单位必填'}]">
                            <template #input>
                                <van-radio-group v-model="currentData.priceUnit">
                                    <van-radio v-for="lu in industryPriceUnitType" :name="lu.code" :key="lu.code">{{lu.name}}
                                    </van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                    </van-col>
                </van-row>


                <van-field label="层高" type="number" name="floorHeight" v-model="currentData.floorHeight"
                           placeholder="请填写层高"
                           :rules="[{required: true,message:'层高必填'}]">
                    <template #button>米</template>
                </van-field>
                <van-field label="承重" type="number" name="bearing" v-model="currentData.bearing"
                           placeholder="楼层单位面积承重"
                           :rules="[{required: true,message:'承重必填'}]">
                    <template #button>吨/平米</template>
                </van-field>

                <van-field label="地坪" name="floorBoardType" placeholder="地面装修类型" :rules="[{required: true,message:'土地性质必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.floorBoardType" direction="horizontal">
                            <van-radio v-for="lu in floorBoardType" :name="lu.code" :key="lu.code">{{lu.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="消防设施" name="fireDeviceTypeList" placeholder="选择已经安装的消防设施" :rules="[{required: true,message:'消防设施必填'}]">
                    <template #input>
                        <van-checkbox-group v-model="currentData.fireDeviceTypeList">
                            <van-checkbox v-for="ids in fireDeviceType" :key="ids.code" :name="ids.code">{{ids.name}}
                            </van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>

                <van-field label="有杭车否" name="hasBridgeCrane" :rules="[{validator:trueOrFalseValidator,message:'有无杭车必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasBridgeCrane" direction="horizontal">
                            <van-radio :name="true">有行车</van-radio>
                            <van-radio :name="false">无行车</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>

                <van-field label="出租类型" name="leaseType" :rules="[{required: true,message:'出租类型必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.leaseType" direction="horizontal">
                            <van-radio v-for="lu in leaseType" :name="lu.code" :key="lu.code">{{lu.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>

                <van-field label="最短租期" type="digit" name="leaseTermMin"  v-model="currentData.leaseTermMin"
                           placeholder="业主期望此房子最短租期"
                           :rules="[{required: true,message:'期望租期必填'}]">
                    <template #button>月</template>
                </van-field>

                <van-field center label="可入住时间" name="enterTime">
                    <template #input>
                        <van-cell :value="enterTimeDesc" @click="enterTimeSelectVisible = true" />
                    </template>
                </van-field>

                <van-field label="适合行业" name="fitIndustryList" :rules="[{required: true,message:'适合行业必填'}]">
                    <template #input>
                        <div style="max-height: 200px;overflow: auto;width:100%">
                            <van-checkbox-group v-model="currentData.fitIndustryList">
                                <van-checkbox v-for="ids in industry" :key="ids.code" :name="ids.code">{{ids.name}}
                                </van-checkbox>
                            </van-checkbox-group>
                        </div>
                    </template>
                </van-field>

                <van-field label="楼层图片" name="floorImagesList" :rules="[{required: true,message:'图片必填'}]">
                    <template #input>
                        <van-uploader v-model="floorImagesList" multiple></van-uploader>
                    </template>
                </van-field>
            </van-form>

            <van-button style="position: fixed;bottom: 0px"
                        type="primary" block
                        @click="onEditorSubmitOk">提交
            </van-button>
        </van-popup>

        <van-calendar v-model="enterTimeSelectVisible" @confirm="onEnterTimeSelectSubmitOk" />

        <van-overlay :show="loading" z-index="9999">
            <van-loading class="wrapper" type="spinner" size="50px" text-size="15" vertical>加载中...</van-loading>
        </van-overlay>
    </div>
</template>

<script>
    import {Popup, Button, Form, Field, Toast, CheckboxGroup, Checkbox,
        RadioGroup, Radio, Uploader,Row,Col,Calendar,Cell,Overlay} from 'vant';
    import {request, Utils} from "../../base/CiiUtils";
    import {dictionaryStorage} from "../../base/DictionaryStorage";
    import {Constants} from "../../base/Constants";

    export default {
        name: "FloorEditor",
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
            [Calendar.name]:Calendar,
            [Cell.name]:Cell,
            [Overlay.name]:Overlay
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
                    buildingId: null,
                    houseUseTypeList: [],
                    floorNumber: null,
                    totalAcreage: null,
                    leaseAcreage: null,
                    leaseAcreageMin: null,
                    price: null,
                    priceUnit: null,
                    floorHeight: null,
                    bearing: null,
                    floorBoardType: null,
                    fireDeviceTypeList: [],
                    hasBridgeCrane: null,
                    leaseType: null,
                    leaseTermMin: null,
                    enterTime: null,
                    fitIndustryList: [],
                    floorImagesList: []
                },
                floorImagesList: [],
                enterTimeSelectVisible:false,
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
            enterTimeDesc:{
               get(){
                   return Utils.dateFormat(this.currentData.enterTime,'yyyy-MM-dd');
               }
            },
            houseIndustryUseType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.industry.dictionary.HouseIndustryUseType")
                }
            },
            industryPriceUnitType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.common.dictionary.IndustryPriceUnitType")
                }
            },
            floorBoardType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.base.dictionary.FloorBoardType")
                }
            },
            fireDeviceType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.base.dictionary.FireDeviceType");
                }
            },
            leaseType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.base.dictionary.LeaseType")
                }
            },
            industry: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.common.dictionary.Industry")
                }
            }

        },
        methods: {

            initCurrentData(editData){
                Object.assign(this.currentData,editData);
                if (editData.floorImagesList){
                    this.floorImagesList = editData.floorImagesList.map((f) => {
                        return {
                            url:window.location.origin + Constants.fileReadUrl + f,
                            isImage: true,
                            fileId:f,
                        }
                    });
                }
            },

            trueOrFalseValidator(value) {
                return value === true || value === false;
            },

            onEditorCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },

            onEditorSubmitOk() {

                this.$refs.floorEditorForm.validate().then(() => {

                    if (!this.floorImagesList || this.floorImagesList.length < 1) {
                        Toast.fail("园区图片必填!");
                        return;
                    }
                    //清空图片数组，重新加载
                    this.currentData.floorImagesList = [];

                    let formData = new FormData();
                    let hasNewFile = false;

                    for (let i = 0; i < this.floorImagesList.length; i++) {
                        formData.append("file", this.floorImagesList[i].file);

                        if (this.floorImagesList[i].fileId){
                            this.currentData.floorImagesList.push(this.floorImagesList[i].fileId);
                        } else{
                            hasNewFile = true;
                            formData.append("file", this.floorImagesList[i].file);
                        }
                    }

                    if (hasNewFile){
                        request({
                            conf: {
                                url: "file/upload",
                                data: formData,
                                headers: {
                                    contentType: 'multipart/form-data'
                                }
                            },
                            success: (response) => {
                                response.result.forEach((fl) => {
                                    this.currentData.floorImagesList.push(fl.id);
                                })
                                this.doRequest(this.currentData);
                            }
                        })
                    }else{
                        this.doRequest(this.currentData);
                    }

                }).catch(() => {
                });


            },

            doRequest(req) {

                //清空源数据，从上传的数组中重新组织
                this.currentData.houseUseType = null;
                this.currentData.fireDeviceType = null;
                this.currentData.fitIndustry = null;
                this.currentData.floorImages = null;

                this.loading = true;

                request({
                    conf: {
                        url: this.editor ? 'floorIndustry/update' : 'floorIndustry/create',
                        data: {
                            entity: req
                        }
                    },
                    success: (response) => {

                        if (this.onSubmitOk) {
                            this.onSubmitOk(response.result);
                        }
                    },
                    finally:()=>{
                        this.loading = false;
                    }
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