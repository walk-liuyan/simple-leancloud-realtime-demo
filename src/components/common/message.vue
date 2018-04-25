<template>
  <div>
    <div v-if="displayTime" class="time">{{message.timestamp}}
    </div>
    <div class="message" v-if="message.id" :class="{mine: isMine, mentioned: message.mentioned}" layout="column">
      <div class="user" v-if="displayClientId" @click="onNameClick()">{{message.from}}</div>
      <div v-if="message.type === RecalledMessage.TYPE" class="action-message">
        该消息已撤回
      </div>
      <div v-if="message.type !== RecalledMessage.TYPE">
        <div>
          <div class="operations">
            <button class="md-icon-button"
                       v-if="isMine"
                       aria-label="Recall"
                       v-click="onRecallClick()">
              <i>delete</i>
            </button>
          </div>
          <div>
            <span class="tips" title="{{groupReadClients}}" v-if="groupReadClients">{{ groupReadHint }}</span>
            <span class="tips" v-if="isLastDelivered ">已送达</span>
            <span class="tips" v-if="isLastRead">已读</span>
            <span v-if="message.status === MessageStatus.SENDING">reply</span>
            <span v-if="message.status === MessageStatus.FAILED">error</span>
          </div>
        </div>
        <div class="image" v-if="message.type === ImageMessage.TYPE">
          <a v-href="message.getFile().url()" target="_blank">
            <img :src="message.getFile().thumbnailURL(260, 360)"/>
          </a>
        </div>
        <div class="sticker" v-if="message.type === StickerMessage.TYPE">
          <img v-src="stickers[message.group][message.sticker]" :alt="message.sticker" width="100"/>
        </div>
        <div class="content" v-if="message.text">{{message.text}}</div>
      </div>
    </div>

    <div v-if="!message.id" >
      <div class="action-message">{{message.text}}</div>
    </div>
  </div>
</template>
<script type="text/babel">

  export default {
    components: {},
    data() {
      return {}
    },
    computed: {},
    methods: {},
    created() {
    }
  }
</script>
<style lang='scss' scoped>
</style>
