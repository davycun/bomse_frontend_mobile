<template>
    <div>
        <van-cell style="margin-top: 10px">
            <template #default>
                楼层ID：{{floor.id}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                地址：{{addr}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                所在层：{{floor.floorNumber}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                房源用途：{{floor.houseUseTypeName}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                楼层总面积：{{floor.totalAcreage}} m²
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                可出租面积：<span class="red-color">{{floor.leaseAcreage}}</span> m²
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                起租面积：<span class="red-color">{{floor.leaseAcreageMin}}</span> m²
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                单价：<span class="red-color">{{floor.price}}</span> {{floor.priceUnitName}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                层高：{{floor.floorHeight}} 米
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                承重：{{floor.bearing}} 吨/平米
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                地坪：{{floor.floorBoardTypeName}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                消防设施：{{floor.fireDeviceTypeName}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                租赁类型：{{floor.leaseTypeName}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                入住时间：{{floor.enterTimeDesc}}
            </template>
        </van-cell>
        <van-cell>
            <template #default>
                适合行业：{{floor.fitIndustryName}}
            </template>
        </van-cell>
    </div>
</template>

<script>
    import {Cell,Tag} from 'vant';

    export default {
        name: "FloorInfo",
        components: {
            [Cell.name]: Cell,
            [Tag.name]:Tag
        },
        props: {
            floor: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data: function () {
            return {}
        },
        computed: {
            addr: function () {
                return this.floor.park ? this.floor.park.detailAddress : ""
            }
        },
        methods: {}
    }
</script>

<style scoped>
    .red-color {
        color: #ff0000;
    }
</style>