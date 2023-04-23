Vue.component('c-crateshot', {
  template: `
  <el-drawer class="comment-drawer" title="我是标题" :visible.sync="drawer" :with-header="false" size="600px">
      <div style="text-align:center;" v-show="!loading">
        <img class="screen-shot-img" crossorigin="anonymous" :src="createdShot" :style="{height: imgHeight}" />
        <el-button style="width:200px;margin-top:10px" type="primary" @click="downLoad">保存</el-button>
      </div>
      <section class="phone" id="poster-target">
          <main class="img-con" :style="{'background-image': 'url('+shotData.files[0]+')'}">
          </main>
          <main class="comment-popup">
              <header class="comment-header">

                  <i class="comment-popup__close el-icon-close"></i>

                  <div class="location">
                      <div class="location-icon">
                          <img class="location-img" src="./img/location.svg" alt="">
                      </div>
                      <div class="address-info">
                          <div class="address-text">
                              {{shotData.areaCH}}
                          </div>
                          <div class="number-of-seen">
                          {{shotData.numberOfSeen}}{{shotData.numberOfSeenUnit}}人看过
                          </div>
                      </div>
                  </div>
                  <div class="comment-num">
                      {{shotData.commentNum}}条评论
                  </div>

              </header>

              <content class="comment-group">
                  <div class="comment-group-con">
                      <div class="comment-item" v-for="(item, key) in shotData.commentList" :key="key">
                          <img :src="item.files[0]" class="head-img" draggable="false" />
                          <div class="comment-item-rig">
                              <div class="nickname">
                                  <span class="name">{{item.name|overflowhidden(6)}}</span>
                                  <template v-if="item.isAuthor">
                                    <span class="author">作者</span>
                                  </template>
                              </div>
                              <div class="comment-content">
                              {{item.content}}
                              </div>
                              <div class="comment-function">
                                  <div class="comment-f-lef">
                                      <span class="time-loc">{{item.time}}·{{item.areaCH}}</span>
                                      <span class="reply">回复</span>
                                  </div>
                                  <div class="comment-f-rig">
                                      <span class="f-rig-item">
                                          <img v-if="item.isLikes" class="f-rig-icon" src="./img/dings.svg" />
                                          <img v-else class="f-rig-icon" src="./img/ding.svg" />
                                          <span class="f-rig-t">{{(Number(item.likesNum)||'')|transformUnit}}</span>
                                      </span>
                                      <span class="f-rig-item">
                                          <img class="f-rig-icon" src="./img/cai.svg" />
                                          <span class="f-rig-t">{{(Number(item.noLikesNum)||'')|transformUnit}}</span>
                                      </span>
                                  </div>
                              </div>

                              <div class="comment-item-child">
                                <div class="comment-item" v-for="(iitem, key) in item.child" :key="key">
                                    <img :src="iitem.files[0]" class="head-img" draggable="false" />
                                    <div class="comment-item-rig">
                                        <div class="nickname">
                                            <span class="name">{{iitem.name|overflowhidden(6)}}</span>
                                            <template v-if="iitem.isAuthor">
                                              <span class="author">作者</span>
                                            </template>
                                            <template v-if="iitem.replyNickname && !iitem.isAuthor">
                                              <i class="el-icon-caret-right"></i>
                                              <span class="name">{{iitem.replyNickname|overflowhidden(6)}}</span>
                                            </template>
                                        </div>
                                        <div class="comment-content">
                                          {{iitem.content}}
                                        </div>
                                        <div class="comment-function">
                                            <div class="comment-f-lef">
                                                <span class="time-loc">{{iitem.time}}·{{iitem.areaCH}}</span>
                                                <span class="reply">回复</span>
                                            </div>
                                            <div class="comment-f-rig">
                                                <span class="f-rig-item">
                                                
                                                <img v-if="iitem.isLikes" class="f-rig-icon" src="./img/dings.svg" />
                                                <img v-else class="f-rig-icon" src="./img/ding.svg" />
                                                    <span class="f-rig-t">{{(Number(iitem.likesNum)||'')|transformUnit}}</span>
                                                </span>
                                                <span class="f-rig-item">
                                                    <img class="f-rig-icon" src="./img/cai.svg" />
                                                    <span class="f-rig-t">{{(Number(iitem.noLikesNum)||'')|transformUnit}}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                              </div>

                          </div>
                      </div>
                  </div>
              </content>

              <footer class="comment-input-con">
                  <div class="comment-input">
                      <input class="text-input" type="text" placeholder="善于结善缘，恶言伤人心" />
                      <div class="icon-group">
                          <img class="comment-input-icon" src="./img/at.svg" draggable="false" />
                          <img class="comment-input-icon" src="./img/smile.svg" draggable="false" />
                          <img class="comment-input-icon" src="./img/add.svg" draggable="false" />
                      </div>
                  </div>
              </footer>
          </main>
      </section>
  </el-drawer>
    `,
  data() {
    return {
      drawer: false,
      createdShot: '',
      imgHeight: '',
      loading: false,
      shotData: {
        files: [],
        areaCH: '',
        numberOfSeen: '',
        numberOfSeenUnit: '',
        commentNum: '', // 评论数
        releaseTime: '', // 发布时间
        commentList: [{
          files: [],
          areaCH: '',
          name: '',
          time: '',
          content: '',
          LikesNum: '',
          isAuthor: false,
          isLikes: false,
          child: [{
            files: [],
            areaCH: '',
            name: '',
            time: '',
            content: '',
            LikesNum: '',
            isAuthor: false,
            isLikes: false
          }]
        }],
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.imgHeight = (window.innerHeight - 100) + 'px'
    })
  },
  filters: {
    transformUnit(number) {
      if (!number && number != 0) return number;
      let str_num;
      if (number >= 1E4 && number < 1E8) {
        str_num = Math.floor(number / 1E4 * 100) / 100
        return str_num + '万'
      }
      if (number >= 1E8 && number < 1E10) {
        str_num = Math.floor(number / 1E8 * 100) / 100
        return str_num + '亿'
      } else if (number >= 1E10 && number < 1E11) {
        str_num = Math.floor(number / 1E10 * 100) / 100
        return str_num + '百亿'
      } else if (number >= 1E11 && number < 1E12) {
        str_num = Math.floor(number / 1E11 * 100) / 100
        return str_num + '千亿'
      } else if (number >= 1E12) {
        str_num = Math.floor(number / 1E12 * 100) / 100
        return str_num + '万亿'
      } else { //一千以下
        return number
      }
    },
    overflowhidden(text, len) {
      text = String(text)
      if (text.length > len) {
        return text.slice(0, len)+ '…'
      } else {
        return text;
      }
    }
  },
  methods: {
    downLoad() {
      let Url = this.createdShot;
      var blob = new Blob([''], {
        type: 'application/octet-stream'
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = Url;
      a.download = '截图' || Url.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];
      var e = document.createEvent('MouseEvents');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      URL.revokeObjectURL(url);
    },
    generateShot(data) {
      this.loading = true;
      this.shotData = data;
      this.drawer = true
      setTimeout(() => {
        var posterTargetWidth = document.getElementById('poster-target').offsetWidth;
        var posterTargetHeight = document.getElementById('poster-target').offsetHeight;
        var canvas = document.createElement("canvas")
        canvas.setAttribute('id', 'thecanvas');
        canvas.width = posterTargetWidth * 1;
        canvas.height = posterTargetHeight * 1;
        canvas.style.width = posterTargetWidth + "px";
        canvas.style.height = posterTargetHeight + "px";
        var context = canvas.getContext("2d");
        var html2canvasParam = {
          width: posterTargetWidth,
          height: posterTargetHeight,
          scale: 1,
          canvas: canvas
        }
        html2canvas(document.getElementById('poster-target'), html2canvasParam).then((canvas) => {
          this.createdShot = canvas.toDataURL('image/png', 1);
          canvas = null;
          this.loading = false;
        });
      }, 200)
    }
  }
})