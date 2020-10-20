<template>
    <div>
        <van-popup v-model="editorVisible" :style="{height:height,width:width}" :position="position">

            <van-form ref="parkEditorForm" style="margin-bottom: 50px">
                <van-field label="省市区"
                           readonly
                           clickable
                           :value="areaString"
                           :rules="[{required: true,message:'省市区必填'}]"
                           name="location"
                           @click="onAreaSelectClick"
                           placeholder="选择市区街道">
                </van-field>
                <van-field label="详细地址"
                           name="address"
                           v-model="currentData.address"
                           :rules="[{required: true,message:'详细地址必填'}]"
                           placeholder="详细路段及门牌号">

                </van-field>
                <van-field label="地图坐标"
                           readonly
                           clickable
                           name="point"
                           :value="addressPoint"
                           :rules="[{required: true,message:'地图坐标必填'}]"
                           @click="onPointSelectClick"
                           placeholder="请选择坐标">
                </van-field>
                <van-field label="园区名称" v-model="currentData.pkName" placeholder="园区别名">
                </van-field>
                <van-field label="证件信息" name="certificateTypeList" :rules="[{required: true,message:'证件信息必填'}]">
                    <template #input>
                        <van-checkbox-group v-model="currentData.certificateTypeList" direction="horizontal">
                            <van-checkbox v-for="ct in parkCertificateType" :name="ct.code" :key="ct.code">{{ct.name}}
                            </van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>
                <van-field label="土地性质" name="landUseType" :rules="[{required: true,message:'土地性质必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.landUseType" direction="horizontal">
                            <van-radio v-for="lu in landUseType" :name="lu.code" :key="lu.code">{{lu.name}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="配电量" name="voltage" type="number" placeholder="配电量单位为KVA"
                           :rules="[{required: true,message:'配电量必填'}]"
                           v-model="currentData.voltage">
                    <template #button>
                        KVA
                    </template>
                </van-field>
                <van-field label="税收要求" name="hasTax" :rules="[{validator:trueOrFalseValidator,message:'税收必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasTax" direction="horizontal">
                            <van-radio :name="true">有要求</van-radio>
                            <van-radio :name="false">无要求</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="公司注册" name="canRegistry" :rules="[{validator:trueOrFalseValidator,message:'是否可注册必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.canRegistry" direction="horizontal">
                            <van-radio :name="true">可注册</van-radio>
                            <van-radio :name="false">不可注册</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="监控设施" name="hasMonitor" :rules="[{validator:trueOrFalseValidator,message:'监控设施必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasMonitor" direction="horizontal">
                            <van-radio :name="true">有监控</van-radio>
                            <van-radio :name="false">无监控</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="园区安保" name="hasGuard" :rules="[{validator:trueOrFalseValidator,message:'园区安保必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasGuard" direction="horizontal">
                            <van-radio :name="true">有安保</van-radio>
                            <van-radio :name="false">无安保</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="配套食堂" name="hasCanteen"
                           :rules="[{validator:trueOrFalseValidator,message:'配套食堂必填',}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasCanteen" direction="horizontal">
                            <van-radio :name="true">有食堂</van-radio>
                            <van-radio :name="false">无食堂</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="办公区" name="hasOffice" :rules="[{validator:trueOrFalseValidator,message:'办公区必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasOffice" direction="horizontal">
                            <van-radio :name="true">有办公区</van-radio>
                            <van-radio :name="false">无办公区</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="停车位" name="hasParkingSpace" :rules="[{validator:trueOrFalseValidator,message:'停车位必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.hasParkingSpace" direction="horizontal">
                            <van-radio :name="true">有停车位</van-radio>
                            <van-radio :name="false">无停车位</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="独门独院" name="singlePark" :rules="[{validator:trueOrFalseValidator,message:'独门独院必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.singlePark" direction="horizontal">
                            <van-radio :name="true">是</van-radio>
                            <van-radio :name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="周转场地" type="number" name="openSpaceAcreage" v-model="currentData.openSpaceAcreage"
                           :rules="[{required: true,message:'周转场地必填'}]">
                    <template #button>
                        平米
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

                <van-field v-if="!editor" :value="houseOwnerString" label="业主选择"
                           :rules="[{required: !editor,message:'业主必填'}]"
                           name="houseOwner" placeholder="选择业主" readonly
                           clickable @click="onHouseOwnerSelectClick">
                </van-field>
                <van-field label="园区图片" name="parkImagesList" :rules="[{required: true,message:'图片必填'}]">
                    <template #input>
                        <van-uploader v-model="parkImagesList" multiple></van-uploader>
                    </template>
                </van-field>

            </van-form>

            <van-button style="position: fixed;bottom: 0px"
                        type="primary" block
                        @click="onEditorSubmitOk">提交
            </van-button>
        </van-popup>
        <AreaSelect :visible="areaSelectVisible" :on-submit-ok="onAreaSelectSubmitOk" :on-cancel="onAreaSelectCancel"/>
        <MapPointSelect :address-data="pointSelectParam" :visible="pointSelectVisible"
                        :on-submit-ok="onPointSelectSubmitOk" :on-cancel="onPointSelectCancel"/>
        <HouseOwnerSelect :visible="houseOwnerSelectVisible" :on-submit-ok="onHouseOwnerSelectSubmitOk"
                          :on-cancel="onHouseOwnerSelectCancel"/>

        <van-overlay :show="loading" z-index="9999">
            <van-loading class="wrapper" type="spinner" size="50px" text-size="15" vertical>加载中...</van-loading>
        </van-overlay>

    </div>
</template>

<script>
    import {Popup, Button, Form, Field, Toast, CheckboxGroup, Checkbox, RadioGroup, Radio, Uploader,Overlay,Loading} from 'vant';
    import {request} from "../../base/CiiUtils";
    import AreaSelect from "../../base/AreaSelect";
    import MapPointSelect from "../../base/MapPointSelect";
    import {dictionaryStorage} from "../../base/DictionaryStorage";
    import HouseOwnerSelect from "../owner/HouseOwnerSelect";
    import {Constants} from "../../base/Constants";

    export default {
        name: "ParkEditor",
        components: {
            HouseOwnerSelect,
            MapPointSelect,
            AreaSelect,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Form.name]: Form,
            [Field.name]: Field,
            [CheckboxGroup.name]: CheckboxGroup,
            [Checkbox.name]: Checkbox,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Uploader.name]: Uploader,
            [Overlay.name]:Overlay,
            [Loading.name]:Loading
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
                loading:false,
                currentData: {
                    cityId: null,
                    cityName: null,
                    regionId: null,
                    regionName: null,
                    streetId: null,
                    streetName: null,
                    communityId: null,
                    communityName: null,
                    address: null,
                    longitude: null,
                    latitude: null,
                    pkName: null,
                    certificateTypeList: [],
                    landUseType: null,
                    voltage: null,
                    hasTax: null,
                    canRegistry: null,
                    hasMonitor: null,
                    hasGuard: null,
                    hasCanteen: null,
                    hasOffice: null,
                    hasParkingSpace: null,
                    singlePark: null,
                    openSpaceAcreage: null,
                    fitIndustryList: [],
                    houseOwnerId: null,
                    parkImagesList: []
                },
                parkImagesList: [],
                areaSelectVisible: false,
                pointSelectVisible: false,
                pointSelectParam: {},
                houseOwnerSelectVisible: false,
                houseOwner: {}
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
            houseOwnerString() {
                return this.houseOwner.id ? `${this.houseOwner.ownName}（${this.houseOwner.ownPhone}）` : null
            },
            areaString: {
                get: function () {
                    return `${this.currentData.cityName || ""}${this.currentData.regionName || ""}${this.currentData.streetName || ""}${this.currentData.communityName || ""}`;
                }
            },
            addressPoint: {
                get: function () {

                    if (this.currentData.longitude) {
                        return `${this.currentData.longitude},${this.currentData.latitude}`;
                    }
                    return '';
                }
            },
            parkCertificateType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.industry.dictionary.ParkCertificateType");
                }
            },
            landUseType: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.house.base.dictionary.LandUseType");
                }
            },
            industry: {
                get: function () {
                    return dictionaryStorage.get("com.cii.bomse.common.dictionary.Industry");
                }

            }

        },
        methods: {
            //当展示编辑的时候由父组件调用
            initCurrentData(editData){
                Object.assign(this.currentData,editData);
                if (editData.parkImagesList){
                    this.parkImagesList = editData.parkImagesList.map((f) => {
                        return {
                            url:window.location.origin + Constants.fileReadUrl + f,
                            isImage: true,
                            fileId:f,
                        }
                    });
                }
            },
            onEditorCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },

            trueOrFalseValidator(value) {
                return value === true || value === false;
            },

            onEditorSubmitOk() {

                this.$refs.parkEditorForm.validate().then(() => {

                    if (!this.parkImagesList || this.parkImagesList.length < 1) {
                        Toast.fail("园区图片必填!");
                        return;
                    }
                    let formData = new FormData();
                    this.currentData.parkImagesList = [];


                    let hasNewFile = false;
                    for (let i = 0; i < this.parkImagesList.length; i++) {

                        if (this.parkImagesList[i].fileId){
                            this.currentData.parkImagesList.push(this.parkImagesList[i].fileId);
                        } else{
                            hasNewFile = true;
                            formData.append("file", this.parkImagesList[i].file);
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
                                    this.currentData.parkImagesList.push(fl.id);
                                })
                                this.doRequest(this.currentData);
                            }
                        })
                    } else{
                        this.doRequest(this.currentData);
                    }

                }).catch(() => {
                });


            },
            doRequest(req) {

                //清楚源数据，从上传的数组中重新获取
                this.currentData.parkImages = null;
                this.currentData.fitIndustry = null;
                this.currentData.certificateType = null;

                this.loading = true;

                request({
                    conf: {
                        url: this.editor ? 'parkIndustry/update' : 'parkIndustry/create',
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
            onAreaSelectClick() {
                this.areaSelectVisible = true;
            },
            onAreaSelectCancel() {
                this.areaSelectVisible = false;
            },
            onAreaSelectSubmitOk(values) {
                this.currentData.cityId = values.cityId;
                this.currentData.cityName = values.cityName;
                this.currentData.regionId = values.regionId;
                this.currentData.regionName = values.regionName;
                this.currentData.streetId = values.streetId;
                this.currentData.streetName = values.streetName;
                this.currentData.communityId = values.communityId;
                this.currentData.communityName = values.communityName;
                this.areaSelectVisible = false;
            },
            onPointSelectClick() {

                if (!this.currentData.cityName || !this.currentData.address) {
                    Toast.fail("请先填写市区及详细地址！");
                    return;
                }

                this.pointSelectParam = {
                    cityName: this.currentData.cityName,
                    regionName: this.currentData.regionName,
                    streetName: this.currentData.streetName,
                    communityName: this.currentData.communityName,
                    address: this.currentData.address,
                }

                this.pointSelectVisible = true;
            },
            onPointSelectCancel() {
                this.pointSelectVisible = false;
            },
            onPointSelectSubmitOk(point) {
                this.pointSelectVisible = false;
                this.currentData.longitude = point.lng;
                this.currentData.latitude = point.lat;
            },
            onHouseOwnerSelectClick() {
                this.houseOwnerSelectVisible = true;
            },
            onHouseOwnerSelectCancel() {
                this.houseOwnerSelectVisible = false;
            },
            onHouseOwnerSelectSubmitOk(values) {
                this.houseOwnerSelectVisible = false;
                this.currentData.houseOwnerId = values.id;
                this.houseOwner = values;
            }
        }
    }
</script>

<style scoped>

</style>