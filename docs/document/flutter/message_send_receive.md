# 发送和接收消息

<Toc />

登录 Chat app 后，用户可以在单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情消息。
- 附件消息，包含图片、语音、视频及文件消息。
- 位置消息。
- CMD 消息。
- 自定义消息。

本文介绍如何使用即时通讯 IM SDK 实现发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM Flutter SDK 通过 `EMChatManager` 和 `EMMessage` 类实现消息的发送、接收与撤回。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应 Create 方法创建文本、文件、附件等类型的消息；
2. 发送方再调用 `SendMessage` 发送消息；
3. 接收方通过 `EMChatEventHandler` 中的方法监听消息回调事件。在收到 `onMessagesReceived` 后，即表示成功接收到消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 发送消息

1. 首先，利用 `EMMessage` 类构造一个消息。

示例代码：

```dart
// 设置发送的消息类型。消息类型共支持 8 种。具体详见 `MessageType` 枚举类型。
MessageType messageType = MessageType.TXT;
// 设置消息接收对象 ID。
String targetId = "tom";
// 设置消息接收对象类型。消息接收对象类型包括单人、群组和聊天室。具体详见 `ChatType` 枚举类型。
ChatType chatType = ChatType.Chat;
// 构造消息。构造不同类型的消息，需要不同的参数。
// 构造文本消息
EMMessage txtMsg = EMMessage.createTxtSendMessage(
  targetId: targetId,
  content: "This is text message",
);

// 构建图片消息，需要图片的本地地址，长宽，和界面用来显示的名称。
String imgPath = "/data/.../image.jpg";
double imgWidth = 100;
double imgHeight = 100;
String imgName = "image.jpg";
int imgSize = 3000;
EMMessage imgMessage = EMMessage.createImageSendMessage(
  targetId: targetId,
  filePath: imgPath,
  width: imgWidth,
  height: imgHeight,
  displayName: imgName,
  fileSize: imgSize,
);

// 构建命令消息。根据命令消息可以执行具体的命令，命令的内容格式自定义的。
String action = "writing";
EMMessage cmdMsg = EMMessage.createCmdSendMessage(
  targetId: targetId,
  action: action,
);

// 自定义消息。消息内容由两部分组成：消息事件和扩展字段。
// 扩展字段用户可以自行实现和使用。
String event = "gift";
Map<String, String> params = {"key": "value"};
EMMessage customMsg = EMMessage.createCustomSendMessage(
  targetId: targetId,
  event: event,
  params: params,
);

// 构建文件消息。文件消息主要需要本地文件地址和文件在页面显示的名称。
String filePath = "data/.../foo.zip";
String fileName = "foo.zip";
int fileSize = 6000;
EMMessage fileMsg = EMMessage.createFileSendMessage(
  targetId: targetId,
  filePath: filePath,
  displayName: fileName,
  fileSize: fileSize,
);

// 构建位置消息。位置消息可以传递经纬度和地名信息。
// 当你需要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。
double latitude = 114.78;
double longitude = 39.89;
String address = "darwin";
EMMessage.createLocationSendMessage(
  targetId: targetId,
  latitude: latitude,
  longitude: longitude,
  address: address,
);

// 构建视频消息。视频消息主要由视频和视频缩略图组成，视频消息支持输入视频的首帧作为缩略图。视频参数包括视频本地地址、视频长宽值，显示名称，播放时间长度。
// 视频的缩略图需要缩略图的本地地址。
// 视频消息相当于包含 2 个附件的消息。
String videoPath = "data/.../foo.mp4";
double videoWidth = 100;
double videoHeight = 100;
String videoName = "foo.mp4";
int videoDuration = 5;
int videoSize = 4000;
EMMessage.createVideoSendMessage(
  targetId: targetId,
  filePath: videoPath,
  width: videoWidth,
  height: videoHeight,
  duration: videoDuration,
  fileSize: videoSize,
  displayName: videoName,
);

// 构建语音消息。该消息需要本地语音文件地址、显示名称和播放时长。
String voicePath = "data/.../foo.wav";
String voiceName = "foo.wav";
int voiceDuration = 5;
int voiceSize = 1000;

EMMessage.createVoiceSendMessage(
  targetId: targetId,
  filePath: voicePath,
  duration: voiceDuration,
  fileSize: voiceSize,
  displayName: voiceName,
);

EMMessage message =
    EMMessage.createCmdSendMessage(targetId: targetId, action: "action");
```

2. 通过 `EMChatManager` 将该消息发出。

```dart
EMClient.getInstance.chatManager.sendMessage(message).then((value) {
});
```

你可以设置发送消息结果回调，用于接收消息发送进度或者发送结果，如发送成功或失败。为此，需实现 `MessageStatusCallBack` 接口。

对于命令消息可能并不需要结果，可以不用赋值。

```dart
// 实现回调对象
message.setMessageStatusCallBack(
  MessageStatusCallBack(
    onSuccess: () {
      // 收到成功回调之后，可以对发送的消息进行更新处理，或者其他操作。
    },
    onError: (error) {
      // 收到回调之后，可以将发送的消息状态进行更新，或者进行其他操作。
    },
    onProgress: (progress) {
      // 对于附件类型的消息，如图片，语音，文件，视频类型，上传或下载文件时会收到相应的进度值，表示附件的上传或者下载进度。
    },
  ),
);

// 消息发送结果会通过回调对象返回，该返回结果仅表示该方法的调用结果，与实际消息发送状态无关。
EMClient.getInstance.chatManager.sendMessage(message).then((value) {
  // 消息发送动作完成。
});
```

### 接收消息

你可以添加 `EMChatEventHandler` 监听器接收消息。

该 `EMChatEventHandler` 可以多次添加。请记得在不需要的时候移除该监听器，如在 `dispose` 的卸载组件的时候。

在新消息到来时，你会收到 `onMessagesReceived` 的事件，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

```dart
// 继承并实现 EMChatEventHandler
class _ChatMessagesPageState extends State<ChatMessagesPage> {
  @override
  void initState() {
    super.initState();
    // 添加监听器
    EMClient.getInstance.chatManager.addEventHandler(
      "UNIQUE_HANDLER_ID",
      EMChatEventHandler(
        onMessagesReceived: (list) => {},
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }

  @override
  void dispose() {
    // 移除监听器
    EMClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
    super.dispose();
  }
}
```

文件消息不会自动下载。图片消息和视频消息默认会生成缩略图，接收到图片消息和视频消息，默认会自动下载缩略图。语音消息接收到后会自动下载。

若手动下载附件，需进行如下设置：

1. 在初始化 SDK 时将 `isAutoDownloadThumbnail` 设置为 `false`。

```dart
EMOptions options = EMOptions(
  appKey: appKey,
  isAutoDownloadThumbnail: false,
);
```

2. 设置下载监听器。

```dart
message.setMessageStatusCallBack(
  MessageStatusCallBack(
    onProgress: (progress) {},
    onSuccess: () {},
    onError: (e) {},
  ),
);
```

3. 下载缩略图。

```dart
EMClient.getInstance.chatManager.downloadThumbnail(message);
```

下载完成后，调用相应消息 body 的 `thumbnailLocalPath` 获取缩略图路径。

```dart
// 获取图片消息 body。
EMImageMessageBody imgBody = message.body as EMImageMessageBody;
// 从本地获取图片缩略图路径。
String? thumbnailLocalPath = imgBody.thumbnailLocalPath;
```

4. 下载附件。

```dart
EMClient.getInstance.chatManager.downloadAttachment(message);
```

下载完成后，调用相应消息 body 的 `localPath` 获取附件路径。

示例代码如下：

```dart
// 获取文件消息 body。
EMFileMessageBody fileBody = message.body as EMFileMessageBody;
// 从本地获取文件路径。
String? localPath = fileBody.localPath;
```

### 撤回消息

消息发送后 2 分钟之内，消息的发送方可以撤回该消息。如果需要调整可撤回时限，可以联系商务。

```dart
try {
  await EMClient.getInstance.chatManager.recallMessage(msgId);
} on EMError catch (e) {
}
```

设置消息撤回监听器：

```dart
// 消息被撤回时触发的回调（此回调位于 EMChatEventHandler 中）。
void onMessagesRecalled(List<EMMessage> messages) {}
```