<template>
  <div class="hello">
    <div @click="acceptMsg">接收信息</div>
    {{message}}
    <div class="messageBox p-l-20 p-r-20">
      <div v-for="item in messages" class="itemMessageBox">
        <div class="sendTime tc">{{item.updatedAt}}</div>
        <div class="sendMsgBox">
          <div class="itemMsg">{{item.summary}}</div>
        </div>
      </div>
    </div>
    <div class="sendMsgBtnBox bg-white w-100 p-l-10 p-r-10">
      <div class="leftInput">
       <textarea class="w-100"
                 v-model="draft"
                 placeholder="说点什么……"
                 @keyup.enter="sendMsg(draft)"
       ></textarea>
      </div>
      <div class="sendBtn" @click="sendMsg(draft)">send</div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import userService from './user/user.service'
  import {Realtime, TextMessage} from 'leancloud-realtime';
  import {ImageMessage} from 'leancloud-realtime-plugin-typed-messages';
  import AV from 'leancloud-storage';
  import {TypingStatusMessage} from './typing-indicator';
  import {smileys, stickers} from './configs';
  import StickerMessage from './sticker-message';

  export default {
    name: 'hello',
    data() {
      return {
        message: '',
        draft: '',
        messages: [],
        IMClient: null,
        userName: ''
      }
    },
    methods: {
      sendText() {
      },
      getCurrentConversation() {
      },
      acceptMsg() {
        console.log('acceptMsg')
        const that = this
        if (this.userName === 'c8d8e6b0ca8a240531a5b7fe86b92a292e0a95870c5a8916c291d5292c9f26b2') {
          realtime.createIMClient('c8d8e6b0ca8a240531a5b7fe86b92a292e0a95870c5a8916c291d5292c9f26b2').then(function (jerry) {
            console.log('jerry', jerry)
            jerry.on('message', function (message, conversation) {
              console.log('Message received: ' + message, conversation);
              console.log(message.text)
              this.message = message.text
              that.messages.push(message)
            })
          }).catch(console.error);
        }
      },
      sendMsg(draft) {
        console.log(draft)
        const that = this
        realtime.createIMClient('ce893b91f7d7bfdbe86bccfbdcd6bf084638e013f89790df9e62ed21a2e98e5b').then(function (tom) {
          // 创建与Jerry之间的对话
          return tom.createConversation({
            members: ['c8d8e6b0ca8a240531a5b7fe86b92a292e0a95870c5a8916c291d5292c9f26b2'],
            name: 'Tom & Jerry',
          });
        }).then(function (conversation) {
          return conversation.send(new TextMessage(draft))
        }).then(function (message) {
          console.log('Tom & Jerry', '发送成功！', message)
          that.messages.push(message)
          that.draft = ''
        }).catch(console.error);
      }
    },
    created() {
      this.userName = this.$route.params.user
      this.acceptMsg()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  $arrow-size: 8px;
  $background: #f6f6f6;

  .messageBox {
    .itemMessageBox {
      .sendTime {
      }
      .sendMsgBox {
        .itemMsg {
          position: relative;
          max-width: 240px;
          padding: 10px;
          margin: 6px 0 0;
          background: #f6f6f6;
          word-wrap: break-word;
          &:after {
            content: '';
            display: block;
            position: absolute;
            top: -$arrow-size;
            left: 0;
            border: $arrow-size solid transparent;
            border-width: 0 $arrow-size $arrow-size 0;
            border-bottom-color: $background;
          }
        }
      }
    }
  }

  .sendMsgBtnBox {
    position: fixed;
    bottom: 0px;
    height: 60px;
    display: flex;
    .leftInput {
      flex: 1;
      textarea {
        max-height: 80px;
        min-height: 26px;
        -ms-flex-preferred-size: auto;
        resize: none;
        overflow-y: scroll;
        color: rgba(0, 0, 0, 0.87);
        border-color: rgba(0, 0, 0, 0.12);
        -ms-flex-order: 2;
        order: 2;
        display: block;
        margin-top: 0;
        background: none;
        padding-top: 2px;
        padding-bottom: 1px;
        padding-left: 2px;
        padding-right: 2px;
        border-width: 0 0 1px 0;
        line-height: 26px;
        -ms-flex-preferred-size: 26px;
        border-radius: 0;
        border-style: solid;
        width: 100%;
        box-sizing: border-box;
        float: left;
      }
    }
    .sendBtn {
      width: 60px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

</style>
