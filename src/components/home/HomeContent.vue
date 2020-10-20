<template>
    <div>
        <div style="height:100px;text-align: left;padding:20px;background-color: #91d5ff">
            <van-row>
                <van-col span="12">
                    本月业绩：{{myReport.divideAmount}}
                </van-col>
                <van-col span="12">
                    本月单量：{{myReport.orderCount}}
                </van-col>
            </van-row>
            <van-divider/>
            <van-row>
                <van-col span="8">
                    本月获客：{{myReport.customerCount}}
                </van-col>
                <van-col span="8">
                    园区录入：{{myReport.parkCount}}
                </van-col>
                <van-col span="8">
                    楼层录入：{{myReport.floorCount}}
                </van-col>
            </van-row>
        </div>
        <van-grid square clickable>
            <van-grid-item icon="img/workshop.png" text="新增房源" :to="{path:'/house/editor'}"></van-grid-item>
            <van-grid-item icon="img/customer.png" text="新增客户" @click="onCustomerCreateClick"></van-grid-item>
        </van-grid>
        <CustomerEditor :editor="false" :visible="customerCreateVisible" :on-cancel="onCustomerCreateCancel" :on-submit-ok="onCustomerCreateSubmitOk"/>
    </div>
</template>

<script>
    import {Grid,GridItem,Row,Col,Divider} from 'vant';
    import CustomerEditor from "../crm/CustomerEditor";
    import {request} from "../base/CiiUtils";
    export default {
        name: "HomeContent",
        components:{
            CustomerEditor,
            [Grid.name]:Grid,
            [GridItem.name]:GridItem,
            [Row.name]:Row,
            [Col.name]:Col,
            [Divider.name]:Divider
        },

        data(){
            return {
                customerCreateVisible:false,
                myReport:{}
            }
        },
        created(){
            this.loadData();
        },
        methods:{
            loadData(){
                request({
                    conf:{
                        url:'myReport/report'
                    },
                    success:(response)=>{
                        this.myReport = response.result;
                    }
                })
            },
            onCustomerCreateClick(){
                this.customerCreateVisible = true;
            },
            onCustomerCreateCancel(){
                this.customerCreateVisible = false;
            },
            onCustomerCreateSubmitOk(){
                this.customerCreateVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>