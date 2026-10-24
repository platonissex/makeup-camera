# 化妆相机网页版

这是「化妆相机」的网页版（静态构建，由 GitHub Pages 托管）。

在手机上用 **Safari** 打开：<https://platonissex.github.io/makeup-camera/>

首次打开需要允许使用摄像头；人脸模型（约 3–4 MB）和 WebAssembly 文件会在首次加载时下载。
也可以在 Safari 中点「分享 → 添加到主屏幕」，像 App 一样使用。

## Android 安装包

侧载用的调试签名 APK（不是 Play 商店正式签名）。妆效、前置摄像头和网页版是同一套页面。

1. 用手机浏览器打开并下载：<https://github.com/platonissex/makeup-camera/releases/download/android-sideload-1/makeup-camera-debug.apk>
2. 若系统提示「禁止安装未知应用」，到设置里允许当前浏览器或文件管理器安装未知来源应用，然后再点 APK。
3. 安装后打开「化妆相机」。第一次进入试妆时允许使用摄像头；应用会打开前置摄像头。

本地重新打包（需要 Android SDK，`ANDROID_HOME` 指向 SDK）：

```bash
npm run build
npm run android:sync
npm run android:debug
```

调试包在 `android/app/build/outputs/apk/debug/app-debug.apk`。网页版 GitHub Pages 仍由根目录的 `index.html` 和 `assets/` 发布，不依赖这个 APK。
