<template>
    <div>
        <div class='header'>
            <div class='header-left'>
                <van-image round width="90" height="90" style="margin-top: 30px" :src="avatar"></van-image>
            </div>
            <div class='header-right' >
                <div class="header-right-top">
                    <div class='login-name'>{{userName}}</div>
                    <div class="login-setting">
                        <van-icon name="setting-o" style="color:#ffffff" size="30px" />
                    </div>
                </div>
                <div class="header-right-bottom">
                    <van-icon name="phone-o">{{userPhone}}</van-icon>
                    <van-icon style="margin-left: 20px" name="location-o" color="#ffffff">{{ownerDeptName}}</van-icon>
                </div>
            </div>
        </div>

        <van-cell icon="chart-trending-o" style="text-align: left;" title="我的报表" is-link></van-cell>

        <van-button style="margin-top: 50px;" type="primary" block @click="logOut">退出</van-button>

    </div>
</template>

<script>

    import {Image, Row, Col,Divider,Cell,Button,Icon} from 'vant';

    import {currentContext} from "../base/CurrentContext";
    import {Constants} from "../base/Constants";
    import {request} from "../base/CiiUtils";

    export default {
        name: "Mine",
        components: {
            [Image.name]: Image,
            [Row.name]: Row,
            [Col.name]: Col,
            [Divider.name]:Divider,
            [Cell.name]:Cell,
            [Button.name]:Button,
            [Icon.name]:Icon
        },
        data() {
            return {
                userPhone:currentContext.getUserPhone(),
                userName: currentContext.getUserName(),
                ownerDeptName: currentContext.getOwnerDeptName(),
                avatar: currentContext.getAvatar()?Constants.fileReadUrl + currentContext.getAvatar():"logo.png"
            }
        },

        // beforeRouteEnter: function (to, from, next) {
        //     next((vm) => {
        //         if (!vm.userPhone) {
        //             vm.userPhone = currentContext.getUserPhone();
        //             vm.userName = currentContext.getUserName();
        //             vm.ownerDeptName = currentContext.getOwnerDeptName();
        //             vm.avatar = currentContext.getAvatar()?Constants.fileReadUrl + currentContext.getAvatar():"/logo.png"
        //         }
        //     });
        // },
        //
        updated:function(){
            currentContext.getUserInfoAsync((user)=>{
                this.userPhone = user.userPhone;
                this.userName = user.userName;
                this.ownerDeptName = user.ownerDeptName;
                this.avatar = user.avatar?Constants.fileReadUrl + user.avatar:"logo.png"
            });
        },

        methods: {
            logOut(){

                request({
                    conf:{
                        url:'user/logout',
                    },
                    success:()=>{
                        this.$router.replace('login');
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .header {
        height: 150px;
        width: 100%;
        background-color: #4a89dc;
    }

    .header .header-left {
        width: 30%;
        height: 150px;
        text-align: center;
        float: left;
    }

    .header-right{
        width: 70%;
        height: 150px;
        float: left;
        color: #fff;
    }
    .header-right-top,.header-right-bottom{
        height:50%;
        width:100%;
        text-align: left;
    }
    .header-right-bottom{
        padding-top: 10px;
    }

    .header-right .login-name {
        font-size: 14px;
        margin-top: 50px;
        float: left;
    }
    .header-right .login-setting{
        font-size: 14px;
        margin-right: 20px;
        margin-top:20px;
        width:20%;
        float: right;
    }
</style>