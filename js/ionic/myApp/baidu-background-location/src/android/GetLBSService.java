package com.plugin.baidubackgroundLocation;

import android.app.Activity;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.mapapi.map.MyLocationData;
import org.apache.cordova.CallbackContext;

public class GetLBSService extends Service
{

	private LocationClient mLocationClient = null;
	private BDLocationListener myListener = new MyLocationListenner();
	private CallbackContext callBack;
	private Activity activity;
	private BaidubackgroundLocation baidubackgroundLocation;
	public class MyBinder extends Binder{
		public void startLBS(CallbackContext callBack,Activity activity,BaidubackgroundLocation baidubackgroundLocation) {
			if(mLocationClient != null) {
				mLocationClient.getLocOption().setScanSpan(BaidubackgroundLocation.interval);
				mLocationClient.start();
				GetLBSService.this.callBack = callBack;
				GetLBSService.this.activity = activity;
				GetLBSService.this.baidubackgroundLocation = baidubackgroundLocation;
				
			}
		}
		public void stopLBS() {
			if(mLocationClient != null) {
				mLocationClient.stop();
			}
		}

	}

	public class MyLocationListenner implements BDLocationListener
	{

		@Override
		public void onReceiveLocation(BDLocation location)
		{
			if (location == null )
			{
				return;
			}
			MyLocationData locData = new MyLocationData.Builder()
					.accuracy(location.getRadius())
					// 此处设置开发者获取到的方向信息，顺时针0-360
					.direction(100).latitude(location.getLatitude())
					.longitude(location.getLongitude()).build();
			String data = location.getLatitude() + ","
					+ location.getLongitude() + ","
					+ BaidubackgroundLocation.interval;
//			callBack.success(data);//回调
			
			 String format = "BaidubackgroundLocation.receiveMessageInAndroidCallback(%s);";
		        final String js = String.format(format, data.toString());
		        activity.runOnUiThread(new Runnable() {
		            @Override
		            public void run() {
		            	baidubackgroundLocation.webView.loadUrl("javascript:" + js);
		            }
		        });
			//mLocationClient.stop();//可以在这里停止获取经纬度，也可以页面点击停止
		}

		public void onReceivePoi(BDLocation poiLocation)
		{
		}
	}
	
	@Override
	public void onCreate()
	{
		initLocation();
		super.onCreate();
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId)
	{
		initLocation();
		return START_STICKY;
	}
	
	private void initLocation() {
		if(mLocationClient == null) {
			mLocationClient = new LocationClient(this);
	        mLocationClient.registerLocationListener(myListener);
	        LocationClientOption option = new LocationClientOption();
	        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
	        option.setOpenGps(true); // 打开gps
	        option.setCoorType("bd09ll"); // 设置坐标类型"posx":"116.475627","posy":"40.007755"
	        mLocationClient.setLocOption(option);
	        mLocationClient.start();
		}
	}

	@Override
	public IBinder onBind(Intent arg0)
	{
		// TODO Auto-generated method stub
		return new MyBinder();
	}

}
