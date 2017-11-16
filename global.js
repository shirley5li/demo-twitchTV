var channels = ["freecodecamp", "test_channel", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
// 获取频道信息
function getChannelInfo() {
  channels.forEach(function(channel) {
    // 获取提供jsonp服务的url地址
    function makeURL(type, name) {
      return 'https://wind-bow.gomix.me/twitch-api/' + type + '/' + name + '?callback=?';
    };
    // Get Stream by User，通过用户名ID获取视频流的信息，查询该频道是否在线，若在线获取直播的游戏名称
    $.getJSON(makeURL("streams", channel), function(data) {
      var game,
          status;
      if (data.stream === null) {
        game = "Offline";
        status = "offline";
      } else if (data.stream === undefined) {
        game = "Account Closed";
        status = "offline";
      } else {
        game = data.stream.game;
        status = "online";
      };
      //Get Channel by ID， 通过用户名ID 获取该频道更详细的账号信息，例如logo,昵称，followers等
      $.getJSON(makeURL("channels", channel), function(data) {
        // 获取logo头像
        var logo = data.logo !== null ? data.logo : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F",
        // 获取频道显示的昵称
          name = data.display_name !== null ? data.display_name : channel,
          // 获取频道的状态信息，即对当前的展示内容的描述，若无则为空
          description = status === "online" ? ': ' + data.status : "";
          // logo, name, description的html结构，追加到文档中
          html = '<div class="row ' + 
          status + '"><div class="col-xs-2 col-sm-1" id="icon"><img src="' + 
          logo + '" class="logo"></div><div class="col-xs-10 col-sm-3" id="name"><a href="' + 
          data.url + '" target="_blank">' + 
          name + '</a></div><div class="col-xs-10 col-sm-8" id="streaming">'+ 
          game + '<span class="hidden-xs">' + 
          description + '</span></div></div>';
          // 在线的频道显示在前面
        status === "online" ? $("#display").prepend(html) : $("#display").append(html);
      });
    });
  });
};

$(document).ready(function() {
  getChannelInfo();
  $(".selector").click(function() {
    // 给当前选择的在线状态添加active类
    $(".selector").removeClass("active");
    $(this).addClass("active");
    var status = $(this).attr('id');
    if (status === "all") {
      // .hidden是bootstrap辅助类里面的，用于强制元素隐藏
      $(".online, .offline").removeClass("hidden");
    } else if (status === "online") {
      $(".online").removeClass("hidden");
      $(".offline").addClass("hidden");
    } else {
      $(".offline").removeClass("hidden");
      $(".online").addClass("hidden");
    }
  })
});