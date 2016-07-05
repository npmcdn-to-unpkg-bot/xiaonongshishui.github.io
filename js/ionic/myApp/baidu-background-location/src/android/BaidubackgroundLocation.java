package com.plugin.baidubackgroundLocation;


import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.telephony.TelephonyManager;

import org.json.JSONArray;
import org.json.JSONException;

import com.plugin.baidubackgroundLocation.GetLBSService.MyBinder;

public class BaidubackgroundLocation extends CordovaPlugin {
    public static final String ACTION_GET_CARRIER_NAME = "start";
    public static final String ACTION_GET_COUNTRY_CODE = "stop";
    public static int type=1;
    public static int accuracy=1;
    public static int interval=5000;

    public TelephonyManager tm;
    public MyBinder binder;
    public CallbackContext callbackContextAll;
    public Activity activity;
    public BaidubackgroundLocation baidubackgroundLocation;

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        Context context = this.cordova.getActivity().getApplicationContext();
        tm = (TelephonyManager)context.getSystemService(Context.TELEPHONY_SERVICE);

        Intent service = new Intent(context, GetLBSService.class);
        context.bindService(service, conn, Context.BIND_AUTO_CREATE);
    }

    private ServiceConnection conn = new ServiceConnection()
    {

        @Override
        public void onServiceDisconnected(ComponentName name)
        {
            // TODO Auto-generated method stub
        }

        @Override
        public void onServiceConnected(ComponentName name, IBinder service)
        {
            // TODO Auto-generated method stub
            binder = (MyBinder) service;
            binder.startLBS(callbackContextAll,activity,baidubackgroundLocation);
        }

    };


    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        try {
        	callbackContextAll = callbackContext;
        	activity = cordova.getActivity();
        	baidubackgroundLocation= this;
            if (ACTION_GET_CARRIER_NAME.equals(action)) {
                this.type=args.getInt(0);
                this.accuracy=args.getInt(1);
                this.interval=args.getInt(2);
                if(!tm.getSimOperatorName().isEmpty()){
                    callbackContext.success(tm.getSimOperatorName());
                }else{
                    callbackContext.success("无SIM卡或无服务商");
                }
                binder.startLBS(callbackContextAll,activity,baidubackgroundLocation);
                return true;
            } else  if (ACTION_GET_COUNTRY_CODE.equals(action)) {
                    
                    if(!tm.getSimCountryIso().isEmpty()){
                    	callbackContext.success(tm.getSimCountryIso());
                	}else{
                		callbackContext.success("无SIM卡");
                	} 
                    binder.stopLBS();
                    return true;
            } else{
            	callbackContext.error("Invalid Action");
            	return false;
            }
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
            callbackContext.error(e.getMessage());
            return false;
        }
    }
} 