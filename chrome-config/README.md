# version 0.1.7

# 修复了生成地址二维码显示不了的bug
# 完成智能合约的功能，以及添加相应的正则验证表单

# version 0.1.8

# zl
# 修复了快速点击添加用户或编辑用户名时弹窗的bug
# 修复了快速点击交易或生成地址的bug

# ch
# 修复了以太币的gas更新
# 修复to self的bug
# 修复了比特币的max获取错误的问题


# version 0.1.9

# zl
# 添加了发送界面的选择账户的分组
# 添加了接受界面复制二维码的按钮
# 修改data的验证

# ch
# 修复交易无确认数的bug
# 修复btc下max的错误指令的问题
# 修复了以太币交易金额为0时无法交易的问题
# 修复了交易金额为很长小数时，返回的错误码不正确的现象
# 更改了以太币data字段长度可以为单数的情况

# version 0.1.10

# zl
# 修复了bugfree的bug

# ch
# 增加gasLimit gasPrice过少的错误码
# 修复插入key1，插入key2，拔出key2，app会退出的bug
# 修复账户交易数量>100时同步死循环的bug
# data字段支持长度为单数，如0x123（变成0x0123）


# version 0.1.11

# zl
# 添加send页面中gas limit随data长度变化而变化

# ch
# 修复了拔除key，未退出账户界面的bug
