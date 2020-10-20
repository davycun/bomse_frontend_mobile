<template>
    <div>
        <van-nav-bar title="上下架客户"
                     left-text="返回"
                     left-arrow
                     @click-left="onBackClick">
        </van-nav-bar>

        <van-form @submit="onSubmit">
            <van-field v-model="upDown.cusId"
                       label="客户ID"
                       name="cusId"
                       :rules="[{required:true,message:'客户编码必填'}]"
                       readonly>
            </van-field>
            <van-field v-model="upDown.upDownType"
                       label="上下架类型"
                       name="upDownType"
                       :rules="[{required:true,message:'上下架必填'}]"
                       readonly>
            </van-field>
            <van-field v-if="upDown.upDownType==='Down'"
                       label="下架原因"
                       name="downReason">
                <template #input>
                    <van-radio-group v-model="upDown.downReason" direction="horizontal">
                        <van-radio v-for="reason in downReasonType" :key="reason.code" :name="reason.code">{{reason.name}}</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <van-field v-if="upDown.upDownType==='Down'"
                       label="下次联系时间"
                       center
                       name="nextContactTime">
                <template #input>
                    <van-cell title="选择日期" :value="dateName" @click="dateShow = true" />
                </template>
            </van-field>
            <van-field label="更多备注"
                       v-model="upDown.remark"
                       autosize
                       row="2"
                       type="textarea"
                       placeholder="填写更多上下架备注"
                       name="remark">
            </van-field>

            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                    提交
                </van-button>
            </div>

        </van-form>

        <van-calendar v-model="dateShow" @confirm="onConfirm" />
    </div>
</template>

<script>

    import {NavBar,Form,Field,RadioGroup,Radio,Calendar,Cell,Button,Toast} from 'vant';
    import {dictionaryStorage} from "../../base/DictionaryStorage";
    import {request} from "../../base/CiiUtils";

    export default {
        name: "CustomerUpDownEditor",
        components:{
            [NavBar.name]:NavBar,
            [Form.name]:Form,
            [Field.name]:Field,
            [RadioGroup.name]:RadioGroup,
            [Radio.name]:Radio,
            [Calendar.name]:Calendar,
            [Cell.name]:Cell,
            [Button.name]:Button
        },
        props:{
            customer:{
                type:Object,
            }
        },
        data:function(){
            return {
                dateShow:false,
                dateName:'',
                upDown:{
                    cusId:this.$route.params.cusId,
                    upDownType:this.$route.params.cusStatus==='HasDown'?'up':'Down',
                    downReason:'',
                    nextContactTime:null,
                    remark:''
                }
            }
        },
        computed:{
            downReasonType:function(){
                return dictionaryStorage.get("com.cii.bomse.crm.customer.base.dictionary.CustomerDownReasonType");
            }
        },
        methods:{
            onBackClick(){
                this.$router.back();
            },
            onSubmit(values){

                values.nextContactTime = this.upDown.nextContactTime;
                
                if (values.upDownType==='Down'){
                    if (!values.downReason || !values.nextContactTime) {
                        Toast.fail('下架客户，下架原因和下次联系时间必填');
                        return;
                    }
                }

                request({
                    conf:{
                        url:'customerIndustryUpDown/create',
                        data:{
                            entity:values
                        }
                    },
                    success:()=>{
                        this.$router.back();
                    }
                })
            },
            onConfirm(date) {
                this.dateShow = false;
                this.dateName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                this.upDown.nextContactTime = date;
            },
        }
    }
</script>

<style scoped>

</style>