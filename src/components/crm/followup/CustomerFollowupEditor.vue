<template>
    <div>
        <van-nav-bar title="新增跟进"
                     @click-left="onBackClick"
                     left-arrow left-text="返回">
        </van-nav-bar>
        <van-form @submit="onSubmit">
            <van-field v-model="followup.cusId"
                       label="客户ID"
                       name="cusId"
                       :rules="[{required:true,message:'客户编码必填'}]"
                       readonly/>
            <van-field name="followupType"
                       :rules="[{required:true,message:'跟进类型必填'}]"
                       label="跟进类型">
                <template #input>
                    <van-radio-group v-model="followup.followupType" direction="horizontal">
                        <van-radio name="Phone">电话跟进</van-radio>
                        <van-radio name="Scene">实地带看</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <van-field name="followupContent"
                       v-model="followup.followupContent"
                       row="2"
                       autosize
                       type="textarea"
                       :rules="[{required: true,message: '跟进内容必填'}]"
                       placeholder="请输入跟进的内容"
                       label="跟进内容">
            </van-field>
            <van-field v-if="followup.followupType == 'Scene'" name="followupImages" label="带看图片">
                <template #input>
                    <van-uploader v-model="followup.followupImagesList" multiple></van-uploader>
                </template>
            </van-field>
            <van-field v-if="followup.followupType == 'Scene'" name="followupHouseList" label="带看房源">
                <template #input>
                    <van-tag @click="onFloorSelectClick">
                        <van-icon name="plus"></van-icon>
                    </van-tag>
                </template>
            </van-field>
            <van-cell>
                <template #default>
                    <p v-for="(floor,index) in selectedFloor" :key="index">{{floor.address}}</p>
                </template>
            </van-cell>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>
        <FloorSelect :visible="floorSelectVisible" :on-submit-ok="onFloorSelectSubmitOk" :on-cancel="onFloorSelectCancel"/>
    </div>
</template>

<script>
    import {NavBar, Form, Field, RadioGroup, Radio, Button, Uploader, Popup, Cell, Icon, Toast,Tag} from 'vant';
    import {request} from "../../base/CiiUtils";
    import FloorSelect from "../../house/floor/FloorSelect";

    export default {
        name: "CustomerFollowupEditor",
        components: {
            FloorSelect,
            [NavBar.name]: NavBar,
            [Form.name]: Form,
            [Field.name]: Field,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Button.name]: Button,
            [Uploader.name]: Uploader,
            [Popup.name]: Popup,
            [Cell.name]: Cell,
            [Icon.name]: Icon,
            [Tag.name]:Tag
        },
        data: function () {
            return {
                floorSelectVisible: false,
                selectedFloor: [],
                followup: {
                    cusId: this.$route.params.cusId,
                    followupType: '',
                    followupContent: '',
                    followupImages: '',
                    followupImagesList: [],
                    nextContactTime: null
                }
            }
        },

        methods: {
            onBackClick() {
                this.$router.back();
            },
            onSubmit(values) {

                if (values.followupType === 'Scene') {

                    if (!values.followupImages || values.followupImages.length < 1 || this.selectedFloor.length < 1) {
                        Toast.fail("带看情况下，带看的照片和带看的房源必填");
                        return;
                    }

                    values.followupHouseList = this.selectedFloor;

                    let formData = new FormData();
                    for (let i = 0; i < values.followupImages.length; i++) {
                        let fl = values.followupImages[i];
                        formData.append("file", fl.file);
                    }
                    request({
                        conf: {
                            url: '/file/upload',
                            data: formData,
                            headers: {
                                contentType: 'multipart/form-data'
                            }
                        },
                        success: (response) => {
                            values.followupImages = null;
                            values.followupImagesList = new Array();
                            for (let j = 0; j < response.result.length; j++) {
                                values.followupImagesList.push(response.result[j].id);
                            }
                            this.doRequest(values);

                        }
                    });
                } else {
                    this.doRequest(values);
                }

            },
            doRequest(values) {

                let _url = 'customerIndustryFollowup/create';
                if(this.$route.params.cusStatus === 'WaitProcess'){
                    _url = 'customerIndustryFollowup/process';
                }

                request({
                    conf: {
                        url: _url,
                        data: {
                            entity: values
                        }
                    },
                    success: () => {
                        this.$router.back();
                    }
                })
            },
            onFloorSelectClick() {
                this.floorSelectVisible = true;
            },
            onFloorSelectCancel() {
                this.floorSelectVisible = false;
            },
            onFloorSelectSubmitOk(floor) {
                this.floorSelectVisible = false;

                this.selectedFloor.push({
                    floorId: floor.id,
                    buildingId: floor.buildingId,
                    parkId: floor.parkId,
                    address: floor.park.detailAddress + floor.building.bdName + '栋第' + floor.floorNumber + '层'
                })
            }
        }

    }
</script>

<style scoped>

</style>