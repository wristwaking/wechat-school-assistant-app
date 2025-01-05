# wechat-school-assistant-app 微信智能助教机器人
微信智能助教机器人

# 打包程序
```
npm run pack

> EdgeHaker-School-WeChat@3.0.0 pack
> electron-builder --win --x64

  • electron-builder  version=24.9.1 os=10.0.22621
  • loaded configuration  file=package.json ("build" field)
  ⨯ Cannot compute electron version from installed node modules - none of the possible electron modules are installed.
See https://github.com/electron-userland/electron-builder/issues/3984#issuecomment-504968246
```

# 安装 electron
```
npm install electron -D
```
常见问题
```
npm run pack

> EdgeHaker-School-WeChat@3.0.0 pack
> electron-builder --win --x64

  • electron-builder  version=24.9.1 os=10.0.22621
  • loaded configuration  file=package.json ("build" field)
  ⨯ Package "electron" is only allowed in "devDependencies". Please remove it from the "dependencies" section in your package.json.
```
解决方案
```
npm install electron -D
```

```
npm run pack

> EdgeHaker-School-WeChat@3.0.0 pack
> electron-builder --win --x64

  • electron-builder  version=24.9.1 os=10.0.22621
  • loaded configuration  file=package.json ("build" field)
  • writing effective config  file=build\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64 electron=33.2.1 appOutDir=build\win-unpacked
  • building        target=nsis file=build\边缘骇客微信智能助教管理系统 Setup 3.0.0.exe archs=x64 oneClick=false perMachine=false
  • building block map  blockMapFile=build\边缘骇客微信智能助教管理系统 Setup 3.0.0.exe.blockmap
```

![image](https://github.com/user-attachments/assets/11e2bc5f-6f07-40cf-af2b-1a4a12ef7b99)


# 程序截图

![image](https://github.com/user-attachments/assets/279dd3ab-738d-4c65-900f-4f118f91dd6c)

![image](https://github.com/user-attachments/assets/b3d52232-edc0-4b96-8554-b6dfbb0a5fab)

![image](https://github.com/user-attachments/assets/2f9487ed-b5db-4533-be93-c9ba065c712b)

![image](https://github.com/user-attachments/assets/aedd61d4-0606-4c80-b7d6-39b285fda225)

![image](https://github.com/user-attachments/assets/421b1a27-50b9-4572-a083-84c8cacc7544)

![image](https://github.com/user-attachments/assets/cd0cc818-2d36-4a96-9b14-1d52e4930a8b)

