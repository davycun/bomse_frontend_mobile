<template>
    <div>
        <van-cell-group>
            <template #title>
                <span class="cell-group-title">客户基本信息</span>
            </template>
            <van-cell>
                <template #default>
                    客户ID：{{customer.id}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    客户姓名：{{customer.cusName}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    产品信息：{{customer.product}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    客户状态：<span class="red-color">{{customer.cusStatusName}}</span>
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    客户类型：{{customer.cusOwnerTypeName}}
                </template>
            </van-cell>
            <van-cell v-if="customer.cusOwnerType=='Hide'">
                <template #default>
                    拉私人：{{customer.ownerName}}
                </template>
            </van-cell>
            <van-cell v-if="customer.cusOwnerType=='Hide'">
                <template #default >
                    拉私时间：{{Utils.dateFormat(customer.hideTime,'yyyy-MM-dd')}}
                </template>
            </van-cell>
            <van-cell v-if="customer.cusOwnerType=='Company'">
                <template #default>
                    所属部门：{{customer.ownerDeptName}}
                </template>
            </van-cell>
            <van-cell v-if="customer.cusOwnerType=='Personal'">
                <template #default>
                    所属人：{{customer.ownerName}}
                </template>
            </van-cell>
            <van-cell v-if="customer.cusOwnerType=='Personal'">
                <template #default>
                    创建人：{{customer.createName}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    需求区域：
                    <span class="red-color" v-for="area in customer.areas" :key="area.id">
                                    {{area.cityName+(area.regionName||"")+(area.streetName||"")}}
                    </span>
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    所属行业：{{customer.industryName}}
                </template>
            </van-cell>

        </van-cell-group>

        <van-cell-group>
            <template #title>
                <span class="cell-group-title">客户需求信息</span>
            </template>
            <van-cell>
                <template #default >
                    需求面积：<span  class="red-color">{{customer.needAcreage}} m²</span>
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    房源用途：{{customer.houseUseTypeName}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    期望价格：<span class="red-color">{{customer.needPrice}} {{customer.priceUnitName}}</span>
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    楼层需求：{{customer.needLayerName}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    电量需求：{{customer.needVoltage}} KVA
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    最晚入住：{{Utils.dateFormat(customer.enterTime,'yyyy-MM-dd')}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    消防需求：{{customer.fireDeviceTypeName}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    其他要求：{{customer.otherRemark}}
                </template>
            </van-cell>
            <van-cell>
                <template #default>
                    更多备注：{{customer.remark}}
                </template>
            </van-cell>
        </van-cell-group>

    </div>
</template>

<script>
    import {Cell,CellGroup} from 'vant';
    import {Utils} from "../base/CiiUtils";

    export default {
        name: "CustomerInfo",
        components:{
            [Cell.name]:Cell,
            [CellGroup.name]:CellGroup
        },
        props:['customer'],
        data:function(){
            return {
                Utils: Utils
            }
        },

    }
</script>

<style scoped>
    .red-color{
        color: #ff0000;
    }
    .cell-group-title{
        font-size: 14px;
        font-weight: bold;
        color: #000;
        text-align: left;
    }
</style>