<template>
  <div>
 <div class="messageBox p-l-20 p-r-20">
      <div v-for="(item,index) in messages" :key="index" class="itemMessageBox">
        <div class="sendTime tc fz34">{{item.updatedAt|dateFormat('YYYY-MM-DD  hh:mm:ss')}}</div>
        <div class="sendMsgBox"
        :class="{'mineMsg':item.from === curUserChatId }">
          <div class="itemMsg fz36">{{item._lctext}}</div>
        </div>
      </div>
       <div id="messageViewBottom" ref="messageViewBottom"></div>
    </div>
    <div class="sendMsgBtnBox bg-white w-100 p-l-10 p-r-10">
      <div class="leftInput">
       <textarea class="w-100"
                 v-model="draft"
                 placeholder="说点什么……"
                 @keyup.enter="sendMsg(draft)"
       ></textarea>
      </div>
      <div class="sendBtn text-middle fz36" @click="sendMsg(draft)">
        <img src="/static/chat/chatSend.png" style="width: 50%;">
      </div>
    </div>
      </div>
</template>
<script type="text/babel">
/* eslint-disable */
import { Realtime, TextMessage } from "leancloud-realtime";
import { ImageMessage } from "leancloud-realtime-plugin-typed-messages";
import AV, { Object } from "leancloud-storage";
import { TypingStatusMessage } from "./js/typing-indicator";
import StickerMessage from "./js/sticker-message";
import userService from "./js/user.service";
import FilterMixins from "@/assets/js/filters-mixins";
import FnMixins from "@/assets/js/fn-mixins";
import _ from "lodash";
import { setTimeout } from "timers";
export default {
  components: {},
  data() {
    return {
      curUserChatId: "", // 当前用户的chatId
      curChatWidthUserId: this.$route.query.id, // 和谁聊天的chatId
      draft: "",
      messages: [],
      LeanRTImClient: null,
      pageYOffset: 0,
      messageIterator: null
    };
  },
  computed: {},
  methods: {
       sendMsg(draft) {
      const that = this;
      console.log("send this.curConversation", this.curConversation);
      this.curConversation
        .send(new TextMessage(draft))
        .then(function(message, conversation) {
          console.log("用户  & 环球理事 ", "发送成功！", message, conversation);
          that.messages.push(message);
          that.draft = "";
          that.scrollToBottom();
        })
        .catch(console.error);
        /*
         realtime
          .createIMClient("环球理事")
          .then(function(tom) {
            console.log("tom imclinet", tom);
            return tom.createConversation({
              members: [`${that.curUserChatId}`],
              name: `环球理事 => ${that.curUserChatId}`
            });
          })
          .then(function(conversation) {
            console.log("conversation", conversation);
            return conversation.send(new TextMessage(draft));
          })
          .then(function(message, conversation) {
            console.log("环球理事 & 用户", "发送成功！", message);
            that.msgToConversation(message);
            that.draft = "";
            that.scrollToBottom();
          })
          .catch(console.error);
        */
    },
    acceptMsg() {
      console.log("acceptMsg");
      const that = this;
      this.LeanRTImClient.then(function(jerry) {
        console.log("用户", jerry);
        jerry.on("message", function(message, conversation) {
          that.messageIterator = conversation.createMessagesIterator({
            limit: 10
          });
          that.messageIterator
            .next()
            .then(function(result) {
              console.log("cur-result", result);
              that.messages = result.value;
            })
            .catch(console.error.bind(console));
          // 第一次调用 next 方法，获得前 10 条消息，还有更多消息，done 为 false
          that.loadMoreChatMsg();

          console.log("Message received: " + message, conversation);
          console.log("received", message.text);
          that.scrollToBottom();
        });
      }).catch(console.error);
    },
    initChatMsg() {
      const that = this;
      that.messageIterator
        .next()
        .then(function(result) {
          that.messages = result.value.concat(that.messages);
          console.log("init data", result.value);
          setTimeout(() => {
            that.scrollToBottom();
          }, 100);
        })
        .catch(console.error.bind(console));
    },
    loadMoreChatMsg() {
      const that = this;
      that.messageIterator
        .next()
        .then(function(result) {
          that.messages = result.value.concat(that.messages);
          console.log("laqu data", result.value);
        })
        .catch(console.error.bind(console));
    },
    getNormalConvs(imClient) {
      return imClient
        .getQuery()
        .withLastMessagesRefreshed()
        .containsMembers([imClient.id])
        .find();
    },
    getConversations(imClient) {
      const that = this;
      return Promise.all([this.getNormalConvs(imClient)]).then(datas => {
        console.log("_createdAt", _.orderBy(datas[0], ["_createdAt"], ["asc"]));
        console.log(datas[0]);
        if (datas[0].length === 0) {
          that.curConversation = this.LeanRTImClient.then(function(imClient) {
            console.log("创建会话", imClient);
            return imClient.createConversation({
              members: ["环球理事"],
              name: `${that.curUserChatId} => 环球理事 `
            });
          });
        } else {
          that.curConversation = datas[0][0];
          console.log("promise that.curConversation", that.curConversation);
        }
        that.messageIterator = that.curConversation.createMessagesIterator({
          limit: 10
        });
        that.initChatMsg(); // 拉去初始历史数据
      });
    },
    scrollToBottom() {
      const elBottom = document.getElementById("messageViewBottom");
      const pageYOffset = elBottom.offsetTop;
      setTimeout(() => {
        window.scroll(0, pageYOffset);
      }, 0);
    }
  },
  mounted() {
    window.onscroll = () => {
      this.pageYOffset = window.pageYOffset;
      if (this.pageYOffset < 30) {
        /* 加载更多数据 */
        this.loadMoreChatMsg(); // 上拉加载历史数据
      }
    };
  },
  created() {
    this.setHtmlTitle(this.curChatWidthUserId);
    const curBrowser = this._curBrowser();
    const curUserInfo = JSON.parse(window.localStorage.getItem("curUserInfo"));
    if (curUserInfo) {
      this.curUserChatId = curUserInfo.binding_chat_id;
    } else {
      if (curBrowser === "wechat") {
        this._setUserStatus;
      }
    }
    this.LeanRTImClient = realtime.createIMClient(this.curUserChatId);
    this.LeanRTImClient.then(function(imClient) {
        // 拉取历史会话
      that.getConversations(imClient);
    });
    this.acceptMsg();
    console.log("from", this.curUserChatId, "to", this.curChatWidthUserId);
  },
  mixins: [FilterMixins, FnMixins]
};
</script>
<style lang='scss' scoped>
h1,
h2 {
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
  margin-bottom: 1.5rem;
  .itemMessageBox {
    margin: 0.7rem 0;
    .sendTime {
    }
    .sendMsgBox {
      display: flex;
      justify-content: flex-start;
      .itemMsg {
        position: relative;
        max-width: 5rem;
        min-height: 37px;
        padding: 0.1rem;
        margin: 0.06rem 0 0;
        background: #f6f6f6;
        word-wrap: break-word;
        &:after {
          content: "";
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
    .mineMsg {
      display: flex;
      justify-content: flex-end;
      .itemMsg {
        background: #2c97e8;
        color: white;
        &:after {
          border-bottom-color: #f6f6f6;
          top: auto;
          left: auto;
          bottom: -8px;
          right: 0;
          border: 8px solid transparent;
          border-width: 8px 0 0 8px;
          border-top-color: #2c97e8;
        }
      }
    }
  }
}

.sendMsgBtnBox {
  position: fixed;
  bottom: 0px;
  height: 1.2rem;
  display: flex;
  .leftInput {
    flex: 1;
    textarea {
      font-size: 0.32rem;
      max-height: 1.6rem;
      min-height: 0.56rem;
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
      padding: 0.04rem;
      border-width: 0 0 0.01rem 0;
      line-height: 0.52rem;
      -ms-flex-preferred-size: 0.52rem;
      border-radius: 0;
      border-style: solid;
      width: 100%;
      box-sizing: border-box;
      float: left;
    }
  }
  .sendBtn {
    width: 1.5rem;
  }
}
</style>

