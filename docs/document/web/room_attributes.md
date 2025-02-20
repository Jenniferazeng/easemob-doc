# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。

本文介绍如何管理聊天室属性信息。

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中实现聊天室基本属性和自定义属性的管理功能：

- 获取和更新聊天室详情，包括聊天室名称、描述和最大成员数等；
- 获取和更新聊天室公告；
- 获取聊天室自定义属性；
- 更新或强制更新单个或多个聊天室自定义属性；
- 删除或强制删除单个或多个聊天室自定义属性。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

### 管理聊天室基本属性

#### 获取聊天室名称和描述

对于聊天室名称和描述，你可以调用 [`getChatRoomDetails`](room_manage.html#获取聊天室详情) 获取聊天室详情时查看。

#### 更新聊天室详情

仅聊天室所有者和管理员可以调用 `modifyChatRoom` 更新聊天室名称、描述和最大成员数量。

示例代码如下：

```javascript
let option = {
    chatRoomId: 'chatRoomId',
    chatRoomName: 'chatRoomName', // 聊天室名称。
    description: 'description',   // 聊天室描述。
    maxusers: 200                 // 聊天室最大成员数。
}
conn.modifyChatRoom(option).then(res => console.log(res))
```

#### 获取聊天室公告

聊天室所有成员均可调用 `fetchChatRoomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```javascript
var option = {
    roomId: 'roomId'
};
conn.fetchChatRoomAnnouncement(option).then(res => console.log(res))
```

#### 更新聊天室公告

仅聊天室所有者和管理员可以设置和更新聊天室公告。聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `updateAnnouncement` 事件。

示例代码如下：

```javascript
let option = {
    roomId: 'roomId',
    announcement: 'hello everyone'
};
conn.updateChatRoomAnnouncement(option).then(res => console.log(res))
```

### 管理聊天室自定义属性（key-value）

利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，属性信息变更会实时同步给聊天室成员。

#### 获取聊天室自定义属性

聊天室所有成员均可通过 `getChatRoomAttributes` 获取聊天室自定义属性。

示例代码如下：

   ```javascript
   let option = {
       chatRoomId: "chatRoomId",  // 聊天室 ID
       attributeKeys: ["attributeKey1","attributeKey2","..."] // 聊天室属性 key（可选，若不设置则获取全部自定义属性）
   }
   conn.getChatRoomAttributes(option).then(res => console.log(res))
   ```

#### 设置聊天室自定义属性

##### 设置单个聊天室自定义属性

聊天室成员均可通过调用 `setChatRoomAttribute` 设置和更新单个自定义属性。设置后，其他聊天室成员收到 `onChatroomEvent` 回调，事件为 `updateChatRoomAttributes`。

   ```javascript
   let option = {
       chatRoomId: "chatRoomId",// 聊天室 ID
       attributeKey: "attributeKey";// 聊天室属性 key
       attributeValue: "attributeValue"; // 聊天室属性 value
   	   autoDelete: true; // 成员退出聊天室时是否删除其设置的聊天室自定义属性（可选，默认为 `true`）
       isForced: false  // 强制设置聊天室自定义属性，即是否支持覆盖其他成员设置的属性（可选，默认为 `false`）
   }
   conn.setChatRoomAttribute(option).then(res => console.log(res))
   ```

##### 设置多个聊天室自定义属性

聊天室成员均可以调用 `setChatRoomAttributes` 批量设置自定义属性。设置后，其他聊天室成员收到 `onChatroomEvent` 回调，事件为 `updateChatRoomAttributes`。

   ```javascript
   let option = {
       chatRoomId: "chatRoomId",  // 聊天室 ID
       attributes:{  // 聊天室属性，为 key-value 格式，即 {"key":"value"}
            "attributeKey1":"attributeValue1",
        	"attributeKey2":"attributeValue2",
         	"..."
       },
       autoDelete: true; // 成员退出聊天室时是否删除其设置的聊天室自定义属性（可选，默认为 `true`）
   	   isForced: false  // 强制设置聊天室自定义属性，即是否支持覆盖其他成员设置的属性（可选，默认为 `false`）
   }
   conn.setChatRoomAttributes(option).then(res => console.log(res))
   ```

#### 删除聊天室自定义属性

##### 移除单个聊天室属性

聊天室所有成员可通过调用 `removeChatRoomAttribute` 移除单个自定义属性。移除成功后，其他成员收到 `onChatroomEvent` 回调，事件为 `removeChatRoomAttributes`。

   ```javascript
   let option = {
      chatRoomId: "chatRoomId",  // 聊天室 ID
   	  attributeKey: "attributeKey",  // 聊天室属性 key
   	  isForced: false // 强制设置聊天室自定义属性，即是否支持移除其他成员设置的属性（可选，默认为 `false`）
   }
   conn.removeChatRoomAttribute(option).then(res => console.log(res))
   ```

##### 移除多个聊天室属性

聊天室所有成员可调用 `removeChatRoomAttributes` 批量移除自定义属性。移除成功后，其他成员收到 `onChatroomEvent` 回调，事件为 `removeChatRoomAttributes`。

   ```javascript
   let option = {
    	chatRoomId: "chatRoomId",  // 聊天室 ID
    	attributeKeys: ["attributeKey1","attributeKey2","..."], // 聊天室属性 key
   	    isForced: false // 强制设置聊天室自定义属性，即是否支持移除其他成员设置的属性（可选，默认为 `false`）
   }
   conn.removeChatRoomAttributes(option).then(res => console.log(res))
   ```

### 监听聊天室事件

有关详细信息，请参阅 [聊天室事件](room_manage.html#监听聊天室事件)。