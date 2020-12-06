<template>
    <div>
        <van-popup v-model="editorVisible" :position="position" :style="{width:width,height:height}">
            <van-form ref="customerEditor" style="margin-bottom: 70px;">
                <van-field label="客户姓名" name="cusName"
                           v-model="currentData.cusName"
                           :rules="[{required: true,message:'客户姓名必填'}]"
                           placeholder="填写客户姓名"></van-field>
                <van-field label="客户电话" name="cusPhone"
                           v-model="currentData.cusPhone"
                           v-if="!this.editor"
                           :rules="this.editor?[{required:false}]:[{required:true,message:'请填写正确的手机号',pattern:/^1[3-9][0-9]{9}$/}]"
                           placeholder="填写客户电话">
                    <template #button>
                        <van-button size="small" type="primary" @click="checkPhoneExists">检查</van-button>
                    </template>
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
                <van-field label="公司" name="company"
                           v-model="currentData.company"
                           placeholder="客户所在公司">
                </van-field>
                <van-field label="找房用途" name="houseUseType" :rules="[{required:true,message:'性别必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.houseUseType" direction="horizontal">
                            <van-radio v-for="dic in houseUseType" :key="dic.code" :name="dic.code">{{dic.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="所属行业" name="industry" :rules="[{required:true,message:'性别必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.industry" direction="horizontal">
                            <van-radio v-for="dic in industry" :key="dic.code" :name="dic.code">{{dic.name}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="产品信息" name="product"
                           v-model="currentData.product"
                           :rules="[{required:true,message:'产品信息必填'}]"
                           placeholder="填写客户是做什么的">
                </van-field>
                <van-field label="需求面积" name="needAcreage"
                           type="number"
                           v-model="currentData.needAcreage"
                           :rules="[{required:true,message:'需求面积必填'}]"
                           placeholder="填写客户大致需要的面积大小">
                    <template #button>㎡</template>
                </van-field>
                <van-row>
                    <van-col span="12">
                        <van-field center label="期望价格" type="number" name="needPrice" v-model="currentData.needPrice"
                                   placeholder="出租单价"
                                   :rules="[{required: true,message:'楼层出租单价必填'}]">
                        </van-field>
                    </van-col>
                    <van-col sapn="12">
                        <van-field label="" name="priceUnit" :rules="[{required: true,message:'单位必填'}]">
                            <template #input>
                                <van-radio-group v-model="currentData.priceUnit">
                                    <van-radio v-for="dic in industryPriceUnitType" :name="dic.code" :key="dic.code">
                                        {{dic.name}}
                                    </van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                    </van-col>
                </van-row>
                <van-field label="楼层要求" name="needLayer" :rules="[{required:true,message:'楼层要求必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.needLayer" direction="horizontal">
                            <van-radio v-for="dic in customerNeedLayerType" :key="dic.code" :name="dic.code">
                                {{dic.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="层高要求" name="layerHeight" type="number"
                           v-model="currentData.layerHeight"
                           placeholder="填写客户最低层高要求">
                    <template #button>米</template>
                </van-field>
                <van-field label="电量要求" name="needVoltage" type="number"
                           v-model="currentData.needVoltage"
                           placeholder="填写客户电量要求">
                    <template #button>KVA</template>
                </van-field>
                <van-field label="最晚入住" name="enterTime" v-model="enterTimerString" readonly clickable
                           @click="enterTimeSelectVisible=true"
                           placeholder="请选择时间">
                </van-field>
                <van-field label="期望租期" name="rentLong" type="number"
                           v-model="currentData.rentLong"
                           placeholder="填写客户期望租期">
                    <template #button>月</template>
                </van-field>
                <van-field label="消防要求" name="fireDeviceTypeList">
                    <template #input>
                        <van-checkbox-group v-model="currentData.fireDeviceTypeList" direction="horizontal">
                            <van-checkbox v-for="dic in fireDeviceType" :key="dic.code" :name="dic.code">
                                {{dic.name}}
                            </van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>
                <van-field label="需要环评" name="needEia">
                    <template #input>
                        <van-radio-group v-model="currentData.needEia" direction="horizontal">
                            <van-radio :name="true">是</van-radio>
                            <van-radio :name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="需要注册" name="needRegister">
                    <template #input>
                        <van-radio-group v-model="currentData.needRegister" direction="horizontal">
                            <van-radio :name="true">是</van-radio>
                            <van-radio :name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="需要产证" name="needCertificate">
                    <template #input>
                        <van-radio-group v-model="currentData.needCertificate" direction="horizontal">
                            <van-radio :name="true">是</van-radio>
                            <van-radio :name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="需要办公" name="needOffice">
                    <template #input>
                        <van-radio-group v-model="currentData.needOffice" direction="horizontal">
                            <van-radio :name="true">是</van-radio>
                            <van-radio :name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="需要独栋" name="needSingleBuilding">
                    <template #input>
                        <van-radio-group v-model="currentData.needSingleBuilding" direction="horizontal">
                            <van-radio :name="true">是</van-radio>
                            <van-radio :name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field label="需要独院" name="needSinglePark">
                    <template #input>
                        <van-radio-group v-model="currentData.needSinglePark" direction="horizontal">
                            <van-radio :name="true">是</van-radio>
                            <van-radio :name="false">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="!editor" label="客户来源" name="cusSource" :rules="[{required:!editor,message:'客户来源必填'}]">
                    <template #input>
                        <van-radio-group v-model="currentData.cusSource" direction="horizontal">
                            <van-radio v-for="dic in customerSource" :key="dic.code" :name="dic.code">{{dic.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="partTimerNeed" label="兼职选择" name="ptName" v-model="partTimerString" readonly clickable
                           :rules="[{required:true,message:'客户来源是兼职推荐，兼职必填'}]"
                           @click="onPartTimerSelectClick" placeholder="选择提供客户的兼职">
                </van-field>
                <van-field v-if="!editor" label="客户分类" name="cusOwnerType" :rules="[{required:!editor,message:'客户分类必填'}]"
                           direction="horizontal">
                    <template #input>
                        <van-radio-group v-model="currentData.cusOwnerType">
                            <van-radio v-for="dic in customerOwnerType" :key="dic.code" :name="dic.code">{{dic.name}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="ownerDeptNeed" label="归属部门" name="ptName" v-model="currentData.ownerDeptName" readonly clickable
                           :rules="[{required:ownerDeptNeed,message:'公盘客户，归属部门必填'}]"
                           @click="onOwnerDeptSelectClick" placeholder="选择公盘客户归属的部门">
                </van-field>

                <van-field v-if="ownerUserNeed" label="分配人员" name="ptName" v-model="currentData.ownerName" readonly clickable
                           :rules="[{required:ownerUserNeed,message:'公盘拉私客户，分配人员必填'}]"
                           @click="onOwnerUserSelectClick" placeholder="选择公盘拉私后的分配人员">
                </van-field>

                <van-field label="更多需求" name="remark" v-model="currentData.remark" type="textarea" rows="2" autosize
                           placeholder="客户更多需求描述">
                </van-field>


                <van-field center label="需求区域" name="areas" readonly>
                    <template #input>
                        <van-tag v-for="(area,index) in currentData.areas" :key="index" type="primary" plain closeable
                                 @close="()=>onAreaDeleteClick(index)">
                            {{`${area.cityName}${area.regionName}${area.streetName}`}}
                        </van-tag>
                    </template>
                    <template #button>
                        <van-tag size="small" type="primary" @click="onAreaSelectClick">
                            <van-icon name="plus"></van-icon>
                        </van-tag>
                    </template>
                </van-field>
            </van-form>
            <van-button style="position: fixed;bottom: 0px;" type="primary" block @click="onEditorSubmitOk">提交
            </van-button>

        </van-popup>

        <van-calendar v-model="enterTimeSelectVisible" @confirm="onEnterTimeSubmitOk"></van-calendar>
        <AreaSelect :visible="areaSelectVisible" :on-submit-ok="onAreaSelectSubmitOk" :on-cancel="onAreaSelectCancel"/>
        <PartTimerSelect :visible="partTimerSelectVisible" :on-submit-ok="onPartTimerSelectSubmitOk"
                         :on-cancel="onPartTimerSelectCancel"/>

        <UserSelect :visible="ownerUserSelectVisible" :on-cancel="onOwnerUserSelectCancel"
                    :on-submit-ok="onOwnerUserSelectSubmitOk"/>
        <DeptSelect :visible="ownerDeptSelectVisible" :on-cancel="onOwnerDeptSelectCancel"
                    :on-submit-ok="onOwnerDeptSelectSubmitOk"/>

        <van-overlay :show="loading" z-index="9999">
            <van-loading class="wrapper" type="spinner" size="50px" text-size="15" vertical>加载中...</van-loading>
        </van-overlay>

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
        Col,
        Toast,
        Overlay,
        Loading
    } from 'vant';
    import {dictionaryStorage} from "../base/DictionaryStorage";
    import AreaSelect from "../base/AreaSelect";
    import PartTimerSelect from "./parttimer/PartTimerSelect";
    import UserSelect from "../ums/UserSelect";
    import DeptSelect from "../hrm/DeptSelect";
    import {request,Utils} from "../base/CiiUtils";

    export default {
        name: "CustomerEditor",
        components: {
            DeptSelect,
            UserSelect,
            PartTimerSelect,
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
            [Col.name]: Col,
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
        data() {
            return {
                loading:false,
                currentData: {
                    cusName: null,
                    cusPhone: null,
                    sex: null,
                    post: null,
                    company: null,
                    houseUseType: null,

                    industry: null,
                    product: null,
                    needAcreage: null,
                    needPrice: null,
                    priceUnit: null,
                    needLayer: null,
                    layerHeight: null,
                    needVoltage: null,
                    enterTime: null,
                    rentLong: null,
                    fireDeviceTypeList: [],
                    needEia: null,
                    needRegister: null,
                    needCertificate: null,
                    needOffice: null,
                    needSingleBuilding: null,
                    needSinglePark: null,

                    cusSource: null,
                    cusOwnerType: null,
                    ptId: null,
                    ptName: null,
                    ptPhone: null,
                    areas: [],
                    remark: null,


                    ownerId: null,
                    ownerName: null,
                    ownerDeptId: null,
                    ownerDeptName: null
                },
                enterTimeSelectVisible: false,
                areaSelectVisible: false,

                //partTimer
                partTimerSelectVisible: false,

                //owner
                ownerDeptSelectVisible: false,
                ownerUserSelectVisible: false,
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
            enterTimerString() {
                return Utils.dateFormat(this.currentData.enterTime,'yyyy-MM-dd');
            },
            partTimerString() {
                const {ptName, ptPhone} = this.currentData;

                return ptName ? `${ptName}（${ptPhone}）` : null;
            },

            partTimerNeed() {
                const {cusSource} = this.currentData;

                let dic = dictionaryStorage.get("com.cii.bomse.crm.customer.base.dictionary.CustomerSource", cusSource);

                return dic && dic.name && dic.name.indexOf("兼职") != -1
            },
            ownerDeptNeed() {
                const {cusOwnerType} = this.currentData;
                return cusOwnerType === 'Company' && !this.editor;
            },
            ownerUserNeed() {
                const {cusOwnerType} = this.currentData;
                return cusOwnerType === 'Hide' && !this.editor;
            },

            sexType: {
                get() {
                    return dictionaryStorage.get("com.ciiframework.common.dictionary.SexType")
                }
            },
            industry() {
                return dictionaryStorage.get("com.cii.bomse.common.dictionary.Industry")
            },
            industryPriceUnitType() {
                return dictionaryStorage.get("com.cii.bomse.common.dictionary.IndustryPriceUnitType")
            },
            customerNeedLayerType() {
                return dictionaryStorage.get("com.cii.bomse.crm.customer.base.dictionary.CustomerNeedLayerType")
            },
            fireDeviceType() {
                return dictionaryStorage.get("com.cii.bomse.house.base.dictionary.FireDeviceType")
            },
            houseUseType() {
                return dictionaryStorage.get("com.cii.bomse.crm.customer.base.dictionary.HouseUseType")
            },
            customerSource() {
                return dictionaryStorage.get("com.cii.bomse.crm.customer.base.dictionary.CustomerSource");
            },
            customerOwnerType() {
                return dictionaryStorage.get("com.cii.bomse.crm.customer.base.dictionary.CustomerOwnerType");
            }
        },

        methods: {
            trueOrFalseValidator(value) {
                return value === true || value === false;
            },
            onEditorCancel() {
                if (this.onCancel) {
                    this.onCancel();
                }
            },
            initCurrentData(editData){
                Object.assign(this.currentData,editData);
            },
            checkPhoneExists(){
                request({
                    conf: {
                        url: 'customerIndustry/checkExist',
                        data: {
                            entity: {
                                cusPhone: this.currentData.cusPhone
                            }
                        }
                    },
                    success: () => {
                        Toast.success("客户号码不存在，可以新增")
                    },
                    fail: () => {
                        Toast.fail("号码已经存在，不可以创建")
                        // this.onRequestFailed(data);
                    }
                })
            },
            onEditorSubmitOk() {

                if (!this.partTimerNeed) {
                    this.currentData.ptId = null;
                    this.currentData.ptName = null;
                    this.currentData.ptPhone = null;
                }
                if (!this.ownerDeptNeed) {
                    this.currentData.ownerDeptId = null;
                    this.currentData.ownerDeptName = null;
                }
                if (!this.ownerUserNeed) {
                    this.currentData.ownerId = null;
                    this.currentData.ownerName = null;
                }
                if (this.currentData.areas.length < 1) {
                    Toast.fail("客户需求区域必填");
                    return;
                }

                if (this.editor){
                    this.currentData.fireDeviceType = null;
                }

                this.loading = true;

                request({
                    conf: {
                        url: this.editor?'customerIndustry/update':'customerIndustry/create',
                        data: {
                            entity: this.currentData
                        }
                    },
                    success:()=>{
                        if (this.onSubmitOk){
                            this.onSubmitOk();
                        }
                    },
                    finally:()=>{
                        this.loading = false;
                    }
                })
            },
            onEnterTimeSubmitOk(date) {
                this.enterTimeSelectVisible = false;
                this.currentData.enterTime = date;
            },
            onAreaSelectClick() {
                this.areaSelectVisible = true;
            },
            onAreaSelectCancel() {
                this.areaSelectVisible = false;
            },
            onAreaSelectSubmitOk(area) {
                this.areaSelectVisible = false;
                this.currentData.areas.push({
                    cityId: area.cityId,
                    cityName: area.cityName,
                    regionId: area.regionId,
                    regionName: area.regionName,
                    streetId: area.streetId,
                    streetName: area.streetName,
                    communityId: area.communityId,
                    communityName: area.communityName
                });
            },
            onAreaDeleteClick(index) {
                this.currentData.areas.splice(index, 1);
            },
            onPartTimerSelectClick() {
                this.partTimerSelectVisible = true;
            },
            onPartTimerSelectCancel() {
                this.partTimerSelectVisible = false;
            },
            onPartTimerSelectSubmitOk(values) {
                this.partTimerSelectVisible = false;
                this.currentData.ptId = values.id;
                this.currentData.ptName = values.ptName;
                this.currentData.ptPhone = values.ptPhone;
            },

            onOwnerDeptSelectClick() {
                this.ownerDeptSelectVisible = true;
            },
            onOwnerDeptSelectCancel() {
                this.ownerDeptSelectVisible = false;
            },
            onOwnerDeptSelectSubmitOk(values) {
                this.ownerDeptSelectVisible = false;
                this.currentData.ownerDeptId = values.id;
                this.currentData.ownerDeptName = values.deptName;
            },

            onOwnerUserSelectClick() {
                this.ownerUserSelectVisible = true;
            },
            onOwnerUserSelectCancel() {
                this.ownerUserSelectVisible = false;
            },
            onOwnerUserSelectSubmitOk(values) {
                this.ownerUserSelectVisible = false;
                this.currentData.ownerId = values.id;
                this.currentData.ownerName = values.userName;
                this.currentData.ownerDeptId = values.ownerDeptId;
                this.currentData.ownerDeptName = values.ownerDeptName;
            }
        }
    }
</script>

<style scoped>

</style>