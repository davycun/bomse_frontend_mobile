<template>
  <div style="margin-top: 200px;">
    <van-form @submit="onSubmit">
      <van-field v-model="userPhone"
                 name="userPhone"
                 label="手机号"
                 placeholder="用户名"/>

      <van-field v-model="secure"
                 name="secure"
                 label="密码"
                 placeholder="密码"/>

      <div style="margin: 15px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>

</template>

<script>

import {Form, Field, Button} from 'vant';
import {request} from "../base/CiiUtils";
import {currentContext} from "../base/CurrentContext";
import {dictionaryStorage} from "../base/DictionaryStorage";

export default {
  name: "Login",
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button
  },
  data: function () {
    return {
      userPhone: '',
      secure: ''
    }
  },
  methods: {
    onSubmit: function (values) {
      request({
        conf: {
          url: "user/login",
          data: {
            entity: values,
            tokenType:"mobile"
          }
        },
        success: () => {
          currentContext.reload();
          dictionaryStorage.init();
          this.$router.replace("/");
        }
      })
    }
  }
}
</script>

<style scoped>

</style>