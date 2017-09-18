# pandora-js-sdk
浏览器端使用的Pandora 大数据客户端打点SDK

## 安装

将 ``src/pandora.js`` 复制到你的项目中，使用 ``require("..../pandora")`` 引入到你的项目中。

## API 文档

- ```
  QiniuPandora.pushToPandoraPipeline(repo, auth, data)
  ```

|  参数  |    类型    |                    说明                    |
| :--: | :------: | :--------------------------------------: |
| repo |  string  |                 实时数据流名称                  |
| auth |  string  | 鉴权信息，通过 AK、SK、RepoName 构造的 token。也可以用[签名生成工具](https://qiniu.github.io/pandora-docs/#/util/akutil)生成 |
| data | Object[] | 上报数据，以 Key-Value 的形式构造 Object，必须和实时数据流定义的字段格式一致。如果希望一次性上报多个数据，则传入一个包含它们的数组即可 |



