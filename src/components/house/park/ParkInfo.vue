<template>
    <div>
        <van-cell style="margin-top: 10px">
            <template #default>
                园区ID：{{park.id}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                园区地址：{{park.detailAddress}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                证件信息：{{park.certificateTypeName}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                起租面积：<span class="red-color">{{park.leaseAcreageMin}} m²</span>
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                可租面积：<span class="red-color">{{park.leaseAcreage}} m²</span>
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                最低单价：<span class="red-color">{{park.priceMin}} {{park.priceMinUnitName}}</span>
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                土地性质：{{park.landUseTypeName}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                配电量：{{park.voltage}} KVA
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                监控设施：{{park.hasMonitor ? "7 X 24小时全程监控" : "无监控"}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                安保措施：{{park.hasGuard ? "24小时保安门岗" : "无保安"}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                场地面积：{{park.openSpaceAcreage}} m²
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                园区特点：{{park.advantageTags ? park.advantageTags.join("，") : "无"}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                园区创建人：{{park.createName}}（{{park.createDeptName}}）
            </template>
        </van-cell>

    </div>
</template>

<script>
    import {Cell} from 'vant';
    import {Utils} from "../../base/CiiUtils";

    export default {
        name: "ParkInfo",
        components: {
            [Cell.name]: Cell,
        },
        props: {
            park: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data: function () {
            return {
                Utils: Utils
            }
        }
    }
</script>

<style scoped>
    .red-color {
        color: #ff0000;
    }

    .cell-group-title {
        font-size: 14px;
        font-weight: bold;
        color: #000;
        text-align: left;
    }
</style>