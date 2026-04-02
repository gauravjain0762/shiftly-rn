package com.shiftly

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DownloadResumeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "DownloadResumeModule"

  @ReactMethod
  fun downloadToDownloads(
      url: String,
      fileName: String,
      mimeType: String?,
      title: String?,
      description: String?,
      promise: Promise,
  ) {
    try {
      val downloadManager =
          reactApplicationContext.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager

      val request = DownloadManager.Request(Uri.parse(url)).apply {
        setAllowedOverMetered(true)
        setAllowedOverRoaming(true)
        setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
        val safeTitle = title?.takeIf { it.isNotBlank() } ?: fileName
        setTitle(safeTitle)
        setDescription(description?.takeIf { it.isNotBlank() } ?: safeTitle)

        // Destination: public Downloads folder so the system manages it.
        setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)

        if (!mimeType.isNullOrBlank()) {
          setMimeType(mimeType)
        }
      }

      val downloadId = downloadManager.enqueue(request)
      promise.resolve(downloadId)
    } catch (e: Exception) {
      promise.reject("DOWNLOAD_FAILED", e.message ?: "Download failed", e)
    }
  }
}

